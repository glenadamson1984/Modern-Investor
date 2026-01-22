import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../src/contexts/AuthContext";
import useWindowSize from "../../src/hooks/useWindowSize";
import SEO from "../../src/components/SEO";
import styled from "styled-components";
import { colours } from "../../src/utils/style.utils";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/config/firebase";
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

const StyledTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
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

const StyledCourseCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
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
  margin: 0 0 1rem 0;
`;

const CoachingPortal = () => {
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();
  const { user, isMember } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!user || !isMember()) {
      router.push("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const coursesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [user, isMember, router]);

  if (!user || !isMember()) {
    return null;
  }

  return (
    <>
      <SEO
        title="Coaching Portal | Modern Investments"
        description="Access video courses, booking calendar, and coaching resources."
      />
      <StyledPageContainer isDesktop={isDesktop}>
        <StyledContentContainer>
          <StyledPageTitle>Coaching Portal</StyledPageTitle>

          <StyledTabs>
            <StyledTab
              active={activeTab === "courses"}
              onClick={() => setActiveTab("courses")}
            >
              Courses
            </StyledTab>
            <StyledTab
              active={activeTab === "bookings"}
              onClick={() => setActiveTab("bookings")}
            >
              Book a Session
            </StyledTab>
            <StyledTab
              active={activeTab === "resources"}
              onClick={() => setActiveTab("resources")}
            >
              Resources
            </StyledTab>
          </StyledTabs>

          {activeTab === "courses" && (
            <div>
              {courses.length === 0 ? (
                <div style={{ color: colours.white, textAlign: "center" }}>
                  No courses available yet. Check back soon!
                </div>
              ) : (
                courses.map((course) => (
                  <StyledCourseCard key={course.id}>
                    <StyledCourseTitle>{course.title}</StyledCourseTitle>
                    <StyledCourseDescription>
                      {course.description}
                    </StyledCourseDescription>
                    {course.videoUrl && (
                      <CallToActionButton
                        variant="darkGreen"
                        onClick={() => window.open(course.videoUrl, "_blank")}
                      >
                        Watch Course
                      </CallToActionButton>
                    )}
                  </StyledCourseCard>
                ))
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div style={{ color: colours.white, textAlign: "center" }}>
              <p>Booking calendar coming soon. Contact us to schedule a session.</p>
              <CallToActionButton
                variant="darkGreen"
                onClick={() => router.push("/coaching")}
              >
                Learn More
              </CallToActionButton>
            </div>
          )}

          {activeTab === "resources" && (
            <div style={{ color: colours.white, textAlign: "center" }}>
              <p>Downloadable resources coming soon.</p>
            </div>
          )}
        </StyledContentContainer>
      </StyledPageContainer>
    </>
  );
};

export default CoachingPortal;
