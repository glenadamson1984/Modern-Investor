import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../src/contexts/AuthContext";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import CallToActionButton from "../../src/components/buttons/action/CallToActionButton";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../src/config/firebase";
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
  max-width: 600px;
  margin: 0 auto;
`;

const StyledPageTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 2rem 0;
`;

const StyledForm = styled.form`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledLabel = styled.label`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${colours.white};
  opacity: 0.9;
`;

const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: ${colours.white};
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colours.pink};
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const AddPerformance = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    platform: "total",
    ytdReturn: "",
    yearlyReturn: "",
    totalReturn: "",
    sharpeRatio: "",
  });

  React.useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login");
    }
  }, [user, isAdmin, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert date string to Firestore Timestamp
      const dateObj = new Date(formData.date);
      const timestamp = Timestamp.fromDate(dateObj);

      const performanceData = {
        date: timestamp,
        platform: formData.platform,
        ytdReturn: parseFloat(formData.ytdReturn) || 0,
        yearlyReturn: parseFloat(formData.yearlyReturn) || 0,
        totalReturn: parseFloat(formData.totalReturn) || 0,
        sharpeRatio: parseFloat(formData.sharpeRatio) || 0,
        createdAt: new Date().toISOString(),
      };

      console.log("Submitting performance data:", performanceData);
      const docRef = await addDoc(collection(db, "performance"), performanceData);
      console.log("Document written with ID:", docRef.id);
      toast.success("Performance data added successfully!");
      setFormData({
        date: "",
        platform: "total",
        ytdReturn: "",
        yearlyReturn: "",
        totalReturn: "",
        sharpeRatio: "",
      });
    } catch (error) {
      console.error("Error adding performance:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      toast.error(`Failed to add performance data: ${error.message || "Please check console for details"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <>
      <SEO title="Add Performance Data | Admin | Modern Investments" />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Add Performance Data</StyledPageTitle>

          <StyledForm onSubmit={handleSubmit}>
            <StyledFormGroup>
              <StyledLabel>Date *</StyledLabel>
              <StyledInput
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel>Platform *</StyledLabel>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "1rem",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  color: colours.white,
                  width: "100%",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="total" style={{ background: colours.darkGrey, color: colours.white }}>
                  Total (All Platforms Combined)
                </option>
                <option value="t212" style={{ background: colours.darkGrey, color: colours.white }}>
                  Trading 212 (T212)
                </option>
                <option value="etoro" style={{ background: colours.darkGrey, color: colours.white }}>
                  eToro
                </option>
                <option value="hl" style={{ background: colours.darkGrey, color: colours.white }}>
                  Hargreaves Lansdown (HL)
                </option>
              </select>
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel>YTD Return (%) *</StyledLabel>
              <StyledInput
                type="number"
                step="0.01"
                name="ytdReturn"
                value={formData.ytdReturn}
                onChange={handleChange}
                placeholder="e.g., 15.5"
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel>Yearly Return (%) *</StyledLabel>
              <StyledInput
                type="number"
                step="0.01"
                name="yearlyReturn"
                value={formData.yearlyReturn}
                onChange={handleChange}
                placeholder="e.g., 18.2"
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel>Total Return (%) *</StyledLabel>
              <StyledInput
                type="number"
                step="0.01"
                name="totalReturn"
                value={formData.totalReturn}
                onChange={handleChange}
                placeholder="e.g., 45.8"
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel>Sharpe Ratio</StyledLabel>
              <StyledInput
                type="number"
                step="0.01"
                name="sharpeRatio"
                value={formData.sharpeRatio}
                onChange={handleChange}
                placeholder="e.g., 1.85"
              />
            </StyledFormGroup>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: colours.darkGreen,
                  border: "none",
                  borderRadius: "30px",
                  padding: "1rem 2rem",
                  color: colours.white,
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  flex: 1,
                  maxWidth: "100%",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {loading ? "Adding..." : "Add Performance Data"}
              </button>
              <CallToActionButton
                variant="secondary"
                onClick={() => router.push("/admin/performance")}
              >
                View All Entries
              </CallToActionButton>
            </div>
          </StyledForm>
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

export default AddPerformance;
