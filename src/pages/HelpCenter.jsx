// ============================================================
// HelpCenter.jsx
// src/pages/HelpCenter.jsx
// Route: /help
// ============================================================
// A comprehensive help center covering:
//   1. Buyer Protection
//   2. How Shipping Works
//   3. Fee Structure
//   4. How to Resolve Disputes
//   5. Returns & Refunds
//   6. FAQ
//
// Features:
//   - Sidebar navigation that highlights the active section
//   - Smooth scroll to each section when clicking sidebar links
//   - Live fee calculator so sellers can check their payout
//   - Search bar to filter FAQ questions
//   - Contact support button at the bottom
// ============================================================

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// ── Fee calculator — same logic as Sell.jsx ─────────────────
function calcFees(price, type) {
  if (!price || isNaN(price) || Number(price) <= 0) {
    return { fee: 0, youReceive: 0, transactionFee: 0, sellingFee: 0, orderTotal: 0, shipping: 0, tax: 0 };
  }
  const itemPrice  = Number(price);
  const shipping   = itemPrice > 500 ? 0 : 14.99;
  const tax        = itemPrice * 0.08;
  const orderTotal = itemPrice + shipping + tax;
  const rate       = type === "preferred" ? 0.0299 : 0.0319;
  const transactionFee = Math.min((orderTotal * rate) + 0.49, 500);
  const sellingFee     = Math.min(Math.max((itemPrice + shipping) * 0.05, 0.50), 500);
  const fee        = transactionFee + sellingFee;
  const youReceive = Math.max(itemPrice - fee, 0);
  return { fee, youReceive, transactionFee, sellingFee, orderTotal, shipping, tax };
}

// ── FAQ data ─────────────────────────────────────────────────
const FAQ = [
  {
    q: "Is it safe to buy on M.Poriums?",
    a: "Yes. Every purchase is covered by M.Poriums Buyer Protection. If an item doesn't arrive or isn't as described, we'll work with you to get a refund or replacement.",
  },
  {
    q: "How do I pay for an item?",
    a: "We accept all major credit and debit cards through our secure Stripe checkout. Your card details are never stored on our servers.",
  },
  {
    q: "Can I make an offer below the listed price?",
    a: "Yes — use the Make Offer button on any product page to send the seller a lower price. The seller can accept, decline, or counter your offer.",
  },
  {
    q: "How long does shipping take?",
    a: "Shipping times vary by seller. Most sellers ship within 1–3 business days. You'll receive tracking information by email once your item ships.",
  },
  {
    q: "What if my item arrives damaged?",
    a: "Take photos immediately and contact us within 3 days of delivery. We'll review your case and arrange a refund or replacement under our Buyer Protection policy.",
  },
  {
    q: "How do I list an item for sale?",
    a: "Click Sell in the navbar, fill in the title, price, photos, category, and condition, then click Publish Listing. Your item goes live immediately.",
  },
  {
    q: "When do I get paid after a sale?",
    a: "Funds are released to your account within 2 business days of the buyer confirming delivery. You can withdraw to your bank at any time.",
  },
  {
    q: "What is a Preferred Seller?",
    a: "Preferred Sellers are verified, high-reputation sellers who receive a lower transaction fee (2.99% vs 3.19%) and a badge on their profile that increases buyer trust.",
  },
  {
    q: "How do I cancel an order?",
    a: "Contact the seller directly through the messaging system as soon as possible. If the item hasn't shipped yet, most sellers will cancel without issue. Once shipped, you'll need to wait for delivery and then request a return.",
  },
  {
    q: "Is my personal information safe?",
    a: "Yes. We never sell your personal data to third parties. Payment information is handled entirely by Stripe and never touches our servers.",
  },
  {
    q: "How do I become a verified seller?",
    a: "Verification is based on transaction history, response rate, and customer ratings. Sellers with 10+ completed sales and a 4.5+ rating are eligible to apply.",
  },
];

// ── Sections for sidebar navigation ─────────────────────────
const SECTIONS = [
  { id: "buyer-protection", label: "Buyer Protection",    icon: "🛡️" },
  { id: "shipping",         label: "Shipping",            icon: "📦" },
  { id: "fees",             label: "Fees & Pricing",      icon: "💰" },
  { id: "disputes",         label: "Disputes & Returns",  icon: "⚖️" },
  { id: "faq",              label: "FAQ",                 icon: "❓" },
  { id: "contact",          label: "Contact Support",     icon: "💬" },
];

