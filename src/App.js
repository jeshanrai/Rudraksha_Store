import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useApp } from "./context/AppContext";   // ✅ ADDED
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";
import About from "./pages/About";
import WishlistPage from "./pages/WishlistPage";
import "./styles.css";
import { loadStripe } from "@stripe/stripe-js";

// ✅ Lazy load user pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const LearnMorePage = lazy(() => import("./pages/learmore/LearnMorePage"));

// ✅ Mukhi-related pages
const CategoriesSection = lazy(() =>
  import("./components/Home/CategoriesSection")
);
const MukhiDescriptionPage = lazy(() =>
  import("./components/Home/MukhiDescriptionPage")
);

// ✅ Admin layout + pages
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage")
);
const InventoryManagement = lazy(() =>
  import("./pages/admin/InventoryManagement")
);
const SalesManagement = lazy(() =>
  import("./pages/admin/SalesManagement")
);
const OrderManagement = lazy(() =>
  import("./pages/admin/OrderManagement")
);
export const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // ✅ Footer only on homepage
  const showFooter = path === "/";


  return (
  
    <>
      {/* Header visible on all except admin */}
      {!path.startsWith("/admin") && <Header />}

      {children}

      {/* Footer only on homepage */}
      {showFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <LayoutWrapper>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* ✅ Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/learn-more" element={<LearnMorePage />} />

                {/* ✅ Mukhi Routes */}
                <Route path="/mukhi" element={<CategoriesSection />} />
                <Route path="/mukhi/:mukhiId" element={<MukhiDescriptionPage />} />

                {/* ✅ Protected User Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="sales" element={<SalesManagement />} />
                  <Route path="order" element={<OrderManagement />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* ✅ 404 Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </LayoutWrapper>
        </Router>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
