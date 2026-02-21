import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

// Keep Header eagerly loaded
import Header from './components/Header';
import BottomNav from './components/BottomNav';

const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const UpdateProduct = lazy(() => import('./pages/UpdateProduct'));
const PrivateRoute = lazy(() => import('./components/privateRoute'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Search = lazy(() => import('./pages/Search'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Cart = lazy(() => import('./pages/Cart'));
const Shipping = lazy(() => import('./pages/Shipping'));
const Payment = lazy(() => import('./pages/Payment'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'));
const Order = lazy(() => import('./pages/Order'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const RegisterVendor = lazy(() => import('./pages/RegisterVendor'));
const AdminProductModeration = lazy(() => import('./pages/AdminProductModeration'));
const AuthSuccess = lazy(() => import('./pages/AuthSuccess'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<div className="w-full text-center p-8 text-emerald-700 font-bold">Loading Nguza...</div>}>
          <Header />
          <div className="pb-20 sm:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/auth-success" element={<AuthSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
              <Route path="/category/:categoryKey" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/products/:id" element={<ProductDetails />} /> {/* Legacy/Alias */}

              <Route element={<PrivateRoute />} >
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/update-product/:id" element={<UpdateProduct />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route path="/order/:id" element={<Order />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/seller-dashboard" element={<SellerDashboard />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/register-vendor" element={<RegisterVendor />} />
              </Route>

              <Route element={<AdminRoute />} >
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/moderation" element={<AdminProductModeration />} />
              </Route>

              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
          <BottomNav />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
