// ============================================================
// Cart.jsx 
// ============================================================


import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {

  // ----------------------------------------------------------
  // GET CART FROM CONTEXT
  // ----------------------------------------------------------
  
  const { cart, totals, removeFromCart, updateQty, clearCart } = useCart();
 
  const { subtotal, shipping, tax, total, itemCount } = totals;

  // ----------------------------------------------------------
  // JSX 
  // ----------------------------------------------------------

  return (
    <main className="page-main">
      <div className="container">

        {/* Breadcrumb
             */}
        <div className="breadcrumb">
          <Link to="/shop" className="link-primary">← Continue Shopping</Link>
        </div>

        {/* Page title with item count
             */}
        <h1 className="page-title">
          Shopping Cart{" "}
          {itemCount > 0 && (
            <span className="text-muted">({itemCount})</span>
          )}
        </h1>

        {/* ── EMPTY STATE ──
             */}
        {cart.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><img src="/icons/shopping-bag.svg" alt="Empty cart" style={{ width: "3.125rem", height: "3.125rem" }} /></div>
            <h2 className="empty-title">Your cart is empty</h2>
            <p className="text-muted">
              Discover amazing deals on music gear, instruments, and audio equipment.
            </p>
            <Link
              to="/shop"
              className="btn btn-primary btn-lg"
              style={{ marginTop: "1.5rem" }}
            >
              Browse the Shop
            </Link>
          </div>
        )}

        {/* ── CART CONTENT ──
             */}
        {cart.length > 0 && (
          <div className="cart-layout">

            {/* ── LEFT COLUMN: Cart Items ── */}
            <div className="cart-items">

              {/* Clear all button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                <button className="btn btn-outline" onClick={clearCart}>
                  Clear All
                </button>
              </div>

              {/* Loop through cart items
                   */}
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>

                  {/* Item image — clicking goes to product detail page */}
                  <Link to={`/product/${item.id}`} className="cart-item-image">
                    <img src={item.image} alt={item.title} />
                  </Link>

                  <div className="cart-item-info">
                    <div>
                      {/* Item title — also a link to product detail */}
                      <Link to={`/product/${item.id}`} className="cart-item-title">
                        {item.title}
                      </Link>
                      {/* Condition and seller info */}
                      <p className="cart-item-meta">
                        {item.condition} · Sold by {item.seller}
                      </p>
                    </div>

                    <div className="cart-item-bottom">

                      {/* Quantity controls
                          */}
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, -1)}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* Remove button
                             */}
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <img src="/icons/trash-2.svg" alt="Remove" style={{ width: "1.1rem", height: "1.1rem" }} />
                        </button>

                        {/* Line total: price × quantity
                            */}
                        <span className="cart-item-price">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── RIGHT COLUMN: Order Summary ── */}
            <div className="cart-summary">
              <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>
                <hr className="separator" />

                {/* Summary rows
                     */}
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  {/* Show "Free" when shipping is 0, otherwise show the amount
                       */}
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <hr className="separator" />

                <div className="summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Free shipping note — only show when shipping is 0
                    */}
                {shipping === 0 && (
                  <p className="free-shipping-note">
                    <img src="/icons/truck.svg" alt="Shipping" style={{ width: "1.05rem", height: "1.05rem", marginRight: "0.3rem", verticalAlign: "-2px" }} />
                    You qualify for free shipping!
                  </p>
                )}

                {/* Checkout button
                     */}
                <Link
                  to="/checkout"
                  className="btn btn-primary btn-lg btn-full"
                  style={{ marginTop: "1.5rem" }}
                >
                  Proceed to Checkout
                </Link>

                <div className="secure-note">
                  <img src="/icons/shield.svg" alt="Secure" style={{ width: "1.05rem", height: "1.05rem", marginRight: "0.3rem", verticalAlign: "-2px" }} />
                  Secure checkout · Buyer protection included
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
