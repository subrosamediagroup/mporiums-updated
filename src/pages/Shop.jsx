// ============================================================
// Shop.jsx 
// ============================================================

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

// ── Filter data ─────────────────────────────────────────────
 
const categories = [
  "All",
  "Guitars & Basses",
  "Synthesizers",
  "Headphones",
  "Speakers & Monitors",
  "Microphones",
  "DJ Equipment",
];

const conditions = ["All", "Like New", "Excellent", "Good", "Fair"];

const priceRanges = [
  { label: "All",            min: 0,    max: Infinity },
  { label: "Under $250",     min: 0,    max: 250      },
  { label: "$250 – $500",    min: 250,  max: 500      },
  { label: "$500 – $1,000",  min: 500,  max: 1000     },
  { label: "$1,000 – $2,000",min: 1000, max: 2000     },
  { label: "$2,000+",        min: 2000, max: Infinity  },
];

// ============================================================
// Shop Component
// ============================================================
function Shop() {

  // ----------------------------------------------------------
  // READ URL PARAMS
  // ----------------------------------------------------------
 
  const [searchParams] = useSearchParams();

  // ----------------------------------------------------------
  // STATE — replaces the 4 global filter variables in script.js
  // ----------------------------------------------------------
 
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
 
  const [selectedCondition, setSelectedCondition] = useState("All");

  
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);

  
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  
  const [sortBy, setSortBy] = useState("Newest");

  // ----------------------------------------------------------
  // SYNC URL PARAMS IF THEY CHANGE
  // ----------------------------------------------------------
  
  useEffect(() => {
    const cat    = searchParams.get("category");
    const search = searchParams.get("search");
    if (cat)    setSelectedCategory(cat);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // ----------------------------------------------------------
  // FILTERING + SORTING — replaces applyFilters() in script.js
  // ----------------------------------------------------------
  

  const filteredProducts = products
    // Step 1: filter by category
    .filter((p) =>
      selectedCategory === "All" ? true : p.category === selectedCategory
    )
    // Step 2: filter by condition
    .filter((p) =>
      selectedCondition === "All" ? true : p.condition === selectedCondition
    )
    // Step 3: filter by price range
    .filter((p) =>
      p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
    )
    // Step 4: filter by search query — checks title, category, and seller
  
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q)    ||
        p.category.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q)
      );
    })
    // Step 5: sort
 
    .slice()
    .sort((a, b) => {
      if (sortBy === "Price: Low to High")  return a.price - b.price;
      if (sortBy === "Price: High to Low")  return b.price - a.price;
      return 0; // "Newest" — keep original order
    });

  // ----------------------------------------------------------
  // ACTIVE FILTERS CHECK — replaces hasActiveFilters()
  // ----------------------------------------------------------

  const hasActiveFilters =
    selectedCategory !== "All"           ||
    selectedCondition !== "All"          ||
    selectedPriceRange.label !== "All"   ||
    searchQuery !== "";

  // ----------------------------------------------------------
  // CLEAR FILTERS — replaces clearFilters() in script.js
  // ---------------------------------------------------------- 
  function clearFilters() {
    setSelectedCategory("All");
    setSelectedCondition("All");
    setSelectedPriceRange(priceRanges[0]);
    setSearchQuery("");
  }

  // ----------------------------------------------------------
  // JSX
  // ----------------------------------------------------------
  return (
    <main className="page-main">
      <div className="container">

        {/* ── SHOP HEADER: title, item count, sort dropdown ── */}
        <div className="shop-header">
          <div>
        
            <h1 className="page-title">
              {searchQuery ? `Results for "${searchQuery}"` : "Shop Gear"}
            </h1>

        
            <p className="text-muted">{filteredProducts.length} items found</p>
          </div>

          <div className="shop-controls">
            {/* Sort dropdown
                 */}
            <select
              className="select-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="shop-layout">

          {/* ── SIDEBAR FILTERS ── */}
          {/* */}
          <aside className="shop-sidebar hide-mobile">

            {/* CATEGORY FILTER
                */}
            <div className="filter-section">
              <h4 className="filter-title">Category</h4>
              <div className="filter-options">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`filter-btn${selectedCategory === c ? " active" : ""}`}
                    onClick={() => setSelectedCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE RANGE FILTER */}
            <div className="filter-section">
              <h4 className="filter-title">Price Range</h4>
              <div className="filter-options">
                {priceRanges.map((r) => (
                  <button
                    key={r.label}
                    className={`filter-btn${selectedPriceRange.label === r.label ? " active" : ""}`}
                    onClick={() => setSelectedPriceRange(r)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CONDITION FILTER */}
            <div className="filter-section">
              <h4 className="filter-title">Condition</h4>
              <div className="filter-options">
                {conditions.map((c) => (
                  <button
                    key={c}
                    className={`filter-btn${selectedCondition === c ? " active" : ""}`}
                    onClick={() => setSelectedCondition(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* CLEAR FILTERS BUTTON
               */}
            {hasActiveFilters && (
              <button
                className="btn btn-outline btn-sm btn-full"
                onClick={clearFilters}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}
              >
                <img src="/icons/x.svg" alt="Clear" style={{ width: "1rem", height: "1rem" }} />
                Clear Filters
              </button>
            )}
          </aside>

          {/* ── PRODUCT GRID ── */}
          <div className="shop-grid-wrapper">

            {/* EMPTY STATE
                */}
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">No items match your filters</p>
                <p className="text-muted">Try adjusting your criteria</p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={clearFilters}
                  style={{ marginTop: "1rem" }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              // RESULTS GRID 
              <div className="listing-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Shop;
