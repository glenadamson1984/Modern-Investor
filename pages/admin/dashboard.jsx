import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../src/contexts/AuthContext";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import CallToActionButton from "../../src/components/buttons/action/CallToActionButton";

const StyledPageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  min-height: 100vh;
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "4rem" : "2rem")};
`;

const StyledContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledPageTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 1rem 0;
`;

const StyledAdminGrid = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isDesktop ? "repeat(2, 1fr)" : "1fr"};
  gap: 2rem;
  margin-top: 3rem;
`;

const StyledAdminCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${colours.pink};
    transform: translateY(-4px);
  }
`;

const StyledCardTitle = styled.h3`
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: ${colours.white};
  margin: 0 0 1rem 0;
`;

const StyledCardDescription = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0 0 1.5rem 0;
`;

const StyledButtonWrapper = styled.div`
  max-width: 100%;
  width: 100%;
`;

const AdminDashboard = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <>
      <SEO title="Admin Dashboard | Modern Investments" />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Admin Dashboard</StyledPageTitle>

          <StyledAdminGrid isDesktop={isDesktop}>
            <StyledAdminCard>
              <StyledCardTitle>Manage Performance</StyledCardTitle>
              <StyledCardDescription>
                View, add, and delete performance entries. Manage all your performance metrics in one place.
              </StyledCardDescription>
              <StyledButtonWrapper>
                <CallToActionButton
                  variant="darkGreen"
                  onClick={() => router.push("/admin/performance")}
                >
                  Manage Performance
                </CallToActionButton>
              </StyledButtonWrapper>
            </StyledAdminCard>

            <StyledAdminCard>
              <StyledCardTitle>Upload Data</StyledCardTitle>
              <StyledCardDescription>
                Upload CSV or Excel files containing performance data or trades.
                Files will be automatically parsed and imported into the system.
              </StyledCardDescription>
              <StyledButtonWrapper>
                <CallToActionButton
                  variant="darkGreen"
                  onClick={() => router.push("/admin/upload")}
                >
                  Go to Upload
                </CallToActionButton>
              </StyledButtonWrapper>
            </StyledAdminCard>

            <StyledAdminCard>
              <StyledCardTitle>Manage Trades</StyledCardTitle>
              <StyledCardDescription>
                Add, edit, or remove trade records. Manage live trade updates
                and track trade performance.
              </StyledCardDescription>
              <StyledButtonWrapper>
                <CallToActionButton
                  variant="darkGreen"
                  onClick={() => router.push("/admin/trades")}
                >
                  Manage Trades
                </CallToActionButton>
              </StyledButtonWrapper>
            </StyledAdminCard>

            <StyledAdminCard>
              <StyledCardTitle>User Management</StyledCardTitle>
              <StyledCardDescription>
                View and manage network members. Assign roles, view user
                activity, and manage access.
              </StyledCardDescription>
              <StyledButtonWrapper>
                <CallToActionButton
                  variant="darkGreen"
                  onClick={() => router.push("/admin/users")}
                >
                  Manage Users
                </CallToActionButton>
              </StyledButtonWrapper>
            </StyledAdminCard>

            <StyledAdminCard>
              <StyledCardTitle>Content Management</StyledCardTitle>
              <StyledCardDescription>
                Manage articles, courses, and other content. Create and edit
                educational materials for the network.
              </StyledCardDescription>
              <StyledButtonWrapper>
                <CallToActionButton
                  variant="darkGreen"
                  onClick={() => router.push("/admin/content")}
                >
                  Manage Content
                </CallToActionButton>
              </StyledButtonWrapper>
            </StyledAdminCard>
          </StyledAdminGrid>
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default AdminDashboard;
