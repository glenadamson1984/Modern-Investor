import React, { useState, useEffect } from "react";
import useWindowSize from "../src/hooks/useWindowSize";
import CallToActionButton from "../src/components/buttons/action/CallToActionButton";
import { useRouter } from "next/router";
import SEO from "../src/components/SEO";
import { colours } from "../src/utils/style.utils";
import {
  StyledHeroBackground,
  StyledHeroContainer,
  StyledHeroTitle,
  StyledHeroDescription,
  StyledHeroButtons,
  StyledTrustBadges,
  StyledPerformanceSection,
  StyledPerformanceContainer,
  StyledSectionTitle,
  StyledSectionDescription,
  StyledMetricsGrid,
  StyledMetricCard,
  StyledMetricValue,
  StyledMetricLabel,
  StyledFeaturesSection,
  StyledFeaturesContainer,
  StyledFeaturesGrid,
  StyledFeatureCard,
  StyledFeatureIcon,
  StyledFeatureTitle,
  StyledFeatureDescription,
} from "../page-styles/index.styles";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../src/config/firebase";

const Home = () => {
  const { checkIsDesktop } = useWindowSize();
  const router = useRouter();
  const isDesktop = checkIsDesktop();
  const [performanceData, setPerformanceData] = useState({
    ytdReturn: 0,
    yearlyReturn: 0,
    totalReturn: 0,
    sharpeRatio: 0,
  });

  useEffect(() => {
    // Fetch latest TOTAL performance data (for homepage overview)
    const fetchPerformance = async () => {
      try {
        const q = query(
          collection(db, "performance"),
          orderBy("date", "desc")
        );
        const snapshot = await getDocs(q);
        // Find the most recent "total" entry
        const totalEntry = snapshot.docs
          .map((doc) => doc.data())
          .find((entry) => (entry.platform || "total") === "total");
        
        if (totalEntry) {
          setPerformanceData({
            ytdReturn: totalEntry.ytdReturn || 0,
            yearlyReturn: totalEntry.yearlyReturn || 0,
            totalReturn: totalEntry.totalReturn || 0,
            sharpeRatio: totalEntry.sharpeRatio || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching performance:", error);
      }
    };

    fetchPerformance();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Modern Investments Network",
    url: "https://moderninvestments.co.uk",
    description:
      "Investment network based in Northern Ireland. Share performance insights, live trades, and expert coaching for investors.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
      addressRegion: "Northern Ireland",
    },
  };

  return (
    <>
      <SEO
        title="Investment Network Northern Ireland | Performance Tracking & Coaching"
        description="Join the investment network in Northern Ireland. Access live performance tracking, expert coaching, and investment insights to grow your portfolio."
        keywords="investment network northern ireland, fund manager northern ireland, investment coaching, portfolio performance, trading insights"
        canonicalUrl="/"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <StyledHeroBackground isDesktop={isDesktop}>
        <StyledHeroContainer isDesktop={isDesktop}>
          <StyledHeroTitle isDesktop={isDesktop}>
            Investment Network Northern Ireland
          </StyledHeroTitle>
          <StyledHeroDescription isDesktop={isDesktop}>
            Join a network of investors in Northern Ireland. Access live
            performance tracking, expert coaching, and investment insights to
            grow your portfolio. Transparent, data-driven investment management.
          </StyledHeroDescription>
          <StyledHeroButtons>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/performance")}
            >
              View Performance
            </CallToActionButton>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/login")}
            >
              Join Network
            </CallToActionButton>
          </StyledHeroButtons>
          <StyledTrustBadges>
            <span>Northern Ireland Based</span>
            <span>•</span>
            <span>Transparent Performance</span>
            <span>•</span>
            <span>Expert Coaching</span>
            <span>•</span>
            <span>Live Trade Updates</span>
          </StyledTrustBadges>
        </StyledHeroContainer>
      </StyledHeroBackground>

      {/* Performance Metrics Section */}
      <StyledPerformanceSection isDesktop={isDesktop}>
        <StyledPerformanceContainer>
          <StyledSectionTitle isDesktop={isDesktop}>
            Performance Overview
          </StyledSectionTitle>
          <StyledSectionDescription isDesktop={isDesktop}>
            Track year-over-year performance and key investment metrics
          </StyledSectionDescription>
          <StyledMetricsGrid isDesktop={isDesktop}>
            <StyledMetricCard>
              <StyledMetricValue>
                {performanceData.ytdReturn > 0 ? "+" : ""}
                {performanceData.ytdReturn.toFixed(2)}%
              </StyledMetricValue>
              <StyledMetricLabel>YTD Return</StyledMetricLabel>
            </StyledMetricCard>
            <StyledMetricCard>
              <StyledMetricValue>
                {performanceData.yearlyReturn > 0 ? "+" : ""}
                {performanceData.yearlyReturn.toFixed(2)}%
              </StyledMetricValue>
              <StyledMetricLabel>Yearly Return</StyledMetricLabel>
            </StyledMetricCard>
            <StyledMetricCard>
              <StyledMetricValue>
                {performanceData.totalReturn > 0 ? "+" : ""}
                {performanceData.totalReturn.toFixed(2)}%
              </StyledMetricValue>
              <StyledMetricLabel>Total Return</StyledMetricLabel>
            </StyledMetricCard>
            <StyledMetricCard>
              <StyledMetricValue>
                {performanceData.sharpeRatio.toFixed(2)}
              </StyledMetricValue>
              <StyledMetricLabel>Sharpe Ratio</StyledMetricLabel>
            </StyledMetricCard>
          </StyledMetricsGrid>
          <div style={{ textAlign: "center", marginTop: "2rem", maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/performance")}
            >
              View Detailed Performance →
            </CallToActionButton>
          </div>
        </StyledPerformanceContainer>
      </StyledPerformanceSection>

      {/* Features Section */}
      <StyledFeaturesSection isDesktop={isDesktop}>
        <StyledFeaturesContainer>
          <StyledSectionTitle isDesktop={isDesktop} light>
            Why Join the Network?
          </StyledSectionTitle>
          <StyledSectionDescription isDesktop={isDesktop} light>
            Access professional investment tools, insights, and coaching to
            elevate your investment strategy
          </StyledSectionDescription>
          <StyledFeaturesGrid isDesktop={isDesktop}>
            <StyledFeatureCard>
              <StyledFeatureIcon>📊</StyledFeatureIcon>
              <StyledFeatureTitle>Live Performance Tracking</StyledFeatureTitle>
              <StyledFeatureDescription>
                Real-time performance metrics, year-over-year comparisons, and
                transparent reporting on all investments.
              </StyledFeatureDescription>
            </StyledFeatureCard>
            <StyledFeatureCard>
              <StyledFeatureIcon>💹</StyledFeatureIcon>
              <StyledFeatureTitle>Live Trade Updates</StyledFeatureTitle>
              <StyledFeatureDescription>
                Get notified of live trades, entry/exit points, and trade
                rationale to learn from real investment decisions.
              </StyledFeatureDescription>
            </StyledFeatureCard>
            <StyledFeatureCard>
              <StyledFeatureIcon>🎓</StyledFeatureIcon>
              <StyledFeatureTitle>Expert Coaching</StyledFeatureTitle>
              <StyledFeatureDescription>
                Access video courses, 1-on-1 coaching sessions, and educational
                content to improve your investment skills.
              </StyledFeatureDescription>
            </StyledFeatureCard>
            <StyledFeatureCard>
              <StyledFeatureIcon>🔮</StyledFeatureIcon>
              <StyledFeatureTitle>Prediction Models</StyledFeatureTitle>
              <StyledFeatureDescription>
                Advanced prediction models with historical accuracy metrics to
                inform your investment decisions.
              </StyledFeatureDescription>
            </StyledFeatureCard>
            <StyledFeatureCard>
              <StyledFeatureIcon>📈</StyledFeatureIcon>
              <StyledFeatureTitle>Portfolio Insights</StyledFeatureTitle>
              <StyledFeatureDescription>
                Detailed portfolio allocation breakdowns, risk assessments, and
                performance analytics.
              </StyledFeatureDescription>
            </StyledFeatureCard>
            <StyledFeatureCard>
              <StyledFeatureIcon>🤝</StyledFeatureIcon>
              <StyledFeatureTitle>Network Community</StyledFeatureTitle>
              <StyledFeatureDescription>
                Connect with other investors in Northern Ireland, share insights,
                and grow together.
              </StyledFeatureDescription>
            </StyledFeatureCard>
          </StyledFeaturesGrid>
          <div style={{ textAlign: "center", marginTop: "2rem", maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/coaching")}
            >
              Explore Coaching →
            </CallToActionButton>
          </div>
        </StyledFeaturesContainer>
      </StyledFeaturesSection>
    </>
  );
};

export default Home;
