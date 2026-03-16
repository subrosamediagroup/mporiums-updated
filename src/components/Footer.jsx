// ============================================================
// Footer.jsx

// ============================================================


import { Link } from "react-router-dom";

function Footer() {
  return (

    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* ── COLUMN 1: Logo + Tagline ── */}
          <div>
            {/*  */}
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
              {/*  */}
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/sell">Sell Gear</Link></li>

              {/* These pages don't exist yet
               */}
              <li><a href="#">Price Guide</a></li>
              <li><a href="#">Deals</a></li>
            </ul>
          </div>

          {/* ── COLUMN 3: Support Links ── */}
          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Buyer Protection</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
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
        {/*  */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} M.Poriums. All rights reserved.
        </div>

      </div>
    </footer>
  );
}


export default Footer;
