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
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";
import About from "./pages/About";
import WishlistPage from "./pages/WishlistPage";
import "./styles.css";

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

// ✅ Layout wrapper for conditional header/footer
const LayoutWrapper = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const path = location.pathname;
const hideFooter =
  path.startsWith("/admin") ||
  path.startsWith("/mukhi") ||
  path.startsWith("/products") ||
  path.startsWith("/product") ||
  path.startsWith("/wishlist") ||
  path.startsWith("/learn-more");

  

  return (
    <>
      {/* ✅ Keep the header always visible (except admin) */}
      {!path.startsWith("/admin") && <Header />}

      {children}

      {/* ✅ Hide footer on mukhi and admin routes */}
      {!hideFooter && <Footer />}
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

                {/* ✅ Admin Routes with Protected Layout */}
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
