import { db } from "../../../src/config/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const q = query(collection(db, "trades"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching trades:", error);
      res.status(500).json({ error: "Failed to fetch trades" });
    }
  } else if (req.method === "POST") {
    try {
      const docRef = await addDoc(collection(db, "trades"), {
        ...req.body,
        date: new Date(),
        createdAt: new Date().toISOString(),
      });
      res.status(200).json({ id: docRef.id, success: true });
    } catch (error) {
      console.error("Error adding trade:", error);
      res.status(500).json({ error: "Failed to add trade" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
