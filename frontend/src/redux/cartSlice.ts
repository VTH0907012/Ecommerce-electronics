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
    addToCart: (state, action: PayloadAction<Product & { quantity?: number }>) => {
    const product = action.payload;
    const index = state.items.findIndex((i) => i._id === product._id);
    const quantityToAdd = product.quantity ?? 1; 

    if (index !== -1) {
      state.items[index].quantity += quantityToAdd; 
    } else {
      state.items.push({
        _id: product._id!,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        quantity: quantityToAdd,
        image: product.images![0],
      });
    }

    state.isOpen = true;
  },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearCart: (state) => {
      state.items = [];
    },
    updateQuantity: (state, action: PayloadAction<{id: string; quantity: number}>) => {
      const { id, quantity } = action.payload;
      const index = state.items.findIndex(item => item._id === id);
      
      if (index !== -1) {
        // Đảm bảo số lượng không nhỏ hơn 1
        state.items[index].quantity = Math.max(1, quantity);
      }
    },
  },
});

export const { addToCart, removeFromCart, toggleCart, clearCart ,updateQuantity} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
