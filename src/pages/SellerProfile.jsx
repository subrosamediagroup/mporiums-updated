// ============================================================
// SellerProfile.jsx — updated with ratings & reviews
// ============================================================

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import reviewsData from "../data/reviews";
import ProductCard from "../components/ProductCard";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";

function SellerProfile() {

  const { sellerName } = useParams();

  // ── Seller data ────────────────────────────────────────
  const sellerProducts = products.filter((p) => p.seller === sellerName);
  const seller = sellerProducts[0] || null;

  // ── Reviews state ──────────────────────────────────────
  // Start with the placeholder data for this seller.
  // New reviews submitted via ReviewForm get added to this array.
  const [reviews, setReviews] = useState(
    reviewsData.filter((r) => r.seller === sellerName)
  );

  // Sort filter: "recent" | "highest" | "lowest"
  const [sortBy, setSortBy] = useState("recent");

  // Which tab is active: "listings" | "reviews"
  const [activeTab, setActiveTab] = useState("reviews");

  // Whether the review form is open
  const [showReviewForm, setShowReviewForm] = useState(false);

  // ── 404 ────────────────────────────────────────────────
  if (!seller) {
    return (
      <main className="page-main center-content" style={{ paddingTop: "64px" }}>
        <div className="text-center">
          <h1 style={{ fontSize: "4rem", fontWeight: 700 }}>404</h1>
          <p className="text-muted" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
            Seller not found
          </p>
          <Link to="/shop" className="link-primary">← Back to Shop</Link>
        </div>
      </main>
    );
  }

  // ── Rating calculations ────────────────────────────────
  const totalReviews  = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  // Count of reviews per star level (5 down to 1)
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: totalReviews > 0
      ? Math.round((reviews.filter((r) => r.rating === star).length / totalReviews) * 100)
      : 0,
  }));

  // ── Sorted reviews ─────────────────────────────────────
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest")  return a.rating - b.rating;
    return new Date(b.date) - new Date(a.date); // recent
  });

  // ── Handle new review submitted ────────────────────────
  function handleNewReview(newReview) {
    setReviews((prev) => [newReview, ...prev]);
    setShowReviewForm(false);
  }

  // ── Helpers ────────────────────────────────────────────
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  }

  // ── JSX ────────────────────────────────────────────────
  return (
    <main className="page-main" style={{ paddingTop: "64px" }}>
      <div className="container narrow">

        <div className="breadcrumb">
          <Link to="/shop" className="link-primary">← Back to Shop</Link>
        </div>

        {/* ── PROFILE HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>

          {/* Avatar */}
          <div
            className="seller-avatar"
            style={{ width: "6rem", height: "6rem", margin: "0 auto 1rem", fontSize: "2rem" }}
          >
            {seller.sellerAvatar}
          </div>

          {/* Name + verified */}
          <h1 className="page-title" style={{ marginBottom: "0.25rem" }}>
            {seller.seller}
          </h1>

          {seller.verified && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
              <img src="/icons/shield.svg" alt="Verified" style={{ width: "1.25rem", height: "1.25rem" }} />
              <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", fontWeight: 500 }}>
                Verified Seller
              </span>
            </div>
          )}

          {/* Location */}
          {(seller.sellerCity || seller.sellerState) && (
            <p className="text-muted" style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
              {seller.sellerCity && seller.sellerState
                ? `${seller.sellerCity}, ${seller.sellerState}`
                : seller.sellerCity || seller.sellerState}
            </p>
          )}

          {/* Stats row */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "2.5rem",
            flexWrap: "wrap",
            marginTop: "1rem",
          }}>
            {/* Average rating */}
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700 }}>
                  {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                </span>
                {averageRating > 0 && <StarRating rating={averageRating} size={16} />}
              </div>
              <p className="text-muted text-sm">
                {totalReviews > 0 ? `${totalReviews} review${totalReviews !== 1 ? "s" : ""}` : "No reviews yet"}
              </p>
            </div>

            {/* Listings count */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700 }}>
                {seller.sellerListings}
              </div>
              <p className="text-muted text-sm">Listings</p>
            </div>

            {/* Member since */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700 }}>
                {seller.memberSince}
              </div>
              <p className="text-muted text-sm">Member since</p>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          marginBottom: "2rem",
          gap: "0",
        }}>
          {[
            { key: "reviews",  label: `Reviews (${totalReviews})` },
            { key: "listings", label: `Listings (${sellerProducts.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderBottom: activeTab === tab.key
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
                background: "transparent",
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? "var(--primary)" : "var(--muted-foreground)",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "color 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════
            REVIEWS TAB
            ════════════════════════════════════════════════ */}
        {activeTab === "reviews" && (
          <div>

            {/* ── RATING SUMMARY + BREAKDOWN ── */}
            {totalReviews > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "2rem",
                background: "var(--card)",
                border: "0.5px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1.5rem",
                marginBottom: "1.5rem",
                alignItems: "center",
              }}>

                {/* Big score */}
                <div style={{ textAlign: "center", minWidth: "100px" }}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "3.5rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "var(--primary)",
                  }}>
                    {averageRating.toFixed(1)}
                  </div>
                  <StarRating rating={averageRating} size={18} />
                  <p className="text-muted text-xs" style={{ marginTop: "0.4rem" }}>
                    {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Bar breakdown — 5 stars down to 1 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {starCounts.map(({ star, count, pct }) => (
                    <div key={star} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      {/* Star label */}
                      <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", minWidth: "32px", textAlign: "right" }}>
                        {star}
                        <img src="/icons/star.svg" alt="star" style={{ width: "0.85rem", height: "0.85rem", marginLeft: "0.2rem", verticalAlign: "-1px" }} />
                      </span>
                      {/* Progress bar */}
                      <div style={{
                        flex: 1,
                        height: "8px",
                        background: "var(--muted)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: "var(--primary)",
                          borderRadius: "4px",
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                      {/* Count */}
                      <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", minWidth: "20px" }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── WRITE A REVIEW BUTTON / FORM ── */}
            <div style={{ marginBottom: "1.5rem" }}>
              {!showReviewForm ? (
                <button
                  className="btn btn-outline"
                  onClick={() => setShowReviewForm(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                >
                  <img src="/icons/star.svg" alt="Review" style={{ width: "1rem", height: "1rem" }} />
                  Write a Review
                </button>
              ) : (
                <ReviewForm
                  sellerName={sellerName}
                  productTitle={sellerProducts[0]?.title}
                  onSubmit={handleNewReview}
                  onCancel={() => setShowReviewForm(false)}
                />
              )}
            </div>

            {/* ── SORT CONTROLS ── */}
            {totalReviews > 1 && !showReviewForm && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Sort by:</span>
                {[
                  { key: "recent",  label: "Most Recent" },
                  { key: "highest", label: "Highest Rated" },
                  { key: "lowest",  label: "Lowest Rated" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    className={`filter-btn${sortBy === opt.key ? " active" : ""}`}
                    onClick={() => setSortBy(opt.key)}
                    style={{ fontSize: "0.8rem" }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* ── REVIEW CARDS ── */}
            {totalReviews === 0 ? (
              <div className="empty-state" style={{ padding: "3rem 0" }}>
                <div className="empty-icon"><img src="/icons/star.svg" alt="No reviews" style={{ width: "3.125rem", height: "3.125rem" }} /></div>
                <p className="empty-title">No reviews yet</p>
                <p className="text-muted">
                  Be the first to leave a review for {sellerName}.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {sortedReviews.map((review) => (
                  <div key={review.id} style={{
                    background: "var(--card)",
                    border: "0.5px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "1.25rem",
                  }}>

                    {/* Review header: avatar + name + date */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

                        {/* Buyer avatar */}
                        <div style={{
                          width: "2.25rem", height: "2.25rem",
                          borderRadius: "50%",
                          background: "var(--secondary)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.75rem", fontWeight: 600,
                          color: "var(--muted-foreground)",
                          flexShrink: 0,
                        }}>
                          {review.buyerAvatar}
                        </div>

                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                              {review.buyerName}
                            </span>
                            {/* Verified purchase badge */}
                            {review.verified && (
                              <span style={{
                                fontSize: "0.7rem", fontWeight: 500,
                                background: "var(--secondary)",
                                color: "var(--muted-foreground)",
                                padding: "1px 7px",
                                borderRadius: "20px",
                              }}>
                                Verified purchase
                              </span>
                            )}
                          </div>
                          {/* Product purchased */}
                          {review.productTitle && (
                            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", margin: 0 }}>
                              Purchased: {review.productTitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                        {formatDate(review.date)}
                      </span>
                    </div>

                    {/* Stars + title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                      <StarRating rating={review.rating} size={15} />
                      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {review.title}
                      </span>
                    </div>

                    {/* Review body */}
                    <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--foreground)", margin: 0 }}>
                      {review.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            LISTINGS TAB
            ════════════════════════════════════════════════ */}
        {activeTab === "listings" && (
          sellerProducts.length > 0 ? (
            <div className="listing-grid">
              {sellerProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-title">No listings available</p>
              <p className="text-muted">
                This seller doesn't have any active listings right now.
              </p>
            </div>
          )
        )}

      </div>
    </main>
  );
}

export default SellerProfile;
