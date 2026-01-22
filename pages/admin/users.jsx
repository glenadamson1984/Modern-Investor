import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../src/contexts/AuthContext";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import CallToActionButton from "../../src/components/buttons/action/CallToActionButton";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  margin: 0 0 2rem 0;
`;

const StyledHeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  > * {
    max-width: 300px;
    flex: 0 1 auto;
  }
`;

const StyledTable = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
`;

const StyledTableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${colours.white};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    display: none;
  }
`;

const StyledTableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const StyledTableCell = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: ${colours.white};
  opacity: 0.9;

  @media (max-width: 768px) {
    &::before {
      content: "${(props) => props.label}: ";
      font-weight: 600;
      opacity: 0.7;
    }
  }
`;

const StyledRoleBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "role",
})`
  background: ${(props) =>
    props.role === "admin"
      ? colours.pink
      : props.role === "member"
      ? colours.green
      : "rgba(255, 255, 255, 0.2)"};
  color: ${colours.white};
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const StyledSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colours.pink};
  }

  &:focus {
    outline: none;
    border-color: ${colours.pink};
  }

  option {
    background: ${colours.darkGrey};
    color: ${colours.white};
  }
`;

const StyledEmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${colours.white};
  opacity: 0.7;
  font-family: "Inter", sans-serif;
  font-size: 18px;
`;

const ManageUsers = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login");
      return;
    }

    fetchUsers();
  }, [user, isAdmin, router]);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });
      toast.success("User role updated successfully!");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return "N/A";
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <>
      <SEO title="Manage Users | Admin | Modern Investments" />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>User Management</StyledPageTitle>

          <StyledHeaderActions>
            <CallToActionButton
              variant="secondary"
              onClick={() => router.push("/admin/dashboard")}
            >
              Back to Dashboard
            </CallToActionButton>
          </StyledHeaderActions>

          {loading ? (
            <StyledEmptyState>Loading users...</StyledEmptyState>
          ) : users.length === 0 ? (
            <StyledEmptyState>
              No users found. Users will appear here once they register.
            </StyledEmptyState>
          ) : (
            <StyledTable>
              <StyledTableHeader>
                <div>Name</div>
                <div>Email</div>
                <div>Current Role</div>
                <div>Joined</div>
                <div>Actions</div>
              </StyledTableHeader>
              {users.map((userData) => (
                <StyledTableRow key={userData.id}>
                  <StyledTableCell label="Name">
                    {userData.name || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell label="Email">
                    {userData.email || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell label="Current Role">
                    <StyledRoleBadge role={userData.role || "user"}>
                      {userData.role || "user"}
                    </StyledRoleBadge>
                  </StyledTableCell>
                  <StyledTableCell label="Joined">
                    {formatDate(userData.createdAt)}
                  </StyledTableCell>
                  <StyledTableCell label="Actions">
                    <StyledSelect
                      value={userData.role || "user"}
                      onChange={(e) => handleRoleChange(userData.id, e.target.value)}
                      disabled={updating === userData.id}
                    >
                      <option value="user">User</option>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </StyledSelect>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </StyledTable>
          )}
        </StyledContentContainer>
      </StyledPageContainer>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default ManageUsers;
