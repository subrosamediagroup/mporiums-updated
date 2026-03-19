// ============================================================
// SellerDashboard.jsx
// src/pages/SellerDashboard.jsx
// Route: /dashboard
// ============================================================
// Analytics page for sellers showing:
//   - Revenue, sales, views, and conversion stats
//   - Revenue chart over time
//   - Top performing listings
//   - Recent orders to fulfill
//   - Payout history
//
// In production: GET /api/sellers/me/dashboard
// ============================================================

import { useState } from "react";
import { Link } from "react-router-dom";

// ── Seed dashboard data ──────────────────────────────────────
const STATS = {
  totalRevenue:    4892.50,
  revenueTrend:    12,
  totalSales:      9,
  salesTrend:      3,
  totalViews:      1847,
  viewsTrend:      22,
  conversionRate:  0.49,
  conversionTrend: 0.08,
  avgSalePrice:    543.61,
  pendingPayout:   317.39,
};

const MONTHLY_REVENUE = [
  { month: "Oct", revenue: 280  },
  { month: "Nov", revenue: 840  },
  { month: "Dec", revenue: 1200 },
  { month: "Jan", revenue: 650  },
  { month: "Feb", revenue: 920  },
  { month: "Mar", revenue: 1003 },
];

const TOP_LISTINGS = [
  { id: "1", title: "Fender Stratocaster '62 Reissue", price: 1450, views: 342, saves: 28, image: "/images/fender-stratocaster.jpg", status: "active"  },
  { id: "4", title: "Yamaha HS8 Studio Monitors (Pair)", price: 520, views: 218, saves: 19, image: "/images/yamaha-hs8.jpg",          status: "active"  },
  { id: "5", title: "Shure SM7B Microphone",             price: 340, views: 187, saves: 14, image: "/images/shure-sm7b.jpg",           status: "active"  },
];

const RECENT_ORDERS = [
  { id: "ORD-10042", buyer: "Marcus T.", item: "Sennheiser HD 650", price: 280, status: "awaiting_shipment", date: "2024-03-10" },
  { id: "ORD-10038", buyer: "Leo P.",    item: "Shure SM7B",        price: 340, status: "shipped",           date: "2024-02-28" },
  { id: "ORD-10021", buyer: "Sarah K.",  item: "Fender Strat",      price: 1450, status: "delivered",        date: "2024-02-10" },
];

const PAYOUTS = [
  { date: "2024-03-01", amount: 312.50, status: "paid",    orderId: "ORD-10038" },
  { date: "2024-02-15", amount: 498.20, status: "paid",    orderId: "ORD-10021" },
  { date: "2024-03-10", amount: 317.39, status: "pending", orderId: "ORD-10042" },
];

const ORDER_STATUS = {
  awaiting_shipment: { label: "Awaiting Shipment", bg: "#FAEEDA", color: "#633806" },
  shipped:           { label: "Shipped",           bg: "var(--muted)", color: "var(--primary)" },
  delivered:         { label: "Delivered",         bg: "#EAF3DE",  color: "#3B6D11" },
};

