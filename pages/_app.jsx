import "../styles/globals.css";
import Layout from "../src/components/layout/Layout";
import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { AuthProvider } from "../src/contexts/AuthContext";
config.autoAddCss = false;

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  // Don't wrap login page with Layout
  if (isLoginPage) {
    return <Component {...pageProps} />;
  }

  // All other pages (including admin) get Layout with navigation
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AuthProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
