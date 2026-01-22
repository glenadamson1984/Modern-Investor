import React, { useState } from "react";
import useWindowSize from "../src/hooks/useWindowSize";
import SEO from "../src/components/SEO";
import PerformanceChart from "../src/components/charts/PerformanceChart";
import styled from "styled-components";
import { colours } from "../src/utils/style.utils";
import CallToActionButton from "../src/components/buttons/action/CallToActionButton";
import { useRouter } from "next/router";

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
  text-align: center;
`;

const StyledPageDescription = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0 0 3rem 0;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledPeriodSelector = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const StyledPeriodButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  background: ${(props) =>
    props.active ? colours.pink : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${(props) => (props.active ? colours.pink : "rgba(255, 255, 255, 0.2)")};
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${colours.white};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.active ? colours.pink : "rgba(255, 255, 255, 0.15)"};
    transform: translateY(-2px);
  }
`;

const Performance = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const [period, setPeriod] = useState("1Y");
  const router = useRouter();

  return (
    <>
      <SEO
        title="Performance Dashboard | Modern Investments"
        description="View detailed performance metrics, year-over-year comparisons, and investment returns."
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Performance Dashboard</StyledPageTitle>
          <StyledPageDescription>
            Track investment performance with detailed metrics, charts, and
            year-over-year comparisons. Transparent reporting on all investments.
          </StyledPageDescription>

          <StyledPeriodSelector>
            <StyledPeriodButton
              active={period === "1Y"}
              onClick={() => setPeriod("1Y")}
            >
              1 Year
            </StyledPeriodButton>
            <StyledPeriodButton
              active={period === "3Y"}
              onClick={() => setPeriod("3Y")}
            >
              3 Years
            </StyledPeriodButton>
            <StyledPeriodButton
              active={period === "5Y"}
              onClick={() => setPeriod("5Y")}
            >
              5 Years
            </StyledPeriodButton>
            <StyledPeriodButton
              active={period === "ALL"}
              onClick={() => setPeriod("ALL")}
            >
              All Time
            </StyledPeriodButton>
          </StyledPeriodSelector>

          <PerformanceChart period={period} showPlatforms={true} />

          <div style={{ textAlign: "center", marginTop: "3rem", maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/login")}
            >
              Join Network for Full Access
            </CallToActionButton>
          </div>
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default Performance;
