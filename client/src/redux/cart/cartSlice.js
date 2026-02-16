import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: 'Cash on Delivery',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product && (!x.variant || x.variant.sku === item.variant?.sku));

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product && (!x.variant || x.variant.sku === existItem.variant?.sku) ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
    },
    removeFromCart: (state, action) => {
      // payload can be just ID or object { id, sku }
      const id = action.payload.id || action.payload;
      const sku = action.payload.sku;

      state.cartItems = state.cartItems.filter((x) =>
        !(x.product === id && (!sku || x.variant?.sku === sku))
      );
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
