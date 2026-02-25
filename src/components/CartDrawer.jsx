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
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col bg-navy-900 border-l border-white/[0.08]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <HiShoppingBag className="w-4 h-4 text-orange-400" />
                  </div>
                  <h2 className="font-bold text-white">Mon panier</h2>
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
                    <div className="w-20 h-20 bg-navy-800 rounded-2xl flex items-center justify-center">
                      <HiShoppingBag className="w-10 h-10 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">
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
                      className="flex gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]"
                    >
                      <img
                        src={item.images?.[0] || PLACEHOLDER}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg bg-navy-800 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-orange-400 text-sm font-bold mt-0.5">
                          {formatPrice(item.price * item.qty)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-2 bg-navy-800 rounded-lg px-2 py-1 border border-white/[0.06]">
                            <button
                              onClick={() => updateQty(item._id, item.qty - 1)}
                              className="text-slate-400 hover:text-white w-4 text-center font-bold"
                            >
                              −
                            </button>
                            <span className="text-white text-sm w-5 text-center font-semibold">
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
                <div className="px-5 py-4 border-t border-white/[0.08] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Total estimé</span>
                    <span className="text-white font-black text-xl">
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
