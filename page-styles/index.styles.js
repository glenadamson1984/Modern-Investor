import styled from "styled-components";
import { colours, media } from "../src/utils/style.utils";

// Hero Section Styles
export const StyledHeroBackground = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  position: relative;
  width: 100%;
  min-height: ${(props) => (props.isDesktop ? "90vh" : "80vh")};
  background: ${colours.darkGrey};
  display: flex;
  align-items: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(35, 35, 35, 0.65) 0%,
      rgba(38, 38, 38, 0.6) 100%
    );
    z-index: 1;
  }
`;

export const StyledHeroContainer = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: ${(props) =>
    props.isDesktop ? "8rem 4rem 4rem" : "4rem 2rem 2rem"};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StyledHeroTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "72px" : "42px")};
  line-height: ${(props) => (props.isDesktop ? "1.1" : "1.2")};
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 2rem 0;
  max-width: ${(props) => (props.isDesktop ? "800px" : "100%")};
`;

export const StyledHeroDescription = styled.p`
  font-family: "Inter", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "22px" : "18px")};
  line-height: ${(props) => (props.isDesktop ? "1.6" : "1.5")};
  color: ${colours.white};
  margin: 0 0 3rem 0;
  max-width: ${(props) => (props.isDesktop ? "700px" : "100%")};
  opacity: 0.95;
`;

export const StyledHeroButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  
  > * {
    max-width: 300px;
    flex: 0 1 auto;
  }
`;

export const StyledTrustBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: ${colours.white};
  opacity: 0.8;
  margin-top: 2rem;
`;

// Performance Metrics Section
export const StyledPerformanceSection = styled.section.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  position: relative;
  background: ${colours.lightGrey};
  padding: ${(props) => (props.isDesktop ? "6rem 4rem" : "4rem 2rem")};
  width: 100%;
  overflow: hidden;
`;

export const StyledPerformanceContainer = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
`;

export const StyledSectionTitle = styled.h2.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop" && prop !== "light",
})`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "56px" : "36px")};
  line-height: 1.2;
  font-weight: 700;
  color: ${(props) => (props.light ? colours.white : colours.black)};
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

export const StyledSectionDescription = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop" && prop !== "light",
})`
  font-family: "Inter", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "20px" : "18px")};
  line-height: 1.6;
  color: ${(props) => (props.light ? colours.white : colours.grey)};
  margin: 0 0 3rem 0;
  opacity: ${(props) => (props.light ? "0.9" : "0.8")};
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

export const StyledMetricsGrid = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const pinkGlow = `
  @keyframes pinkGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(255, 64, 139, 0.4),
                  0 0 40px rgba(255, 64, 139, 0.3),
                  0 0 60px rgba(255, 64, 139, 0.2);
    }
    50% {
      box-shadow: 0 0 30px rgba(255, 64, 139, 0.6),
                  0 0 60px rgba(255, 64, 139, 0.5),
                  0 0 90px rgba(255, 64, 139, 0.4);
    }
  }
`;

export const StyledMetricCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  background: ${colours.white};
  padding: ${(props) => (props.isDesktop ? "3.5rem 4rem" : "2.5rem 3rem")};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  min-width: ${(props) => (props.isDesktop ? "280px" : "240px")};
  transition: transform 0.2s;
  
  ${pinkGlow}
  animation: pinkGlow 3s ease-in-out infinite;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const StyledMetricValue = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "56px" : "48px")};
  font-weight: 700;
  color: ${colours.darkGreen};
  line-height: 1.2;
`;

export const StyledMetricLabel = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  font-family: "Inter", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "16px" : "14px")};
  color: ${colours.grey};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

// Features Section
export const StyledFeaturesSection = styled.section.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  position: relative;
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "6rem 4rem" : "4rem 2rem")};
  width: 100%;
  overflow: hidden;
`;

export const StyledFeaturesContainer = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
`;

export const StyledFeaturesGrid = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isDesktop ? "repeat(3, 1fr)" : "1fr"};
  gap: 2rem;
  margin-bottom: 3rem;
`;

export const StyledFeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;

  &:hover {
    transform: translateY(-4px);
    border-color: ${colours.pink};
    box-shadow: 0 8px 24px rgba(255, 64, 139, 0.2);
  }
`;

export const StyledFeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 1rem;
`;

export const StyledFeatureTitle = styled.h3`
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: ${colours.white};
  margin: 0;
`;

export const StyledFeatureDescription = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0;
`;
