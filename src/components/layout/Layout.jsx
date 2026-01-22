import Logo from "./logo/Logo";
import NavigationControl from "./navigation/NavigationControl";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { colours } from "../../utils/style.utils";
import useWindowSize from "../../hooks/useWindowSize";
import CallToActionButton from "../buttons/action/CallToActionButton";
import ContactFooter from "./ContactFooter";
import {
  StyledBody,
  StyledContainer,
  StyledNavigationContainer,
} from "./layout.styles";
import MobileMenu from "./navigation/MobileMenu";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import MouseTrail from "../effects/MouseTrail";

const Layout = ({ children }) => {
  const { checkIsDesktop } = useWindowSize();
  const router = useRouter();
  const isDesktop = checkIsDesktop();
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <MouseTrail />
      <StyledBody>
        <StyledContainer>
          <Logo />
          {isDesktop ? (
            <StyledNavigationContainer>
              <NavigationControl />
              {user ? (
                <CallToActionButton
                  animate={false}
                  variant="secondary"
                  onClick={logout}
                >
                  Logout
                </CallToActionButton>
              ) : (
                <CallToActionButton
                  animate={false}
                  variant="primary"
                  onClick={() => router.push("/login")}
                >
                  Login
                </CallToActionButton>
              )}
            </StyledNavigationContainer>
          ) : (
            <div
              onClick={() => setShowMenu(!showMenu)}
              style={{
                zIndex: 1001,
                position: "relative",
                cursor: "pointer",
                padding: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "44px",
                minHeight: "44px",
              }}
            >
              <FontAwesomeIcon size="2x" color={colours.pink} icon={faBars} />
            </div>
          )}
        </StyledContainer>
        {children}
        <ContactFooter />
      </StyledBody>
      {showMenu && (
        <MobileMenu
          showMenu={showMenu}
          onMenuClick={(showMenu) => setShowMenu(showMenu)}
        />
      )}
    </>
  );
};

export default Layout;
