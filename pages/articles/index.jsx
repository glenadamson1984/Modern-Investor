import React, { useEffect, useState } from "react";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { useRouter } from "next/router";

const StyledPageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  min-height: 100vh;
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "4rem" : "2rem")};
`;

const StyledContentContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const StyledPageTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 1rem 0;
  text-align: center;
`;

const StyledPageDescription = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0 0 3rem 0;
  text-align: center;
`;

const StyledArticleCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${colours.pink};
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(255, 64, 139, 0.2);
  }
`;

const StyledArticleTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: ${colours.white};
  margin: 0 0 1rem 0;
`;

const StyledArticleMeta = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: ${colours.white};
  opacity: 0.6;
  margin-bottom: 1rem;
`;

const StyledArticleExcerpt = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: ${colours.white};
  opacity: 0.9;
  margin: 0;
`;

const Articles = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(
          collection(db, "articles"),
          orderBy("date", "desc"),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const articlesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <>
      <SEO
        title="Investment Articles | Modern Investments"
        description="Read educational articles, market insights, and investment strategies."
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Investment Articles</StyledPageTitle>
          <StyledPageDescription>
            Educational content, market insights, and investment strategies to
            help you grow your portfolio.
          </StyledPageDescription>

          {loading ? (
            <div style={{ color: colours.white, textAlign: "center" }}>
              Loading articles...
            </div>
          ) : articles.length === 0 ? (
            <div style={{ color: colours.white, textAlign: "center" }}>
              No articles available yet. Check back soon for new content!
            </div>
          ) : (
            articles.map((article) => (
              <StyledArticleCard
                key={article.id}
                onClick={() => router.push(`/articles/${article.id}`)}
              >
                <StyledArticleTitle>{article.title}</StyledArticleTitle>
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
                <StyledArticleExcerpt>
                  {article.excerpt || article.content?.substring(0, 200) + "..."}
                </StyledArticleExcerpt>
              </StyledArticleCard>
            ))
          )}
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default Articles;
