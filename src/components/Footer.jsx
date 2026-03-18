// ============================================================
// Footer.jsx
// Converted from index.html for M.Poriums
// ============================================================
// The footer is the SIMPLEST component on your site because:
//   - It has no state (nothing changes or toggles)
//   - It has no jQuery (nothing was being manipulated)
//   - It's just HTML structure + a few links
//
// The only two things that change from your original HTML:
//   1. class=""   →  className=""
//   2. onclick="showPage('shop')"  →  <Link to="/shop">
// ============================================================

// We only need Link here — no useState or useEffect needed
// because this component never changes after it renders.
import { Link } from "react-router-dom";

function Footer() {
  return (
    // Was: <footer class="footer" id="footer">
    // The id="footer" is no longer needed — in your old script.js,
    // jQuery("#footer").toggle() was used to hide it on the 404 page.
    // In React, the Footer simply won't be rendered on pages that don't need it.
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* ── COLUMN 1: Logo + Tagline ── */}
          <div>
            {/* Was: <img src="images/mporiums-logo.png" style="height:32px;margin-bottom:1rem;" />
                Note: in Vite, files in the public/ folder are served from the root.
                So public/images/mporiums-logo.png becomes src="/images/mporiums-logo.png" */}
            <img
              src="/images/mporiums-logo.png"
              alt="M.Poriums"
              style={{ height: "32px", marginBottom: "1rem" }}
            />
            <p className="text-muted text-sm">
              The trusted marketplace for buying and selling audio hardware and musical instruments.
            </p>
          </div>

          {/* ── COLUMN 2: Marketplace Links ── */}
          <div>
            <h4 className="footer-heading">Marketplace</h4>
            <ul className="footer-links">
              {/* Was: <a href="#" onclick="showPage('shop')">Shop All</a>
                  Now: <Link to="/shop"> handles navigation automatically.
                  No onclick needed — clicking a Link changes the URL
                  and React Router shows the right page. */}
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/sell">Sell Gear</Link></li>

              {/* These pages don't exist yet, so href="#" is fine for now.
                  When you build them, just replace with <Link to="/price-guide"> etc. */}
              <li><Link to="/price-guide">Price Guide</Link></li>
              <li><Link to="/deals">Deals</Link></li>
            </ul>
          </div>

          {/* ── COLUMN 3: Support Links ── */}
          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/help#buyer-protection">Buyer Protection</Link></li>
              <li><Link to="/help#shipping">Shipping Info</Link></li>
              <li><Link to="/help#disputes">Returns</Link></li>
            </ul>
          </div>

          {/* ── COLUMN 4: Company Links ── */}
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

        </div>

        {/* ── Copyright Bar ── */}
        {/* Was: © 2026 M.Poriums. All rights reserved.
            Tip: you can make the year dynamic so it never goes out of date:
            {new Date().getFullYear()} automatically returns the current year */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} M.Poriums. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

// Export so other files can use it:
// import Footer from "./components/Footer";
export default Footer;
