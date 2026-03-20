// ============================================================
// Deals.jsx
// src/pages/Deals.jsx
// Route: /deals
// ============================================================
// Shows listings with price drops, limited-time offers,
// and featured deals. Navbar "Deals" link points here.
//
// Sections:
//   - Hero banner with deal countdown timer
//   - Featured deal of the day
//   - Price drop listings (sorted by biggest saving)
//   - Filter by category and discount percentage
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

// ── Seed deals data ──────────────────────────────────────────
// In production: GET /api/deals — listings where price was recently reduced
// For now we add originalPrice and discountPct to existing products
const DEALS = [
  { ...products[0], originalPrice: 1750, discountPct: 17, dealTag: "Price Drop",    endsIn: 48 },
  { ...products[1], originalPrice: 3200, discountPct: 13, dealTag: "Deal of Day",   endsIn: 24 },
  { ...products[2], originalPrice: 380,  discountPct: 26, dealTag: "Flash Sale",    endsIn: 6  },
  { ...products[3], originalPrice: 650,  discountPct: 20, dealTag: "Price Drop",    endsIn: 72 },
  { ...products[4], originalPrice: 420,  discountPct: 19, dealTag: "Weekend Deal",  endsIn: 36 },
  { ...products[5], originalPrice: 2100, discountPct: 24, dealTag: "Price Drop",    endsIn: 12 },
];

const CATEGORIES = ["All", "Guitars & Basses", "Synthesizers", "Headphones", "Speakers & Monitors", "Microphones", "DJ Equipment"];
const DISCOUNTS  = ["All", "10%+", "15%+", "20%+", "25%+"];

// ── Countdown timer hook ─────────────────────────────────────
function useCountdown(hours) {
  const endTime = Date.now() + hours * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, endTime - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(timeLeft / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  return { h, m, s };
}

// ── Timer display component ──────────────────────────────────
function CountdownTimer({ hours, label }) {
  const { h, m, s } = useCountdown(hours);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{label}</span>
      {[h, m, s].map((unit, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span style={{
            background: "var(--primary)", color: "#fff",
            borderRadius: "4px", padding: "2px 6px",
            fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.875rem",
          }}>
            {pad(unit)}
          </span>
          {i < 2 && <span style={{ color: "var(--primary)", fontWeight: 700 }}>:</span>}
        </span>
      ))}
    </div>
  );
}

