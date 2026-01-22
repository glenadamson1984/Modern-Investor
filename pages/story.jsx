import React from "react";
import useWindowSize from "../src/hooks/useWindowSize";
import SEO from "../src/components/SEO";
import styled from "styled-components";
import { colours } from "../src/utils/style.utils";

const StyledPageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  min-height: 100vh;
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "6rem 4rem" : "4rem 2rem")};
`;

const StyledContentContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const StyledPageTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "56px" : "36px")};
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 2rem 0;
  text-align: center;
`;

const StyledSection = styled.section`
  margin-bottom: 4rem;
`;

const StyledSectionTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: 32px;
  font-weight: 600;
  color: ${colours.pink};
  margin: 0 0 1.5rem 0;
`;

const StyledParagraph = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 1.8;
  color: ${colours.white};
  opacity: 0.9;
  margin: 0 0 1.5rem 0;
`;

const Story = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();

  return (
    <>
      <SEO
        title="My Investment Story | Modern Investments"
        description="Learn about my investment journey, credentials, and path to fund management in Northern Ireland."
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle isDesktop={isDesktop}>My Investment Story</StyledPageTitle>

          <StyledSection>
            <StyledSectionTitle>The Journey Begins</StyledSectionTitle>
            <StyledParagraph>
              My investment journey started with a simple goal: to build
              financial security and create a sustainable income stream as I
              approach retirement. Based in Northern Ireland, I began investing
              with a focus on long-term growth and risk management.
            </StyledParagraph>
            <StyledParagraph>
              Over the years, I've developed a systematic approach to investing,
              combining fundamental analysis with technical indicators to make
              informed decisions. My strategy emphasizes diversification,
              disciplined risk management, and continuous learning.
            </StyledParagraph>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>Building the Network</StyledSectionTitle>
            <StyledParagraph>
              As my investment portfolio grew, friends and colleagues began
              reaching out for advice. I realized there was a need for a
              transparent, data-driven investment network in Northern Ireland
              where investors could share insights, track performance, and learn
              from each other.
            </StyledParagraph>
            <StyledParagraph>
              This led to the creation of the Modern Investments Network—a
              platform where I share my performance metrics, live trades, and
              investment strategies openly. The goal is to build a community of
              informed investors who can grow their portfolios together.
            </StyledParagraph>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>Path to Fund Management</StyledSectionTitle>
            <StyledParagraph>
              As the network grows, I'm working toward establishing a formal
              fund management operation. This would allow me to manage
              investments on behalf of network members while maintaining the
              same level of transparency and performance tracking.
            </StyledParagraph>
            <StyledParagraph>
              The fund management approach will focus on:
            </StyledParagraph>
            <ul
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                lineHeight: "1.8",
                color: colours.white,
                opacity: 0.9,
                paddingLeft: "2rem",
              }}
            >
              <li>Transparent fee structures</li>
              <li>Regular performance reporting</li>
              <li>Risk-adjusted returns</li>
              <li>Diversified portfolio management</li>
              <li>Continuous education and coaching</li>
            </ul>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>Northern Ireland Focus</StyledSectionTitle>
            <StyledParagraph>
              Being based in Northern Ireland, I understand the unique economic
              landscape and investment opportunities in the region. The network
              aims to connect local investors and provide insights relevant to
              the Northern Ireland market.
            </StyledParagraph>
            <StyledParagraph>
              Whether you're just starting your investment journey or looking to
              grow an existing portfolio, the Modern Investments Network
              provides the tools, insights, and community support you need to
              succeed.
            </StyledParagraph>
          </StyledSection>
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default Story;
