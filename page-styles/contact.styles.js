import styled from "styled-components";
import { colours, media } from "../src/utils/style.utils";

export const StyledContactHero = styled.div`
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "120px 80px 80px" : "80px 40px 60px")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledContactHeroContent = styled.div`
  max-width: 800px;
  text-align: center;
`;

export const StyledContactHeroTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "64px" : "42px")};
  font-weight: 700;
  line-height: 1.2;
  color: ${colours.white};
  margin: 0 0 1.5rem 0;

  span {
    color: ${colours.pink};
  }
`;

export const StyledContactHeroSubtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "20px" : "18px")};
  line-height: 1.6;
  color: ${colours.white};
  opacity: 0.9;
  margin: 0;
`;

export const StyledContactSection = styled.section`
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "80px 80px 120px" : "60px 40px 80px")};
`;

export const StyledContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: ${(props) => (props.isDesktop ? "grid" : "flex")};
  grid-template-columns: ${(props) => (props.isDesktop ? "1fr 1fr" : "1fr")};
  gap: ${(props) => (props.isDesktop ? "80px" : "60px")};
  flex-direction: column;
`;

export const StyledContactForm = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: ${(props) => (props.isDesktop ? "50px" : "40px 30px")};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

export const StyledFormTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "36px" : "28px")};
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 2rem 0;
  text-align: center;

  span {
    color: ${colours.pink};
  }
`;

export const StyledFieldSet = styled.fieldset`
  border: none;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
`;

export const StyledIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colours.white};
  opacity: 0.7;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 60px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  font-family: "Inter", sans-serif;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: ${colours.white};

  &:focus {
    outline: none;
    border-color: ${colours.pink};
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 16px 20px 16px 60px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  font-family: "Inter", sans-serif;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
  color: ${colours.white};

  &:focus {
    outline: none;
    border-color: ${colours.pink};
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const StyledErrorMessage = styled.div`
  color: ${colours.pink};
  font-family: "Inter", sans-serif;
  font-size: 14px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
`;

export const StyledContactDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledContactDetailsTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "36px" : "28px")};
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 2rem 0;

  span {
    color: ${colours.pink};
  }
`;

export const StyledContactDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const StyledContactDetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }
`;

export const StyledContactDetailIcon = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colours.pink};
  border-radius: 12px;
  color: ${colours.white};
  font-size: 24px;
  flex-shrink: 0;
`;

export const StyledContactDetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StyledContactDetailType = styled.h3`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${colours.white};
  margin: 0;
`;

export const StyledContactDetailValue = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: ${colours.white};
  opacity: 0.9;
  margin: 0;

  a {
    color: ${colours.pink};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${colours.darkGreen};
    }
  }
`;
