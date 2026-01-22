import styled from "styled-components";
import { colours, media } from "../../utils/style.utils";

export const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colours.darkGrey};
  padding: 1rem 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  gap: 1rem;
  min-height: 70px;

  ${media.forDesktop} {
    padding: 1.25rem 4rem;
    gap: 2rem;
  }

  ${media.forDesktopWideScreen} {
    padding: 1.25rem 6rem;
  }

  ${media.forBigDesktopAndUp} {
    padding: 1.25rem 8rem;
  }
`;

export const StyledNavigationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;
