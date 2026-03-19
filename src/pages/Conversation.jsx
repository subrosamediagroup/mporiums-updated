// ============================================================
// Conversation.jsx
// src/pages/Conversation.jsx
// Route: /messages/:conversationId
// ============================================================
// The individual message thread between a buyer and seller.
// Shows:
//   - Product card at the top for context
//   - Full message history in a chat-style layout
//   - Text input to send new messages at the bottom
//   - Offer messages shown with a distinct offer card style
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMessaging } from "../context/MessagingContext";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const FULL_URL_PATTERN = /^https?:\/\/[^\s]+$/;

// ── Format timestamp for message bubbles ────────────────────
function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now  = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function renderMessageText(text) {
  if (!text) return null;

  return text.split(URL_PATTERN).map((part, index) => {
    if (!part) return null;

    if (FULL_URL_PATTERN.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "inherit",
            textDecoration: "underline",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          {part}
        </a>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function Conversation() {

  const { conversationId } = useParams();
  const { getConversation, sendMessage, markAsRead } = useMessaging();
  const navigate = useNavigate();

  const conv = getConversation(conversationId);

  // Input state
  const [messageText, setMessageText] = useState("");

  // Auto-scroll to bottom ref
  const bottomRef = useRef(null);

  // Mark as read when opening the thread
  useEffect(() => {
    if (conv) markAsRead(conversationId);
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conv?.messages?.length]);

  // ── 404 if conversation not found ───────────────────────
  if (!conv) {
    return (
      <main className="page-main center-content" style={{ paddingTop: "64px" }}>
        <div className="text-center">
          <h1 style={{ fontSize: "4rem", fontWeight: 700 }}>404</h1>
          <p className="text-muted" style={{ marginBottom: "1rem" }}>Conversation not found</p>
          <Link to="/messages" className="link-primary">← Back to Messages</Link>
        </div>
      </main>
    );
  }

  // ── Send a text message ──────────────────────────────────
  function handleSend(e) {
    e.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed) return;
    sendMessage(conversationId, trimmed, "message");
    setMessageText("");
  }

  // ── JSX ─────────────────────────────────────────────────
  return (
    <main className="page-main" style={{ paddingTop: "64px" }}>
      <div className="container" style={{ maxWidth: "720px" }}>

        {/* ── HEADER ── */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "1rem", marginBottom: "1.5rem",
        }}>
          <Link to="/messages" className="link-primary" style={{ flexShrink: 0 }}>
            ← Messages
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: "1.1rem", fontWeight: 700,
              margin: 0, whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {conv.sellerName}
            </h1>
          </div>
        </div>

        {/* ── PRODUCT CONTEXT CARD ── */}
        <Link
          to={`/product/${conv.productId}`}
          style={{ textDecoration: "none" }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            background: "var(--card)",
            border: "0.5px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "0.75rem",
            marginBottom: "1.5rem",
            transition: "border-color 0.15s",
          }}>
            {/* Product image */}
            <div style={{
              width: "3.5rem", height: "3.5rem", borderRadius: "8px",
              overflow: "hidden", flexShrink: 0, background: "var(--muted)",
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

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600, fontSize: "0.875rem",
                color: "var(--foreground)", margin: 0,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {conv.productTitle}
              </p>
              <p style={{
                fontSize: "1rem", fontWeight: 700,
                color: "var(--primary)", margin: "0.1rem 0 0",
              }}>
                ${conv.productPrice?.toLocaleString()}
              </p>
            </div>

            <span style={{
              fontSize: "0.75rem", color: "var(--primary)",
              fontWeight: 500, flexShrink: 0,
            }}>
              View listing →
            </span>
          </div>
        </Link>

        {/* ── MESSAGE THREAD ── */}
        <div style={{
          display: "flex", flexDirection: "column", gap: "0.75rem",
          marginBottom: "1.5rem",
          minHeight: "300px",
        }}>

          {conv.messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--muted-foreground)" }}>
              <p style={{ fontSize: "0.9rem" }}>
                No messages yet. Send a message below to start the conversation.
              </p>
            </div>
          )}

          {conv.messages.map((msg) => {
            const isYou = msg.sender === "you";

            // ── Offer message — special card style ──────────
            if (msg.type === "offer") {
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isYou ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  <div style={{
                    background: "var(--card)",
                    border: `1.5px solid var(--primary)`,
                    borderRadius: "var(--radius)",
                    padding: "0.875rem 1rem",
                  }}>
                    <p style={{
                      fontSize: "0.7rem", fontWeight: 600,
                      color: "var(--primary)", marginBottom: "0.25rem",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      Offer
                    </p>
                    <p style={{
                      fontSize: "1.4rem", fontWeight: 700,
                      color: "var(--primary)", margin: "0 0 0.35rem",
                    }}>
                      ${msg.offerAmount?.toLocaleString()}
                    </p>
                    {msg.text && (
                      <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: 0, overflowWrap: "anywhere", wordBreak: "break-word" }}>
                        {renderMessageText(msg.text)}
                      </p>
                    )}
                  </div>
                  <p style={{
                    fontSize: "0.7rem", color: "var(--muted-foreground)",
                    textAlign: isYou ? "right" : "left",
                    marginTop: "0.25rem",
                  }}>
                    {isYou ? "You" : conv.sellerName} · {formatTime(msg.timestamp)}
                  </p>
                </div>
              );
            }

            // ── Regular message bubble ───────────────────────
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isYou ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                }}
              >
                {/* Sender label — only show for seller messages */}
                {!isYou && (
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "0.4rem", marginBottom: "0.3rem",
                  }}>
                    <div style={{
                      width: "1.5rem", height: "1.5rem", borderRadius: "50%",
                      background: "var(--secondary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.6rem", fontWeight: 700,
                      color: "var(--muted-foreground)",
                    }}>
                      {conv.sellerAvatar}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", fontWeight: 500 }}>
                      {conv.sellerName}
                    </span>
                  </div>
                )}

                {/* Bubble */}
                <div style={{
                  padding: "0.65rem 0.9rem",
                  borderRadius: isYou
                    ? "18px 18px 4px 18px"   // your messages: flat bottom-right
                    : "18px 18px 18px 4px",  // seller messages: flat bottom-left
                  background: isYou ? "var(--primary)" : "var(--card)",
                  border: isYou ? "none" : "0.5px solid var(--border)",
                  color: isYou ? "#fff" : "var(--foreground)",
                }}>
                  <p style={{ fontSize: "0.875rem", margin: 0, lineHeight: 1.5, overflowWrap: "anywhere", wordBreak: "break-word" }}>
                    {renderMessageText(msg.text)}
                  </p>
                </div>

                {/* Timestamp */}
                <p style={{
                  fontSize: "0.7rem", color: "var(--muted-foreground)",
                  textAlign: isYou ? "right" : "left",
                  marginTop: "0.25rem",
                }}>
                  {formatTime(msg.timestamp)}
                  {/* Read receipt for your messages */}
                  {isYou && (
                    <span style={{ marginLeft: "0.3rem" }}>
                      {msg.read ? "· Read" : "· Sent"}
                    </span>
                  )}
                </p>
              </div>
            );
          })}

          {/* Invisible anchor — scrolled into view when new messages arrive */}
          <div ref={bottomRef} />
        </div>

        {/* ── MESSAGE INPUT ── */}
        <form
          onSubmit={handleSend}
          style={{
            display: "flex", gap: "0.75rem", alignItems: "flex-end",
            position: "sticky", bottom: "1rem",
            background: "var(--background)",
            paddingTop: "0.75rem",
            borderTop: "0.5px solid var(--border)",
          }}
        >
          <textarea
            rows={2}
            placeholder={`Message ${conv.sellerName}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            // Send on Enter, new line on Shift+Enter
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            style={{
              flex: 1, resize: "none",
              fontSize: "0.9rem",
              borderRadius: "var(--radius)",
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!messageText.trim()}
            style={{ flexShrink: 0 }}
          >
            Send
          </button>
        </form>

        {/* Hint text */}
        <p className="text-muted text-xs" style={{ textAlign: "right", marginTop: "0.4rem" }}>
          Press Enter to send · Shift+Enter for new line
        </p>

      </div>
    </main>
  );
}

export default Conversation;
