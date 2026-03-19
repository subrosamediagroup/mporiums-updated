// ============================================================
// OrderHistory.jsx
// src/pages/OrderHistory.jsx
// Route: /orders
// ============================================================
// Shows the logged-in user's past purchases with:
//   - Order status (Processing, Shipped, Delivered, Cancelled)
//   - Tracking information
//   - Order items, totals, and shipping address
//   - Links to leave a review for the seller
//   - Link to report a problem
//
// In production: GET /api/orders?userId=me
// ============================================================

import { useState } from "react";
import { Link } from "react-router-dom";

// ── Seed orders ──────────────────────────────────────────────
const SEED_ORDERS = [
  {
    id: "ORD-10042",
    date: "2024-03-10",
    status: "delivered",
    tracking: "1Z999AA10123456784",
    carrier: "UPS",
    items: [
      { productId: "3", title: "Sennheiser HD 650 Headphones", price: 280, qty: 1, image: "/images/sennheiser-hd650.jpg", seller: "AudioPhile99" },
    ],
    subtotal: 280,
    shipping: 14.99,
    tax: 22.40,
    total: 317.39,
    address: { name: "Test Buyer", street: "123 Main St", city: "Austin", state: "TX", zip: "78701" },
    reviewLeft: false,
  },
  {
    id: "ORD-10038",
    date: "2024-02-28",
    status: "delivered",
    tracking: "9400111899223397681209",
    carrier: "USPS",
    items: [
      { productId: "5", title: "Shure SM7B Microphone", price: 340, qty: 1, image: "/images/shure-sm7b.jpg", seller: "ProAudioDeals" },
    ],
    subtotal: 340,
    shipping: 0,
    tax: 27.20,
    total: 367.20,
    address: { name: "Test Buyer", street: "123 Main St", city: "Austin", state: "TX", zip: "78701" },
    reviewLeft: true,
  },
  {
    id: "ORD-10021",
    date: "2024-02-10",
    status: "shipped",
    tracking: "1Z999AA10123456785",
    carrier: "UPS",
    items: [
      { productId: "4", title: "Yamaha HS8 Studio Monitors (Pair)", price: 520, qty: 1, image: "/images/yamaha-hs8.jpg", seller: "StudioGear" },
    ],
    subtotal: 520,
    shipping: 0,
    tax: 41.60,
    total: 561.60,
    address: { name: "Test Buyer", street: "123 Main St", city: "Austin", state: "TX", zip: "78701" },
    reviewLeft: false,
  },
  {
    id: "ORD-10008",
    date: "2024-01-15",
    status: "cancelled",
    tracking: null,
    carrier: null,
    items: [
      { productId: "1", title: "Fender Stratocaster '62 Reissue", price: 1450, qty: 1, image: "/images/fender-stratocaster.jpg", seller: "VintageAxes" },
    ],
    subtotal: 1450,
    shipping: 0,
    tax: 116,
    total: 1566,
    address: { name: "Test Buyer", street: "123 Main St", city: "Austin", state: "TX", zip: "78701" },
    reviewLeft: false,
  },
];

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG = {
  processing: { label: "Processing", color: "#633806", bg: "#FAEEDA", icon: "/icons/loader.svg", steps: 1 },
  shipped:    { label: "Shipped",    color: "var(--primary)", bg: "var(--muted)", icon: "/icons/package.svg", steps: 2 },
  delivered:  { label: "Delivered",  color: "#3B6D11", bg: "#EAF3DE", icon: "/icons/check-circle.svg", steps: 3 },
  cancelled:  { label: "Cancelled",  color: "#A32D2D", bg: "#FCEBEB", icon: "/icons/x.svg", steps: 0 },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function OrderHistory() {

  const [filter, setFilter]       = useState("all");
  const [expanded, setExpanded]   = useState(null);
  const [orders, setOrders]       = useState(SEED_ORDERS);

  const filtered = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter);

  function markReviewed(orderId) {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, reviewLeft: true } : o));
  }

  return (
    <main className="page-main" style={{ paddingTop: "64px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 className="page-title">Order History</h1>
          <p className="text-muted">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
        </div>

        {/* ── FILTER TABS ── */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
          {[
            { key: "all",        label: `All (${orders.length})` },
            { key: "shipped",    label: "Shipped" },
            { key: "delivered",  label: "Delivered" },
            { key: "cancelled",  label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "0.6rem 1.25rem", border: "none",
                borderBottom: filter === tab.key ? "2px solid var(--primary)" : "2px solid transparent",
                background: "transparent",
                fontWeight: filter === tab.key ? 600 : 400,
                color: filter === tab.key ? "var(--primary)" : "var(--muted-foreground)",
                cursor: "pointer", fontSize: "0.875rem", transition: "color 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── EMPTY STATE ── */}
        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding: "3rem 0" }}>
            <div style={{ marginBottom: "1rem" }}>
              <img src="/icons/package.svg" alt="No orders" style={{ width: "2.5rem", height: "2.5rem", opacity: 0.8 }} />
            </div>
            <h2 className="empty-title">No orders found</h2>
            <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
              {filter === "all" ? "You haven't placed any orders yet." : `No ${filter} orders.`}
            </p>
            <Link to="/shop" className="btn btn-primary">Browse Gear</Link>
          </div>
        )}

        {/* ── ORDER CARDS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((order) => {
            const status  = STATUS_CONFIG[order.status];
            const isOpen  = expanded === order.id;

            return (
              <div key={order.id} style={{
                background: "var(--card)",
                border: `0.5px solid ${isOpen ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                overflow: "hidden",
              }}>

                {/* ── Order header ── */}
                <div
                  style={{ padding: "1rem", cursor: "pointer" }}
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{order.id}</span>
                        <span style={{
                          fontSize: "0.72rem", fontWeight: 600,
                          background: status.bg, color: status.color,
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          padding: "2px 8px", borderRadius: "20px",
                        }}>
                          <img src={status.icon} alt={status.label} style={{ width: "0.9rem", height: "0.9rem" }} />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-muted text-xs">{formatDate(order.date)}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: "1rem" }}>${order.total.toFixed(2)}</div>
                      <p className="text-muted text-xs">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  {/* Item preview */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "var(--muted)" }}>
                      <img src={order.items[0].image} alt={order.items[0].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 500, fontSize: "0.875rem", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {order.items[0].title}
                      </p>
                      <p className="text-muted text-xs">by {order.items[0].seller}</p>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
                  </div>
                </div>

                {/* ── Expanded detail ── */}
                {isOpen && (
                  <div style={{ borderTop: "0.5px solid var(--border)" }}>

                    {/* Progress tracker — only for non-cancelled */}
                    {order.status !== "cancelled" && (
                      <div style={{ padding: "1rem", background: "var(--muted)", borderBottom: "0.5px solid var(--border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                          {["Order Placed", "Shipped", "Delivered"].map((step, i) => {
                            const done = status.steps > i;
                            const active = status.steps === i + 1;
                            return (
                              <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                                  {i > 0 && <div style={{ flex: 1, height: "2px", background: done ? "var(--primary)" : "var(--border)" }} />}
                                  <div style={{
                                    width: "28px", height: "28px", borderRadius: "50%",
                                    background: done ? "var(--primary)" : "var(--card)",
                                    border: `2px solid ${done ? "var(--primary)" : "var(--border)"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "0.75rem", color: done ? "#fff" : "var(--muted-foreground)",
                                    fontWeight: 700, flexShrink: 0,
                                  }}>
                                    {done ? (
                                      <img src="/icons/check.svg" alt="Complete" style={{ width: "0.9rem", height: "0.9rem", filter: "brightness(0) invert(1)" }} />
                                    ) : i + 1}
                                  </div>
                                  {i < 2 && <div style={{ flex: 1, height: "2px", background: status.steps > i + 1 ? "var(--primary)" : "var(--border)" }} />}
                                </div>
                                <p style={{ fontSize: "0.7rem", marginTop: "0.35rem", color: done ? "var(--primary)" : "var(--muted-foreground)", fontWeight: done ? 600 : 400 }}>
                                  {step}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        {/* Tracking */}
                        {order.tracking && (
                          <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                            <span style={{ fontWeight: 500 }}>{order.carrier} tracking: </span>
                            <span style={{ fontFamily: "var(--font-mono)" }}>{order.tracking}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Items */}
                    <div style={{ padding: "1rem", borderBottom: "0.5px solid var(--border)" }}>
                      <h4 style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.75rem" }}>Items</h4>
                      {order.items.map((item) => (
                        <div key={item.productId} style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                            <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <Link to={`/product/${item.productId}`} style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--foreground)", textDecoration: "none" }}>
                              {item.title}
                            </Link>
                            <p className="text-muted text-xs">by {item.seller} · Qty: {item.qty}</p>
                          </div>
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>${item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order total */}
                    <div style={{ padding: "1rem", borderBottom: "0.5px solid var(--border)" }}>
                      <h4 style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.75rem" }}>Order Summary</h4>
                      {[
                        { label: "Subtotal",  value: `$${order.subtotal.toFixed(2)}` },
                        { label: "Shipping",  value: order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}` },
                        { label: "Tax",       value: `$${order.tax.toFixed(2)}` },
                      ].map((row) => (
                        <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                          <span>{row.label}</span><span>{row.value}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.95rem", borderTop: "0.5px solid var(--border)", paddingTop: "0.5rem", marginTop: "0.35rem" }}>
                        <span>Total</span><span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Shipping address */}
                    <div style={{ padding: "1rem", borderBottom: "0.5px solid var(--border)" }}>
                      <h4 style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem" }}>Shipped to</h4>
                      <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                        {order.address.name}<br />
                        {order.address.street}<br />
                        {order.address.city}, {order.address.state} {order.address.zip}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ padding: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      {order.status === "delivered" && !order.reviewLeft && (
                        <Link
                          to={`/seller/${order.items[0].seller}`}
                          className="btn btn-primary btn-sm"
                          onClick={() => markReviewed(order.id)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                        >
                          <img src="/icons/star.svg" alt="Review" style={{ width: "1rem", height: "1rem" }} />
                          Leave a Review
                        </Link>
                      )}
                      {order.status === "delivered" && order.reviewLeft && (
                        <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <img src="/icons/check-circle.svg" alt="Submitted" style={{ width: "1rem", height: "1rem" }} />
                          Review submitted
                        </span>
                      )}
                      {order.status !== "cancelled" && (
                        <Link to="/help#disputes" className="btn btn-outline btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                          <img src="/icons/info.svg" alt="Report" style={{ width: "1rem", height: "1rem" }} />
                          Report a Problem
                        </Link>
                      )}
                      <Link to={`/messages`} className="btn btn-outline btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                        <img src="/icons/message-square.svg" alt="Message" style={{ width: "1rem", height: "1rem" }} />
                        Message Seller
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default OrderHistory;
