import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : { items: [], totalAmount: 0 };
  }
  return { items: [], totalAmount: 0 };
};

const saveCart = (cart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

// 🔑 helper to normalize variants array into a string
const getVariantKey = (variantArr) => {
  if (!variantArr) return "default";
  return variantArr.map((v) => `${v.name}:${v.value}`).join("|");
};

const initialState = loadCart();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, price, variants } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          JSON.stringify(item.variants) === JSON.stringify(variants)
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      saveCart(state);
    },
    removeFromCart: (state, action) => {
      const { productId, variants } = action.payload;
      state.items = state.items.filter(
        (item) =>
          item.productId !== productId ||
          JSON.stringify(item.variants) !== JSON.stringify(variants)
      );
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      saveCart(state);
    },
    updateQuantity: (state, action) => {
      const { productId, variants, quantity } = action.payload;
      const item = state.items.find(
        (i) =>
          i.productId === productId &&
          JSON.stringify(i.variants) === JSON.stringify(variants)
      );

      if (item) {
        item.quantity = quantity > 0 ? quantity : 1;
      }

      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      saveCart(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      saveCart(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
