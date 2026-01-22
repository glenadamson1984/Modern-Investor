import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { colours } from "../../utils/style.utils";
import useWindowSize from "../../hooks/useWindowSize";

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
`;

const StyledTrailDot = styled.div`
  position: fixed;
  pointer-events: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${colours.pink};
  box-shadow: 0 0 10px ${colours.pink}, 0 0 20px ${colours.pink};
  z-index: 9999;
  animation: ${fadeOut} 1.2s ease-out forwards;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  transform: translate(-50%, -50%);
`;

const MouseTrail = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const [dots, setDots] = useState([]);

  useEffect(() => {
    if (!isDesktop) return;

    let dotId = 0;
    let lastDotTime = 0;
    const dotInterval = 50; // Create a dot every 50ms for smoother trail

    const handleMouseMove = (e) => {
      const now = Date.now();
      
      // Throttle dot creation for smoother performance
      if (now - lastDotTime >= dotInterval) {
        const newDot = {
          id: dotId++,
          x: e.clientX,
          y: e.clientY,
        };

        setDots((prev) => [...prev, newDot]);

        // Remove dot after animation completes
        setTimeout(() => {
          setDots((prev) => prev.filter((dot) => dot.id !== newDot.id));
        }, 1200);

        lastDotTime = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {dots.map((dot) => (
        <StyledTrailDot key={dot.id} x={dot.x} y={dot.y} />
      ))}
    </>
  );
};

export default MouseTrail;
