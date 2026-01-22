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
  font-size: 16px;
  font-weight: 600;
  color: ${colours.white};
  opacity: 0.9;
`;

const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 16px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colours.pink};
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const StyledSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colours.pink};
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: ${colours.darkGrey};
    color: ${colours.white};
  }
`;

const StyledTextarea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colours.pink};
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const StyledSubmitButton = styled.button`
  background: ${colours.green};
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    background: #0d8a4f;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddTrade = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    type: "BUY",
    date: new Date().toISOString().split("T")[0],
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    profit: "",
    rationale: "",
  });

  React.useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login");
    }
  }, [user, isAdmin, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Calculate profit if not provided
      let profit = formData.profit;
      if (!profit && formData.entryPrice && formData.exitPrice && formData.quantity) {
        const entry = parseFloat(formData.entryPrice);
        const exit = parseFloat(formData.exitPrice);
        const qty = parseFloat(formData.quantity);
        profit = (exit - entry) * qty;
      }

      const tradeData = {
        symbol: formData.symbol.toUpperCase(),
        type: formData.type,
        date: Timestamp.fromDate(new Date(formData.date)),
        entryPrice: parseFloat(formData.entryPrice) || 0,
        exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : null,
        quantity: parseFloat(formData.quantity) || 0,
        profit: profit ? parseFloat(profit) : null,
        rationale: formData.rationale || "",
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "trades"), tradeData);

      toast.success("Trade added successfully!");
      router.push("/admin/trades");
    } catch (error) {
      console.error("Error adding trade:", error);
      toast.error("Failed to add trade. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <>
      <SEO title="Add Trade | Admin | Modern Investments" />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Add New Trade</StyledPageTitle>

          <StyledForm onSubmit={handleSubmit}>
            <StyledFormGroup>
              <StyledLabel htmlFor="symbol">Symbol *</StyledLabel>
              <StyledInput
                type="text"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="e.g., AAPL, TSLA, BTC"
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="type">Type *</StyledLabel>
              <StyledSelect
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </StyledSelect>
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="date">Date *</StyledLabel>
              <StyledInput
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="entryPrice">Entry Price (£) *</StyledLabel>
              <StyledInput
                type="number"
                id="entryPrice"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="exitPrice">Exit Price (£)</StyledLabel>
              <StyledInput
                type="number"
                id="exitPrice"
                name="exitPrice"
                value={formData.exitPrice}
                onChange={handleChange}
                placeholder="0.00 (optional)"
                step="0.01"
                min="0"
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="quantity">Quantity *</StyledLabel>
              <StyledInput
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="profit">Profit/Loss (£)</StyledLabel>
              <StyledInput
                type="number"
                id="profit"
                name="profit"
                value={formData.profit}
                onChange={handleChange}
                placeholder="Auto-calculated if exit price provided"
                step="0.01"
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="rationale">Rationale</StyledLabel>
              <StyledTextarea
                id="rationale"
                name="rationale"
                value={formData.rationale}
                onChange={handleChange}
                placeholder="Explain the reasoning behind this trade..."
              />
            </StyledFormGroup>

            <StyledButtonGroup>
              <StyledSubmitButton type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Trade"}
              </StyledSubmitButton>
              <CallToActionButton
                variant="secondary"
                onClick={() => router.push("/admin/trades")}
                type="button"
              >
                Cancel
              </CallToActionButton>
            </StyledButtonGroup>
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

export default AddTrade;
