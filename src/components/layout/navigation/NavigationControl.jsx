import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { colours } from "../../../utils/style.utils";
import { useRouter } from "next/router";
import { StyledContainer, StyledNav } from "./navigation-control.styles";
import { ConvertPathNameToURL, NavigationItems } from "./NavigationPaths";
import { useAuth } from "../../../contexts/AuthContext";

const NavigationControl = () => {
  const { pathname } = useRouter();
  const { user, isMember, isAdmin } = useAuth();

  const getNavigationItems = () => {
    const items = [...NavigationItems];
    if (user && isMember()) {
      items.push("Dashboard");
    }
    if (user && isAdmin()) {
      items.push("Admin");
    }
    return items;
  };

  return (
    <StyledContainer>
      {getNavigationItems().map((navigationItem, index) => {
        const href =
          navigationItem === "Home"
            ? "/"
            : navigationItem === "Dashboard"
            ? "/dashboard"
            : navigationItem === "Admin"
            ? "/admin/dashboard"
            : `/${ConvertPathNameToURL(navigationItem)}`;
        const isActive =
          navigationItem === "Home"
            ? pathname === "/"
            : navigationItem === "Dashboard"
            ? pathname === "/dashboard"
            : navigationItem === "Admin"
            ? pathname.startsWith("/admin")
            : pathname === `/${ConvertPathNameToURL(navigationItem)}`;

        return (
          <StyledNav key={index} active={isActive}>
            <Link href={href}>
              <a>{navigationItem}</a>
            </Link>
          </StyledNav>
        );
      })}
    </StyledContainer>
  );
};

export default NavigationControl;
