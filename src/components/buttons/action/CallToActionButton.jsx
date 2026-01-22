import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { colours } from "../../../utils/style.utils";

const StyledCallToAction = styled.div.attrs((props) => ({
  "data-variant": props.variant,
}))`
  background: ${(props) => {
    const variant = props["data-variant"] || "primary";
    return variant === "darkGreen"
      ? `${colours.darkGreen}`
      : variant === "secondary"
      ? `${colours.white}`
      : `${colours.pink}`;
  }};
  border-radius: 30px;
  opacity: 1;
  padding: 1rem;
  cursor: pointer;
  color: ${(props) => {
    const variant = props["data-variant"] || "primary";
    return variant === "secondary" ? `${colours.black}` : `${colours.white}`;
  }};
  transition: all 0.3s ease;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background: ${(props) => {
      const variant = props["data-variant"] || "primary";
      return variant === "secondary"
        ? `${colours.darkGreen}`
        : variant === "darkGreen"
        ? `${colours.pink}`
        : `${colours.darkGreen}`;
    }};
    color: ${(props) => {
      const variant = props["data-variant"] || "primary";
      return variant === "secondary" ? `${colours.white}` : `${colours.white}`;
    }};
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
`;

const StyledCallToActionText = styled.div`
  text-align: center;
  font: normal normal medium 20px/26px Inter;
  font-weight: bold;
  font-size: 20px;
  padding: 0 1rem;
`;

const CallToActionButton = ({
  children,
  variant = "primary",
  onClick,
  href,
  animate = false,
}) => {
  const buttonContent = (
    <StyledCallToAction
      className={animate ? "animate-bounce" : null}
      data-variant={variant}
      onClick={onClick}
      as={href ? undefined : "div"}
    >
      <StyledCallToActionText>{children}</StyledCallToActionText>
    </StyledCallToAction>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        <a style={{ textDecoration: "none", display: "inline-block" }}>
          {buttonContent}
        </a>
      </Link>
    );
  }

  return buttonContent;
};

export default CallToActionButton;
