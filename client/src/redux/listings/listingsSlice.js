import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import listingsApi from '../../utils/listingsApi';

// Thunks
export const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async (params, { rejectWithValue }) => {
    try {
      const res = await listingsApi.getListings(params);
      return res; // expected { listings, total }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch listings');
    }
  }
);

export const fetchListingById = createAsyncThunk(
  'listings/fetchListingById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await listingsApi.getListing(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch listing');
    }
  }
);

export const fetchFeatured = createAsyncThunk(
  'listings/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const res = await listingsApi.getListings({ limit: 10, featured: true });
      return res.listings || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch featured');
    }
  }
);

const initialState = {
  items: [],
  featured: [],
  total: 0,
  currentListing: null,
  status: 'idle',
  error: null,
};

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    clearCurrent(state) {
      state.currentListing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.listings || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchListingById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featured = action.payload || [];
      });
  },
});

export const { clearCurrent } = listingsSlice.actions;
export default listingsSlice.reducer;
