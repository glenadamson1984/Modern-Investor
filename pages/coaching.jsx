import React from "react";
import useWindowSize from "../src/hooks/useWindowSize";
import SEO from "../src/components/SEO";
import styled from "styled-components";
import { colours } from "../src/utils/style.utils";
import CallToActionButton from "../src/components/buttons/action/CallToActionButton";
import { useRouter } from "next/router";
import { useAuth } from "../src/contexts/AuthContext";

const StyledPageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  min-height: 100vh;
  background: ${colours.darkGrey};
  padding: ${(props) => (props.isDesktop ? "6rem 4rem" : "4rem 2rem")};
`;

const StyledContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledPageTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => (props.isDesktop ? "56px" : "36px")};
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 1rem 0;
  text-align: center;
`;

const StyledPageDescription = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 1.8;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0 0 4rem 0;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledCoursesGrid = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isDesktop ? "repeat(3, 1fr)" : "1fr"};
  gap: 2rem;
  margin-bottom: 4rem;
`;

const StyledCourseCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${colours.pink};
    box-shadow: 0 8px 24px rgba(255, 64, 139, 0.2);
  }
`;

const StyledCourseIcon = styled.div`
  font-size: 48px;
  margin-bottom: 1rem;
`;

const StyledCourseTitle = styled.h3`
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: ${colours.white};
  margin: 0 0 1rem 0;
`;

const StyledCourseDescription = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0 0 1.5rem 0;
`;

const StyledSection = styled.section`
  margin-bottom: 4rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2.5rem;
`;

const StyledSectionTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-size: 32px;
  font-weight: 600;
  color: ${colours.pink};
  margin: 0 0 1.5rem 0;
`;

const StyledParagraph = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 1.8;
  color: ${colours.white};
  opacity: 0.9;
  margin: 0 0 1.5rem 0;
`;

const Coaching = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isMember } = useAuth();

  const courses = [
    {
      icon: "📊",
      title: "Investment Fundamentals",
      description:
        "Learn the basics of investing, portfolio construction, and risk management.",
    },
    {
      icon: "📈",
      title: "Technical Analysis",
      description:
        "Master chart reading, indicators, and technical trading strategies.",
    },
    {
      icon: "💼",
      title: "Portfolio Management",
      description:
        "Advanced strategies for building and managing diversified portfolios.",
    },
    {
      icon: "🎯",
      title: "Risk Management",
      description:
        "Learn how to protect capital and manage downside risk effectively.",
    },
    {
      icon: "🔍",
      title: "Market Analysis",
      description:
        "Develop skills in fundamental analysis and market research.",
    },
    {
      icon: "💰",
      title: "Trading Psychology",
      description:
        "Master the psychological aspects of trading and investment decisions.",
    },
  ];

  return (
    <>
      <SEO
        title="Investment Coaching | Modern Investments"
        description="Access expert investment coaching, video courses, and 1-on-1 sessions to improve your investment skills."
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle isDesktop={isDesktop}>
            Investment Coaching
          </StyledPageTitle>
          <StyledPageDescription>
            Elevate your investment skills with expert coaching, comprehensive
            courses, and personalized guidance. Whether you're a beginner or
            experienced investor, our coaching programs are designed to help you
            succeed.
          </StyledPageDescription>

          <StyledSection>
            <StyledSectionTitle>Online Courses</StyledSectionTitle>
            <StyledParagraph>
              Access comprehensive video courses covering all aspects of
              investing. Learn at your own pace with structured lessons,
              practical exercises, and downloadable resources.
            </StyledParagraph>
            <StyledCoursesGrid isDesktop={isDesktop}>
              {courses.map((course, index) => (
                <StyledCourseCard key={index}>
                  <StyledCourseIcon>{course.icon}</StyledCourseIcon>
                  <StyledCourseTitle>{course.title}</StyledCourseTitle>
                  <StyledCourseDescription>
                    {course.description}
                  </StyledCourseDescription>
                </StyledCourseCard>
              ))}
            </StyledCoursesGrid>
            {user && isMember() ? (
              <div style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
                <CallToActionButton
                  variant="darkGreen"
                  onClick={() => router.push("/coaching/portal")}
                >
                  Access Course Portal
                </CallToActionButton>
              </div>
            ) : (
              <div style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
                <CallToActionButton
                  variant="darkGreen"
                  onClick={() => router.push("/login")}
                >
                  Join Network to Access Courses
                </CallToActionButton>
              </div>
            )}
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>1-on-1 Coaching Sessions</StyledSectionTitle>
            <StyledParagraph>
              Get personalized investment guidance through one-on-one coaching
              sessions. Discuss your portfolio, investment goals, and get
              tailored advice to improve your investment strategy.
            </StyledParagraph>
            <StyledParagraph>
              Sessions can cover:
            </StyledParagraph>
            <ul
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                lineHeight: "1.8",
                color: colours.white,
                opacity: 0.9,
                paddingLeft: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              <li>Portfolio review and optimization</li>
              <li>Investment strategy development</li>
              <li>Risk assessment and management</li>
              <li>Market analysis and opportunities</li>
              <li>Goal setting and planning</li>
            </ul>
            {user && isMember() ? (
              <div style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
                <CallToActionButton
                  variant="darkGreen"
                  onClick={() => router.push("/coaching/portal")}
                >
                  Book a Session
                </CallToActionButton>
              </div>
            ) : (
              <div style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
                <CallToActionButton
                  variant="darkGreen"
                  onClick={() => router.push("/login")}
                >
                  Join Network to Book Sessions
                </CallToActionButton>
              </div>
            )}
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>Educational Resources</StyledSectionTitle>
            <StyledParagraph>
              Access a library of educational articles, market insights, and
              investment guides. Stay informed with regular updates on market
              trends, investment strategies, and portfolio management tips.
            </StyledParagraph>
            <div style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
              <CallToActionButton
                variant="darkGreen"
                onClick={() => router.push("/articles")}
              >
                Browse Articles
              </CallToActionButton>
            </div>
          </StyledSection>
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default Coaching;
