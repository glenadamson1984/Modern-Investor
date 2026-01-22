import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../src/contexts/AuthContext";
import styled from "styled-components";
import { colours } from "../src/utils/style.utils";
import CallToActionButton from "../src/components/buttons/action/CallToActionButton";
import SEO from "../src/components/SEO";
import useWindowSize from "../src/hooks/useWindowSize";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledLoginContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDesktop",
})`
  min-height: 100vh;
  background: ${colours.darkGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => (props.isDesktop ? "4rem" : "2rem")};
`;

const StyledLoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const StyledTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: ${colours.white};
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

const StyledSubtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: ${colours.white};
  opacity: 0.8;
  margin: 0 0 2rem 0;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: ${colours.white};
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

const StyledLabel = styled.label`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${colours.white};
  opacity: 0.9;
`;

const StyledToggle = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: ${colours.white};
  opacity: 0.8;

  span {
    color: ${colours.pink};
    cursor: pointer;
    font-weight: 600;

    &:hover {
      opacity: 1;
    }
  }
`;

const StyledError = styled.div`
  background: rgba(229, 31, 40, 0.2);
  border: 1px solid ${colours.red};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: ${colours.white};
  text-align: center;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const router = useRouter();
  const { checkIsDesktop } = useWindowSize();
  const isDesktop = checkIsDesktop();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      if (isRegister) {
        const result = await register(email, password, { name });
        console.log("Registration successful:", result);
        toast.success("Account created successfully! Redirecting...");
        // Wait a moment for Firestore to update
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        await login(email, password);
        toast.success("Logged in successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      
      // Handle specific Firebase errors
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists. Try logging in instead, or if you created the user in Firebase Console, you need to create the Firestore document manually.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Login | Modern Investments Network"
        description="Login to access the investment network dashboard, live trades, and coaching resources."
      />
      <StyledLoginContainer isDesktop={isDesktop}>
        <StyledLoginCard>
          <StyledTitle>
            {isRegister ? "Join the Network" : "Welcome Back"}
          </StyledTitle>
          <StyledSubtitle>
            {isRegister
              ? "Create an account to access investment insights and coaching"
              : "Login to access your dashboard and investment resources"}
          </StyledSubtitle>
          <StyledForm onSubmit={handleSubmit}>
            {error && <StyledError>{error}</StyledError>}
            {isRegister && (
              <>
                <div>
                  <StyledLabel>Full Name</StyledLabel>
                  <StyledInput
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div>
              <StyledLabel>Email</StyledLabel>
              <StyledInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <StyledLabel>Password</StyledLabel>
              <StyledInput
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: colours.darkGreen,
                border: "none",
                borderRadius: "30px",
                padding: "1rem 2rem",
                color: colours.white,
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              {loading
                ? "Loading..."
                : isRegister
                ? "Create Account"
                : "Login"}
            </button>
          </StyledForm>
          <StyledToggle>
            {isRegister ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsRegister(false)}>Login</span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span onClick={() => setIsRegister(true)}>Register</span>
              </>
            )}
          </StyledToggle>
          <div style={{ textAlign: "center", marginTop: "2rem", maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}>
            <CallToActionButton
              variant="secondary"
              onClick={() => router.push("/")}
            >
              Return to Home
            </CallToActionButton>
          </div>
        </StyledLoginCard>
      </StyledLoginContainer>
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

export default Login;
