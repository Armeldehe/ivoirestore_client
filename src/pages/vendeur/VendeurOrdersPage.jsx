import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiCheck, HiTruck, HiEye } from "react-icons/hi";
import VendeurLayout from "../../layouts/VendeurLayout";
import OrderDetailModal from "../../components/OrderDetailModal";
import {
  getVendeurOrders,
  markOrderDelivered,
  cancelVendeurOrder,
} from "../../services/api";
import toast from "react-hot-toast";

const STATUS_LABELS = {
  transmitted: "Transmise",
  delivered: "Livrée",
  commission_paid: "Commission payée",
  cancelled: "Annulée",
};

const STATUS_FILTER = [
  { value: "", label: "Toutes" },
  { value: "transmitted", label: "Transmises" },
  { value: "delivered", label: "Livrées" },
  { value: "commission_paid", label: "Commission payée" },
  { value: "cancelled", label: "Annulées" },
];

export default function VendeurOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [delivering, setDelivering] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async (p = 1, statusFilter = "") => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const data = await getVendeurOrders(params);
      setOrders(data.data || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterChange = (value) => {
    setFilter(value);
    fetchOrders(1, value);
  };

  const handleCancelOrder = async (orderId) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir annuler cette commande ? Le stock sera restitué.",
      )
    )
      return;
    setDelivering(orderId);
    try {
      await cancelVendeurOrder(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o,
        ),
      );
      toast.success("Commande annulée avec succès !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDelivering(null);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    setDelivering(orderId);
    try {
      await markOrderDelivered(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "delivered" } : o,
        ),
      );
      toast.success("Commande marquée comme livrée !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDelivering(null);
    }
  };

  return (
    <VendeurLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Mes Commandes
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Commandes transmises par IvoireStore à votre boutique
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTER.map((s) => (
            <button
              key={s.value}
              onClick={() => handleFilterChange(s.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === s.value
                  ? "bg-emerald-500 text-white"
                  : "bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-emerald-500/20"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
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
                    "Montant",
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
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(10)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 skeleton rounded-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-10 text-slate-500"
                    >
                      Aucune commande
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
                      <td className="text-[var(--text-primary)] font-medium">
                        {order.customerName}
                      </td>
                      <td className="text-[var(--text-secondary)]">
                        {order.customerPhone}
                      </td>
                      <td className="text-[var(--text-secondary)] max-w-[120px] truncate">
                        {order.customerLocation}
                      </td>
                      <td className="text-[var(--text-secondary)] max-w-[140px] truncate">
                        {order.product?.name || "—"}
                      </td>
                      <td className="text-[var(--text-primary)] text-center">
                        {order.quantity}
                      </td>
                      <td className="text-emerald-400 font-semibold whitespace-nowrap">
                        {new Intl.NumberFormat("fr-FR").format(
                          order.totalPrice,
                        )}{" "}
                        FCFA
                      </td>
                      <td className="text-amber-400 font-semibold whitespace-nowrap">
                        {new Intl.NumberFormat("fr-FR").format(
                          order.commissionAmount,
                        )}{" "}
                        FCFA
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.status === "transmitted"
                              ? "bg-blue-500/15 text-blue-400"
                              : order.status === "delivered"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : order.status === "cancelled"
                                  ? "bg-red-500/15 text-red-500"
                                  : "bg-purple-500/15 text-purple-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.status === "transmitted"
                                ? "bg-blue-400"
                                : order.status === "delivered"
                                  ? "bg-emerald-400"
                                  : order.status === "cancelled"
                                    ? "bg-red-500"
                                    : "bg-purple-400"
                            }`}
                          />
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="text-slate-500 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {order.status === "transmitted" && (
                            <>
                              <button
                                onClick={() => handleMarkDelivered(order._id)}
                                disabled={delivering === order._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
                              >
                                {delivering === order._id ? (
                                  <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <HiCheck className="w-3.5 h-3.5" />
                                )}
                                Livré
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={delivering === order._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-500 hover:bg-red-500/25 transition-colors disabled:opacity-50"
                              >
                                Annuler
                              </button>
                            </>
                          )}
                          {order.status === "delivered" && (
                            <span className="flex items-center gap-1.5 text-xs text-emerald-400 mr-2">
                              <HiTruck className="w-3.5 h-3.5" /> Livrée
                            </span>
                          )}

                          {/* Viewer de détails */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--bg-hover)] text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Détails"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchOrders(i + 1, filter)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  page === i + 1
                    ? "bg-emerald-500 text-white"
                    : "bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-emerald-500/20"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        isAdmin={false}
      />
    </VendeurLayout>
  );
}
