import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";

const StyledPageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  min-height: 100vh;
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "6rem 4rem" : "4rem 2rem")};
`;

const StyledContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const StyledArticleTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "48px" : "36px")};
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 1rem 0;
`;

const StyledArticleMeta = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: ${colours.white};
  opacity: 0.6;
  margin-bottom: 3rem;
`;

const StyledArticleContent = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 1.8;
  color: ${colours.white};
  opacity: 0.9;
  white-space: pre-wrap;
  word-wrap: break-word;

  p {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-family: "Poppins", sans-serif;
    font-size: 32px;
    font-weight: 600;
    color: ${colours.pink};
    margin: 2rem 0 1rem 0;
  }

  h3 {
    font-family: "Poppins", sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: ${colours.white};
    margin: 1.5rem 0 1rem 0;
  }
`;

const ArticleDetail = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          router.push("/articles");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        router.push("/articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, router]);

  if (loading) {
    return (
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <div style={{ color: colours.white, textAlign: "center" }}>
            Loading article...
          </div>
        </StyledContentContainer>
      </StyledPageContainer>
    );
  }

  if (!article) {
    return null;
  }

  const content = article.content || article.excerpt || "";

  return (
    <>
      <SEO
        title={`${article.title} | Modern Investments`}
        description={article.excerpt || article.content?.substring(0, 160)}
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledArticleTitle isDesktop={isDesktop}>
            {article.title}
          </StyledArticleTitle>
          <StyledArticleMeta>
            {article.date
              ? new Date(
                  article.date.seconds
                    ? article.date.seconds * 1000
                    : article.date
                ).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </StyledArticleMeta>
          <StyledArticleContent
            dangerouslySetInnerHTML={
              /<[^>]+>/.test(content)
                ? { __html: content }
                : { __html: content.replace(/\n/g, '<br />') }
            }
          />
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default ArticleDetail;
