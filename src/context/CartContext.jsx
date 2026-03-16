// ============================================================
// CartContext.jsx

// ============================================================

import { createContext, useContext, useState, useEffect } from "react";


const CartContext = createContext();


export function CartProvider({ children }) {

  
  const [cart, setCart] = useState(() => {
    
    try {
      const saved = localStorage.getItem("mporiums-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Save cart to localStorage whenever it changes ──────────
  
  useEffect(() => {
    localStorage.setItem("mporiums-cart", JSON.stringify(cart));
  }, [cart]);

  // ── ADD TO CART ────────────────────────────────────────────

  function addToCart(product) {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        // Item is already in the cart — just increase quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

   
     // Brand new item — add it with quantity 1.
      return [
        ...prevCart,
        {
          id:        product.id,
          title:     product.title,
          price:     product.price,
          condition: product.condition,
          image:     product.images[0],
          seller:    product.seller,
          quantity:  1,
        },
      ];
    });
  }

  // ── REMOVE FROM CART ───────────────────────────────────────
  
  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }

  // ── UPDATE QUANTITY ────────────────────────────────────────
  
  function updateQty(id, delta) {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // ── CLEAR ENTIRE CART ──────────────────────────────────────
  
  function clearCart() {
    setCart([]);
  }

  // ── CART TOTALS ────────────────────────────────────────────
  
  const subtotal  = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping  = subtotal > 500 ? 0 : subtotal === 0 ? 0 : 14.99;
  const tax       = subtotal * 0.08;
  const total     = subtotal + shipping + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totals = { subtotal, shipping, tax, total, itemCount };

  return (
    <CartContext.Provider
      value={{
        cart,         // the cart array itself
        totals,       // subtotal, shipping, tax, total, itemCount
        addToCart,    // function to add a product
        removeFromCart, // function to remove by id
        updateQty,    // function to change quantity (+1 or -1)
        clearCart,    // function to empty the whole cart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  return useContext(CartContext);
}
