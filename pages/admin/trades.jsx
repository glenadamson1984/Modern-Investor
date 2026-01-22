import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../src/contexts/AuthContext";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import CallToActionButton from "../../src/components/buttons/action/CallToActionButton";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
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
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledPageTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 2rem 0;
`;

const StyledHeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  > * {
    max-width: 300px;
    flex: 0 1 auto;
  }
`;

const StyledTable = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
`;

const StyledTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${colours.white};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    display: none;
  }
`;

const StyledTableRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const StyledTableCell = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: ${colours.white};
  opacity: 0.9;

  @media (max-width: 768px) {
    &::before {
      content: "${(props) => props.label}: ";
      font-weight: 600;
      opacity: 0.7;
    }
  }
`;

const StyledTradeType = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "type",
})`
  background: ${(props) =>
    props.type === "BUY" || props.type === "buy" ? colours.green : colours.red};
  color: ${colours.white};
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const StyledDeleteButton = styled.button`
  background: ${colours.red};
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #c41a1f;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledEmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${colours.white};
  opacity: 0.7;
  font-family: "Inter", sans-serif;
  font-size: 18px;
`;

const ManageTrades = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login");
      return;
    }

    fetchTrades();
  }, [user, isAdmin, router]);

  const fetchTrades = async () => {
    try {
      const q = query(collection(db, "trades"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const tradesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrades(tradesData);
    } catch (error) {
      console.error("Error fetching trades:", error);
      toast.error("Failed to load trades");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this trade?")) {
      return;
    }

    setDeleting(id);
    try {
      await deleteDoc(doc(db, "trades", id));
      toast.success("Trade deleted successfully!");
      fetchTrades(); // Refresh the list
    } catch (error) {
      console.error("Error deleting trade:", error);
      toast.error("Failed to delete trade. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    if (date instanceof Date) {
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return "N/A";
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <>
      <SEO title="Manage Trades | Admin | Modern Investments" />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Manage Trades</StyledPageTitle>

          <StyledHeaderActions>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/admin/add-trade")}
            >
              Add New Trade
            </CallToActionButton>
            <CallToActionButton
              variant="secondary"
              onClick={() => router.push("/admin/dashboard")}
            >
              Back to Dashboard
            </CallToActionButton>
          </StyledHeaderActions>

          {loading ? (
            <StyledEmptyState>Loading trades...</StyledEmptyState>
          ) : trades.length === 0 ? (
            <StyledEmptyState>
              No trades yet. Add your first trade or upload a CSV/Excel file.
            </StyledEmptyState>
          ) : (
            <StyledTable>
              <StyledTableHeader>
                <div>Date</div>
                <div>Symbol</div>
                <div>Type</div>
                <div>Entry Price</div>
                <div>Exit Price</div>
                <div>Quantity</div>
                <div>Profit/Loss</div>
                <div>Actions</div>
              </StyledTableHeader>
              {trades.map((trade) => (
                <StyledTableRow key={trade.id}>
                  <StyledTableCell label="Date">
                    {formatDate(trade.date)}
                  </StyledTableCell>
                  <StyledTableCell label="Symbol">
                    {trade.symbol || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell label="Type">
                    <StyledTradeType type={trade.type || "BUY"}>
                      {trade.type || "BUY"}
                    </StyledTradeType>
                  </StyledTableCell>
                  <StyledTableCell label="Entry Price">
                    {trade.entryPrice ? `£${trade.entryPrice.toFixed(2)}` : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell label="Exit Price">
                    {trade.exitPrice ? `£${trade.exitPrice.toFixed(2)}` : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell label="Quantity">
                    {trade.quantity || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell label="Profit/Loss">
                    {trade.profit !== undefined ? (
                      <span
                        style={{
                          color: trade.profit > 0 ? colours.green : colours.red,
                        }}
                      >
                        {trade.profit > 0 ? "+" : ""}£{trade.profit.toFixed(2)}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </StyledTableCell>
                  <StyledTableCell label="Actions">
                    <StyledDeleteButton
                      onClick={() => handleDelete(trade.id)}
                      disabled={deleting === trade.id}
                    >
                      {deleting === trade.id ? "Deleting..." : "Delete"}
                    </StyledDeleteButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </StyledTable>
          )}
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

export default ManageTrades;
