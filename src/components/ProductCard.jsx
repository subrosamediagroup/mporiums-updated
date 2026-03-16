// ============================================================
// ProductCard.jsx
// Converted from renderListingCard() in script.js
// ============================================================


import { useState } from "react";


import { Link } from "react-router-dom";

function ProductCard({ product, onAddToCart }) {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------


  const [wishlisted, setWishlisted] = useState(false);

  // ----------------------------------------------------------
  // FUNCTIONS
  // ----------------------------------------------------------


  function handleWishlistClick(e) {
    e.preventDefault();      // stop any default browser behaviour
    e.stopPropagation();     // stop the click reaching the parent <Link>
    setWishlisted(!wishlisted); // toggle the heart on/off
  }

  // ----------------------------------------------------------
  // JSX — 
  // ----------------------------------------------------------

  return (
  
    <Link to={`/product/${product.id}`} className="card listing-card">

      {/* ── IMAGE SECTION ── */}
      <div className="listing-image">

        {/*  */}
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
        />

        {/* Condition badge  */}
        <span className="listing-badge">{product.condition}</span>

        {/* Wishlist heart button
            */}
        <button
          className="listing-heart"
          onClick={handleWishlistClick}
          aria-label="Save to wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* ── BODY SECTION ── */}
      <div className="listing-body">

        {/* Category label — e.g. "Guitars & Basses"
             */}
        <p className="listing-category">{product.category}</p>

        {/* Product title
            \ */}
        <h3 className="listing-title">{product.title}</h3>

        {/* Price — toLocaleString() adds commas e.g. $1,450
             */}
        <p className="listing-price">${product.price.toLocaleString()}</p>

        {/* ── META ROW: verified badge, seller name, rating ── */}
        <div className="listing-meta">

          {/*  */}
          <span className="listing-verified">
            {product.verified && (
              <img
                src="/icons/shield.svg"
                alt="Verified"
                style={{ width: "30px", height: "30px", display: "inline" }}
              />
            )}
          </span>

          {/* Seller name */}
          <span className="listing-seller">{product.seller}</span>

          {/* Star rating — only show if rating is greater than 0
               */}
          <span className="listing-rating">
            {product.rating > 0 && (
              <>
                <img
                  src="/icons/star.svg"
                  alt="Rating"
                  style={{
                    width: "30px",
                    height: "30px",
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: "0.25rem"
                  }}
                />
                {product.rating}
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
