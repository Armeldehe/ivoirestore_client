import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageLoader from "./components/PageLoader";
import CookieConsent from "./components/CookieConsent";

// Public pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const BoutiquesPage = lazy(() => import("./pages/BoutiquesPage"));
const BoutiqueDetailPage = lazy(() => import("./pages/BoutiqueDetailPage"));

// Legal & Info pages
const CGUPage = lazy(() => import("./pages/CGUPage"));
const CGVPage = lazy(() => import("./pages/CGVPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const RefundPage = lazy(() => import("./pages/RefundPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// Admin pages
import AdminRoute from "./components/AdminRoute";
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));
const AdminBoutiquesPage = lazy(
  () => import("./pages/admin/AdminBoutiquesPage"),
);
const AddBoutiquePage = lazy(() => import("./pages/admin/AddBoutiquePage"));
const AddProductPage = lazy(() => import("./pages/admin/AddProductPage"));

// Vendeur pages
import VendeurRoute from "./components/VendeurRoute";
const VendeurLoginPage = lazy(() => import("./pages/vendeur/VendeurLoginPage"));
const VendeurDashboardPage = lazy(
  () => import("./pages/vendeur/VendeurDashboardPage"),
);
const VendeurProductsPage = lazy(
  () => import("./pages/vendeur/VendeurProductsPage"),
);
const VendeurAddProductPage = lazy(
  () => import("./pages/vendeur/VendeurAddProductPage"),
);
const VendeurEditProductPage = lazy(
  () => import("./pages/vendeur/VendeurEditProductPage"),
);
const VendeurOrdersPage = lazy(
  () => import("./pages/vendeur/VendeurOrdersPage"),
);
const VendeurSettingsPage = lazy(
  () => import("./pages/vendeur/VendeurSettingsPage"),
);

export default function App() {
  const location = useLocation();

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ── Public ── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/boutiques" element={<BoutiquesPage />} />
            <Route path="/boutiques/:id" element={<BoutiqueDetailPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />

            {/* ── Legal & Info ── */}
            <Route path="/cgu" element={<CGUPage />} />
            <Route path="/cgv" element={<CGVPage />} />
            <Route path="/confidentialite" element={<PrivacyPage />} />
            <Route path="/remboursement" element={<RefundPage />} />
            <Route path="/mentions-legales" element={<LegalPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* ── Admin ── */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrdersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProductsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/add"
              element={
                <AdminRoute>
                  <AddProductPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/boutiques"
              element={
                <AdminRoute>
                  <AdminBoutiquesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/boutiques/add"
              element={
                <AdminRoute>
                  <AddBoutiquePage />
                </AdminRoute>
              }
            />

            {/* ── Vendeur ── */}
            <Route path="/vendeur/login" element={<VendeurLoginPage />} />
            <Route
              path="/vendeur"
              element={
                <VendeurRoute>
                  <VendeurDashboardPage />
                </VendeurRoute>
              }
            />
            <Route
              path="/vendeur/products"
              element={
                <VendeurRoute>
                  <VendeurProductsPage />
                </VendeurRoute>
              }
            />
            <Route
              path="/vendeur/products/add"
              element={
                <VendeurRoute>
                  <VendeurAddProductPage />
                </VendeurRoute>
              }
            />
            <Route
              path="/vendeur/products/edit/:id"
              element={
                <VendeurRoute>
                  <VendeurEditProductPage />
                </VendeurRoute>
              }
            />
            <Route
              path="/vendeur/orders"
              element={
                <VendeurRoute>
                  <VendeurOrdersPage />
                </VendeurRoute>
              }
            />
            <Route
              path="/vendeur/settings"
              element={
                <VendeurRoute>
                  <VendeurSettingsPage />
                </VendeurRoute>
              }
            />

            {/* ── 404 ── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      {/* Cookie consent popup */}
      <CookieConsent />
    </>
  );
}
