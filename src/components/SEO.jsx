import Head from "next/head";

const SEO = ({
  title = "Modern Investments - Investment Network Northern Ireland",
  description = "Join the investment network in Northern Ireland. Access live performance tracking, expert coaching, and investment insights to grow your portfolio.",
  keywords = "investment network northern ireland, fund manager northern ireland, investment coaching, portfolio performance, trading insights",
  ogImage = "/images/logo.png",
  canonicalUrl,
  structuredData = null,
}) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://moderninvestments.co.uk";
  const fullCanonicalUrl = canonicalUrl
    ? `${siteUrl}${canonicalUrl}`
    : siteUrl;
  const fullOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${siteUrl}${ogImage}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content="Modern Investments" />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Modern Investments" />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
};

export default SEO;
