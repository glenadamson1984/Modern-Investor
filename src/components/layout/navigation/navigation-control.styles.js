import styled from "styled-components";
import { colours } from "../../../utils/style.utils";

export const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledNav = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  text-align: left;
  font-family: "Inter", sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: ${(props) => (props.active ? colours.white : "rgba(255, 255, 255, 0.85)")};
  text-transform: capitalize;
  margin: 0;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;
  overflow: hidden;

  a {
    color: inherit;
    text-decoration: none;
    position: relative;
    z-index: 1;
    display: block;
    transition: color 0.3s ease;
  }

  /* Active state - highlight background */
  ${(props) =>
    props.active &&
    `
    background: rgba(255, 64, 139, 0.15);
    color: ${colours.white};
    box-shadow: 0 2px 8px rgba(255, 64, 139, 0.2);
    
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 64, 139, 0.1) 0%, rgba(255, 64, 139, 0.05) 100%);
      border-radius: 8px;
      z-index: 0;
    }
  `}

  /* Hover state - smooth background and scale */
  &:hover {
    color: ${colours.white};
    background: ${(props) =>
      props.active
        ? "rgba(255, 64, 139, 0.25)"
        : "rgba(255, 255, 255, 0.1)"};
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.active
        ? "0 4px 12px rgba(255, 64, 139, 0.3)"
        : "0 2px 8px rgba(0, 0, 0, 0.15)"};
  }

  /* Active hover - enhanced effect */
  ${(props) =>
    props.active &&
    `
    &:hover {
      background: rgba(255, 64, 139, 0.25);
      box-shadow: 0 4px 12px rgba(255, 64, 139, 0.3);
    }
  `}
`;
