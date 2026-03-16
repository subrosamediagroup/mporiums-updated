// ============================================================
// Sell.jsx 
// ============================================================

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  // STATE — replaces 4 global variables in script.js
  // ----------------------------------------------------------
 
  const [sellCategory, setSellCategory] = useState("");
 
  const [sellCondition, setSellCondition] = useState("");
 
  const [uploadedImages, setUploadedImages] = useState([]);
 
  const [sellTitle, setSellTitle] = useState("");
 
  const [sellPrice, setSellPrice] = useState("");
 
  const [sellDescription, setSellDescription] = useState("");
 
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // ----------------------------------------------------------
  // LIVE PREVIEW — replaces updateListingPreview()
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

  // Remove one image by index 

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
    <main className="page-main">
      <div className="container">

        {/* Page header */}
        <div className="sell-header">
          <h1 className="page-title">List Your Gear</h1>
          <p className="text-muted">Fill out the details below to create your listing.</p>
        </div>

        {/* Sign in required notice
             */}
        <div className="signin-required-box">
          <p className="signin-required-text">You need to sign in to list items.</p>
          <Link to="/auth" className="btn btn-primary">Sign In / Sign Up</Link>
        </div>

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
                  <span className="upload-icon">📤</span>
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
                      >
                        ✕
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

            {/* PUBLISH BUTTON
                */}
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
