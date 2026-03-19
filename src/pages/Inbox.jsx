// ============================================================
// Inbox.jsx
// src/pages/Inbox.jsx
// Route: /messages
// ============================================================
// Lists all of the user's conversations sorted by most recent.
// Each row shows:
//   - Seller avatar + name
//   - Product thumbnail + title
//   - Last message preview
//   - Time since last message
//   - Unread badge if there are unread messages
//
// Clicking a row navigates to /messages/:id (the thread)
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMessaging } from "../context/MessagingContext";

// ── Relative time helper ─────────────────────────────────────
// Converts an ISO timestamp to "2 hours ago", "Yesterday" etc.
function timeAgo(isoString) {
  if (!isoString) return "";
  const diff = (Date.now() - new Date(isoString)) / 1000; // seconds
  if (diff < 60)   return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Inbox() {

  const { conversations, unreadCount, deleteConversation } = useMessaging();
  const navigate = useNavigate();

  // Filter: "all" | "unread"
  const [filter, setFilter] = useState("all");

  // Confirm delete
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Sort by most recent message
  const sorted = [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
  );

  const filtered = filter === "unread"
    ? sorted.filter((c) => c.unreadCount > 0)
    : sorted;

  function handleDelete() {
    deleteConversation(confirmDeleteId);
    setConfirmDeleteId(null);
  }

  return (
    <main className="page-main" style={{ paddingTop: "64px" }}>
      <div className="container" style={{ maxWidth: "720px" }}>

        {/* ── HEADER ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "1.5rem",
          flexWrap: "wrap", gap: "0.75rem",
        }}>
          <div>
            <h1 className="page-title">Messages</h1>
            <p className="text-muted">
              {unreadCount > 0
                ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
                : "All caught up"}
            </p>
          </div>
        </div>

        {/* ── FILTER TABS ── */}
        <div style={{
          display: "flex", gap: "0",
          borderBottom: "1px solid var(--border)",
          marginBottom: "1.5rem",
        }}>
          {[
            { key: "all",    label: `All (${conversations.length})` },
            { key: "unread", label: `Unread (${unreadCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "0.6rem 1.25rem",
                border: "none",
                borderBottom: filter === tab.key
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
                background: "transparent",
                fontWeight: filter === tab.key ? 600 : 400,
                color: filter === tab.key ? "var(--primary)" : "var(--muted-foreground)",
                cursor: "pointer",
                fontSize: "0.875rem",
                transition: "color 0.15s",
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
              <img src="/icons/message-square.svg" alt="No messages" style={{ width: "2.8rem", height: "2.8rem", opacity: 0.8 }} />
            </div>
            <h2 className="empty-title">
              {filter === "unread" ? "No unread messages" : "No messages yet"}
            </h2>
            <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
              {filter === "unread"
                ? "You're all caught up!"
                : "Start a conversation by messaging a seller on any product listing."}
            </p>
            {filter === "all" && (
              <Link to="/shop" className="btn btn-primary btn-lg">
                Browse Listings
              </Link>
            )}
          </div>
        )}

        {/* ── CONVERSATION LIST ── */}
        {filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {filtered.map((conv, i) => (
              <div
                key={conv.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 0.5rem",
                  borderBottom: i < filtered.length - 1
                    ? "0.5px solid var(--border)" : "none",
                  cursor: "pointer",
                  borderRadius: "var(--radius)",
                  background: conv.unreadCount > 0
                    ? "var(--muted)" : "transparent",
                  transition: "background 0.15s",
                }}
                onClick={() => navigate(`/messages/${conv.id}`)}
              >
                {/* Seller avatar */}
                <div style={{
                  width: "2.75rem", height: "2.75rem", borderRadius: "50%",
                  background: "var(--secondary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: 700,
                  color: "var(--muted-foreground)", flexShrink: 0,
                  border: conv.unreadCount > 0
                    ? "2px solid var(--primary)" : "2px solid transparent",
                }}>
                  {conv.sellerAvatar}
                </div>

                {/* Product thumbnail */}
                <div style={{
                  width: "3rem", height: "3rem", borderRadius: "8px",
                  overflow: "hidden", flexShrink: 0,
                  background: "var(--muted)",
                }}>
                  {conv.productImage ? (
                    <img
                      src={conv.productImage}
                      alt={conv.productTitle}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="/icons/camera.svg" alt="No product image" style={{ width: "1.1rem", height: "1.1rem", opacity: 0.6 }} />
                    </div>
                  )}
                </div>

                {/* Conversation info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{
                      fontWeight: conv.unreadCount > 0 ? 700 : 500,
                      fontSize: "0.9rem",
                      color: "var(--foreground)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {conv.sellerName}
                    </span>
                    <span style={{
                      fontSize: "0.72rem",
                      color: "var(--muted-foreground)",
                      flexShrink: 0,
                    }}>
                      {timeAgo(conv.lastMessageAt)}
                    </span>
                  </div>

                  {/* Product title */}
                  <p style={{
                    fontSize: "0.75rem",
                    color: "var(--primary)",
                    margin: "0.1rem 0",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {conv.productTitle}
                  </p>

                  {/* Last message preview + unread badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                    <p style={{
                      fontSize: "0.8rem",
                      color: conv.unreadCount > 0
                        ? "var(--foreground)" : "var(--muted-foreground)",
                      fontWeight: conv.unreadCount > 0 ? 500 : 400,
                      margin: 0,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {conv.lastMessage || "No messages yet"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span style={{
                        background: "var(--primary)", color: "#fff",
                        fontSize: "0.65rem", fontWeight: 700,
                        borderRadius: "20px", padding: "1px 7px",
                        flexShrink: 0, minWidth: "20px", textAlign: "center",
                      }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  className="btn btn-ghost icon-btn"
                  style={{ flexShrink: 0, opacity: 0.5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(conv.id);
                  }}
                  title="Delete conversation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── DELETE CONFIRMATION MODAL ── */}
        {confirmDeleteId && (
          <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="form-card-title">Delete Conversation</h2>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                This will permanently delete this conversation and all its messages.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-primary btn-lg btn-flex"
                  style={{ background: "var(--destructive)", borderColor: "var(--destructive)" }}
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => setConfirmDeleteId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default Inbox;
