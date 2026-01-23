import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../src/contexts/AuthContext";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import CallToActionButton from "../../src/components/buttons/action/CallToActionButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledPageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  min-height: 100vh;
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "4rem" : "2rem")};
`;

const StyledContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const StyledPageTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 1rem 0;
`;

const StyledUploadArea = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${colours.pink};
    background: rgba(255, 255, 255, 0.08);
  }
`;

const StyledInput = styled.input`
  display: none;
`;

const StyledLabel = styled.label`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  color: ${colours.white};
  cursor: pointer;
  display: block;
`;

const StyledFileInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const StyledFileInfoText = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: ${colours.white};
  opacity: 0.9;
  margin: 0.5rem 0;
`;

const DataUpload = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login");
    }
  }, [user, isAdmin, router]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(",")[1];
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileData: base64,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success(
            `File uploaded successfully! ${data.recordsProcessed} records processed.`
          );
          setSelectedFile(null);
          // Reset file input
          const fileInput = document.getElementById("file-upload");
          if (fileInput) {
            fileInput.value = "";
          }
        } else {
          const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || "Upload failed");
          toast.error(errorMsg, { autoClose: 7000 });
          console.error("Upload error details:", data);
        }
        setUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <>
      <SEO title="Data Upload | Admin | Modern Investments" />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Data Upload</StyledPageTitle>

          <StyledUploadArea>
            <StyledInput
              type="file"
              id="file-upload"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
            />
            <StyledLabel htmlFor="file-upload">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : "Click to select CSV or Excel file"}
            </StyledLabel>
          </StyledUploadArea>

          {selectedFile && (
            <StyledFileInfo>
              <StyledFileInfoText>
                <strong>File:</strong> {selectedFile.name}
              </StyledFileInfoText>
              <StyledFileInfoText>
                <strong>Size:</strong>{" "}
                {(selectedFile.size / 1024).toFixed(2)} KB
              </StyledFileInfoText>
              <StyledFileInfoText>
                <strong>Type:</strong> {selectedFile.type || "Unknown"}
              </StyledFileInfoText>
            </StyledFileInfo>
          )}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ maxWidth: "300px", width: "100%" }}>
              <CallToActionButton
                variant="darkGreen"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? "Uploading..." : "Upload File"}
              </CallToActionButton>
            </div>
            <div style={{ maxWidth: "300px", width: "100%" }}>
              <CallToActionButton
                variant="secondary"
                onClick={() => router.push("/admin/dashboard")}
              >
                Back to Dashboard
              </CallToActionButton>
            </div>
          </div>
        </StyledContentContainer>
      </StyledPageContainer>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default DataUpload;
