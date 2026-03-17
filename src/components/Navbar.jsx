// ============================================================
// Navbar.jsx — updated with AuthContext
// ============================================================

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart }     from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth }     from "../context/AuthContext";

function Navbar() {

  const { totals }              = useCart();
  const { wishlist }            = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();

  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark]           = useState(false);

  // Dropdown open/closed — shows when user clicks their avatar
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Load saved theme on first render
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      setIsDark(true);
      document.body.classList.add("dark");
    }
  }, []);

  // Close user dropdown when clicking anywhere outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest("#user-menu-wrapper")) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggleTheme() {
    const newDark = !isDark;
    setIsDark(newDark);
    document.body.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  }

  function handleToggleMobileMenu() {
    setMenuOpen(!menuOpen);
  }

  // Sign out — clears auth state and goes to home page
  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <nav className="navbar" id="navbar">
      <div className="container navbar-inner">

        {/* ── LEFT: Logo + Nav Links ── */}
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src="/images/mporiums-logo.png" alt="M.Poriums" style={{ height: "32px" }} />
          </Link>

          <div className="nav-links hide-mobile">
            <Link to="/shop"  className="nav-link">Shop</Link>
            <Link to="/sell"  className="nav-link">Sell</Link>
            <a href="#"       className="nav-link">Deals</a>
            <a href="#"       className="nav-link">Community</a>
          </div>
        </div>

        {/* ── CENTER: Search Bar ── */}
        <form className="search-bar hide-mobile" onSubmit={handleSearchSubmit}>
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Search gear, instruments, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* ── RIGHT: Icons + User ── */}
        <div className="navbar-right">

          {/* THEME TOGGLE */}
          <button className="btn btn-ghost icon-btn" onClick={handleToggleTheme} title="Toggle theme">
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>

          {/* WISHLIST — only show when logged in */}
          {isLoggedIn && (
            <Link to="/wishlist" className="btn btn-ghost icon-btn" title="Saved items">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill={wishlist.length > 0 ? "var(--primary)" : "none"}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="cart-badge">{wishlist.length}</span>
              )}
            </Link>
          )}

          {/* CART */}
          <Link to="/cart" className="btn btn-ghost icon-btn cart-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {totals.itemCount > 0 && (
              <span className="cart-badge">{totals.itemCount}</span>
            )}
          </Link>

          {/* ── USER SECTION ────────────────────────────────────
              Shows Sign In button when logged out.
              Shows user avatar + dropdown when logged in. */}
          {!isLoggedIn ? (

            // ── NOT LOGGED IN — show Sign In button ────────────
            <Link to="/auth" className="btn btn-primary hide-mobile">
              Sign In
            </Link>

          ) : (

            // ── LOGGED IN — show avatar + dropdown ─────────────
            <div id="user-menu-wrapper" style={{ position: "relative" }}>

              {/* Avatar button — clicking opens the dropdown */}
              <button
                className="btn btn-ghost icon-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                title={user?.displayName || "My Account"}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.25rem 0.5rem",
                }}
              >
                {/* Avatar circle with user initials */}
                <div style={{
                  width: "2rem", height: "2rem", borderRadius: "50%",
                  background: "var(--primary)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                }}>
                  {user?.avatar || user?.displayName?.slice(0, 2).toUpperCase() || "ME"}
                </div>

                {/* Display name — hidden on small screens */}
                <span className="hide-mobile" style={{ fontSize: "0.875rem", fontWeight: 500, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.displayName || "My Account"}
                </span>

                {/* Chevron down arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hide-mobile">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* ── DROPDOWN MENU ──────────────────────────────
                  Only renders when userMenuOpen is true */}
              {userMenuOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "var(--card)",
                  border: "0.5px solid var(--border)",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  minWidth: "200px", zIndex: 1000,
                  overflow: "hidden",
                }}>

                  {/* User info header */}
                  <div style={{
                    padding: "0.875rem 1rem",
                    borderBottom: "0.5px solid var(--border)",
                    background: "var(--muted)",
                  }}>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0 }}>
                      {user?.displayName}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", margin: 0 }}>
                      {user?.email}
                    </p>
                    {/* Seller type badge */}
                    <span style={{
                      display: "inline-block", marginTop: "0.35rem",
                      fontSize: "0.65rem", fontWeight: 600,
                      padding: "1px 7px", borderRadius: "20px",
                      background: user?.sellerType === "preferred" ? "var(--primary)" : "var(--secondary)",
                      color: user?.sellerType === "preferred" ? "#fff" : "var(--muted-foreground)",
                    }}>
                      {user?.sellerType === "preferred" ? "Preferred Seller" : "Standard Seller"}
                    </span>
                  </div>

                  {/* Menu links */}
                  {[
                    { to: "/account",      label: "My Account",    icon: "👤" },
                    { to: "/my-listings",  label: "My Listings",   icon: "📦" },
                    { to: "/wishlist",     label: "Saved Items",   icon: "♡" },
                    { to: "/messages",     label: "Messages",      icon: "💬" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.6rem",
                        padding: "0.65rem 1rem",
                        fontSize: "0.875rem",
                        color: "var(--foreground)",
                        textDecoration: "none",
                        borderBottom: "0.5px solid var(--border)",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--muted)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                  {/* Sign Out */}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.6rem",
                      width: "100%", padding: "0.65rem 1rem",
                      fontSize: "0.875rem",
                      color: "var(--destructive)",
                      background: "transparent", border: "none",
                      cursor: "pointer", textAlign: "left",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--muted)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: "0.9rem" }}>🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* HAMBURGER (mobile only) */}
          <button
            className="btn btn-ghost icon-btn show-mobile"
            onClick={handleToggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearchSubmit} className="mobile-search">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Search gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Link to="/shop"  className="mobile-link" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/sell"  className="mobile-link" onClick={() => setMenuOpen(false)}>Sell</Link>
          <a href="#"       className="mobile-link">Deals</a>
          <a href="#"       className="mobile-link">Community</a>

          {/* Show account links when logged in, sign in link when not */}
          {isLoggedIn ? (
            <>
              <Link to="/account"     className="mobile-link" onClick={() => setMenuOpen(false)}>My Account</Link>
              <Link to="/my-listings" className="mobile-link" onClick={() => setMenuOpen(false)}>My Listings</Link>
              <Link to="/wishlist"    className="mobile-link" onClick={() => setMenuOpen(false)}>Saved Items</Link>
              <Link to="/messages"    className="mobile-link" onClick={() => setMenuOpen(false)}>Messages</Link>
              <button
                className="mobile-link"
                onClick={handleLogout}
                style={{
                  background: "none", border: "none", width: "100%",
                  textAlign: "left", cursor: "pointer",
                  color: "var(--destructive)", padding: 0,
                  fontSize: "inherit",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
              style={{ color: "var(--primary)" }}
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
