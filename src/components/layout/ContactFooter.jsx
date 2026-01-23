import React from "react";
import useWindowSize from "../../hooks/useWindowSize";
import CallToActionButton from "../buttons/action/CallToActionButton";
import { useRouter } from "next/router";
import styled from "styled-components";
import { colours, media } from "../../utils/style.utils";

const StyledContactSection = styled.section.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "6rem 4rem" : "4rem 2rem")};
  color: ${colours.white};
  position: relative;
  overflow: hidden;

  ${media.forDesktopWideScreen} {
    padding: 6rem 6rem;
  }
`;

const StyledContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const StyledSectionTitle = styled.h2.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop" && prop !== "light",
})`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "48px" : "32px")};
  font-weight: 700;
  color: ${(props) => (props.light ? colours.white : colours.black)};
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const StyledSectionDescription = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop" && prop !== "light",
})`
  font-family: "Inter", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "20px" : "16px")};
  line-height: 1.6;
  color: ${(props) => (props.light ? colours.white : colours.grey)};
  opacity: ${(props) => (props.light ? 0.9 : 1)};
  max-width: 800px;
  margin: 0 auto;
`;

const StyledContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 3rem;
  align-items: center;

  ${media.forDesktop} {
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
  }
`;

const StyledContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: ${colours.white};
  opacity: 0.9;
`;

const ContactFooter = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();

  return (
    <StyledContactSection isDesktop={isDesktop}>
      <StyledContactContainer>
        <StyledSectionTitle isDesktop={isDesktop} light>
          Join the Investment Network
        </StyledSectionTitle>
        <StyledSectionDescription
          isDesktop={isDesktop}
          light
          style={{
            marginTop: "1rem",
            fontSize: isDesktop ? "18px" : "16px",
            opacity: 0.9,
          }}
        >
          Connect with a network of investors in Northern Ireland. Access live
          trades, performance insights, and expert coaching to grow your
          investment portfolio.
        </StyledSectionDescription>
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: "300px", width: "100%" }}>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/coaching")}
            >
              Explore Coaching
            </CallToActionButton>
          </div>
          {!router.pathname.includes("/login") && (
            <div style={{ maxWidth: "300px", width: "100%" }}>
              <CallToActionButton
                variant="secondary"
                onClick={() => router.push("/login")}
              >
                Join Network
              </CallToActionButton>
            </div>
          )}
          {!router.pathname.includes("/contact") && (
            <div style={{ maxWidth: "300px", width: "100%" }}>
              <CallToActionButton
                variant="primary"
                onClick={() => router.push("/contact")}
              >
                Get In Touch
              </CallToActionButton>
            </div>
          )}
        </div>
        <StyledContactInfo>
          <StyledContactItem>
            <span>📍</span>
            <span>Northern Ireland, UK</span>
          </StyledContactItem>
          <StyledContactItem>
            <span>✉️</span>
            <a 
              href="mailto:info@modern-investor.co.uk" 
              style={{ 
                color: "inherit", 
                textDecoration: "none",
                transition: "color 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.color = "#FF4081"}
              onMouseLeave={(e) => e.target.style.color = "inherit"}
            >
              info@modern-investor.co.uk
            </a>
          </StyledContactItem>
        </StyledContactInfo>
      </StyledContactContainer>
    </StyledContactSection>
  );
};

export default ContactFooter;
