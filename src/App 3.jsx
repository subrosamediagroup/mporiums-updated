// ============================================================
// App.jsx — FINAL VERSION
// All routes wired up, all pages imported
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";

import Home          from "./pages/Home";
import Shop          from "./pages/Shop";
import Cart          from "./pages/Cart";
import Checkout      from "./pages/Checkout";
import Auth          from "./pages/Auth";
import Sell          from "./pages/Sell";
import ProductDetail from "./pages/ProductDetail";
import { PaymentSuccess } from "./pages/ExtraPages";
import { NotFound }       from "./pages/ExtraPages";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/"            element={<Home />}          />
          <Route path="/shop"        element={<Shop />}          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart"        element={<Cart />}          />
          <Route path="/checkout"    element={<Checkout />}      />
          <Route path="/auth"        element={<Auth />}          />
          <Route path="/sell"        element={<Sell />}          />
          <Route path="/success"     element={<PaymentSuccess />}/>

          {/* Catch-all — any URL that doesn't match shows the 404 page
               */}
          <Route path="*"            element={<NotFound />}      />
        </Routes>

        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
