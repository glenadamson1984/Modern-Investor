import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../src/contexts/AuthContext";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import CallToActionButton from "../../src/components/buttons/action/CallToActionButton";
import { collection, addDoc, Timestamp } from "firebase/firestore";
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
  max-width: 800px;
  margin: 0 auto;
`;

const StyledPageTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 2rem 0;
`;

const StyledForm = styled.form`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledLabel = styled.label`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${colours.white};
  opacity: 0.9;
`;

const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 16px;
  transition: all 0.2s ease;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colours.pink};
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const StyledTextarea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colours.pink};
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const StyledContentTextarea = styled(StyledTextarea)`
  min-height: 300px;
  font-family: "Inter", sans-serif;
  line-height: 1.8;
`;

const StyledCheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const StyledSubmitButton = styled.button`
  background: ${colours.green};
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  color: ${colours.white};
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    background: #0d8a4f;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddArticle = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    published: true,
  });

  React.useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login");
    }
  }, [user, isAdmin, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const articleData = {
        title: formData.title,
        excerpt: formData.excerpt || formData.content.substring(0, 200) + "...",
        content: formData.content,
        date: Timestamp.fromDate(new Date(formData.date)),
        published: formData.published,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "articles"), articleData);

      toast.success("Article added successfully!");
      router.push("/admin/content");
    } catch (error) {
      console.error("Error adding article:", error);
      toast.error("Failed to add article. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <>
      <SEO title="Add Article | Admin | Modern Investments" />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Add New Article</StyledPageTitle>

          <StyledForm onSubmit={handleSubmit}>
            <StyledFormGroup>
              <StyledLabel htmlFor="title">Title *</StyledLabel>
              <StyledInput
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter article title"
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="excerpt">Excerpt</StyledLabel>
              <StyledTextarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the article (optional - will auto-generate from content if left empty)"
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="date">Date *</StyledLabel>
              <StyledInput
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="content">Content *</StyledLabel>
              <StyledContentTextarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article content here. You can use HTML for formatting."
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledCheckboxGroup>
                <StyledCheckbox
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                />
                <StyledLabel htmlFor="published" style={{ margin: 0, cursor: "pointer" }}>
                  Publish immediately
                </StyledLabel>
              </StyledCheckboxGroup>
            </StyledFormGroup>

            <StyledButtonGroup>
              <StyledSubmitButton type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Article"}
              </StyledSubmitButton>
              <div style={{ maxWidth: "200px", width: "100%" }}>
                <CallToActionButton
                  variant="secondary"
                  onClick={() => router.push("/admin/content")}
                  type="button"
                >
                  Cancel
                </CallToActionButton>
              </div>
            </StyledButtonGroup>
          </StyledForm>
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

export default AddArticle;
