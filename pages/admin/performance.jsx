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
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
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
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
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

const ManagePerformance = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login");
      return;
    }

    fetchEntries();
  }, [user, isAdmin, router]);

  const fetchEntries = async () => {
    try {
      const q = query(collection(db, "performance"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const entriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(entriesData);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast.error("Failed to load performance entries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this performance entry?")) {
      return;
    }

    setDeleting(id);
    try {
      await deleteDoc(doc(db, "performance", id));
      toast.success("Performance entry deleted successfully!");
      fetchEntries(); // Refresh the list
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry. Please try again.");
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
      <SEO title="Manage Performance | Admin | Modern Investments" />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Manage Performance Data</StyledPageTitle>

          <StyledHeaderActions>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/admin/add-performance")}
            >
              Add New Entry
            </CallToActionButton>
            <CallToActionButton
              variant="secondary"
              onClick={() => router.push("/admin/dashboard")}
            >
              Back to Dashboard
            </CallToActionButton>
          </StyledHeaderActions>

          {loading ? (
            <StyledEmptyState>Loading entries...</StyledEmptyState>
          ) : entries.length === 0 ? (
            <StyledEmptyState>
              No performance entries yet. Add your first entry to get started.
            </StyledEmptyState>
          ) : (
            <StyledTable>
              <StyledTableHeader>
                <div>Date</div>
                <div>Platform</div>
                <div>YTD Return</div>
                <div>Yearly Return</div>
                <div>Total Return</div>
                <div>Sharpe Ratio</div>
                <div>Actions</div>
              </StyledTableHeader>
              {entries.map((entry) => {
                const platform = entry.platform || "total";
                const platformName = 
                  platform === "t212" ? "T212" :
                  platform === "etoro" ? "eToro" :
                  platform === "hl" ? "HL" :
                  "Total";
                
                return (
                  <StyledTableRow key={entry.id}>
                    <StyledTableCell label="Date">
                      {formatDate(entry.date)}
                    </StyledTableCell>
                    <StyledTableCell label="Platform">
                      {platformName}
                    </StyledTableCell>
                    <StyledTableCell label="YTD Return">
                      {entry.ytdReturn > 0 ? "+" : ""}
                      {entry.ytdReturn?.toFixed(2) || "0.00"}%
                    </StyledTableCell>
                    <StyledTableCell label="Yearly Return">
                      {entry.yearlyReturn != null && entry.yearlyReturn !== 0 ? (
                        <>
                          {entry.yearlyReturn > 0 ? "+" : ""}
                          {entry.yearlyReturn.toFixed(2)}%
                        </>
                      ) : (
                        "N/A"
                      )}
                    </StyledTableCell>
                    <StyledTableCell label="Total Return">
                      {entry.totalReturn != null && entry.totalReturn !== 0 ? (
                        <>
                          {entry.totalReturn > 0 ? "+" : ""}
                          {entry.totalReturn.toFixed(2)}%
                        </>
                      ) : (
                        "N/A"
                      )}
                    </StyledTableCell>
                    <StyledTableCell label="Sharpe Ratio">
                      {entry.sharpeRatio?.toFixed(2) || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell label="Actions">
                      <StyledDeleteButton
                        onClick={() => handleDelete(entry.id)}
                        disabled={deleting === entry.id}
                      >
                        {deleting === entry.id ? "Deleting..." : "Delete"}
                      </StyledDeleteButton>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
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

export default ManagePerformance;
