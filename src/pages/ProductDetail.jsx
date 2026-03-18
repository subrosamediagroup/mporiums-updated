// ============================================================
// ProductDetail.jsx
// ============================================================ 

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import products from "../data/products";

function ProductDetail() {

  // ----------------------------------------------------------
  // GET PRODUCT FROM URL
  // ----------------------------------------------------------

  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  // ----------------------------------------------------------
  // CART
  // ----------------------------------------------------------

  const { addToCart } = useCart();

  // ----------------------------------------------------------
  // SCROLL TO TOP
  // ----------------------------------------------------------

  function handleScrollToTop() {
    window.scrollTo(0, 0);
  }

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
                <img src="/icons/message-square.svg" alt="Message" style={{ width: "2rem", height: "2rem" }} />
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [offerModalOpen, setOfferModalOpen] = useState(false);

                <img src="/icons/heart.svg" alt="Save" style={{ width: "2rem", height: "2rem" }} />
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");

  // Added to cart confirmation
                <img src="/icons/share-2.svg" alt="Share" style={{ width: "2rem", height: "2rem" }} />

  // ----------------------------------------------------------
  // HANDLE PRODUCT NOT FOUND
  // ----------------------------------------------------------
  // If someone visits /product/99 and that ID doesn't exist,
  // show a friendly message instead of crashing.
  if (!product) {
    return (
      <main className="page-main center-content">
        <div className="text-center">
          <h1 style={{ fontSize: "4rem", fontWeight: 700 }}>404</h1>
          <p className="text-muted" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
            Product not found
          </p>
          <Link to="/shop" className="link-primary">← Back to Shop</Link>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------------
  // IMAGE GALLERY FUNCTIONS
  // ----------------------------------------------------------

  // Select specific image by index
  function selectImage(i) {
    setActiveImageIndex(i);
  }
  // Go to next image (wraps around to first if at end)

  function nextImage() {
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  }

  function prevImage() {
    setActiveImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  }

  // ----------------------------------------------------------
  // ADD TO CART
  // ----------------------------------------------------------
  
  function handleAddToCart() {
    addToCart(product);
    setAddedToCart(true);
    // Reset the confirmation message after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000);
  }

  // ----------------------------------------------------------
  // OFFER MODAL FUNCTIONS
  // ----------------------------------------------------------

  
  function openOfferModal() {
    setOfferModalOpen(true);
  }


  function closeOfferModal() {
    setOfferModalOpen(false);
    setOfferAmount("");
    setOfferMessage("");
  }

  function handleSendOffer(e) {
    e.preventDefault();
    alert("Offer sent! (Requires backend integration)");
    closeOfferModal();
  }

  // ----------------------------------------------------------
  // JSX
  // ----------------------------------------------------------

  return (
    <main className="page-main">
      <div className="container">

        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <Link to="/shop" className="link-primary">← Back to Shop</Link>
          <span>/</span>
          <span>{product.category}</span>
        </div>

        <div className="product-layout">

          {/* ── IMAGE GALLERY ── */}
          <div className="product-gallery">
            <div className="product-main-image">

              {/* Main image
                  */}
              <img
                src={product.images[activeImageIndex]}
                alt={product.title}
              />

              {/* Prev/Next buttons — only show if more than 1 image */}
              {product.images.length > 1 && (
                <>
                  <button className="gallery-nav gallery-prev" onClick={prevImage}>
                    ‹
                  </button>
                  <button className="gallery-nav gallery-next" onClick={nextImage}>
                    ›
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAILS
               */}
            <div className="product-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`product-thumb${activeImageIndex === i ? " active" : ""}`}
                  onClick={() => selectImage(i)}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="product-info">

            {/* Condition badge
                 */}
            <span className="badge badge-secondary">{product.condition}</span>

            {/* Title
                */}
            <h1 className="product-title">{product.title}</h1>

            {/* Category
                 */}
            <p className="text-muted" style={{ marginLeft: "1px" }}>
              {product.category}
            </p>

            {/* Price
                 */}
            <p className="product-price">${product.price.toLocaleString()}</p>

            {/* Rating
                 */}
            {product.rating > 0 && (
              <div className="product-rating">
                <img
                  src="/icons/star.svg"
                  alt="Rating"
                  style={{ width: "32px", height: "32px", display: "inline", verticalAlign: "middle", marginRight: "0.25rem" }}
                />
                {product.rating}
              </div>
            )}

            <hr className="separator" />

            {/* Description
                 */}
            <p className="product-description">{product.description}</p>

            <hr className="separator" />

            {/* ── SELLER CARD ──
                */}
            <div className="seller-card" style={{ maxWidth: "1120px" }}>
              <h3 className="filter-title">Seller</h3>
              <div className="seller-info">

                {/* Seller avatar initials */}
                <div className="seller-avatar">{product.sellerAvatar}</div>

                <div className="seller-name">
                  {/* Seller name — plain text for now.
                      You can make this a Link to /seller/:id when you build that page */}
                    <Link to={`/seller/${product.seller}`} style={{ color: "var(--primary)", fontWeight: 600 }} onClick={handleScrollToTop}>
                      {product.seller}
                    </Link>

                  {/* Verified badge — only show if verified
                      */}
                  {product.verified && (
                    <img
                      src="/icons/shield.svg"
                      alt="Verified seller"
                      style={{ width: "2rem", height: "2rem", marginTop: "2px" }}
                    />
                  )}
                </div>

                {/* City, State
                   */}
                <div className="seller-location">
                  {product.sellerCity && product.sellerState
                    ? `${product.sellerCity}, ${product.sellerState}`
                    : product.sellerCity || product.sellerState || ""}
                </div>
              </div>
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div className="product-actions">

              {/* ADD TO CART
                   */}
              <button
                className="btn btn-primary btn-sm btn-flex"
                onClick={handleAddToCart}
              >
                <img src="/icons/shopping-cart-white.svg" alt="Cart" style={{ width: "2rem", height: "2rem" }} />
                {/* Show "Added!" briefly after clicking, then revert */}
                {addedToCart ? "Added!" : "Add to Cart"}
              </button>

              {/* MAKE OFFER
                  */}
              <button
                className="btn btn-outline btn-sm btn-blue-hover"
                onClick={openOfferModal}
              >
                <img src="/icons/message-square.svg" alt="Message" style={{ width: "2rem", height: "2rem" }} />
                Make Offer
              </button>

              <button className="btn btn-outline btn-sm btn-blue-hover">
                <img src="/icons/heart.svg" alt="Save" style={{ width: "2rem", height: "2rem" }} />
                Save
              </button>

              <button className="btn btn-outline btn-sm btn-blue-hover">
                <img src="/icons/share-2.svg" alt="Share" style={{ width: "2rem", height: "2rem" }} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          OFFER MODAL
          ================================================================
           */}
      {offerModalOpen && (
        <div
          className="modal-overlay"
          onClick={closeOfferModal}
        >
          {/*  */}
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="form-card-title">Make an Offer</h2>
            <p className="text-muted">
              Send an offer for <strong>{product.title}</strong>
            </p>
            <p className="text-muted">
              Listed at <strong className="text-primary">${product.price.toLocaleString()}</strong>
            </p>

            <form onSubmit={handleSendOffer}>
              <div className="form-group" style={{ marginTop: "1.25rem" }}>
                <label>Your Offer ($)</label>
                <input
                  type="number"
                  placeholder={Math.round(product.price * 0.9)}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  style={{ fontSize: "1.125rem", fontWeight: 600 }}
                />
              </div>
              <div className="form-group">
                <label>Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Add a message to the seller..."
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary btn-lg btn-flex">
                  Send Offer
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={closeOfferModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductDetail;
