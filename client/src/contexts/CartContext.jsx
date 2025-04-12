import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("zlgCart");
    return storedCart
      ? JSON.parse(storedCart)
      : { subscription: null, single: [] };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("zlgCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addItem = (item, type = "single") => {
    if (type === "subscription") {
      setCartItems((prev) => ({
        ...prev,
        subscription: item,
      }));
    } else {
      setCartItems((prev) => {
        const existing = prev.single.find((i) => i.package.id === item.id);
        if (existing) {
          return {
            ...prev,
            single: prev.single.map((i) =>
              i.package.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        } else {
          return {
            ...prev,
            single: [...prev.single, { package: item, quantity: 1 }],
          };
        }
      });
    }
  };

  // Remove item from cart
  const removeItem = (id, type = "single") => {
    if (type === "subscription") {
      setCartItems((prev) => ({ ...prev, subscription: null }));
    } else {
      setCartItems((prev) => ({
        ...prev,
        single: prev.single.filter((i) => i.package.id !== id),
      }));
    }
  };

  // Update quantity (only for single items)
  const updateQuantity = (id, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      single: prev.single.map((i) =>
        i.package.id === id ? { ...i, quantity } : i
      ),
    }));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems({ subscription: null, single: [] });
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy access
export const useCart = () => useContext(CartContext);