// ── Mini bar chart ────────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "120px", padding: "0 0.5rem" }}>
      {data.map((d) => (
        <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{
              width: "100%",
              height: `${(d.revenue / max) * 100}%`,
              background: "var(--primary)",
              borderRadius: "4px 4px 0 0",
              minHeight: "4px",
              opacity: 0.85,
              transition: "height 0.4s ease",
            }} />
          </div>
          <span style={{ fontSize: "0.65rem", color: "var(--muted-foreground)" }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SellerDashboard() {

  const [activeTab, setActiveTab] = useState("overview");

  const statCards = [
    { label: "Total Revenue",   value: `$${STATS.totalRevenue.toLocaleString()}`,     trend: `+${STATS.revenueTrend}%`,    up: true  },
    { label: "Total Sales",     value: STATS.totalSales,                               trend: `+${STATS.salesTrend} this month`, up: true },
    { label: "Listing Views",   value: STATS.totalViews.toLocaleString(),             trend: `+${STATS.viewsTrend}%`,      up: true  },
    { label: "Conversion Rate", value: `${STATS.conversionRate}%`,                    trend: `+${STATS.conversionTrend}%`, up: true  },
  ];

  return (
    <main className="page-main" style={{ paddingTop: "64px" }}>
      <div className="container">

        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: "0.25rem" }}>Seller Dashboard</h1>
            <p className="text-muted">Your sales performance at a glance</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link to="/sell" className="btn btn-primary btn-sm">+ New Listing</Link>
            <Link to="/my-listings" className="btn btn-outline btn-sm">My Listings</Link>
          </div>
        </div>

        {/* ── PAYOUT ALERT ── */}
        {STATS.pendingPayout > 0 && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "#EAF3DE", border: "0.5px solid #3B6D11",
            borderRadius: "var(--radius)", padding: "0.875rem 1.25rem",
            marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <img src="/icons/dollar-sign.svg" alt="Payout" style={{ width: "1.25rem", height: "1.25rem" }} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#3B6D11" }}>
                ${STATS.pendingPayout.toFixed(2)} pending payout
              </span>
              <span style={{ fontSize: "0.8rem", color: "#3B6D11" }}>· Available in 2 business days</span>
            </div>
            <button className="btn btn-sm" style={{ background: "#3B6D11", color: "#fff", border: "none" }}>
              Request Payout
            </button>
          </div>
        )}

        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {statCards.map((stat) => (
            <div key={stat.label} style={{
              background: "var(--card)", border: "0.5px solid var(--border)",
              borderRadius: "var(--radius)", padding: "1.25rem",
            }}>
              <p className="text-muted text-xs" style={{ marginBottom: "0.5rem" }}>{stat.label}</p>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                {stat.value}
              </div>
              <span style={{ fontSize: "0.75rem", color: stat.up ? "#3B6D11" : "#A32D2D", fontWeight: 500 }}>
                {stat.up ? "↑" : "↓"} {stat.trend}
              </span>
              <span className="text-muted text-xs"> vs last month</span>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
          {[
            { key: "overview", label: "Overview"      },
            { key: "orders",   label: "Recent Orders" },
            { key: "payouts",  label: "Payouts"       },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "0.6rem 1.25rem", border: "none",
                borderBottom: activeTab === tab.key ? "2px solid var(--primary)" : "2px solid transparent",
                background: "transparent",
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? "var(--primary)" : "var(--muted-foreground)",
                cursor: "pointer", fontSize: "0.875rem", transition: "color 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════
            OVERVIEW TAB
            ════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

            {/* Revenue chart */}
            <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: 600, fontSize: "0.95rem", margin: 0 }}>Monthly Revenue</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Last 6 months</span>
              </div>
              <BarChart data={MONTHLY_REVENUE} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "0.5px solid var(--border)" }}>
                <div>
                  <p className="text-muted text-xs">Total 6-month</p>
                  <p style={{ fontWeight: 700, color: "var(--primary)" }}>
                    ${MONTHLY_REVENUE.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="text-muted text-xs">Best month</p>
                  <p style={{ fontWeight: 700 }}>
                    {MONTHLY_REVENUE.reduce((b, d) => d.revenue > b.revenue ? d : b).month}
                  </p>
                </div>
              </div>
            </div>

            {/* Top listings */}
            <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: 600, fontSize: "0.95rem", margin: 0 }}>Top Listings</h3>
                <Link to="/my-listings" className="link-primary" style={{ fontSize: "0.8rem" }}>View all →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {TOP_LISTINGS.map((listing, i) => (
                  <div key={listing.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted-foreground)", minWidth: "16px" }}>
                      #{i + 1}
                    </span>
                    <div style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "var(--muted)" }}>
                      <img src={listing.image} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 500, fontSize: "0.8rem", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {listing.title}
                      </p>
                      <p className="text-muted text-xs">{listing.views} views · {listing.saves} saves</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", flexShrink: 0 }}>
                      ${listing.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem", gridColumn: "1 / -1" }}>
              <h3 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "1rem" }}>Performance Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
                {[
                  { label: "Avg sale price",    value: `$${STATS.avgSalePrice.toFixed(2)}` },
                  { label: "Response rate",     value: "98%"                                },
                  { label: "Avg response time", value: "< 2 hours"                         },
                  { label: "Seller rating",     value: "4.9 ⭐"                             },
                  { label: "Active listings",   value: TOP_LISTINGS.length                  },
                  { label: "Items sold",        value: STATS.totalSales                     },
                ].map((item) => (
                  <div key={item.label} style={{ background: "var(--muted)", borderRadius: "calc(var(--radius) - 4px)", padding: "0.875rem" }}>
                    <p className="text-muted text-xs" style={{ marginBottom: "0.25rem" }}>{item.label}</p>
                    <p style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            ORDERS TAB
            ════════════════════════════════════════════════ */}
        {activeTab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {RECENT_ORDERS.map((order) => {
              const status = ORDER_STATUS[order.status];
              return (
                <div key={order.id} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  background: "var(--card)", border: "0.5px solid var(--border)",
                  borderRadius: "var(--radius)", padding: "1rem",
                  flexWrap: "wrap",
                }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>{order.id}</span>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 600,
                        background: status.bg, color: status.color,
                        padding: "1px 7px", borderRadius: "20px",
                      }}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-muted text-xs">{order.item} · {order.buyer} · {formatDate(order.date)}</p>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>${order.price.toLocaleString()}</span>
                  {order.status === "awaiting_shipment" && (
                    <button className="btn btn-primary btn-sm">Mark as Shipped</button>
                  )}
                  <Link to="/messages" className="btn btn-outline btn-sm">Message Buyer</Link>
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            PAYOUTS TAB
            ════════════════════════════════════════════════ */}
        {activeTab === "payouts" && (
          <div>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {[
                { label: "Total paid out", value: `$${PAYOUTS.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0).toFixed(2)}` },
                { label: "Pending",        value: `$${PAYOUTS.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0).toFixed(2)}` },
              ].map((stat) => (
                <div key={stat.label} style={{
                  flex: 1, minWidth: "150px",
                  background: "var(--card)", border: "0.5px solid var(--border)",
                  borderRadius: "var(--radius)", padding: "1rem", textAlign: "center",
                }}>
                  <p className="text-muted text-xs" style={{ marginBottom: "0.25rem" }}>{stat.label}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)", margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {PAYOUTS.map((payout) => (
                <div key={payout.orderId} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "var(--card)", border: "0.5px solid var(--border)",
                  borderRadius: "var(--radius)", padding: "1rem",
                  flexWrap: "wrap", gap: "0.5rem",
                }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: "0 0 0.15rem" }}>{payout.orderId}</p>
                    <p className="text-muted text-xs">{formatDate(payout.date)}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>${payout.amount.toFixed(2)}</span>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 600,
                      background: payout.status === "paid" ? "#EAF3DE" : "#FAEEDA",
                      color: payout.status === "paid" ? "#3B6D11" : "#633806",
                      display: "inline-flex", alignItems: "center", gap: "0.25rem",
                      padding: "2px 8px", borderRadius: "20px",
                    }}>
                      <img
                        src={payout.status === "paid" ? "/icons/check-circle.svg" : "/icons/loader.svg"}
                        alt={payout.status === "paid" ? "Paid" : "Pending"}
                        style={{ width: "0.9rem", height: "0.9rem" }}
                      />
                      {payout.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default SellerDashboard;
