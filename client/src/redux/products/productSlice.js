import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  product: null,
  topProducts: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setTopProducts: (state, action) => {
      state.topProducts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { setProducts, setProduct, setTopProducts, setLoading, setError } = productSlice.actions;

export default productSlice.reducer;
