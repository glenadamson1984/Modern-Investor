import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../src/contexts/AuthContext";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import CallToActionButton from "../../src/components/buttons/action/CallToActionButton";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
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

const StyledTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const StyledTab = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.active ? colours.pink : "transparent")};
  padding: 1rem 2rem;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.active ? colours.white : colours.grey)};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${colours.white};
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
  grid-template-columns: 2fr 1fr 1fr 0.5fr;
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
  grid-template-columns: 2fr 1fr 1fr 0.5fr;
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

const StyledDeleteButton = styled.button`
  background: ${colours.red};
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 100px;
  width: 100%;

  &:hover {
    background: #c41a1f;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const ManageContent = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login");
      return;
    }

    fetchContent();
  }, [user, isAdmin, router, activeTab]);

  const fetchContent = async () => {
    try {
      if (activeTab === "articles") {
        const q = query(collection(db, "articles"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const articlesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
      } else {
        const snapshot = await getDocs(collection(db, "courses"));
        const coursesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesData);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    setDeleting(id);
    try {
      const collectionName = type === "article" ? "articles" : "courses";
      await deleteDoc(doc(db, collectionName, id));
      toast.success(`${type === "article" ? "Article" : "Course"} deleted successfully!`);
      fetchContent();
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("en-GB", {
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
      <SEO title="Manage Content | Admin | Modern Investments" />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Content Management</StyledPageTitle>

          <StyledHeaderActions>
            <CallToActionButton
              variant="darkGreen"
              onClick={() => router.push("/admin/add-article")}
            >
              Add New Article
            </CallToActionButton>
            <CallToActionButton
              variant="secondary"
              onClick={() => router.push("/admin/dashboard")}
            >
              Back to Dashboard
            </CallToActionButton>
          </StyledHeaderActions>

          <StyledTabs>
            <StyledTab
              active={activeTab === "articles"}
              onClick={() => {
                setActiveTab("articles");
                setLoading(true);
                fetchContent();
              }}
            >
              Articles
            </StyledTab>
            <StyledTab
              active={activeTab === "courses"}
              onClick={() => {
                setActiveTab("courses");
                setLoading(true);
                fetchContent();
              }}
            >
              Courses
            </StyledTab>
          </StyledTabs>

          {loading ? (
            <StyledEmptyState>Loading content...</StyledEmptyState>
          ) : activeTab === "articles" ? (
            articles.length === 0 ? (
              <StyledEmptyState>
                No articles yet. Add your first article to get started.
              </StyledEmptyState>
            ) : (
              <StyledTable>
                <StyledTableHeader>
                  <div>Title</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Actions</div>
                </StyledTableHeader>
                {articles.map((article) => (
                  <StyledTableRow key={article.id}>
                    <StyledTableCell label="Title">
                      {article.title || "Untitled"}
                    </StyledTableCell>
                    <StyledTableCell label="Date">
                      {formatDate(article.date)}
                    </StyledTableCell>
                    <StyledTableCell label="Status">
                      {article.published ? "Published" : "Draft"}
                    </StyledTableCell>
                    <StyledTableCell label="Actions">
                      <StyledDeleteButton
                        onClick={() => handleDelete(article.id, "article")}
                        disabled={deleting === article.id}
                      >
                        {deleting === article.id ? "Deleting..." : "Delete"}
                      </StyledDeleteButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </StyledTable>
            )
          ) : (
            courses.length === 0 ? (
              <StyledEmptyState>
                No courses yet. Add your first course to get started.
              </StyledEmptyState>
            ) : (
              <StyledTable>
                <StyledTableHeader>
                  <div>Title</div>
                  <div>Description</div>
                  <div>Status</div>
                  <div>Actions</div>
                </StyledTableHeader>
                {courses.map((course) => (
                  <StyledTableRow key={course.id}>
                    <StyledTableCell label="Title">
                      {course.title || "Untitled"}
                    </StyledTableCell>
                    <StyledTableCell label="Description">
                      {course.description?.substring(0, 50) + "..." || "No description"}
                    </StyledTableCell>
                    <StyledTableCell label="Status">
                      {course.published ? "Published" : "Draft"}
                    </StyledTableCell>
                    <StyledTableCell label="Actions">
                      <StyledDeleteButton
                        onClick={() => handleDelete(course.id, "course")}
                        disabled={deleting === course.id}
                      >
                        {deleting === course.id ? "Deleting..." : "Delete"}
                      </StyledDeleteButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </StyledTable>
            )
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

export default ManageContent;