function Deals() {

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDiscount, setSelectedDiscount] = useState("All");
  const [sortBy, setSortBy] = useState("biggest");

  // Filter and sort
  const filtered = DEALS
    .filter((d) => selectedCategory === "All" || d.category === selectedCategory)
    .filter((d) => {
      if (selectedDiscount === "All") return true;
      const min = parseInt(selectedDiscount);
      return d.discountPct >= min;
    })
    .sort((a, b) => {
      if (sortBy === "biggest")  return b.discountPct - a.discountPct;
      if (sortBy === "ending")   return a.endsIn - b.endsIn;
      if (sortBy === "price-asc") return a.price - b.price;
      return b.price - a.price;
    });

  // Deal of the day — biggest discount
  const dealOfDay = DEALS.reduce((best, d) => d.discountPct > best.discountPct ? d : best, DEALS[0]);

  const statStyle = {
    background: "var(--card)",
    border: "0.5px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1rem",
    textAlign: "center",
    flex: 1,
  };

  return (
    <main className="page-main" style={{ paddingTop: "64px" }}>

      {/* ── HERO BANNER ── */}
      <section style={{
        background: "linear-gradient(135deg, var(--primary) 0%, hsl(0,60%,35%) 100%)",
        color: "#fff",
        padding: "3rem 0",
        marginBottom: "2rem",
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{
            background: "rgba(255,255,255,0.2)", borderRadius: "20px",
            padding: "0.3rem 1rem", fontSize: "0.8rem", fontWeight: 600,
            letterSpacing: "0.05em", marginBottom: "1rem", display: "inline-block",
          }}>
            LIMITED TIME OFFERS
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "2.5rem",
            fontWeight: 700, margin: "0.5rem 0",
          }}>
            Deals & Price Drops
          </h1>
          <p style={{ opacity: 0.85, fontSize: "1.05rem", marginBottom: "1.5rem" }}>
            Verified price reductions on gear from trusted sellers
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { value: `${DEALS.length}`, label: "Active deals" },
              { value: `${Math.max(...DEALS.map(d => d.discountPct))}%`, label: "Max discount" },
              { value: `$${Math.min(...DEALS.map(d => d.price)).toLocaleString()}`, label: "Lowest price" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">

        {/* ── DEAL OF THE DAY ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h2 className="section-title" style={{ margin: 0 }}>🔥 Deal of the Day</h2>
            <CountdownTimer hours={dealOfDay.endsIn} label="Ends in:" />
          </div>

          <Link to={`/product/${dealOfDay.id}`} style={{ textDecoration: "none" }}>
            <div className="deal-of-day-card" style={{
              display: "grid", gridTemplateColumns: "280px 1fr",
              background: "var(--card)", border: "1.5px solid var(--primary)",
              borderRadius: "var(--radius)", overflow: "hidden",
              transition: "box-shadow 0.2s",
            }}>
              {/* Image */}
              <div style={{ position: "relative", background: "var(--muted)" }}>
                <img
                  src={dealOfDay.images[0]}
                  alt={dealOfDay.title}
                  style={{ width: "100%", height: "220px", objectFit: "cover" }}
                />
                <span style={{
                  position: "absolute", top: "0.75rem", left: "0.75rem",
                  background: "var(--primary)", color: "#fff",
                  fontSize: "0.8rem", fontWeight: 700,
                  padding: "0.25rem 0.75rem", borderRadius: "20px",
                }}>
                  {dealOfDay.discountPct}% OFF
                </span>
              </div>

              {/* Info */}
              <div className="deal-of-day-info" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                  {dealOfDay.category}
                </p>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                  {dealOfDay.title}
                </h3>
                <p className="text-muted text-sm" style={{ marginBottom: "1rem", lineHeight: 1.6 }}>
                  {dealOfDay.description}
                </p>
                <div className="deal-of-day-price-row" style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                    ${dealOfDay.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: "1rem", color: "var(--muted-foreground)", textDecoration: "line-through" }}>
                    ${dealOfDay.originalPrice.toLocaleString()}
                  </span>
                  <span style={{
                    background: "#EAF3DE", color: "#3B6D11",
                    fontSize: "0.8rem", fontWeight: 600,
                    padding: "2px 8px", borderRadius: "20px",
                  }}>
                    Save ${(dealOfDay.originalPrice - dealOfDay.price).toLocaleString()}
                  </span>
                </div>
                <div className="deal-of-day-seller-row" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    width: "1.75rem", height: "1.75rem", borderRadius: "50%",
                    background: "var(--secondary)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 700, color: "var(--muted-foreground)",
                  }}>
                    {dealOfDay.sellerAvatar}
                  </div>
                  <span className="text-muted text-sm">{dealOfDay.seller}</span>
                  {dealOfDay.verified && (
                    <img src="/icons/shield.svg" alt="Verified" style={{ width: "1rem", height: "1rem" }} />
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ── FILTERS ── */}
        <div style={{
          display: "flex", gap: "1.5rem", flexWrap: "wrap",
          alignItems: "flex-start", marginBottom: "1.5rem",
        }}>
          {/* Category */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--muted-foreground)", marginBottom: "0.4rem" }}>
              CATEGORY
            </p>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`filter-btn${selectedCategory === c ? " active" : ""}`}
                  onClick={() => setSelectedCategory(c)}
                  style={{ fontSize: "0.8rem" }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Discount */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--muted-foreground)", marginBottom: "0.4rem" }}>
              MIN DISCOUNT
            </p>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {DISCOUNTS.map((d) => (
                <button
                  key={d}
                  className={`filter-btn${selectedDiscount === d ? " active" : ""}`}
                  onClick={() => setSelectedDiscount(d)}
                  style={{ fontSize: "0.8rem" }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div style={{ marginLeft: "auto" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--muted-foreground)", marginBottom: "0.4rem" }}>
              SORT BY
            </p>
            <select
              className="select-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="biggest">Biggest Discount</option>
              <option value="ending">Ending Soonest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ── DEALS GRID ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <h2 className="section-title" style={{ margin: 0 }}>All Deals</h2>
          <span className="text-muted text-sm">({filtered.length} listings)</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No deals match your filters</p>
            <button className="btn btn-outline" onClick={() => { setSelectedCategory("All"); setSelectedDiscount("All"); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
            {filtered.map((deal) => (
              <Link
                key={deal.id}
                to={`/product/${deal.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="deal-row-card" style={{
                  display: "flex", gap: "1rem", alignItems: "center",
                  background: "var(--card)", border: "0.5px solid var(--border)",
                  borderRadius: "var(--radius)", padding: "1rem",
                  transition: "border-color 0.15s",
                  flexWrap: "wrap",
                }}>
                  {/* Image */}
                  <div className="deal-row-image" style={{
                    width: "80px", height: "80px", borderRadius: "8px",
                    overflow: "hidden", flexShrink: 0, background: "var(--muted)",
                    position: "relative",
                  }}>
                    <img src={deal.images[0]} alt={deal.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span style={{
                      position: "absolute", bottom: "2px", left: "2px",
                      background: "var(--primary)", color: "#fff",
                      fontSize: "0.6rem", fontWeight: 700,
                      padding: "1px 5px", borderRadius: "3px",
                    }}>
                      -{deal.discountPct}%
                    </span>
                  </div>

                  {/* Info */}
                  <div className="deal-row-info" style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 600,
                        background: deal.dealTag === "Flash Sale" ? "#FCEBEB" : deal.dealTag === "Deal of Day" ? "#FAEEDA" : "#EAF3DE",
                        color: deal.dealTag === "Flash Sale" ? "#A32D2D" : deal.dealTag === "Deal of Day" ? "#633806" : "#3B6D11",
                        padding: "1px 7px", borderRadius: "20px",
                      }}>
                        {deal.dealTag}
                      </span>
                      <span className="text-muted text-xs">{deal.category}</span>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: "0 0 0.25rem", color: "var(--foreground)" }}>
                      {deal.title}
                    </p>
                    <p className="text-muted text-xs">by {deal.seller}</p>
                  </div>

                  {/* Price */}
                  <div className="deal-row-price" style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)" }}>
                      ${deal.price.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "line-through" }}>
                      ${deal.originalPrice.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#3B6D11", fontWeight: 500 }}>
                      Save ${(deal.originalPrice - deal.price).toLocaleString()}
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="deal-row-timer" style={{ flexShrink: 0 }}>
                    <CountdownTimer hours={deal.endsIn} label="Ends:" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Deals;
