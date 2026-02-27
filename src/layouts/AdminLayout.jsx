import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiViewGrid,
  HiShoppingBag,
  HiCollection,
  HiOfficeBuilding,
  HiLogout,
  HiMenu,
  HiX,
  HiExternalLink,
  HiPlus,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin", icon: HiViewGrid, label: "Tableau de bord" },
  { to: "/admin/orders", icon: HiShoppingBag, label: "Commandes" },
  { to: "/admin/products", icon: HiCollection, label: "Produits" },
  { to: "/admin/boutiques", icon: HiOfficeBuilding, label: "Boutiques" },
];

const QUICK_ACTIONS = [
  { to: "/admin/boutiques/add", icon: HiPlus, label: "Ajouter Boutique" },
  { to: "/admin/products/add", icon: HiPlus, label: "Ajouter Produit" },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/admin/login");
  }, [logout, navigate]);

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "p-0" : ""}`}>
      {/* Logo */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <img
          src="/logo_ivoirestore.png"
          alt="IvoireStore Admin"
          className="h-8 w-auto"
        />
        <p
          className="text-xs mt-1 font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          Administration
        </p>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p
          className="text-[10px] font-bold uppercase tracking-widest px-4 mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Menu
        </p>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active =
            location.pathname === to ||
            (to !== "/admin" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                active
                  ? "bg-gradient-to-r from-orange-500/15 to-orange-500/5 text-orange-400 border border-orange-500/20"
                  : "hover:bg-[var(--bg-hover)]"
              }`}
              style={active ? undefined : { color: "var(--text-secondary)" }}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? "text-orange-400" : "group-hover:text-orange-400/60"}`}
              />
              {label}
            </Link>
          );
        })}

        {/* Quick Actions */}
        <div
          className="pt-4 mt-4"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest px-4 mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Actions rapides
          </p>
          {QUICK_ACTIONS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:text-orange-400 hover:bg-orange-500/5 transition-all duration-200 group"
              style={{ color: "var(--text-tertiary)" }}
            >
              <div
                className="w-7 h-7 group-hover:bg-orange-500/10 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: "var(--bg-hover)" }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div
        className="px-3 pb-4 space-y-1 pt-3"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[var(--bg-hover)] text-sm transition-colors"
          style={{ color: "var(--text-tertiary)" }}
        >
          <HiExternalLink className="w-4 h-4" /> Voir le site
        </Link>
        <div className="px-4 py-2.5 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl flex items-center justify-center border border-orange-500/20">
            <span className="text-orange-400 text-xs font-bold">
              {admin?.username?.[0]?.toUpperCase() || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {admin?.username || "Admin"}
            </p>
            <p
              className="text-[10px] truncate"
              style={{ color: "var(--text-tertiary)" }}
            >
              {admin?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl text-sm transition-all"
        >
          <HiLogout className="w-4 h-4" /> Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 backdrop-blur-xl fixed top-0 bottom-0 left-0 z-40"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 bottom-0 left-0 w-72 z-50 lg:hidden"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderRight: "1px solid var(--border-color)",
              }}
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 backdrop-blur-2xl px-4 py-3 flex items-center gap-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--bg-primary) 90%, transparent)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <button
            className="lg:hidden btn-ghost p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <HiX className="w-5 h-5" />
            ) : (
              <HiMenu className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <h1
              className="font-bold text-base"
              style={{ color: "var(--text-primary)" }}
            >
              {NAV_ITEMS.find(
                (n) =>
                  location.pathname === n.to ||
                  (n.to !== "/admin" && location.pathname.startsWith(n.to)),
              )?.label || "Admin"}
            </h1>
            <p
              className="text-xs hidden sm:block"
              style={{ color: "var(--text-muted)" }}
            >
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl flex items-center justify-center border border-orange-500/20">
              <span className="text-orange-400 text-xs font-bold">
                {admin?.username?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
