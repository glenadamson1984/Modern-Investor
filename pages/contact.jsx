import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faEnvelope,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import useWindowSize from "../src/hooks/useWindowSize";
import SEO from "../src/components/SEO";
import {
  StyledContactHero,
  StyledContactHeroContent,
  StyledContactHeroTitle,
  StyledContactHeroSubtitle,
  StyledContactSection,
  StyledContactContainer,
  StyledContactForm,
  StyledFormTitle,
  StyledFieldSet,
  StyledIcon,
  StyledInput,
  StyledTextArea,
  StyledErrorMessage,
  StyledContactDetails,
  StyledContactDetailsTitle,
  StyledContactDetailsContainer,
  StyledContactDetailItem,
  StyledContactDetailIcon,
  StyledContactDetailContent,
  StyledContactDetailType,
  StyledContactDetailValue,
} from "../page-styles/contact.styles";
import CallToActionButton from "../src/components/buttons/action/CallToActionButton";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();
  const router = useRouter();

  const nameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    let data = {
      name: nameRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      message: messageRef.current.value,
    };

    if (
      data.name === "" ||
      data.email === "" ||
      data.message === ""
    ) {
      setIsError(true);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        setSubmitted(true);
        toast.success("Email sent successfully.", {
          theme: "colored",
        });

        nameRef.current.value = "";
        phoneRef.current.value = "";
        emailRef.current.value = "";
        messageRef.current.value = "";
      }
    } catch (e) {
      toast.error("Problem sending email. Please try again later.", {
        theme: "colored",
      });
    }
  };

  if (submitted) {
    setTimeout(() => {
      router.push("/");
    }, "2000");
  }

  return (
    <>
      <SEO
        title="Contact Us - Modern Investor | Investment Network Northern Ireland"
        description="Get in touch with Modern Investor for investment insights, coaching, and network opportunities in Northern Ireland."
        keywords="contact Modern Investor, investment network Northern Ireland, investment coaching contact, investment advice contact"
        canonicalUrl="/contact"
      />
      <ToastContainer />
      {/* Contact Hero Section */}
      <StyledContactHero isDesktop={isDesktop}>
        <StyledContactHeroContent>
          <StyledContactHeroTitle isDesktop={isDesktop}>
            Get In <span>Touch</span>
          </StyledContactHeroTitle>
          <StyledContactHeroSubtitle isDesktop={isDesktop}>
            Have questions about our investment network, coaching services, or performance insights? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </StyledContactHeroSubtitle>
        </StyledContactHeroContent>
      </StyledContactHero>

      {/* Contact Form and Details Section */}
      <StyledContactSection isDesktop={isDesktop}>
        <StyledContactContainer isDesktop={isDesktop}>
          {/* Contact Form */}
          <StyledContactForm isDesktop={isDesktop}>
            <StyledFormTitle isDesktop={isDesktop}>
              Send A <span>Message</span>
            </StyledFormTitle>
            {isError && (
              <StyledErrorMessage>
                Please complete all required sections of this form
              </StyledErrorMessage>
            )}

            <form onSubmit={handleSubmit}>
              <StyledFieldSet>
                <StyledIcon>
                  <FontAwesomeIcon icon={faUser} />
                </StyledIcon>
                <StyledInput
                  ref={nameRef}
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                />
              </StyledFieldSet>
              <StyledFieldSet>
                <StyledIcon>
                  <FontAwesomeIcon icon={faPhone} />
                </StyledIcon>
                <StyledInput
                  ref={phoneRef}
                  type="text"
                  name="phone"
                  placeholder="Phone Number (Optional)"
                />
              </StyledFieldSet>
              <StyledFieldSet>
                <StyledIcon>
                  <FontAwesomeIcon icon={faEnvelope} />
                </StyledIcon>
                <StyledInput
                  ref={emailRef}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                />
              </StyledFieldSet>
              <StyledFieldSet>
                <StyledIcon>
                  <FontAwesomeIcon icon={faPen} />
                </StyledIcon>
                <StyledTextArea
                  ref={messageRef}
                  name="message"
                  rows="4"
                  placeholder="Tell us about your investment interests or questions"
                  required
                />
              </StyledFieldSet>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                <div style={{ maxWidth: "300px", width: "100%" }}>
                  <button
                    type="submit"
                    style={{
                      background: "#2D8659",
                      border: "none",
                      borderRadius: "30px",
                      padding: "1rem",
                      cursor: "pointer",
                      color: "#FFFFFF",
                      transition: "all 0.3s ease",
                      width: "100%",
                      maxWidth: "100%",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#FF4081";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#2D8659";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </StyledContactForm>

          {/* Contact Details */}
          <StyledContactDetails>
            <StyledContactDetailsTitle isDesktop={isDesktop}>
              Or You <span>Can...</span>
            </StyledContactDetailsTitle>
            <StyledContactDetailsContainer>
              <StyledContactDetailItem>
                <StyledContactDetailIcon>
                  <FontAwesomeIcon icon={faEnvelope} />
                </StyledContactDetailIcon>
                <StyledContactDetailContent>
                  <StyledContactDetailType>Email us</StyledContactDetailType>
                  <StyledContactDetailValue>
                    <a href="mailto:info@modern-investor.co.uk">
                      info@modern-investor.co.uk
                    </a>
                  </StyledContactDetailValue>
                </StyledContactDetailContent>
              </StyledContactDetailItem>
            </StyledContactDetailsContainer>
          </StyledContactDetails>
        </StyledContactContainer>
      </StyledContactSection>
    </>
  );
};

export default Contact;
