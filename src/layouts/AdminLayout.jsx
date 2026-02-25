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
      <div className="px-6 py-5 border-b border-white/[0.07]">
        <img
          src="/logo_ivoirestore.png"
          alt="IvoireStore Admin"
          className="h-8 w-auto"
        />
        <p className="text-slate-500 text-xs mt-1 font-medium">
          Administration
        </p>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-4 mb-2">
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
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
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
        <div className="pt-4 mt-4 border-t border-white/[0.05]">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-4 mb-2">
            Actions rapides
          </p>
          {QUICK_ACTIONS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-orange-400 hover:bg-orange-500/5 transition-all duration-200 group"
            >
              <div className="w-7 h-7 bg-white/[0.04] group-hover:bg-orange-500/10 rounded-lg flex items-center justify-center transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </div>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/[0.07] pt-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-white rounded-xl hover:bg-white/5 text-sm transition-colors"
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
            <p className="text-white text-xs font-semibold truncate">
              {admin?.username || "Admin"}
            </p>
            <p className="text-slate-500 text-[10px] truncate">
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
    <div className="min-h-screen bg-navy-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy-900/80 backdrop-blur-xl border-r border-white/[0.07] fixed top-0 bottom-0 left-0 z-40">
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
              className="fixed top-0 bottom-0 left-0 w-72 bg-navy-900 border-r border-white/[0.07] z-50 lg:hidden"
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-2xl border-b border-white/[0.07] px-4 py-3 flex items-center gap-4">
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
            <h1 className="text-white font-bold text-base">
              {NAV_ITEMS.find(
                (n) =>
                  location.pathname === n.to ||
                  (n.to !== "/admin" && location.pathname.startsWith(n.to)),
              )?.label || "Admin"}
            </h1>
            <p className="text-slate-600 text-xs hidden sm:block">
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
