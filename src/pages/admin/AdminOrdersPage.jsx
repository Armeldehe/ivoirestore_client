import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getOrders,
  transmitOrder,
  markCommissionPaid,
} from "../../services/api";
import OrderDetailModal from "../../components/OrderDetailModal";
import {
  HiEye,
  HiSearch,
  HiPaperAirplane,
  HiCurrencyDollar,
} from "react-icons/hi";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "En attente",
    color: "bg-amber-500/15 text-amber-400",
  },
  {
    value: "transmitted",
    label: "Transmise",
    color: "bg-blue-500/15 text-blue-400",
  },
  {
    value: "delivered",
    label: "Livrée",
    color: "bg-emerald-500/15 text-emerald-400",
  },
  {
    value: "commission_paid",
    label: "Commission payée",
    color: "bg-purple-500/15 text-purple-400",
  },
  {
    value: "cancelled",
    label: "Annulée",
    color: "bg-red-500/15 text-red-500",
  },
];

const getStatusStyle = (status) => {
  return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [filterStatus, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders({
        page,
        limit: 15,
        status: filterStatus || undefined,
        search: search || undefined,
      });
      setOrders(data.data || []);
      setTP(data.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTransmit = async (orderId) => {
    setActing(orderId);
    try {
      await transmitOrder(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "transmitted" } : o,
        ),
      );
      toast.success("Commande transmise à la boutique !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActing(null);
    }
  };

  const handleCommissionPaid = async (orderId) => {
    setActing(orderId);
    try {
      await markCommissionPaid(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "commission_paid" } : o,
        ),
      );
      toast.success("Commission marquée comme payée !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActing(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header + filters */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[var(--text-primary)] font-bold text-lg">
            Toutes les commandes
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="search"
                placeholder="Rechercher client, produit..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="input-field sm:w-52 py-2.5 text-sm"
            >
              <option value="" className="bg-[var(--bg-input)]">
                Tous les statuts
              </option>
              {STATUS_OPTIONS.map((s) => (
                <option
                  key={s.value}
                  value={s.value}
                  className="bg-[var(--bg-input)]"
                >
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-premium">
              <thead>
                <tr>
                  {[
                    "Client",
                    "Téléphone",
                    "Localisation",
                    "Produit",
                    "Qté",
                    "Total",
                    "Commission",
                    "Statut",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(10)].map((_, j) => (
                        <td key={j}>
                          <div className="h-4 skeleton rounded-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-16 text-slate-500"
                    >
                      Aucune commande trouvée
                    </td>
                  </tr>
                ) : (
                  orders.map((order, i) => {
                    const statusStyle = getStatusStyle(order.status);
                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="text-[var(--text-primary)] font-semibold whitespace-nowrap">
                          {order.customerName}
                        </td>
                        <td className="text-[var(--text-secondary)] whitespace-nowrap">
                          {order.customerPhone}
                        </td>
                        <td className="text-[var(--text-secondary)] max-w-[120px] truncate">
                          {order.customerLocation}
                        </td>
                        <td className="text-[var(--text-secondary)] max-w-[160px] truncate">
                          {order.product?.name || "—"}
                        </td>
                        <td className="text-[var(--text-secondary)] text-center">
                          {order.quantity}
                        </td>
                        <td className="text-orange-400 font-bold whitespace-nowrap">
                          {order.totalPrice != null
                            ? new Intl.NumberFormat("fr-FR").format(
                                order.totalPrice,
                              ) + " FCFA"
                            : "—"}
                        </td>
                        <td className="text-amber-400 font-semibold whitespace-nowrap">
                          {new Intl.NumberFormat("fr-FR").format(
                            order.commissionAmount || 0,
                          )}{" "}
                          FCFA
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.color}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                order.status === "pending"
                                  ? "bg-amber-400"
                                  : order.status === "transmitted"
                                    ? "bg-blue-400"
                                    : order.status === "delivered"
                                      ? "bg-emerald-400"
                                      : order.status === "commission_paid"
                                        ? "bg-purple-400"
                                        : "bg-red-500"
                              }`}
                            />
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="text-slate-500 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            {/* Transmettre — pending only */}
                            {order.status === "pending" && (
                              <button
                                onClick={() => handleTransmit(order._id)}
                                disabled={acting === order._id}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors disabled:opacity-50"
                                title="Transmettre à la boutique"
                              >
                                {acting === order._id ? (
                                  <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <HiPaperAirplane className="w-3.5 h-3.5" />
                                )}
                                Transmettre
                              </button>
                            )}

                            {/* Commission payée — delivered only */}
                            {order.status === "delivered" && (
                              <button
                                onClick={() => handleCommissionPaid(order._id)}
                                disabled={acting === order._id}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 transition-colors disabled:opacity-50"
                                title="Marquer commission payée"
                              >
                                {acting === order._id ? (
                                  <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <HiCurrencyDollar className="w-3.5 h-3.5" />
                                )}
                                Commission payée
                              </button>
                            )}

                            {/* Detail */}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 bg-white/5 hover:bg-orange-500/10 rounded-lg text-slate-400 hover:text-orange-400 transition-all"
                              title="Détails"
                            >
                              <HiEye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--border-color)]">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                ← Précédent
              </button>
              <span className="text-[var(--text-secondary)] text-sm">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </div>
      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusUpdate={() => {}}
      />
    </AdminLayout>
  );
}
