import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiShoppingBag, HiMenu, HiX } from "react-icons/hi";
import { HiMagnifyingGlass, HiSun, HiMoon } from "react-icons/hi2";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/products", label: "Catalogue" },
    { to: "/boutiques", label: "Boutiques" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "backdrop-blur-2xl shadow-2xl" : "bg-transparent"
        }`}
        style={
          scrolled
            ? {
                backgroundColor:
                  theme === "dark"
                    ? "rgba(9,13,30,0.9)"
                    : "rgba(255,255,255,0.85)",
                borderBottom: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo_ivoirestore.png"
                alt="IvoireStore"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-orange-400 bg-orange-500/10"
                        : "hover:bg-[var(--bg-hover)]"
                    }`}
                    style={{
                      color: isActive ? undefined : "var(--text-secondary)",
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="btn-ghost p-2 hover:text-orange-400 transition-colors"
                aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
                title={theme === "dark" ? "Mode clair" : "Mode sombre"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0, scale: 0 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HiSun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0, scale: 0 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HiMoon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <Link
                to="/products"
                className="btn-ghost hidden md:flex p-2 hover:text-orange-400 transition-colors"
                aria-label="Rechercher"
              >
                <HiMagnifyingGlass className="w-5 h-5" />
              </Link>

              <button
                onClick={() => setIsOpen(true)}
                className="relative btn-ghost p-2 hover:text-orange-400 transition-colors"
                aria-label="Panier"
              >
                <HiShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow-md shadow-orange-500/30"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              <button
                className="md:hidden btn-ghost p-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <HiX className="w-5 h-5" />
                ) : (
                  <HiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden backdrop-blur-2xl"
              style={{
                borderTop: `1px solid var(--border-color)`,
                backgroundColor:
                  theme === "dark"
                    ? "rgba(9,13,30,0.98)"
                    : "rgba(255,255,255,0.98)",
              }}
            >
              <nav className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all block ${
                        location.pathname === link.to
                          ? "text-orange-400 bg-orange-500/10"
                          : ""
                      }`}
                      style={{
                        color:
                          location.pathname === link.to
                            ? undefined
                            : "var(--text-secondary)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer />
    </>
  );
}
