// ============================================================
// Home.jsx
// ============================================================

import { useState } from "react";


import { Link, useNavigate } from "react-router-dom";

import ProductCard from "../components/ProductCard";

// Your products array 
import products from "../data/products";

// ============================================================
// Category data
// ============================================================
const categories = [
  { name: "Guitars & Basses",   icon: "/icons/guitar.svg",     count: "8,200+" },
  { name: "Synthesizers",       icon: "/icons/piano.svg",      count: "4,100+" },
  { name: "Headphones",         icon: "/icons/headphones.svg", count: "6,500+" },
  { name: "Speakers & Monitors",icon: "/icons/speaker.svg",    count: "3,800+" },
  { name: "Microphones",        icon: "/icons/mic.svg",        count: "2,900+" },
  { name: "DJ Equipment",       icon: "/icons/music.svg",      count: "3,400+" },
];
 
const steps = [
  { number: "1", icon: "/icons/camera.svg", title: "List Your Gear",    desc: "Snap photos, set your price, and publish in minutes." },
  { number: "2", icon: "/icons/tag.svg",    title: "Buyers Discover",   desc: "Your listing reaches thousands of gear enthusiasts instantly." },
  { number: "3", icon: "/icons/shield.svg", title: "Secure Payment",    desc: "Buyer pays through our protected checkout system." },
  { number: "4", icon: "/icons/truck.svg",  title: "Ship & Done",       desc: "Ship the item, get paid. We handle the rest." },
];

// ============================================================
// Home Component
// ============================================================
function Home() {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  // Hero search input value
  const [heroSearch, setHeroSearch] = useState("");

  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------

  const navigate = useNavigate();

  // ----------------------------------------------------------
  // FUNCTIONS
  // ----------------------------------------------------------
  // Hero search submit
  function handleHeroSearch(e) {
    e.preventDefault();
    const trimmed = heroSearch.trim();
    if (trimmed) {
  
      navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
      setHeroSearch(""); // clear the input
    }
  }

  // Category card click
  function handleCategoryClick(categoryName) {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  }

  // ----------------------------------------------------------
  // JSX
  // ----------------------------------------------------------

  return (

    <main style={{ padding: "2rem 0" }}>

      {/* ====================================================
          HERO SECTION
          ====================================================
           */}
      <section className="hero">
        <div className="hero-bg">
          {/* Image path: public/images/hero-bg.jpg → src="/images/hero-bg.jpg"
            */}
          <img
            src="/images/hero-bg.jpg"
            alt="Audio equipment and musical instruments"
            loading="eager"
          />
          <div className="hero-overlay-lr"></div>
          <div className="hero-overlay-bt"></div>
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">THE #1 MARKETPLACE FOR USED AUDIO GEAR</span>

            {/*  */}
            <h1 className="hero-title">
              Buy & Sell<br />
              <span className="text-primary">Premium Gear</span>
            </h1>

            <p className="hero-desc">
              The trusted marketplace for audio hardware, synths, guitars, and studio equipment.
              Thousands of listings from verified sellers.
            </p>

            <div className="hero-actions">

              {/* Hero search form
                  */}
              <form className="hero-search" onSubmit={handleHeroSearch}>
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <input
                  type="text"
                  placeholder="What gear are you looking for?"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                />
              </form>

              {/* */}
              <Link to="/shop" className="btn btn-primary btn-lg">
                Browse Gear →
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          CATEGORIES SECTION
          ====================================================
         */}
      <section className="section">
        <div className="container text-center">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>

          <div className="category-grid">
            {categories.map((cat) => (
             
              <a
                key={cat.name}
                href="#"
                className="card category-card"
                onClick={(e) => {
                  e.preventDefault(); // stop the # from jumping the page
                  handleCategoryClick(cat.name);
                }}
              >
                <div className="category-icon">
                  {/* */}
                  <img src={cat.icon} alt={cat.name} />
                </div>
                <div>
                  <p className="category-name">{cat.name}</p>
                  <p className="category-count">{cat.count}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          TRENDING GEAR / FEATURED LISTINGS
          ====================================================
           */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Trending Gear</h2>
              <p className="section-subtitle">Hot listings picked for you</p>
            </div>
            {/*  */}
            <Link to="/shop" className="link-primary">View all →</Link>
          </div>

          {/* The featured grid
               */}
          <div
            className="listing-grid"
            style={{ maxWidth: "100%", margin: "auto" }}
          >
            {/* Loop through all products and render a ProductCard for each. */}
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          HOW IT WORKS SECTION
          ====================================================
          */}
      <section className="section">
        <div className="container text-center">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Sell your gear in 4 simple steps</p>

          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-icon">
                  <span className="step-badge">{step.number}</span>
                  <img src={step.icon} alt={step.title} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;
