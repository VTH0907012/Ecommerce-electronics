// redux/cartSlice.ts
import { CartState } from "@/type/Cart";
import { Product } from "@/type/Product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<Product & { quantityToBuy?: number }>
    ) => {
      const product = action.payload;
      const index = state.items.findIndex((i) => i._id === product._id);
      const quantityToAdd = product.quantityToBuy ?? 1;
      const quantityInStock = product.quantity;

      if (index !== -1) {
        const newQuantity = state.items[index].quantity + quantityToAdd;
        state.items[index].quantity = Math.min(newQuantity, quantityInStock);
      } else {
        state.items.push({
          _id: product._id!,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          quantity: quantityToAdd,
          image: product.images![0],
          quantityInStock: quantityInStock,
        });
      }

      state.isOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearCart: (state) => {
      state.items = [];
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantityToBuy: number }>
    ) => {
      const { id, quantityToBuy } = action.payload;
      const index = state.items.findIndex((item) => item._id === id);

      if (index !== -1) {
        const newQuantity = Math.max(1, quantityToBuy);
        const maxQuantity = state.items[index].quantityInStock ?? Infinity;
        state.items[index].quantity = Math.min(newQuantity, maxQuantity);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  toggleCart,
  clearCart,
  updateQuantity,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
