import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../src/contexts/AuthContext";
import useWindowSize from "../src/hooks/useWindowSize";
import SEO from "../src/components/SEO";
import styled from "styled-components";
import { colours } from "../src/utils/style.utils";
import PerformanceChart from "../src/components/charts/PerformanceChart";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../src/config/firebase";
import CallToActionButton from "../src/components/buttons/action/CallToActionButton";

const StyledPageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  min-height: 100vh;
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "4rem" : "2rem")};
`;

const StyledContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const StyledPageTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 1rem 0;
`;

const StyledWelcomeMessage = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0 0 3rem 0;
`;

const StyledDashboardGrid = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isDesktop ? "repeat(2, 1fr)" : "1fr"};
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StyledCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
`;

const StyledCardTitle = styled.h3`
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: ${colours.white};
  margin: 0 0 1.5rem 0;
`;

const StyledMetricValue = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: ${colours.pink};
  margin-bottom: 0.5rem;
`;

const StyledMetricLabel = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: ${colours.white};
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledQuickLinks = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 3rem;
  
  > * {
    max-width: 300px;
    flex: 0 1 auto;
  }
`;

const Dashboard = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, userData, isMember } = useAuth();
  const [performanceData, setPerformanceData] = useState({
    ytdReturn: 0,
    yearlyReturn: 0,
  });

  useEffect(() => {
    if (!user || !isMember()) {
      router.push("/login");
      return;
    }

    const fetchPerformance = async () => {
      try {
        const q = query(
          collection(db, "performance"),
          orderBy("date", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setPerformanceData({
            ytdReturn: data.ytdReturn || 0,
            yearlyReturn: data.yearlyReturn || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching performance:", error);
      }
    };

    fetchPerformance();
  }, [user, isMember, router]);

  if (!user || !isMember()) {
    return null;
  }

  return (
    <>
      <SEO
        title="Dashboard | Modern Investments"
        description="Access your investment dashboard with performance metrics, live trades, and resources."
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Dashboard</StyledPageTitle>
          <StyledWelcomeMessage>
            Welcome back{userData?.name ? `, ${userData.name}` : ""}! Here's
            your investment overview.
          </StyledWelcomeMessage>
          {userData && (
            <div style={{ 
              background: "rgba(255, 255, 255, 0.05)", 
              padding: "1rem", 
              borderRadius: "8px", 
              marginBottom: "2rem",
              fontSize: "14px", 
              color: colours.white,
              opacity: 0.8
            }}>
              <div>Role: <strong>{userData.role || "member"}</strong> | Email: {userData.email}</div>
              {userData.role === "admin" && (
                <div style={{ marginTop: "1rem", maxWidth: "300px" }}>
                  <CallToActionButton
                    variant="darkGreen"
                    onClick={() => router.push("/admin/dashboard")}
                  >
                    Go to Admin Dashboard
                  </CallToActionButton>
                </div>
              )}
            </div>
          )}

          <StyledDashboardGrid isDesktop={isDesktop}>
            <StyledCard>
              <StyledCardTitle>YTD Performance</StyledCardTitle>
              <StyledMetricValue>
                {performanceData.ytdReturn > 0 ? "+" : ""}
                {performanceData.ytdReturn.toFixed(2)}%
              </StyledMetricValue>
              <StyledMetricLabel>Year to Date Return</StyledMetricLabel>
            </StyledCard>

            <StyledCard>
              <StyledCardTitle>Yearly Performance</StyledCardTitle>
              <StyledMetricValue>
                {performanceData.yearlyReturn > 0 ? "+" : ""}
                {performanceData.yearlyReturn.toFixed(2)}%
              </StyledMetricValue>
              <StyledMetricLabel>Annual Return</StyledMetricLabel>
            </StyledCard>
          </StyledDashboardGrid>

          <StyledCard>
            <StyledCardTitle>Performance Chart</StyledCardTitle>
            <PerformanceChart period="1Y" showPlatforms={true} />
          </StyledCard>

          <StyledQuickLinks>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/live-trades")}
            >
              View Live Trades
            </CallToActionButton>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/coaching/portal")}
            >
              Access Coaching
            </CallToActionButton>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/predictions")}
            >
              View Predictions
            </CallToActionButton>
          </StyledQuickLinks>
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default Dashboard;
