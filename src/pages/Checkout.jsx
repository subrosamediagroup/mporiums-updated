// ============================================================
// Checkout.jsx
// ============================================================ 

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {

  // ----------------------------------------------------------
  // CART DATA FROM CONTEXT
  // ---------------------------------------------------------- 
  const { cart, totals, clearCart } = useCart();
  const { subtotal, shipping, tax, total } = totals;

  const navigate = useNavigate();

  // ----------------------------------------------------------
  // HANDLE CHECKOUT SUBMIT
  // ---------------------------------------------------------- 
  function handleCheckout(e) {
    e.preventDefault();
    alert("In production, you would be redirected to Stripe for secure payment.");
    clearCart();
    navigate("/success");
  }

  // ----------------------------------------------------------
  // JSX
  // ----------------------------------------------------------

  return (
    <main className="page-main">
      <div className="container">

        {/* Breadcrumb
           */}
        <div className="breadcrumb">
          <Link to="/cart" className="link-primary">← Back to Cart</Link>
        </div>

        <h1 className="page-title">Checkout</h1>

        {/* The whole page is one form — submitting it triggers handleCheckout */}
        <form onSubmit={handleCheckout} className="checkout-layout">

          {/* ── LEFT COLUMN: Shipping + Payment ── */}
          <div className="checkout-form">

            {/* SHIPPING ADDRESS FORM CARD */}
            <div className="form-card">
              <h2 className="form-card-title">Shipping Address</h2>
              <hr className="separator" />

              <div className="form-grid-2">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" required placeholder="John" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" required placeholder="Doe" />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="john@example.com" />
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="address" required placeholder="123 Main St" />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" required placeholder="Los Angeles" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" required placeholder="California" />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input type="text" name="zip" required placeholder="90001" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" required placeholder="(555) 123-4567" />
                </div>
              </div>
            </div>

            {/* PAYMENT INFO CARD — static, Stripe handles the rest */}
            <div className="form-card">
              <h2 className="form-card-title">Payment</h2>
              <hr className="separator" />
              <div className="info-box">
                <span>💳</span>
                <div>
                  <p className="info-box-title">Secure Card Payment via Stripe</p>
                  <p className="text-muted text-xs">
                    You'll be redirected to Stripe's secure checkout to complete payment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Order Summary ── */}
          <div className="checkout-summary">
            <div className="summary-card sticky">
              <h2 className="summary-title">Order Summary</h2>
              <hr className="separator" />

              {/* CHECKOUT ITEMS
                   */}
              <div className="checkout-items">
                {cart.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <img src={item.image} alt={item.title} />
                    <div className="checkout-item-info">
                      <p className="checkout-item-title">{item.title}</p>
                      <p className="checkout-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <span className="checkout-item-price">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="separator" />

              {/* TOTALS
                 */}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
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

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                style={{ marginTop: "1.5rem" }}
              >
                Proceed to Payment
              </button>

              <div className="secure-note">
                🛡️ Secure checkout · Buyer protection included
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
