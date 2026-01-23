import { db, storage } from "../../../src/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // For now, we'll use the permissive rules
    // In production, you'd verify the auth token here
    const { fileData, fileName, fileType } = req.body;

    if (!fileData || !fileName) {
      return res.status(400).json({ error: "File data and name required" });
    }

    // Parse file based on type
    let parsedData = [];
    const buffer = Buffer.from(fileData, "base64");

    if (fileType === "text/csv" || fileName.endsWith(".csv")) {
      const csvText = buffer.toString("utf-8");
      const result = Papa.parse(csvText, { header: true });
      parsedData = result.data;
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileName.endsWith(".xlsx")
    ) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      parsedData = XLSX.utils.sheet_to_json(worksheet);
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Upload file to Firebase Storage (optional - skip if storage not configured)
    try {
      const storageRef = ref(storage, `uploads/${fileName}`);
      await uploadBytes(storageRef, buffer);
    } catch (storageError) {
      // Storage not available - continue without uploading file
      console.log("Storage not available, skipping file upload:", storageError);
    }

    // Save parsed data to Firestore
    const batch = [];
    let skippedCount = 0;
    for (const row of parsedData) {
      // Skip completely empty rows
      const hasData = Object.keys(row).length > 0 && Object.values(row).some(v => v !== null && v !== "" && String(v).trim() !== "");
      if (!hasData) {
        skippedCount++;
        continue;
      }
      
      // Determine collection based on data structure
      const collectionName = row.type === "trade" ? "trades" : "performance";
        
      // Process and convert data based on collection type
      let processedRow = { ...row };
      
      // Convert date field to Firestore Timestamp
      if (row.date) {
        try {
          // Handle different date formats
          let dateStr = String(row.date).trim();
          // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
          if (dateStr.includes("/") && dateStr.split("/").length === 3) {
            const parts = dateStr.split("/");
            if (parts[0].length === 2) {
              // DD/MM/YYYY format
              dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
          }
          const dateObj = new Date(dateStr);
          if (!isNaN(dateObj.getTime())) {
            processedRow.date = Timestamp.fromDate(dateObj);
          } else {
            console.warn("Invalid date format:", row.date);
          }
        } catch (e) {
          console.warn("Could not parse date:", row.date, e);
        }
      }
      
      // Validate required fields before processing
      let isValid = true;
      if (collectionName === "trades") {
        // Validate required fields for trades
        if (!row.symbol || !row.date) {
          console.warn("Skipping trade row - missing required fields (symbol, date):", row);
          isValid = false;
        } else {
          // Convert trade-specific fields
          if (row.entryPrice) processedRow.entryPrice = parseFloat(row.entryPrice) || 0;
          if (row.exitPrice) processedRow.exitPrice = parseFloat(row.exitPrice) || null;
          if (row.quantity) processedRow.quantity = parseFloat(row.quantity) || 0;
          if (row.profit !== undefined && row.profit !== "") {
            processedRow.profit = parseFloat(row.profit) || null;
          }
          // Remove the "type" field from the document (it's only used for routing)
          delete processedRow.type;
        }
      } else {
        // Validate required fields for performance
        if (!row.date) {
          console.warn("Skipping performance row - missing required field (date):", row);
          isValid = false;
        } else {
          // Convert performance-specific fields
          if (row.totalReturn !== undefined && row.totalReturn !== "") {
            processedRow.totalReturn = parseFloat(row.totalReturn) || 0;
          }
          if (row.ytdReturn !== undefined && row.ytdReturn !== "") {
            processedRow.ytdReturn = parseFloat(row.ytdReturn) || 0;
          }
          if (row.yearlyReturn !== undefined && row.yearlyReturn !== "") {
            processedRow.yearlyReturn = parseFloat(row.yearlyReturn) || 0;
          }
          if (row.monthlyReturn !== undefined && row.monthlyReturn !== "") {
            processedRow.monthlyReturn = parseFloat(row.monthlyReturn) || null;
          }
          if (row.sharpeRatio !== undefined && row.sharpeRatio !== "") {
            processedRow.sharpeRatio = parseFloat(row.sharpeRatio) || 0;
          }
          // Keep platform field if present
          if (row.platform) {
            processedRow.platform = String(row.platform).toLowerCase().trim();
          }
          // Remove the "type" field from the document (it's only used for routing)
          delete processedRow.type;
        }
      }
      
      // Only add to batch if valid
      if (isValid) {
        // Add metadata
        processedRow.uploadedAt = new Date().toISOString();
        processedRow.sourceFile = fileName;
        processedRow.createdAt = Timestamp.now();
        
        batch.push(
          addDoc(collection(db, collectionName), processedRow)
        );
      }
    }

    if (batch.length === 0) {
      return res.status(400).json({ 
        error: "No valid records found in file. Please check your CSV format.",
        details: `Parsed ${parsedData.length} rows, but none were valid. Make sure your CSV has headers and at least one data row with a valid date. Skipped ${skippedCount} empty rows.`
      });
    }

    try {
      await Promise.all(batch);
    } catch (dbError) {
      console.error("Error saving to Firestore:", dbError);
      return res.status(500).json({ 
        error: "Failed to save data to database",
        details: dbError.message || "Please check your Firebase configuration and permissions."
      });
    }

    res.status(200).json({
      success: true,
      recordsProcessed: batch.length,
      message: "File uploaded and processed successfully",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ 
      error: "Failed to upload and process file",
      details: error.message || "Please check the file format and try again."
    });
  }
}
