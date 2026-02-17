import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage by default
import userReducer from "./user/userSlice.js";
import productsReducer from './products/productsSlice.js';
import filtersReducer from './filters/filtersSlice.js';
import wishlistReducer from './wishlist/wishlistSlice.js';
import cartReducer from './cart/cartSlice.js';
import orderReducer from './orders/orderSlice.js';

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  filters: filtersReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  order: orderReducer,
});

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Create a persisted reducer that wraps the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable serializable check because of persist
    }),
});

// Create and export the persistor
export const persistor = persistStore(store);

