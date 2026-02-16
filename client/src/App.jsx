import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

// Keep Header eagerly loaded so the top navigation renders immediately and
// avoids a white screen while the header chunk downloads. Routes remain
// lazy-loaded to preserve code-splitting.
import Header from './components/Header';

const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));
const CreateListing = lazy(() => import('./pages/CreateListing'));
const UpdateListing = lazy(() => import('./pages/UpdateListing'));
const PrivateRoute = lazy(() => import('./components/privateRoute'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const Listing = lazy(() => import('./pages/Listing'));
const Search = lazy(() => import('./pages/Search'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Shipping = lazy(() => import('./pages/Shipping'));
const Payment = lazy(() => import('./pages/Payment'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'));
const Order = lazy(() => import('./pages/Order'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<div className="w-full text-center p-8">Loading...</div>}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:categoryKey" element={<CategoryPage />} />
            <Route path="/listing/:listingId" element={<Listing />} />

            <Route element={<PrivateRoute />} >
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/update-listing/:listingId" element={<UpdateListing />} />
            </Route>

            <Route element={<AdminRoute />} >
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />

            <Route element={<PrivateRoute />} >
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<Order />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
