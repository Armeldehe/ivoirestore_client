import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiTrash, HiShoppingBag } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import OrderModal from "./OrderModal";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=70";

function formatPrice(n) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQty,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderLeft: "1px solid var(--border-color)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <HiShoppingBag className="w-4 h-4 text-orange-400" />
                  </div>
                  <h2
                    className="font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Mon panier
                  </h2>
                  {totalItems > 0 && (
                    <span className="badge-orange">{totalItems}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-ghost p-1.5"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <HiShoppingBag className="w-10 h-10 text-slate-700" />
                    </div>
                    <div>
                      <p
                        className="font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Panier vide
                      </p>
                      <p className="text-slate-500 text-sm">
                        Ajoutez des produits pour commander
                      </p>
                    </div>
                    <Link
                      to="/products"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary text-sm"
                    >
                      Découvrir les produits
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <img
                        src={item.images?.[0] || PLACEHOLDER}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                        onError={(e) => {
                          e.target.src = PLACEHOLDER;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium line-clamp-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.name}
                        </p>
                        <p className="text-orange-400 text-sm font-bold mt-0.5">
                          {formatPrice(item.price * item.qty)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className="flex items-center gap-2 rounded-lg px-2 py-1"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              border: "1px solid var(--border-color)",
                            }}
                          >
                            <button
                              onClick={() => updateQty(item._id, item.qty - 1)}
                              className="text-slate-400 hover:text-white w-4 text-center font-bold"
                            >
                              −
                            </button>
                            <span
                              className="text-sm w-5 text-center font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item._id, item.qty + 1)}
                              className="text-slate-400 hover:text-white w-4 text-center font-bold"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-400 hover:text-red-300 p-1 transition-colors"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div
                  className="px-5 py-4 space-y-4"
                  style={{ borderTop: "1px solid var(--border-color)" }}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Total estimé
                    </span>
                    <span
                      className="font-black text-xl"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    💳 Paiement à la livraison — aucun prépaiement
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsOrderOpen(true);
                    }}
                    className="btn-primary w-full justify-center py-4"
                  >
                    Commander tout le panier
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        items={items}
        clearCart={clearCart}
      />
    </>
  );
}
