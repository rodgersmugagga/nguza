import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <section
      id="about"
      style={{
        padding: "80px 20px",
        backgroundColor: "#f4f6f8",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Helmet>
        <title>About Nguza — Agriculture Marketplace</title>
        <meta
          name="description"
          content="Nguza is an agricultural marketplace connecting farmers, buyers and service providers — crops, livestock, inputs, equipment and services — across Uganda."
        />
        <meta
          name="keywords"
          content="Nguza, agriculture marketplace, crops, livestock, farm inputs, farming equipment, agricultural services, Uganda"
        />
        <meta name="author" content="Nguza" />
        <link rel="canonical" href="https://harvemart.onrender.com/about" />

        {/* Open Graph */}
        <meta property="og:title" content="About Nguza — Agriculture Marketplace" />
        <meta property="og:description" content="Nguza connects farmers and buyers with crops, livestock, farm inputs, equipment and services across Uganda." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://harvemart.onrender.com/about" />
        <meta property="og:site_name" content="Nguza" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="About Nguza" />
        <meta name="twitter:description" content="Nguza — an agricultural marketplace for crops, livestock, inputs, equipment and services." />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />

        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Nguza",
            "url": "https://harvemart.onrender.com",
            "logo": "https://harvemart.onrender.com/logo.svg",
            "description": "A marketplace for agricultural goods and services in Uganda.",
            "sameAs": [
              "https://twitter.com/harvemart",
              "https://facebook.com/harvemart"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "UG",
              "addressRegion": "Uganda"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "email": "support@harvemart.onrender.com"
            }
          })}
        </script>
      </Helmet>

      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        {/* Hero / Brand Image */}
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "center" }}>
          <img
            src="/logo.svg"
            alt="Nguza logo"
            style={{ width: "140px", height: "140px", objectFit: "contain" }}
          />
        </div>

        <h1 style={{ fontSize: "3rem", color: "#1a1a1a", marginBottom: "20px" }}>
          About Nguza
        </h1>

        <p style={{ fontSize: "1.2rem", color: "#555", lineHeight: "1.8", marginBottom: "40px" }}>
          Nguza is Uganda's local agricultural marketplace, built to connect farmers, buyers, and service providers across the country.
          We bring together listings for crops, livestock, farm inputs, equipment and agricultural services — making it easy to buy, sell and discover resources for productive farming.
        </p>

        <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "15px" }}>
          Our Mission
        </h2>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "30px" }}>
          To empower smallholder farmers and agribusinesses with a trusted, localized marketplace that increases market access, transparency and convenience for all agricultural actors.
        </p>

        <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "15px" }}>
          What We Offer
        </h2>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "30px" }}>
          Nguza supports listings across five main categories: <strong>Crops</strong> (seeds, grains, produce), <strong>Livestock</strong> (cattle, poultry, small stock), <strong>Inputs</strong> (fertilisers, agrochemicals, seeds), <strong>Equipment</strong> (tractors, tools) and <strong>Services</strong> (extension, transport, mechanization).
        </p>

        <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "15px" }}>
          Why Choose Nguza?
        </h2>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "30px" }}>
          We focus exclusively on agriculture, so our search, filters and field types are tailored to farming needs. Listings are localized, moderated and built to help you transact with confidence.
        </p>

        <p className="text-sm sm:text-base text-brand-600 mb-2">
          Browse listings: {" "}
          <Link to="/" className="text-brand-600 no-underline font-bold border-b-2 border-brand-600">
            Visit Nguza
          </Link>
        </p>

        <p style={{ fontSize: "0.95rem", color: "#888" }}>
          Contact support: <a href="mailto:support@harvemart.onrender.com" style={{ color: "#888" }}>support@harvemart.onrender.com</a>
        </p>
      </div>
    </section>
  );
};

export default About;
