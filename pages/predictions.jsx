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

const StyledPredictionCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const StyledPredictionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledPredictionSymbol = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: ${colours.white};
`;

const StyledPredictionDirection = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "direction",
})`
  background: ${(props) =>
    props.direction === "BULLISH" ? colours.green : colours.red};
  color: ${colours.white};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
`;

const StyledPredictionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const StyledPredictionDetail = styled.div``;

const StyledPredictionLabel = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 12px;
  color: ${colours.white};
  opacity: 0.6;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const StyledPredictionValue = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: ${colours.white};
`;

const StyledPredictionExplanation = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: ${colours.white};
  opacity: 0.9;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Predictions = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isMember } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isMember()) {
      router.push("/login");
      return;
    }

    const fetchPredictions = async () => {
      try {
        const q = query(
          collection(db, "predictions"),
          orderBy("date", "desc"),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const predictionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPredictions(predictionsData);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [user, isMember, router]);

  if (!user || !isMember()) {
    return null;
  }

  return (
    <>
      <SEO
        title="Prediction Model | Modern Investments"
        description="Access market predictions, model explanations, and historical accuracy metrics."
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Prediction Model</StyledPageTitle>
          <StyledPageDescription>
            Advanced prediction models with historical accuracy metrics to
            inform your investment decisions. All predictions include risk
            assessments and model explanations.
          </StyledPageDescription>

          {loading ? (
            <div style={{ color: colours.white, textAlign: "center" }}>
              Loading predictions...
            </div>
          ) : predictions.length === 0 ? (
            <div style={{ color: colours.white, textAlign: "center" }}>
              No predictions available yet. Check back soon for market
              predictions.
            </div>
          ) : (
            predictions.map((prediction) => (
              <StyledPredictionCard key={prediction.id}>
                <StyledPredictionHeader>
                  <StyledPredictionSymbol>
                    {prediction.symbol || "N/A"}
                  </StyledPredictionSymbol>
                  <StyledPredictionDirection
                    direction={prediction.direction || "BULLISH"}
                  >
                    {prediction.direction || "BULLISH"}
                  </StyledPredictionDirection>
                </StyledPredictionHeader>
                <StyledPredictionDetails>
                  <StyledPredictionDetail>
                    <StyledPredictionLabel>Target Price</StyledPredictionLabel>
                    <StyledPredictionValue>
                      {prediction.targetPrice
                        ? `£${prediction.targetPrice.toFixed(2)}`
                        : "N/A"}
                    </StyledPredictionValue>
                  </StyledPredictionDetail>
                  <StyledPredictionDetail>
                    <StyledPredictionLabel>Time Horizon</StyledPredictionLabel>
                    <StyledPredictionValue>
                      {prediction.timeHorizon || "N/A"}
                    </StyledPredictionValue>
                  </StyledPredictionDetail>
                  <StyledPredictionDetail>
                    <StyledPredictionLabel>Confidence</StyledPredictionLabel>
                    <StyledPredictionValue>
                      {prediction.confidence
                        ? `${prediction.confidence}%`
                        : "N/A"}
                    </StyledPredictionValue>
                  </StyledPredictionDetail>
                  <StyledPredictionDetail>
                    <StyledPredictionLabel>Risk Level</StyledPredictionLabel>
                    <StyledPredictionValue>
                      {prediction.riskLevel || "N/A"}
                    </StyledPredictionValue>
                  </StyledPredictionDetail>
                </StyledPredictionDetails>
                {prediction.explanation && (
                  <StyledPredictionExplanation>
                    <strong>Model Explanation:</strong> {prediction.explanation}
                  </StyledPredictionExplanation>
                )}
              </StyledPredictionCard>
            ))
          )}
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default Predictions;
