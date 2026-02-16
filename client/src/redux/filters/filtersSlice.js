import { createSlice } from '@reduxjs/toolkit';
import { getFieldsForSubcategory } from '../../utils/subcategoryFields';

const initialState = {
  keyword: '',
  category: 'all',
  subCategory: 'all',
  sort: 'newest',
  page: 1,
  limit: 12,
  filters: {}, // dynamic filter object
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setKeyword(state, action) {
      state.keyword = action.payload;
      state.page = 1;
    },
    setCategory(state, action) {
      // when category changes, reset subcategory and clear filters to avoid
      // carrying over fields (e.g., parking, amenities) that don't apply
      state.category = action.payload;
      state.subCategory = 'all';
      state.page = 1;
      // preserve location-related filters across category changes
      const preserved = {};
      const locKeys = ['district', 'subcounty', 'parish'];
      (state.filters || {}) && Object.entries(state.filters).forEach(([k, v]) => {
        if (locKeys.includes(k)) preserved[k] = v;
      });
      state.filters = preserved;
    },
    setSubCategory(state, action) {
      // when subcategory changes, keep only filters that are valid for the
      // new subcategory (prevents parking/amenities/features from persisting)
      const newSub = action.payload;
      state.subCategory = newSub;
      state.page = 1;

      // always preserve location filters
      const locKeys = ['district', 'subcounty', 'parish'];
      const preserved = {};
      (state.filters || {}) && Object.entries(state.filters).forEach(([k, v]) => {
        if (locKeys.includes(k)) preserved[k] = v;
      });

      if (!newSub || newSub === 'all' || state.category === 'all') {
        // no specific subcategory => clear dynamic filters but keep location
        state.filters = preserved;
      } else {
        const allowed = new Set(getFieldsForSubcategory(state.category, newSub));
        const pruned = {};
        Object.entries(state.filters || {}).forEach(([k, v]) => {
          if (allowed.has(k)) pruned[k] = v;
        });
        // merge preserved location filters back in
        state.filters = { ...preserved, ...pruned };
      }
    },
    setSort(state, action) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
    setFilter(state, action) {
      const { key, value } = action.payload;
      if (value === null || typeof value === 'undefined' || value === '') {
        delete state.filters[key];
      } else {
        state.filters[key] = value;
      }
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = {};
      state.keyword = '';
      state.page = 1;
    },
  },
});

export const { setKeyword, setCategory, setSubCategory, setSort, setPage, setLimit, setFilter, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
