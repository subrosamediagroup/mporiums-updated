// ============================================================
// SellerProfile.jsx 
// ============================================================ 

import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

function SellerProfile() {

  // ----------------------------------------------------------
  // SCROLL TO TOP
  // ----------------------------------------------------------

  function handleScrollToTop() {
    window.scrollTo(0, 0);
  }

  // ----------------------------------------------------------
  // GET SELLER FROM URL
  // ----------------------------------------------------------
  
  const { sellerName } = useParams();

  // ----------------------------------------------------------
  // FIND SELLER DATA + LISTINGS
  // ----------------------------------------------------------

  const sellerProducts = products.filter((p) => p.seller === sellerName);

  // Get seller details from the first matching product.
  // If no products found, seller is null — handled below.
  const seller = sellerProducts[0] || null;

  // ----------------------------------------------------------
  // HANDLE SELLER NOT FOUND
  // ----------------------------------------------------------

  if (!seller) {
    return (
      <main className="page-main center-content">
        <div className="text-center">
          <h1 style={{ fontSize: "4rem", fontWeight: 700 }}>404</h1>
          <p className="text-muted" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
            Seller not found
          </p>
          <Link to="/shop" className="link-primary" onClick={handleScrollToTop}>← Back to Shop</Link>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------------
  // JSX
  // ----------------------------------------------------------

  return (
    <main className="page-main">
      <div className="container narrow">

        {/* BREADCRUMB
             */}
        <div className="breadcrumb">
          <Link to="/shop" className="link-primary" onClick={handleScrollToTop}>← Back to Shop</Link>
        </div>

        {/* ── SELLER PROFILE HEADER ── */}
        <div className="seller-profile-header" style={{ textAlign: "center", marginBottom: "3rem" }}>

          {/* Seller avatar initials
               */}
          <div
            className="seller-avatar"
            style={{ width: "6rem", height: "6rem", margin: "0 auto 1rem", fontSize: "2rem" }}
          >
            {seller.sellerAvatar}
          </div>

          {/* Seller name
               */}
          <h1 className="page-title">{seller.seller}</h1>

          {/* City, State
               */}
          <p className="text-muted" style={{ fontSize: "1.125rem" }}>
            {seller.sellerCity && seller.sellerState
              ? `${seller.sellerCity}, ${seller.sellerState}`
              : seller.sellerCity || seller.sellerState || ""}
          </p>

          {/* Verified badge
              */}
          {seller.verified && (
            <img
              src="/icons/shield.svg"
              alt="Verified seller"
              style={{ width: "2rem", height: "2rem", margin: "0.5rem auto 0" }}
            />
          )}

          {/* Stats: Rating + Listings
              */}
          <div style={{ marginTop: "1.5rem" }}>
            <span style={{ display: "inline-block", marginRight: "2rem" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>
                {seller.sellerRating}
              </div>
              <div className="text-muted text-sm">Rating</div>
            </span>
            <span style={{ display: "inline-block" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>
                {seller.sellerListings}
              </div>
              <div className="text-muted text-sm">Listings</div>
            </span>
          </div>

          {/* Member since
               */}
          <p className="text-muted" style={{ marginTop: "1.5rem" }}>
            Member since {seller.memberSince}
          </p>
        </div>

        {/* ── SELLER'S LISTINGS ── */}
        <h2 className="section-title">Recent Listings</h2>
 
        {sellerProducts.length > 0 ? (
          <div className="listing-grid" style={{ marginTop: "2rem" }}>
            {sellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ marginTop: "2rem" }}>
            <p className="empty-title">No listings available</p>
            <p className="text-muted">
              This seller doesn't have any active listings right now.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}

export default SellerProfile;
