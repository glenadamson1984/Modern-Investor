import React from "react";
import useWindowSize from "../src/hooks/useWindowSize";
import SEO from "../src/components/SEO";
import styled from "styled-components";
import { colours } from "../src/utils/style.utils";
import CallToActionButton from "../src/components/buttons/action/CallToActionButton";
import { useRouter } from "next/router";

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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2.5rem;
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

const StyledFAQItem = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const StyledFAQQuestion = styled.h3`
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: ${colours.white};
  margin: 0 0 1rem 0;
`;

const StyledFAQAnswer = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0;
`;

const FundManagement = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();

  return (
    <>
      <SEO
        title="How Fund Management Works | Modern Investments"
        description="Learn about fund management, the process, risk management, and fee structures."
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle isDesktop={isDesktop}>
            How Fund Management Works
          </StyledPageTitle>

          <StyledSection>
            <StyledSectionTitle>What is Fund Management?</StyledSectionTitle>
            <StyledParagraph>
              Fund management involves professionally managing investment funds
              on behalf of investors. A fund manager makes investment decisions,
              monitors performance, and adjusts the portfolio to meet investment
              objectives while managing risk.
            </StyledParagraph>
            <StyledParagraph>
              At Modern Investments, we believe in transparency, data-driven
              decisions, and clear communication with our network members.
            </StyledParagraph>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>The Process</StyledSectionTitle>
            <StyledParagraph>
              <strong>1. Research & Analysis:</strong> We conduct thorough
              research on potential investments, analyzing market trends,
              company fundamentals, and economic indicators.
            </StyledParagraph>
            <StyledParagraph>
              <strong>2. Portfolio Construction:</strong> Investments are selected
              and allocated based on risk-return profiles, diversification
              principles, and investment objectives.
            </StyledParagraph>
            <StyledParagraph>
              <strong>3. Active Management:</strong> The portfolio is actively
              monitored and adjusted based on market conditions, performance
              metrics, and changing investment opportunities.
            </StyledParagraph>
            <StyledParagraph>
              <strong>4. Performance Reporting:</strong> Regular performance
              reports are provided, showing returns, risk metrics, and portfolio
              composition.
            </StyledParagraph>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>Risk Management</StyledSectionTitle>
            <StyledParagraph>
              Risk management is central to our approach. We use several
              strategies:
            </StyledParagraph>
            <ul
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                lineHeight: "1.8",
                color: colours.white,
                opacity: 0.9,
                paddingLeft: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              <li>Diversification across asset classes and sectors</li>
              <li>Position sizing based on risk assessment</li>
              <li>Stop-loss orders to limit downside risk</li>
              <li>Regular portfolio rebalancing</li>
              <li>Stress testing and scenario analysis</li>
            </ul>
            <StyledParagraph>
              Our goal is to achieve strong returns while managing downside risk
              and protecting capital.
            </StyledParagraph>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>Fee Structure</StyledSectionTitle>
            <StyledParagraph>
              We believe in transparent, fair fee structures. Fees are
              structured to align our interests with investors:
            </StyledParagraph>
            <ul
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                lineHeight: "1.8",
                color: colours.white,
                opacity: 0.9,
                paddingLeft: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              <li>
                <strong>Management Fee:</strong> A small percentage of assets
                under management (typically 1-2% annually)
              </li>
              <li>
                <strong>Performance Fee:</strong> A percentage of profits
                above a high-water mark (typically 20% of gains)
              </li>
              <li>
                <strong>No Hidden Fees:</strong> All fees are clearly disclosed
                upfront
              </li>
            </ul>
            <StyledParagraph>
              Fee structures will be finalized as we transition to formal fund
              management operations.
            </StyledParagraph>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>Frequently Asked Questions</StyledSectionTitle>

            <StyledFAQItem>
              <StyledFAQQuestion>
                How do I invest in the fund?
              </StyledFAQQuestion>
              <StyledFAQAnswer>
                As we transition to formal fund management, investment
                opportunities will be available to network members. Contact us
                to learn more about upcoming investment options.
              </StyledFAQAnswer>
            </StyledFAQItem>

            <StyledFAQItem>
              <StyledFAQQuestion>What is the minimum investment?</StyledFAQQuestion>
              <StyledFAQAnswer>
                Minimum investment requirements will be determined as we establish
                the fund structure. We aim to make investing accessible while
                maintaining operational efficiency.
              </StyledFAQAnswer>
            </StyledFAQItem>

            <StyledFAQItem>
              <StyledFAQQuestion>How often are performance reports provided?</StyledFAQQuestion>
              <StyledFAQAnswer>
                Performance reports are provided monthly, with real-time updates
                available through the member dashboard. Annual comprehensive
                reports include detailed analysis and insights.
              </StyledFAQAnswer>
            </StyledFAQItem>

            <StyledFAQItem>
              <StyledFAQQuestion>What are the risks?</StyledFAQQuestion>
              <StyledFAQAnswer>
                All investments carry risk, including the potential loss of
                capital. Past performance does not guarantee future results. We
                provide detailed risk disclosures and work to manage risk through
                diversification and disciplined investment processes.
              </StyledFAQAnswer>
            </StyledFAQItem>
          </StyledSection>

          <div style={{ textAlign: "center", marginTop: "3rem", maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/coaching")}
            >
              Learn More About Coaching
            </CallToActionButton>
          </div>
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default FundManagement;
