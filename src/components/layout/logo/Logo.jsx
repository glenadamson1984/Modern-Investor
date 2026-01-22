import Image from "next/image";
import React from "react";
import useWindowSize from "../../../hooks/useWindowSize";
import { useRouter } from "next/router";
import styled from "styled-components";
import { colours, media } from "../../../utils/style.utils";

export const StyledLogo = styled.div`
  cursor: pointer;
  position: relative;
  display: inline-block;
  background: ${colours.darkGrey};
  border-radius: 12px;
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  flex-shrink: 0;
  max-width: calc(100% - 60px);
  
  ${media.forDesktop} {
    max-width: none;
  }
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 64, 139, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 
                0 4px 12px rgba(255, 64, 139, 0.3),
                0 0 20px rgba(255, 64, 139, 0.1);
    background: ${colours.darkGrey};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
  }
  
  img {
    display: block;
    border-radius: 8px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: brightness(1.05) contrast(1.05);
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 50px;
    
    ${media.forDesktop} {
      max-height: none;
    }
  }
  
  &:hover img {
    filter: brightness(1.15) contrast(1.1);
    transform: scale(1.02);
  }
`;

const Logo = () => {
  const { checkIsDesktop } = useWindowSize();
  const router = useRouter();
  const isDesktop = checkIsDesktop();

  return (
    <StyledLogo onClick={() => router.push("/")}>
      <Image
        src="/images/Logo/Modern-investor-logo.png"
        alt="Modern Investor"
        width={355}
        height={112.5}
      />
    </StyledLogo>
  );
};

export default Logo;
