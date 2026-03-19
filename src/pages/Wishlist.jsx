// ============================================================
// Wishlist.jsx
// src/pages/Wishlist.jsx
// ============================================================
// The saved items / favourites page in the user's profile.
// Accessible at /wishlist
//
// Shows all products the user has hearted across the site.
// Each card has:
//   - Product image, title, price, condition, seller
//   - Remove button (the heart) to unsave it
//   - Add to Cart button for quick checkout
//   - "Saved on" date
//
// Sorting: Recently Saved, Price Low→High, Price High→Low
//
// Empty state: friendly message with a link to the Shop
// ============================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {

  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [sortBy, setSortBy] = useState("recent");

  // Track which items have just been added to cart
  // so we can show a brief "Added!" confirmation on the button
  const [addedIds, setAddedIds] = useState([]);

  // ── Sorting ─────────────────────────────────────────────
  const sorted = [...wishlist].sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    // "recent" — sort by savedAt timestamp, newest first
    return new Date(b.savedAt) - new Date(a.savedAt);
  });

  // ── Add to cart with brief confirmation ─────────────────
  function handleAddToCart(product) {
    addToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  }

  // ── Format the saved date ────────────────────────────────
  function formatSavedDate(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }

  // ── JSX ─────────────────────────────────────────────────
  return (
    <main className="page-main" style={{ paddingTop: "64px" }}>
      <div className="container">

        {/* ── PAGE HEADER ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "2rem",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <h1 className="page-title">Saved Items</h1>
            <p className="text-muted">
              {wishlist.length > 0
                ? `${wishlist.length} item${wishlist.length !== 1 ? "s" : ""} saved`
                : "Items you heart will appear here"}
            </p>
          </div>

          {/* Clear all — only show when list has items */}
          {wishlist.length > 0 && (
            <button
              className="btn btn-outline btn-sm"
              onClick={clearWishlist}
              style={{ color: "var(--destructive)", borderColor: "var(--destructive)" }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* ── EMPTY STATE ── */}
        {wishlist.length === 0 && (
          <div className="empty-state" style={{ padding: "4rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
              {/* Heart outline */}
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h2 className="empty-title">No saved items yet</h2>
            <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
              Tap the heart on any listing to save it here for later.
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Browse Gear
            </Link>
          </div>
        )}

        {/* ── SORT CONTROLS + GRID ── */}
        {wishlist.length > 0 && (
          <>
            {/* Sort row */}
            <div style={{
              display: "flex", alignItems: "center",
              gap: "0.6rem", marginBottom: "1.5rem", flexWrap: "wrap",
            }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                Sort by:
              </span>
              {[
                { key: "recent",     label: "Recently Saved" },
                { key: "price-asc",  label: "Price: Low to High" },
                { key: "price-desc", label: "Price: High to Low" },
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

            {/* Wishlist item cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {sorted.map((product) => (
                <div key={product.id} style={{
                  background: "var(--card)",
                  border: "0.5px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "1rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}>

                  {/* Product image — links to detail page */}
                  <Link
                    to={`/product/${product.id}`}
                    style={{ flexShrink: 0 }}
                  >
                    <div style={{
                      width: "80px", height: "80px",
                      borderRadius: "calc(var(--radius) - 4px)",
                      overflow: "hidden",
                      background: "var(--muted)",
                    }}>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                          <img src="/icons/camera.svg" alt="No image" style={{ width: "1.1rem", height: "1.1rem", opacity: 0.6 }} />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="text-muted text-xs" style={{ marginBottom: "0.1rem" }}>
                      {product.category}
                    </p>
                    <Link
                      to={`/product/${product.id}`}
                      style={{
                        fontWeight: 600, fontSize: "0.95rem",
                        color: "var(--foreground)", textDecoration: "none",
                        display: "block", marginBottom: "0.2rem",
                      }}
                    >
                      {product.title}
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{
                        fontWeight: 700, fontSize: "1rem",
                        color: "var(--foreground)",
                      }}>
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="badge badge-secondary" style={{ fontSize: "0.72rem" }}>
                        {product.condition}
                      </span>
                      <Link
                        to={`/seller/${product.seller}`}
                        className="text-muted text-xs"
                        style={{ textDecoration: "none" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        by {product.seller}
                      </Link>
                    </div>
                    {/* Saved date */}
                    {product.savedAt && (
                      <p className="text-muted text-xs" style={{ marginTop: "0.25rem" }}>
                        Saved {formatSavedDate(product.savedAt)}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: "flex", flexDirection: "column",
                    gap: "0.5rem", alignSelf: "center", flexShrink: 0,
                  }}>

                    {/* Add to Cart */}
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ minWidth: "110px" }}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedIds.includes(product.id) ? (
                        <>
                          <img src="/icons/check.svg" alt="Added" style={{ width: "1rem", height: "1rem", marginRight: "0.25rem", verticalAlign: "-1px" }} />
                          Added!
                        </>
                      ) : "Add to Cart"}
                    </button>

                    {/* Remove from wishlist */}
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ minWidth: "110px" }}
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label="Remove from saved items"
                    >
                      {/* Filled heart to indicate it's saved — clicking removes it */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="var(--primary)"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        style={{ marginRight: "0.3rem", verticalAlign: "middle" }}
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      Unsave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
