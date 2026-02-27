import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiX,
  HiUser,
  HiPhone,
  HiLocationMarker,
  HiShoppingBag,
  HiShieldCheck,
  HiCalendar,
  HiRefresh,
} from "react-icons/hi";
import { updateOrderStatus } from "../services/api";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "transmitted", label: "Transmise" },
  { value: "delivered", label: "Livrée" },
  { value: "commission_paid", label: "Commission payée" },
];

function formatPrice(n) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

function StatusBadge({ status, isUpdating }) {
  if (isUpdating) {
    return (
      <span className="badge-navy flex items-center gap-2">
        <HiRefresh className="w-3 h-3 animate-spin" />
        Mise à jour...
      </span>
    );
  }
  const map = {
    pending: <span className="badge-amber">En attente</span>,
    transmitted: <span className="badge-navy">Transmise</span>,
    delivered: <span className="badge-green">Livrée</span>,
    commission_paid: (
      <span className="badge bg-purple-500/20 text-purple-400">
        Commission payée
      </span>
    ),
  };
  return map[status] || <span className="badge">{status}</span>;
}

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
}) {
  const [updating, setUpdating] = useState(false);
  if (!order) return null;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      toast.success("Statut mis à jour !");
      if (onStatusUpdate) onStatusUpdate(order._id, newStatus);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] shadow-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-primary)] z-10">
                <div>
                  <h2 className="font-bold text-[var(--text-primary)] text-lg">
                    Détails de la commande
                  </h2>
                  <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5">
                    ID: <span className="font-mono">{order._id}</span>
                  </p>
                </div>
                <button onClick={onClose} className="btn-ghost p-1.5">
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Status and Date */}
                <div className="flex flex-wrap items-center justify-between bg-[var(--bg-hover)] p-4 rounded-xl border border-[var(--border-color)] gap-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                      Statut actuel
                    </p>
                    <StatusBadge status={order.status} isUpdating={updating} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                      Changer le statut
                    </p>
                    <select
                      value={order.status}
                      disabled={updating}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)] cursor-pointer hover:border-orange-500/50 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option
                          key={s.value}
                          value={s.value}
                          className="bg-navy-900"
                        >
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-right ml-auto">
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                      Passée le
                    </p>
                    <p className="text-[var(--text-primary)] text-sm font-medium flex items-center gap-1.5 justify-end">
                      <HiCalendar className="w-4 h-4 text-slate-500" />
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Customer Section */}
                <div className="space-y-4">
                  <h3 className="text-[var(--text-primary)] font-bold text-sm flex items-center gap-2">
                    <HiUser className="w-4 h-4 text-orange-400" /> Informations
                    Client
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex flex-col p-3 bg-[var(--bg-hover)] rounded-xl border border-[var(--border-color)]">
                      <span className="text-slate-500 text-[10px] uppercase font-bold mb-0.5">
                        Nom complet
                      </span>
                      <span className="text-[var(--text-primary)] font-semibold">
                        {order.customerName}
                      </span>
                    </div>
                    <div className="flex flex-col p-3 bg-[var(--bg-hover)] rounded-xl border border-[var(--border-color)]">
                      <span className="text-slate-500 text-[10px] uppercase font-bold mb-0.5">
                        Téléphone
                      </span>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-orange-400 font-bold flex items-center gap-1.5"
                      >
                        <HiPhone className="w-4 h-4" /> {order.customerPhone}
                      </a>
                    </div>
                    <div className="flex flex-col p-3 bg-[var(--bg-hover)] rounded-xl border border-[var(--border-color)]">
                      <span className="text-slate-500 text-[10px] uppercase font-bold mb-0.5">
                        Lieu de livraison
                      </span>
                      <span className="text-[var(--text-secondary)] text-sm flex items-start gap-1.5">
                        <HiLocationMarker className="w-4 h-4 text-slate-500 mt-0.5" />
                        {order.customerLocation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Section */}
                <div className="space-y-4">
                  <h3 className="text-[var(--text-primary)] font-bold text-sm flex items-center gap-2">
                    <HiShoppingBag className="w-4 h-4 text-orange-400" />{" "}
                    Article commandé
                  </h3>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] flex gap-4">
                    <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={
                          order.product?.images?.[0] ||
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"
                        }
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--text-primary)] font-bold mb-1 truncate">
                        {order.product?.name || "Produit supprimé"}
                      </p>
                      <p className="text-[var(--text-secondary)] text-xs mb-3">
                        Vendu par :{" "}
                        <span className="text-orange-400 font-medium">
                          {order.boutique?.name || "N/A"}
                        </span>
                      </p>
                      <div className="flex justify-between items-end">
                        <div className="text-slate-500 text-xs">
                          {formatPrice(order.product?.price || 0)} x{" "}
                          {order.quantity}
                        </div>
                        <div className="text-[var(--text-primary)] font-black text-xl">
                          {formatPrice(
                            order.totalPrice ||
                              order.product?.price * order.quantity ||
                              0,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commission Section */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">
                      <HiShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-bold text-sm">
                        Commission IvoireStore
                      </p>
                      <p className="text-orange-300 text-[10px]">
                        Prélevée sur la vente
                      </p>
                    </div>
                  </div>
                  <div className="text-orange-400 font-black text-lg">
                    {formatPrice(order.commissionAmount || 0)}
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-6 border-t border-[var(--border-color)] flex gap-3">
                <button
                  onClick={onClose}
                  className="btn-secondary w-full justify-center"
                >
                  Fermer
                </button>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="btn-primary w-full justify-center gap-2"
                >
                  <HiPhone className="w-4 h-4" /> Appeler le client
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
