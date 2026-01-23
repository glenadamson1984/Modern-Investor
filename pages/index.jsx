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
import { getLatestTotalPerformance } from "../src/utils/performance.utils";

const Home = () => {
  const { checkIsDesktop } = useWindowSize();
  const router = useRouter();
  const isDesktop = checkIsDesktop();
  const [performanceData, setPerformanceData] = useState({
    ytdReturn: 0,
    totalReturn: 0,
  });

  useEffect(() => {
    // Fetch latest TOTAL performance data (for homepage overview)
    const fetchPerformance = async () => {
      try {
        const q = query(
          collection(db, "performance"),
          orderBy("date", "desc"),
          limit(100) // Get more entries to calculate totals across all platforms
        );
        const snapshot = await getDocs(q);
        const allEntries = snapshot.docs.map((doc) => doc.data());
        
        // Calculate totals from all platforms (this creates "total" entries that aggregate all platforms)
        const { calculateTotalPerformance } = await import("../src/utils/performance.utils");
        const entriesWithTotals = calculateTotalPerformance(allEntries);
        
        // Get latest total entry (aggregated across all platforms)
        const totalEntry = getLatestTotalPerformance(entriesWithTotals);
        
        // Group entries by platform and calculate cumulative returns for each
        const platformEntries = {};
        entriesWithTotals.forEach((entry) => {
          const platform = entry.platform || "total";
          if (platform !== "total") {
            if (!platformEntries[platform]) {
              platformEntries[platform] = [];
            }
            platformEntries[platform].push(entry);
          }
        });
        
        // Calculate cumulative returns per platform (same logic as chart)
        const platformTotals = {};
        Object.keys(platformEntries).forEach((platform) => {
          const entries = platformEntries[platform].sort((a, b) => {
            const dateA = a.date?.seconds ? a.date.seconds * 1000 : new Date(a.date).getTime();
            const dateB = b.date?.seconds ? b.date.seconds * 1000 : new Date(b.date).getTime();
            return dateA - dateB;
          });
          
          let cumulative = 1;
          let hasStartedCalculation = false;
          
          entries.forEach((entry) => {
            if (entry.totalReturn != null && entry.totalReturn !== 0) {
              entry.calculatedTotalReturn = parseFloat(entry.totalReturn.toFixed(2));
              cumulative = 1 + (entry.totalReturn / 100);
              hasStartedCalculation = true;
            } else if (entry.monthlyReturn != null && entry.monthlyReturn !== 0) {
              const monthlyDecimal = entry.monthlyReturn / 100;
              cumulative *= (1 + monthlyDecimal);
              entry.calculatedTotalReturn = parseFloat(((cumulative - 1) * 100).toFixed(2));
              hasStartedCalculation = true;
            } else if (hasStartedCalculation) {
              entry.calculatedTotalReturn = parseFloat(((cumulative - 1) * 100).toFixed(2));
            }
          });
          
          // Get the latest calculated total for this platform
          const latestEntry = entries[entries.length - 1];
          if (latestEntry && latestEntry.calculatedTotalReturn != null) {
            platformTotals[platform] = latestEntry.calculatedTotalReturn;
          }
        });
        
        // Calculate average total return across all platforms
        const totalReturnValues = Object.values(platformTotals).filter(v => v != null);
        const combinedTotalReturn = totalReturnValues.length > 0
          ? totalReturnValues.reduce((sum, v) => sum + v, 0) / totalReturnValues.length
          : 0;
        
        // Get latest YTD and Yearly returns (average across platforms)
        const latestEntries = {};
        entriesWithTotals.forEach((entry) => {
          const platform = entry.platform || "total";
          if (platform !== "total") {
            const entryDate = entry.date?.seconds 
              ? new Date(entry.date.seconds * 1000).getTime()
              : new Date(entry.date).getTime();
            
            if (!latestEntries[platform] || entryDate > latestEntries[platform].date) {
              latestEntries[platform] = {
                ...entry,
                date: entryDate
              };
            }
          }
        });
        
        const ytdReturns = Object.values(latestEntries)
          .map(e => e.ytdReturn)
          .filter(v => v != null);
        const combinedYtdReturn = ytdReturns.length > 0
          ? ytdReturns.reduce((sum, v) => sum + v, 0) / ytdReturns.length
          : 0;
        
        setPerformanceData({
          ytdReturn: parseFloat(combinedYtdReturn.toFixed(2)),
          totalReturn: parseFloat(combinedTotalReturn.toFixed(2)),
        });
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
            <StyledMetricCard isDesktop={isDesktop}>
              <StyledMetricValue isDesktop={isDesktop}>
                {performanceData.ytdReturn > 0 ? "+" : ""}
                {performanceData.ytdReturn.toFixed(2)}%
              </StyledMetricValue>
              <StyledMetricLabel isDesktop={isDesktop}>YTD Return</StyledMetricLabel>
            </StyledMetricCard>
            <StyledMetricCard isDesktop={isDesktop}>
              <StyledMetricValue isDesktop={isDesktop}>
                {performanceData.totalReturn > 0 ? "+" : ""}
                {performanceData.totalReturn.toFixed(2)}%
              </StyledMetricValue>
              <StyledMetricLabel isDesktop={isDesktop}>Total Return</StyledMetricLabel>
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
