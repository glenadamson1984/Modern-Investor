import Head from "next/head";
import styles from "../styles/Maintenance.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Modern Investor | Under maintenance</title>
        <meta name="description" content="Modern Investor is currently under maintenance. Please check back soon." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.maintenance}>
        <div className={styles.content}>
          <p className={styles.brand}>Modern Investor<span>.</span></p>
          <div className={styles.accent} aria-hidden="true" />
          <h1 className={styles.heading}>We’ll be back soon.</h1>
          <p className={styles.message}>The website is currently under maintenance.<br />Please check back soon.</p>
        </div>
      </main>
    </>
  );
}
