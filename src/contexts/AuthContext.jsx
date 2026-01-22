import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = { id: userDoc.id, ...userDoc.data() };
            console.log("User data loaded:", data);
            setUserData(data);
          } else {
            // User exists in Auth but not in Firestore - create basic user data
            console.warn("User document not found in Firestore for:", user.uid);
            setUserData({
              id: user.uid,
              email: user.email,
              role: "member",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Set basic user data if Firestore fails
          setUserData({
            id: user.uid,
            email: user.email,
            role: "member",
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, userData = {}) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Create user document in Firestore
    try {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role: "member",
        createdAt: new Date().toISOString(),
        ...userData,
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      // Still return the credential even if Firestore write fails
      // The user is authenticated, just missing Firestore data
    }
    return userCredential;
  };

  const logout = async () => {
    return signOut(auth);
  };

  const isAdmin = () => {
    return userData?.role === "admin";
  };

  const isMember = () => {
    return userData?.role === "member" || userData?.role === "admin";
  };

  const value = {
    user,
    userData,
    login,
    register,
    logout,
    loading,
    isAdmin,
    isMember,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
