import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../src/contexts/AuthContext";
import useWindowSize from "../src/hooks/useWindowSize";
import SEO from "../src/components/SEO";
import styled from "styled-components";
import { colours } from "../src/utils/style.utils";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../src/config/firebase";

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
  margin: 0 0 1rem 0;
`;

const StyledPageDescription = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0 0 3rem 0;
`;

const StyledTradeCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${colours.pink};
    transform: translateX(4px);
  }
`;

const StyledTradeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledTradeSymbol = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: ${colours.white};
`;

const StyledTradeType = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "type",
})`
  background: ${(props) =>
    props.type === "BUY" ? colours.green : colours.red};
  color: ${colours.white};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
`;

const StyledTradeDate = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: ${colours.white};
  opacity: 0.7;
`;

const StyledTradeDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StyledTradeDetail = styled.div``;

const StyledTradeLabel = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 12px;
  color: ${colours.white};
  opacity: 0.6;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

const StyledTradeValue = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${colours.white};
`;

const StyledTradeRationale = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: ${colours.white};
  opacity: 0.9;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LiveTrades = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isMember } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isMember()) {
      router.push("/login");
      return;
    }

    const fetchTrades = async () => {
      try {
        const q = query(
          collection(db, "trades"),
          orderBy("date", "desc"),
          limit(50)
        );
        const snapshot = await getDocs(q);
        const tradesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrades(tradesData);
      } catch (error) {
        console.error("Error fetching trades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [user, isMember, router]);

  if (!user || !isMember()) {
    return null;
  }

  return (
    <>
      <SEO
        title="Live Trades | Modern Investments"
        description="View live trade updates, entry/exit points, and trade rationale."
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Live Trades</StyledPageTitle>
          <StyledPageDescription>
            Real-time updates on trades, including entry/exit points, rationale,
            and performance tracking.
          </StyledPageDescription>

          {loading ? (
            <div style={{ color: colours.white, textAlign: "center" }}>
              Loading trades...
            </div>
          ) : trades.length === 0 ? (
            <div style={{ color: colours.white, textAlign: "center" }}>
              No trades available yet. Check back soon for live trade updates.
            </div>
          ) : (
            trades.map((trade) => (
              <StyledTradeCard key={trade.id}>
                <StyledTradeHeader>
                  <StyledTradeSymbol>{trade.symbol || "N/A"}</StyledTradeSymbol>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <StyledTradeType type={trade.type || "BUY"}>
                      {trade.type || "BUY"}
                    </StyledTradeType>
                    <StyledTradeDate>
                      {trade.date
                        ? new Date(
                            trade.date.seconds
                              ? trade.date.seconds * 1000
                              : trade.date
                          ).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </StyledTradeDate>
                  </div>
                </StyledTradeHeader>
                <StyledTradeDetails>
                  <StyledTradeDetail>
                    <StyledTradeLabel>Entry Price</StyledTradeLabel>
                    <StyledTradeValue>
                      {trade.entryPrice ? `£${trade.entryPrice.toFixed(2)}` : "N/A"}
                    </StyledTradeValue>
                  </StyledTradeDetail>
                  {trade.exitPrice && (
                    <StyledTradeDetail>
                      <StyledTradeLabel>Exit Price</StyledTradeLabel>
                      <StyledTradeValue>
                        £{trade.exitPrice.toFixed(2)}
                      </StyledTradeValue>
                    </StyledTradeDetail>
                  )}
                  <StyledTradeDetail>
                    <StyledTradeLabel>Quantity</StyledTradeLabel>
                    <StyledTradeValue>{trade.quantity || "N/A"}</StyledTradeValue>
                  </StyledTradeDetail>
                  {trade.profit && (
                    <StyledTradeDetail>
                      <StyledTradeLabel>Profit/Loss</StyledTradeLabel>
                      <StyledTradeValue
                        style={{
                          color:
                            trade.profit > 0 ? colours.green : colours.red,
                        }}
                      >
                        {trade.profit > 0 ? "+" : ""}£{trade.profit.toFixed(2)}
                      </StyledTradeValue>
                    </StyledTradeDetail>
                  )}
                </StyledTradeDetails>
                {trade.rationale && (
                  <StyledTradeRationale>
                    <strong>Rationale:</strong> {trade.rationale}
                  </StyledTradeRationale>
                )}
              </StyledTradeCard>
            ))
          )}
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default LiveTrades;
