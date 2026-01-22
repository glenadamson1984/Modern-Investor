import styled from "styled-components";
import { colours } from "../../../utils/style.utils";

export const StyledBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  backdrop-filter: blur(4px);
`;

export const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 400px;
  height: 100vh;
  background: ${colours.darkGrey};
  z-index: 1000;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow-y: auto;
`;

export const StyledIconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
`;

export const StyledCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const StyledNavigationContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StyledNavigationLink = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${colours.white};
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: capitalize;

  &:hover {
    background: rgba(255, 64, 139, 0.2);
    transform: translateX(4px);
  }
`;
