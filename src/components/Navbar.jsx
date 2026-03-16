// ============================================================
// Navbar.jsx
// ============================================================



import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

// ============================================================
// The Navbar Component
// ============================================================

function Navbar() {

  // Get cart data from CartContext

  const { totals } = useCart();

  // ----------------------------------------------------------
  // STATE — 
  // ----------------------------------------------------------

  const [menuOpen, setMenuOpen] = useState(false);


  const [searchQuery, setSearchQuery] = useState("");


  const [isDark, setIsDark] = useState(false);

  // ----------------------------------------------------------
  // useNavigate — 
  // ----------------------------------------------------------
  
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // useEffect — 
  // ----------------------------------------------------------

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved === "dark" || (!saved && prefersDark)) {
      setIsDark(true);
      document.body.classList.add("dark"); 
    }
  }, []);

  // ----------------------------------------------------------
  // FUNCTIONS — 
  // ----------------------------------------------------------

  function handleToggleTheme() {
    const newDark = !isDark;
    setIsDark(newDark);
    document.body.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  }


  function handleSearchSubmit(e) {
    e.preventDefault(); // stops the browser from doing a full page reload
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate("/shop"); // go to the shop page
      setSearchQuery(""); // clear the search box
      setMenuOpen(false); // close mobile menu if open
      window.scrollTo(0, 0); // scroll to top when navigating
    }
  }

  // Scroll to top when navigating
  function handleScrollToTop() {
    window.scrollTo(0, 0);
  }


  function handleToggleMobileMenu() {
    setMenuOpen(!menuOpen);
  }

  // ----------------------------------------------------------
  // THE JSX — 
  // ----------------------------------------------------------


  return (
    <nav className="navbar" id="navbar">
      <div className="container navbar-inner">

        {/* ── LEFT: Logo + Nav Links ── */}
        <div className="navbar-left">

          {/*  <Link to="/"> navigates to the home route */}
          <Link to="/" className="logo" onClick={handleScrollToTop}>
            <img src="/images/mporiums-logo.png" alt="M.Poriums" style={{ height: "32px" }} />
          </Link>

          <div className="nav-links hide-mobile">
            {/* <Link to="/shop"> — no onclick needed, routing is automatic */}
            <Link to="/shop" className="nav-link" onClick={handleScrollToTop}>Shop</Link>
            <Link to="/sell" className="nav-link" onClick={handleScrollToTop}>Sell</Link>
            <a href="#" className="nav-link">Deals</a>
            <a href="#" className="nav-link">Community</a>
          </div>
        </div>

        {/* ── CENTER: Search Bar ── */}
        {/*  */}
        <form className="search-bar hide-mobile" onSubmit={handleSearchSubmit}>
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          {/*  */}
          <input
            type="text"
            placeholder="Search gear, instruments, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* ── RIGHT: Theme Toggle, Cart, Sign In, Hamburger ── */}
        <div className="navbar-right">

          {/* THEME TOGGLE BUTTON
               */}
          <button
            className="btn btn-ghost icon-btn"
            onClick={handleToggleTheme}
            title="Toggle theme"
          >
            {isDark ? (
              // Moon icon — shown when dark mode is ON
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              // Sun icon — shown when dark mode is OFF
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

          {/* CART BUTTON
               */}
          <Link to="/cart" className="btn btn-ghost icon-btn cart-btn" onClick={handleScrollToTop}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {/* Only show the badge when cart has items */}
            {totals.itemCount > 0 && (
              <span className="cart-badge">{totals.itemCount}</span>
            )}
          </Link>

          {/* SIGN IN BUTTON (desktop only) */}
          <Link to="/auth" className="btn btn-primary hide-mobile" onClick={handleScrollToTop}>
            Sign In
          </Link>

          {/* HAMBURGER BUTTON (mobile only)
              */}
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

      {/* ── MOBILE MENU ──
           */}
      {menuOpen && (
        <div className="mobile-menu">

          {/* Mobile search — same controlled input pattern as desktop */}
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

          {/* Mobile nav links
               */}
          <Link to="/shop" className="mobile-link" onClick={() => { setMenuOpen(false); handleScrollToTop(); }}>Shop</Link>
          <Link to="/sell" className="mobile-link" onClick={() => { setMenuOpen(false); handleScrollToTop(); }}>Sell</Link>
          <a href="#" className="mobile-link">Deals</a>
          <a href="#" className="mobile-link">Community</a>
          <Link
            to="/auth"
            className="mobile-link"
            onClick={() => { setMenuOpen(false); handleScrollToTop(); }}
            style={{ color: "var(--primary)" }}
          >
            Sign In / Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}


export default Navbar;
