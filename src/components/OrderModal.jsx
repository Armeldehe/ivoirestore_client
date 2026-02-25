import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiX,
  HiPhone,
  HiLocationMarker,
  HiUser,
  HiShoppingBag,
} from "react-icons/hi";
import { HiShieldCheck } from "react-icons/hi2";
import { useOrder } from "../hooks/useOrder";

function formatPrice(n) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function OrderModal({
  product,
  items = [],
  isOpen,
  onClose,
  clearCart,
}) {
  const navigate = useNavigate();
  const { placeOrder, loading } = useOrder();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerLocation: "",
  });
  const [errors, setErrors] = useState({});

  const isMulti = items.length > 0;
  const activeItems = isMulti ? items : product ? [{ ...product, qty: 1 }] : [];

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Nom requis";
    if (!form.customerPhone.trim()) e.customerPhone = "Téléphone requis";
    if (!form.customerLocation.trim()) e.customerLocation = "Adresse requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Pour le moment le backend traite un produit par commande
      // On boucle donc sur les produits du panier
      for (const item of activeItems) {
        await placeOrder({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerLocation: form.customerLocation,
          product: item._id,
          quantity: item.qty || 1,
        });
      }

      if (clearCart) clearCart();
      onClose();

      // On redirige avec le premier produit pour le visuel du succès
      navigate("/order-success", {
        state: {
          order: { customerName: form.customerName },
          product: activeItems[0],
          isMulti: activeItems.length > 1,
        },
      });
    } catch (_) {
      // L'erreur est gérée par useOrder (toast)
    }
  };

  const totalPrice = activeItems.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0,
  );

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
    className: `input-field ${errors[name] ? "border-red-500 focus:ring-red-500" : ""}`,
  });

  return (
    <AnimatePresence>
      {isOpen && activeItems.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", damping: 30, stiffness: 380 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg bg-navy-900 rounded-2xl border border-white/[0.08] shadow-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] sticky top-0 bg-navy-900 z-10">
                <div>
                  <h2 className="font-bold text-white">
                    Finaliser ma commande
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Paiement à la livraison
                  </p>
                </div>
                <button onClick={onClose} className="btn-ghost p-1.5">
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {/* Products List */}
              <div className="px-5 py-3 space-y-2 bg-navy-800/30 border-b border-white/[0.06]">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Résumé des articles
                </p>
                {activeItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0"
                  >
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80"
                      }
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg bg-navy-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-xs line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        Qté: {item.qty || 1} • {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-orange-400 font-bold text-xs">
                      {formatPrice(item.price * (item.qty || 1))}
                    </div>
                  </div>
                ))}
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-white font-bold text-sm">
                    Total à payer
                  </span>
                  <span className="text-white font-black text-lg">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                    <HiUser className="w-4 h-4" /> Nom complet *
                  </label>
                  <input
                    type="text"
                    placeholder="Jean Kouassi"
                    {...field("customerName")}
                  />
                  {errors.customerName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                    <HiPhone className="w-4 h-4" /> Téléphone *
                  </label>
                  <input
                    type="tel"
                    placeholder="+225 07 00 00 00 00"
                    {...field("customerPhone")}
                  />
                  {errors.customerPhone && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.customerPhone}
                    </p>
                  )}
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                    <HiLocationMarker className="w-4 h-4" /> Adresse de
                    livraison *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Abidjan, Cocody, Riviera 2..."
                    {...field("customerLocation")}
                    className={`input-field resize-none ${errors.customerLocation ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  {errors.customerLocation && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.customerLocation}
                    </p>
                  )}
                </div>

                {/* COD notice */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
                  <HiShieldCheck className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <p className="text-orange-300 text-xs">
                    Aucun prépaiement requis. Vous payez uniquement à la
                    réception ({activeItems.length} article
                    {activeItems.length > 1 ? "s" : ""}).
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-4 text-base"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Passage des commandes...
                    </span>
                  ) : (
                    <>
                      <HiShoppingBag className="w-5 h-5" /> Confirmer la
                      commande
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
