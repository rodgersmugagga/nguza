import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  order: null, // Current order details
  loading: false,
  error: null,
  success: false,
};

// Async thunks would typically go here calling API
// For now, setting up basic state structure

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderCreateRequest: (state) => {
      state.loading = true;
    },
    orderCreateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    },
    orderCreateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderReset: (state) => {
      state.success = false;
      state.error = null;
      state.order = null;
    }
  },
});

export const {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderReset
} = orderSlice.actions;

export default orderSlice.reducer;
