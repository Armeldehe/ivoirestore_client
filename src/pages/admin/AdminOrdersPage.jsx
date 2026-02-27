import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { getOrders, updateOrderStatus, getBoutiques } from "../../services/api";
import OrderDetailModal from "../../components/OrderDetailModal";
import { HiEye, HiSearch } from "react-icons/hi";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "transmitted", label: "Transmise" },
  { value: "delivered", label: "Livrée" },
  { value: "commission_paid", label: "Commission payée" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
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

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success("Statut mis à jour !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
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
                    "Statut",
                    "Date",
                    "",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(9)].map((_, j) => (
                        <td key={j}>
                          <div className="h-4 skeleton rounded-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-16 text-slate-500"
                    >
                      Aucune commande trouvée
                    </td>
                  </tr>
                ) : (
                  orders.map((order, i) => (
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
                          : order.product?.price != null
                            ? new Intl.NumberFormat("fr-FR").format(
                                order.product.price * order.quantity,
                              ) + " FCFA"
                            : "—"}
                      </td>
                      <td>
                        {updating === order._id ? (
                          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`status-dot status-dot-${order.status}`}
                            />
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              className="bg-transparent border border-[var(--border-color)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)] cursor-pointer hover:border-orange-500/50 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500"
                            >
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
                        )}
                      </td>
                      <td className="text-slate-500 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 bg-white/5 hover:bg-orange-500/10 rounded-lg text-slate-400 hover:text-orange-400 transition-all"
                          title="Détails"
                        >
                          <HiEye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
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
        onStatusUpdate={handleStatusChange}
      />
    </AdminLayout>
  );
}