const FEE_HEADERS = ["Fee type", "Standard Seller", "Preferred Seller", "Max"];

function HelpCenter() {
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("buyer-protection");
  const [faqSearch, setFaqSearch]         = useState("");
  const [openFaq, setOpenFaq]             = useState(null);

  // Fee calculator state
  const [calcPrice, setCalcPrice]       = useState("");
  const [calcType, setCalcType]         = useState("standard");
  const fees = calcFees(calcPrice, calcType);

  useEffect(() => {
    const hash = location.hash.replace("#", "");

    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("buyer-protection");
      return;
    }

    const targetId = hash === "returns" ? "disputes" : hash;
    const el = document.getElementById(targetId);

    if (el) {
      setActiveSection(targetId);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname, location.hash]);

  // Scroll to a section and update active state
  function scrollTo(id) {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Filter FAQ by search
  const filteredFaq = FAQ.filter(
    (item) =>
      faqSearch === "" ||
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // ── Shared section heading style ─────────────────────────
  const sectionStyle = {
    scrollMarginTop: "80px",
    marginBottom: "3rem",
  };

  const headingStyle = {
    fontFamily: "var(--font-display)",
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  };

  const cardStyle = {
    background: "var(--card)",
    border: "0.5px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1.25rem",
    marginBottom: "1rem",
  };

  return (
    <main className="page-main" style={{ paddingTop: "64px" }}>
      <div className="container">

        {/* ── PAGE HEADER ── */}
        <div className="help-header" style={{ textAlign: "center", marginBottom: "3rem", paddingTop: "2rem" }}>
          <h1 className="page-title" style={{ marginBottom: "0.5rem" }}>
            Help Center
          </h1>
          <p className="text-muted" style={{ fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>
            Everything you need to know about buying and selling on M.Poriums.
          </p>
        </div>

        <div className="help-layout">

          {/* ── SIDEBAR NAVIGATION ── */}
          <aside className="help-sidebar" style={{
            position: "sticky",
            top: "80px",
          }}>
            <div className="help-sidebar-card" style={{
              background: "var(--card)",
              border: "0.5px solid var(--border)",
              borderRadius: "var(--radius)",
            }}>
              {SECTIONS.map((section, i) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "none",
                    borderBottom: i < SECTIONS.length - 1 ? "0.5px solid var(--border)" : "none",
                    background: activeSection === section.id ? "var(--muted)" : "transparent",
                    borderLeft: activeSection === section.id ? "3px solid var(--primary)" : "3px solid transparent",
                    color: activeSection === section.id ? "var(--primary)" : "var(--foreground)",
                    fontWeight: activeSection === section.id ? 600 : 400,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="help-content">

            {/* ════════════════════════════════════════════════
                SECTION 1 — BUYER PROTECTION
                ════════════════════════════════════════════════ */}
            <section id="buyer-protection" style={sectionStyle}>
              <h2 style={headingStyle}>🛡️ Buyer Protection</h2>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                Every purchase on M.Poriums is covered by our Buyer Protection policy. Shop with confidence knowing we have your back.
              </p>

              {/* Protection cards */}
              {[
                {
                  title: "Item not received",
                  desc: "If your item doesn't arrive within 7 days of the estimated delivery date, contact us and we'll investigate. If the item can't be located, you'll receive a full refund.",
                  icon: "📭",
                },
                {
                  title: "Item not as described",
                  desc: "If the item is significantly different from the listing description — wrong condition, missing parts, or undisclosed damage — you're entitled to a full refund. Contact us within 3 days of delivery.",
                  icon: "🔍",
                },
                {
                  title: "Secure payments",
                  desc: "All payments are processed through Stripe. Your card details are never stored on our servers. We use bank-level encryption on every transaction.",
                  icon: "🔒",
                },
                {
                  title: "Verified sellers",
                  desc: "Preferred Sellers have been verified by M.Poriums and have a proven track record of successful transactions. Look for the shield badge on seller profiles.",
                  icon: "✅",
                },
              ].map((item) => (
                <div key={item.title} style={cardStyle}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <h3 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.3rem" }}>
                        {item.title}
                      </h3>
                      <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* How to file a claim */}
              <div style={{
                ...cardStyle,
                background: "var(--muted)",
                border: "1.5px solid var(--primary)",
              }}>
                <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>How to file a claim</h3>
                {[
                  "Go to your Order History and find the affected order",
                  "Click Report a Problem and describe the issue",
                  "Attach photos if the item arrived damaged or differs from the listing",
                  "Our team reviews within 24 hours and contacts both buyer and seller",
                  "Refunds are processed within 3–5 business days if the claim is approved",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem", alignItems: "flex-start" }}>
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: "var(--primary)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ════════════════════════════════════════════════
                SECTION 2 — SHIPPING
                ════════════════════════════════════════════════ */}
            <section id="shipping" style={sectionStyle}>
              <h2 style={headingStyle}>📦 Shipping</h2>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                Shipping on M.Poriums is handled directly between buyers and sellers. Here's how it works.
              </p>

              {/* Shipping options */}
              <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Shipping options</h3>
              <div className="help-card-grid" style={{ marginBottom: "1.5rem" }}>
                {[
                  { title: "Free shipping", desc: "Orders over $500 automatically qualify for free shipping. Look for the Free Shipping badge on qualifying listings.", icon: "🎁" },
                  { title: "Flat rate shipping", desc: "Orders under $500 have a flat rate of $14.99. The seller packs and ships within 1–3 business days.", icon: "📮" },
                  { title: "Seller-set rates", desc: "Some sellers set custom shipping rates, especially for large or heavy items like studio monitors and pianos.", icon: "⚖️" },
                ].map((item) => (
                  <div key={item.title} style={cardStyle}>
                    <div style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>{item.icon}</div>
                    <h4 style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.25rem" }}>{item.title}</h4>
                    <p className="text-muted text-sm" style={{ lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Packing tips */}
              <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Seller packing guidelines</h3>
              <div style={cardStyle}>
                <p className="text-muted text-sm" style={{ marginBottom: "0.75rem" }}>
                  To avoid damage claims and disputes, sellers should follow these packing guidelines:
                </p>
                {[
                  "Use the original box if available — it's designed for the item",
                  "Double-box fragile items like tube amps and vintage equipment",
                  "Wrap all items in at least 2 inches of bubble wrap",
                  "Fill empty space with packing peanuts or crumpled paper",
                  "Include a packing slip with the order details inside the box",
                  "Take photos of the packed item before sealing and shipping",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem" }}>
                    <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ════════════════════════════════════════════════
                SECTION 3 — FEES
                ════════════════════════════════════════════════ */}
            <section id="fees" style={sectionStyle}>
              <h2 style={headingStyle}>💰 Fees & Pricing</h2>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                M.Poriums charges sellers a fee on each completed sale. Listing is always free.
              </p>

              {/* Fee table */}
              <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Selling fee structure</h3>
              <div className="help-table-wrap" style={{ ...cardStyle, padding: 0, marginBottom: "1.5rem" }}>
                <table className="help-fee-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ background: "var(--muted)" }}>
                      {FEE_HEADERS.map((h) => (
                        <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, borderBottom: "0.5px solid var(--border)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Transaction fee", "3.19% + $0.49", "2.99% + $0.49", "$500"],
                      ["Selling fee", "3% of item price", "3% of item price", "$500"],
                      ["Listing fee", "Free", "Free", "—"],
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: i < 2 ? "0.5px solid var(--border)" : "none" }}>
                        {row.map((cell, j) => (
                          <td key={j} data-label={FEE_HEADERS[j]} style={{ padding: "0.75rem 1rem", color: j === 0 ? "var(--foreground)" : "var(--muted-foreground)" }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-muted text-xs" style={{ marginBottom: "1.5rem" }}>
                Transaction fee is calculated on the full order total including shipping and applicable sales tax. Selling fee is calculated on item price + shipping only.
              </p>

              {/* Live fee calculator */}
              <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Fee calculator</h3>
              <div style={{ ...cardStyle, background: "var(--muted)" }}>
                <p className="text-muted text-sm" style={{ marginBottom: "1rem" }}>
                  Enter a price to see your estimated payout.
                </p>

                <div className="help-fee-controls" style={{ marginBottom: "1rem" }}>
                  {/* Price input */}
                  <div className="help-field">
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.35rem" }}>
                      Listing price ($)
                    </label>
                    <div className="price-input-wrap">
                      <span className="price-symbol">$</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={calcPrice}
                        onChange={(e) => setCalcPrice(e.target.value)}
                        style={{ fontSize: "0.9rem" }}
                      />
                    </div>
                  </div>

                  {/* Seller type */}
                  <div className="help-field">
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.35rem" }}>
                      Seller type
                    </label>
                    <select
                      value={calcType}
                      onChange={(e) => setCalcType(e.target.value)}
                      className="select-control"
                      style={{ width: "100%" }}
                    >
                      <option value="standard">Standard Seller</option>
                      <option value="preferred">Preferred Seller</option>
                    </select>
                  </div>
                </div>

                {/* Results */}
                {calcPrice && Number(calcPrice) > 0 && (
                  <div style={{
                    background: "var(--card)",
                    border: "0.5px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "1rem",
                  }}>
                    {[
                      { label: "Item price",        value: `$${Number(calcPrice).toLocaleString()}` },
                      { label: "Est. shipping",     value: fees.shipping === 0 ? "Free" : `$${fees.shipping.toFixed(2)}` },
                      { label: "Est. tax (8%)",     value: `$${fees.tax.toFixed(2)}` },
                      { label: "Order total",       value: `$${fees.orderTotal.toFixed(2)}`, bold: true },
                      { label: "Transaction fee",   value: `-$${fees.transactionFee.toFixed(2)}`, red: true },
                      { label: "Selling fee (3%)",  value: `-$${fees.sellingFee.toFixed(2)}`, red: true },
                    ].map((row) => (
                      <div key={row.label} style={{
                        display: "flex", justifyContent: "space-between",
                        padding: "0.2rem 0",
                        fontSize: "0.85rem",
                        fontWeight: row.bold ? 600 : 400,
                        color: row.red ? "var(--destructive)" : "var(--muted-foreground)",
                        borderTop: row.bold ? "0.5px solid var(--border)" : "none",
                        paddingTop: row.bold ? "0.5rem" : "0.2rem",
                        marginTop: row.bold ? "0.25rem" : 0,
                      }}>
                        <span style={{ color: row.bold ? "var(--foreground)" : undefined }}>{row.label}</span>
                        <span>{row.value}</span>
                      </div>
                    ))}
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "0.5px solid var(--border)",
                      paddingTop: "0.75rem", marginTop: "0.5rem",
                    }}>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>You receive</span>
                      <span style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--primary)" }}>
                        ${fees.youReceive.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-muted text-xs" style={{ marginTop: "0.5rem" }}>
                      Estimate only. Final fees confirmed at checkout.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ════════════════════════════════════════════════
                SECTION 4 — DISPUTES & RETURNS
                ════════════════════════════════════════════════ */}
            <section id="disputes" style={sectionStyle}>
              <div id="returns" style={{ position: "relative", top: "-80px" }} aria-hidden="true" />
              <h2 style={headingStyle}>⚖️ Disputes & Returns</h2>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                We aim to resolve all disputes fairly and quickly for both buyers and sellers.
              </p>

              {/* Return policy */}
              <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Return policy</h3>
              <div style={cardStyle}>
                <div className="help-policy-grid">
                  {[
                    { label: "Return window", value: "3 days from delivery" },
                    { label: "Condition required", value: "Original condition, unmodified" },
                    { label: "Who pays return shipping", value: "Seller (if item not as described)" },
                    { label: "Refund processing time", value: "3–5 business days" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-muted text-xs" style={{ marginBottom: "0.15rem" }}>{item.label}</p>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispute resolution steps */}
              <h3 style={{ fontWeight: 600, margin: "1.5rem 0 0.75rem" }}>How disputes are resolved</h3>
              {[
                {
                  step: "1. Contact the seller first",
                  desc: "Most issues are resolved quickly when the buyer and seller communicate directly. Use the messaging system to explain the problem and give the seller 24 hours to respond.",
                },
                {
                  step: "2. Open a dispute",
                  desc: "If the seller doesn't respond or you can't reach an agreement, open a dispute from your Order History within 3 days of delivery. Include photos and a clear description.",
                },
                {
                  step: "3. M.Poriums reviews",
                  desc: "Our team reviews all evidence submitted by both parties within 24 hours. We may ask for additional photos, messages, or documentation.",
                },
                {
                  step: "4. Resolution",
                  desc: "We'll issue a decision based on the evidence. If the buyer is entitled to a refund, it's processed within 3–5 business days. Sellers found at fault may have their account reviewed.",
                },
              ].map((item, i) => (
                <div key={i} style={{ ...cardStyle, borderLeft: "3px solid var(--primary)" }}>
                  <h4 style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.35rem", color: "var(--primary)" }}>
                    {item.step}
                  </h4>
                  <p className="text-muted text-sm" style={{ lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </section>

            {/* ════════════════════════════════════════════════
                SECTION 5 — FAQ
                ════════════════════════════════════════════════ */}
            <section id="faq" style={sectionStyle}>
              <h2 style={headingStyle}>❓ Frequently Asked Questions</h2>

              {/* Search */}
              <div className="help-search" style={{ position: "relative", marginBottom: "1.5rem" }}>
                <svg style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>

              {/* FAQ accordion */}
              {filteredFaq.length === 0 ? (
                <p className="text-muted" style={{ textAlign: "center", padding: "2rem 0" }}>
                  No questions match your search.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {filteredFaq.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        ...cardStyle,
                        marginBottom: 0,
                        cursor: "pointer",
                        borderColor: openFaq === i ? "var(--primary)" : "var(--border)",
                      }}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <div className="help-faq-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                        <p className="help-faq-question" style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0 }}>
                          {item.q}
                        </p>
                        <span style={{
                          flexShrink: 0,
                          color: "var(--muted-foreground)",
                          transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                          fontSize: "0.8rem",
                        }}>
                          ▼
                        </span>
                      </div>
                      {openFaq === i && (
                        <p className="text-muted text-sm" style={{ marginTop: "0.75rem", lineHeight: 1.6, margin: "0.75rem 0 0" }}>
                          {item.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ════════════════════════════════════════════════
                SECTION 6 — CONTACT SUPPORT
                ════════════════════════════════════════════════ */}
            <section id="contact" style={sectionStyle}>
              <h2 style={headingStyle}>💬 Contact Support</h2>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                Can't find what you're looking for? Our team is here to help.
              </p>

              <div className="help-contact-grid" style={{ marginBottom: "2rem" }}>
                {[
                  { title: "Messaging", desc: "Message a seller directly through any product listing or your inbox.", icon: "💬", action: "Go to Inbox", link: "/messages" },
                  { title: "Help articles", desc: "Browse our full library of guides and how-to articles.", icon: "📖", action: "Browse articles", link: "/help" },
                  { title: "Report a problem", desc: "Have an issue with an order? Open a dispute from your order history.", icon: "🚨", action: "Order history", link: "/orders" },
                  { title: "Email support", desc: "Reach our support team at support@mporiums.com. We respond within 24 hours.", icon: "📧", action: "Send email", link: "mailto:support@mporiums.com" },
                ].map((item) => (
                  <div key={item.title} style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                    <h4 style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.3rem" }}>{item.title}</h4>
                    <p className="text-muted text-sm" style={{ lineHeight: 1.5, marginBottom: "0.75rem" }}>{item.desc}</p>
                    {item.link.startsWith("mailto") ? (
                      <a href={item.link} className="link-primary" style={{ fontSize: "0.85rem", marginTop: "auto" }}>{item.action} →</a>
                    ) : (
                      <Link to={item.link} className="link-primary" style={{ fontSize: "0.85rem", marginTop: "auto" }}>{item.action} →</Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Response time notice */}
              <div style={{
                ...cardStyle,
                background: "var(--muted)",
                textAlign: "center",
                padding: "2rem",
              }}>
                <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Average response time</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--primary)", margin: "0.25rem 0" }}>
                  Under 24 hours
                </p>
                <p className="text-muted text-sm">
                  Monday – Friday, 9am – 6pm EST
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}

export default HelpCenter;
