import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

// Public pages
import Home from "../pages/public/Home.jsx";
import StoreDiscovery from "../pages/public/StoreDiscovery.jsx";
import StorePage from "../pages/public/StorePage.jsx";

// Auth pages
import Login from "../pages/auth/Login.jsx";
import RegisterChoice from "../pages/auth/RegisterChoice.jsx";
import RegisterCustomer from "../pages/auth/RegisterCustomer.jsx";
import RegisterVendor from "../pages/auth/RegisterVendor.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

// Customer pages
import ProductListing from "../pages/customer/ProductListing.jsx";
import ProductDetails from "../pages/customer/ProductDetails.jsx";
import Cart from "../pages/customer/Cart.jsx";
import Checkout from "../pages/customer/Checkout.jsx";
import OrderConfirmation from "../pages/customer/OrderConfirmation.jsx";

// Customer dashboard
import Profile from "../pages/customer/dashboard/Profile.jsx";
import Orders from "../pages/customer/dashboard/Orders.jsx";
import OrderDetails from "../pages/customer/dashboard/OrderDetails.jsx";
import Wishlist from "../pages/customer/dashboard/Wishlist.jsx";
import Addresses from "../pages/customer/dashboard/Addresses.jsx";
import Settings from "../pages/customer/dashboard/Settings.jsx";

// Vendor pages
import VendorDashboard from "../pages/vendor/Dashboard.jsx";
import VendorProducts from "../pages/vendor/Products.jsx";
import VendorProductForm from "../pages/vendor/ProductForm.jsx";
import VendorInventory from "../pages/vendor/Inventory.jsx";
import VendorOrders from "../pages/vendor/Orders.jsx";
import VendorStoreSettings from "../pages/vendor/StoreSettings.jsx";
import VendorAnalytics from "../pages/vendor/Analytics.jsx";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import AdminStores from "../pages/admin/Stores.jsx";

// Route protection
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/stores" element={<StoreDiscovery />} />
        <Route path="/stores/:storeId" element={<StorePage />} />

        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:productId" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />
      </Route>

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterChoice />} />
        <Route path="/register/customer" element={<RegisterCustomer />} />
        <Route path="/register/vendor" element={<RegisterVendor />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ================= CUSTOMER ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/customer/profile" element={<Profile />} />
        <Route path="/customer/orders" element={<Orders />} />
        <Route
          path="/customer/orders/:orderId"
          element={<OrderDetails />}
        />
        <Route path="/customer/wishlist" element={<Wishlist />} />
        <Route path="/customer/addresses" element={<Addresses />} />
        <Route path="/customer/settings" element={<Settings />} />
      </Route>

      {/* ================= VENDOR ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["vendor"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/products" element={<VendorProducts />} />
        <Route path="/vendor/products/new" element={<VendorProductForm />} />
        <Route
          path="/vendor/products/:productId/edit"
          element={<VendorProductForm />}
        />
        <Route path="/vendor/inventory" element={<VendorInventory />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route
          path="/vendor/store-settings"
          element={<VendorStoreSettings />}
        />
        <Route path="/vendor/analytics" element={<VendorAnalytics />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/stores" element={<AdminStores />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}