import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/wishlist/${product._id}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return product; // Return full product for state update
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [], // Array of full product objects
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Payload is array of products
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // Optimistically add the product to the list
        // Check if it already exists to avoid duplicates
        const exists = state.items.some(item => item._id === action.payload._id);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      // Remove
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
