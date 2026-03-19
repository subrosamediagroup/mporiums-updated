// ============================================================
// Sell.jsx
// ============================================================ 

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sell categories and conditions 
const sellCategories = [
  "Guitars & Basses",
  "Synthesizers",
  "Headphones",
  "Speakers & Monitors",
  "Microphones",
  "DJ Equipment",
];

const sellConditions = ["Like New", "Excellent", "Good", "Fair"];

function Sell() {

  // ----------------------------------------------------------
  // STATE — 
  // ----------------------------------------------------------

 
  const [sellCategory, setSellCategory] = useState("");

 
  const [sellCondition, setSellCondition] = useState("");
 
  const [uploadedImages, setUploadedImages] = useState([]);

   
  const [sellTitle, setSellTitle] = useState("");

  
  const [sellPrice, setSellPrice] = useState("");

  
  const [sellDescription, setSellDescription] = useState("");
 
  const [sellerType, setSellerType] = useState("standard");
  const { isLoggedIn } = useAuth();

  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // ----------------------------------------------------------
  // FEE CALCULATOR
  // ----------------------------------------------------------
  // Two separate fees apply to every sale on M.Poriums:
  //
  // 1. TRANSACTION FEE (based on seller type)
  //    Standard:  3.19% + $0.49 per transaction, max $500
  //    Preferred: 2.99% + $0.49 per transaction, max $500
  //    Calculated on: full order total (item + shipping + tax)
  //
  // 2. SELLING FEE (flat rate, applies to all sellers)
  //    5% of item price + shipping (excludes tax)
  //    Minimum: $0.50
  //    Maximum: $500
  //
  // youReceive = itemPrice - transactionFee - sellingFee
  function calculateFees(price, type) {
    if (!price || isNaN(price) || Number(price) <= 0) {
      return {
        itemPrice: 0, shipping: 0, tax: 0, orderTotal: 0,
        transactionRate: 0, transactionFee: 0,
        sellingFee: 0, totalFees: 0, youReceive: 0,
      };
    }

    const itemPrice  = Number(price);
    const shipping   = itemPrice > 500 ? 0 : 14.99;   // matches CartContext
    const tax        = itemPrice * 0.08;
    const orderTotal = itemPrice + shipping + tax;

    // ── TRANSACTION FEE ──
    const transactionRate = type === "preferred" ? 0.0299 : 0.0319;
    const perTransaction  = 0.49;
    const rawTransaction  = (orderTotal * transactionRate) + perTransaction;
    const transactionFee  = Math.min(rawTransaction, 500);

    // ── SELLING FEE ──
    // 5% of (item price + shipping), min $0.50, max $500
    const sellingBase = itemPrice + shipping;
    const rawSelling  = sellingBase * 0.05;
    const sellingFee  = Math.min(Math.max(rawSelling, 0.50), 500);

    // ── TOTAL ──
    const totalFees  = transactionFee + sellingFee;
    const youReceive = Math.max(itemPrice - totalFees, 0);

    return {
      itemPrice, shipping, tax, orderTotal,
      transactionRate, transactionFee, perTransaction,
      sellingFee, sellingBase,
      totalFees, youReceive,
    };
  }

  const fees = calculateFees(sellPrice, sellerType);

  // ----------------------------------------------------------
  // LIVE PREVIEW  
  // ---------------------------------------------------------- 
  const showPreview = !!(sellTitle || sellPrice);

  // ----------------------------------------------------------
  // IMAGE UPLOAD 
  // ----------------------------------------------------------
  
  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    const remaining = 8 - uploadedImages.length; // max 8 images

    const newImages = files
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining)
      .map((f) => URL.createObjectURL(f));

    setUploadedImages((prev) => [...prev, ...newImages]);

    // Reset the input so the same file can be re-selected if needed
    e.target.value = "";
  }

  
  function removeUploadedImage(i) {
    setUploadedImages((prev) => prev.filter((_, index) => index !== i));
  }

  // ----------------------------------------------------------
  // PUBLISH 
  // ----------------------------------------------------------

  function handlePublishListing() {
    if (!sellTitle.trim() || !sellPrice || !sellCategory || !sellCondition) {
      alert("Please fill in all required fields (title, price, category, condition).");
      return;
    }
    alert("Listing published! (Requires backend integration)");
    navigate("/shop");
  }

  // ----------------------------------------------------------
  // JSX
  // ----------------------------------------------------------

  return (
    <main className="page-main" style={{ paddingTop: "64px" }}>
      <div className="container">

        {/* Page header */}
        <div className="sell-header">
          <h1 className="page-title">List Your Gear</h1>
          <p className="text-muted">Fill out the details below to create your listing.</p>
        </div>

        {/* Sign in required notice — only shown when NOT signed in */}
        {!isLoggedIn && (
          <div className="signin-required-box">
            <p className="signin-required-text">You need to sign in to list items.</p>
            <Link to="/auth" className="btn btn-primary">Sign In / Sign Up</Link>
          </div>
        )}

        <div className="sell-layout">

          {/* ── LEFT COLUMN: Images & Details ── */}
          <div className="sell-main">

            {/* IMAGE UPLOAD SECTION */}
            <div className="form-group">
              <label className="label-with-icon">
                <img src="/icons/camera.svg" alt="Photos" style={{ width: "1.25rem", height: "1.25rem" }} />
                Photos{" "}
                
                <span className="text-muted text-xs">({uploadedImages.length}/8)</span>
              </label>

              {/* Upload area
                 */}
              {uploadedImages.length < 8 && (
                <div
                  className="upload-area"
                  onClick={() => fileInputRef.current.click()}
                  style={{ cursor: "pointer" }}
                >
                  <span className="upload-icon">
                    <img src="/icons/upload.svg" alt="Upload" style={{ width: "2.2rem", height: "2.2rem", opacity: 0.85 }} />
                  </span>
                  <span className="upload-text">Click or drag to upload images</span>
                </div>
              )}

              {/* Hidden file input
                   */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />

              {/* THUMBNAIL GRID
                  */}
              {uploadedImages.length > 0 && (
                <div className="upload-thumbs">
                  {uploadedImages.map((src, i) => (
                    <div key={i} className="upload-thumb">
                      <img src={src} alt={`Upload ${i + 1}`} />
                      
                      <button
                        className="upload-thumb-remove"
                        onClick={() => removeUploadedImage(i)}
                        aria-label="Remove image"
                      >
                        <img src="/icons/x.svg" alt="Remove" style={{ width: "0.9rem", height: "0.9rem" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="separator" />

            {/* TITLE INPUT
                 */}
            <div className="form-group">
              <label className="label-with-icon">
                <img src="/icons/tag.svg" alt="Title" style={{ width: "1.25rem", height: "1.25rem" }} />
                Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Fender Stratocaster '62 Reissue"
                value={sellTitle}
                onChange={(e) => setSellTitle(e.target.value)}
              />
            </div>

            {/* DESCRIPTION INPUT */}
            <div className="form-group">
              <label className="label-with-icon">
                <img src="/icons/info.svg" alt="Description" style={{ width: "1.25rem", height: "1.25rem" }} />
                Description
              </label>
              <textarea
                rows={5}
                placeholder="Describe condition, history, what's included..."
                value={sellDescription}
                onChange={(e) => setSellDescription(e.target.value)}
              />
            </div>
          </div>

          {/* ── RIGHT SIDEBAR: Price, Category, Condition, Preview ── */}
          <div className="sell-sidebar">

            {/* PRICE INPUT
                */}
            <div className="form-group">
              <label className="label-with-icon">
                <img src="/icons/tag.svg" alt="Price" style={{ width: "1.25rem", height: "1.25rem" }} />
                Price *
              </label>
              <div className="price-input-wrap">
                <span className="price-symbol">$</span>
                <input
                  type="number"
                  placeholder="0"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                />
              </div>
            </div>

            {/* CATEGORY PILLS
                */}
            <div className="form-group">
              <label className="label-with-icon">
                <img src="/icons/package.svg" alt="Category" style={{ width: "1.25rem", height: "1.25rem" }} />
                Category *
              </label>
              <div className="pill-group">
                {sellCategories.map((c) => (
                  <button
                    key={c}
                    className={`pill-btn${sellCategory === c ? " active" : ""}`}
                    onClick={() => setSellCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* CONDITION PILLS — same pattern as category */}
            <div className="form-group">
              <label className="label-with-icon">
                <img src="/icons/star.svg" alt="Condition" style={{ width: "1.25rem", height: "1.25rem" }} />
                Condition *
              </label>
              <div className="pill-group">
                {sellConditions.map((c) => (
                  <button
                    key={c}
                    className={`pill-btn${sellCondition === c ? " active" : ""}`}
                    onClick={() => setSellCondition(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <hr className="separator" />

            {/* SELLER PROFILE PREVIEW */}
            <div className="seller-card">
              <h3 className="filter-title">Your Seller Profile</h3>
              <div className="seller-info">
                <div className="seller-avatar">
                  <img src="/icons/user-transparent.svg" alt="User Avatar" style={{ width: "2rem", height: "2rem" }} />
                </div>
                <div>
                  <p className="seller-name">Guest</p>
                  <p className="text-muted text-xs">Sign in to build your reputation</p>
                </div>
              </div>
            </div>

            {/* LIVE LISTING PREVIEW
                 */}
            {showPreview && (
              <div className="listing-preview">
                <h3 className="filter-title text-primary">Listing Preview</h3>
                <p className="listing-preview-title">{sellTitle}</p>
                <div className="listing-preview-meta">
                  {/* Show formatted price if entered */}
                  {sellPrice && (
                    <span className="listing-preview-price">
                      ${Number(sellPrice).toLocaleString()}
                    </span>
                  )}
                  {/* Show condition badge only if a condition is selected */}
                  {sellCondition && (
                    <span className="badge badge-secondary">{sellCondition}</span>
                  )}
                </div>
                {/* Show category if selected */}
                {sellCategory && (
                  <p className="text-muted text-xs">{sellCategory}</p>
                )}
              </div>
            )} 

            {/* ── FEE BREAKDOWN CARD ──
                 */}
            <div className="form-card" style={{ marginBottom: "1rem", padding: "1rem" }}>
              <h3 className="filter-title" style={{ marginBottom: "0.75rem" }}>
                Selling Fees
              </h3>

              {/* Fee rate table with radio buttons inline in each row */}
              <div style={{
                border: "0.5px solid var(--border)",
                borderRadius: "calc(var(--radius) - 4px)",
                overflow: "hidden", fontSize: "0.78rem",
                marginBottom: "0.75rem",
              }}>
                {/* Header row */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  background: "var(--muted)",
                  borderBottom: "0.5px solid var(--border)",
                }}>
                  <div style={{ padding: "0.4rem 0.75rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
                    Seller type
                  </div>
                  <div style={{ padding: "0.4rem 0.75rem", fontWeight: 600, color: "var(--muted-foreground)", borderLeft: "0.5px solid var(--border)" }}>
                    Fee
                  </div>
                </div>

                {/* Standard row — radio button inline */}
                <label
                  htmlFor="seller-standard"
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    cursor: "pointer",
                    background: sellerType === "standard" ? "var(--muted)" : "transparent",
                    borderBottom: "0.5px solid var(--border)",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    padding: "0.55rem 0.75rem",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    fontWeight: sellerType === "standard" ? 600 : 400,
                    color: sellerType === "standard" ? "var(--primary)" : "var(--foreground)",
                  }}>
                    <input
                      type="radio"
                      id="seller-standard"
                      name="sellerType"
                      value="standard"
                      checked={sellerType === "standard"}
                      onChange={() => setSellerType("standard")}
                      style={{ accentColor: "var(--primary)", flexShrink: 0 }}
                    />
                    Standard
                  </div>
                  <div style={{
                    padding: "0.55rem 0.75rem",
                    color: "var(--muted-foreground)",
                    borderLeft: "0.5px solid var(--border)",
                    display: "flex", alignItems: "center",
                  }}>
                    3.19% + $0.49
                  </div>
                </label>

                {/* Preferred row — radio button inline */}
                <label
                  htmlFor="seller-preferred"
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    cursor: "pointer",
                    background: sellerType === "preferred" ? "var(--muted)" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    padding: "0.55rem 0.75rem",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    fontWeight: sellerType === "preferred" ? 600 : 400,
                    color: sellerType === "preferred" ? "var(--primary)" : "var(--foreground)",
                  }}>
                    <input
                      type="radio"
                      id="seller-preferred"
                      name="sellerType"
                      value="preferred"
                      checked={sellerType === "preferred"}
                      onChange={() => setSellerType("preferred")}
                      style={{ accentColor: "var(--primary)", flexShrink: 0 }}
                    />
                    Preferred
                  </div>
                  <div style={{
                    padding: "0.55rem 0.75rem",
                    color: "var(--muted-foreground)",
                    borderLeft: "0.5px solid var(--border)",
                    display: "flex", alignItems: "center",
                  }}>
                    2.99% + $0.49
                  </div>
                </label>
              </div>

              <p className="text-muted text-xs" style={{ marginBottom: "0.5rem" }}>
                Max fee $500 per transaction. Fee calculated on full order total
                including shipping and applicable sales tax.
              </p>

              {/* Live breakdown — only shows once a price is entered */}
              {sellPrice && Number(sellPrice) > 0 && (
                <>
                  <hr className="separator" style={{ margin: "0.75rem 0" }} />

                  <p style={{ fontWeight: 600, fontSize: "0.8rem", marginBottom: "0.6rem" }}>
                    Estimated breakdown for ${Number(sellPrice).toLocaleString()}
                  </p>

                  {/* Order total rows */}
                  <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginBottom: "0.6rem" }}>
                    {[
                      { label: "Item price",   value: `$${Number(sellPrice).toLocaleString()}` },
                      { label: "Est. shipping", value: fees.shipping === 0 ? "Free" : `$${fees.shipping.toFixed(2)}` },
                      { label: "Est. tax (8%)", value: `$${fees.tax.toFixed(2)}` },
                    ].map((row) => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                        <span>{row.label}</span>
                        <span>{row.value}</span>
                      </div>
                    ))}
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      borderTop: "0.5px solid var(--border)",
                      paddingTop: "0.2rem", marginTop: "0.2rem", fontWeight: 500,
                      color: "var(--foreground)",
                    }}>
                      <span>Order total</span>
                      <span>${fees.orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Fee rows */}
                  <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginBottom: "0.6rem" }}>
                    {/* Transaction fee */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                      <span>
                        Transaction fee ({(fees.transactionRate * 100).toFixed(2)}% + $0.49)
                        {fees.transactionFee >= 500 && (
                          <span style={{ marginLeft: "0.35rem", fontSize: "0.7rem", background: "var(--secondary)", padding: "1px 5px", borderRadius: "4px" }}>
                            max $500
                          </span>
                        )}
                      </span>
                      <span style={{ color: "var(--destructive)", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>
                        -${fees.transactionFee.toFixed(2)}
                      </span>
                    </div>

                    {/* Selling fee */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                      <span>
                        Selling fee (3% of item)
                        {fees.sellingFee >= 500 && (
                          <span style={{ marginLeft: "0.35rem", fontSize: "0.7rem", background: "var(--secondary)", padding: "1px 5px", borderRadius: "4px" }}>
                            max $500
                          </span>
                        )}
                      </span>
                      <span style={{ color: "var(--destructive)", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>
                        -${fees.sellingFee.toFixed(2)}
                      </span>
                    </div>

                    {/* Total fees */}
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      borderTop: "0.5px solid var(--border)",
                      paddingTop: "0.2rem", marginTop: "0.2rem",
                      fontWeight: 500, color: "var(--destructive)",
                    }}>
                      <span style={{ color: "var(--muted-foreground)" }}>Total fees</span>
                      <span>-${fees.totalFees.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* You receive — highlighted */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--muted)",
                    border: "0.5px solid var(--border)",
                    borderRadius: "calc(var(--radius) - 4px)",
                    padding: "0.6rem 0.75rem",
                  }}>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>You receive</span>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)" }}>
                      ${fees.youReceive.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-muted text-xs" style={{ marginTop: "0.5rem" }}>
                    Estimate only. Final fees confirmed at checkout.
                  </p>
                </>
              )}
            </div>

            {/* PUBLISH BUTTON */}
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handlePublishListing}
            >
              Publish Listing
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Sell;
