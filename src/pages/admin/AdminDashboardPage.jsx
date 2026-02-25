import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiShoppingBag,
  HiCollection,
  HiOfficeBuilding,
  HiCurrencyDollar,
  HiArrowUp,
  HiPlus,
} from "react-icons/hi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminStats,
  getOrders,
  updateOrderStatus,
} from "../../services/api";
import OrderDetailModal from "../../components/OrderDetailModal";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "transmitted", label: "Transmise" },
  { value: "delivered", label: "Livrée" },
  { value: "commission_paid", label: "Commission payée" },
];

const STATUS_COLORS = {
  pending: "#f59e0b",
  transmitted: "#3b82f6",
  delivered: "#10b981",
  commission_paid: "#a855f7",
};

function AnimatedNumber({ value, suffix = "" }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    if (value == null) return;
    const num =
      typeof value === "string"
        ? parseInt(value.replace(/\D/g, ""), 10)
        : value;
    if (isNaN(num)) {
      setDisplayed(value);
      return;
    }
    let start = 0;
    const duration = 800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (num - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return (
    <>
      {typeof value === "string" && isNaN(parseInt(value))
        ? value
        : new Intl.NumberFormat("fr-FR").format(displayed) + suffix}
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  index,
  suffix = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass-card p-5 hover:border-orange-500/20 transition-all duration-500 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {sub && (
          <span className="text-green-400 text-xs flex items-center gap-0.5 bg-green-500/10 px-2 py-0.5 rounded-full">
            <HiArrowUp className="w-3 h-3" /> {sub}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
      <p className="text-3xl font-black text-white">
        {value != null ? <AnimatedNumber value={value} suffix={suffix} /> : "—"}
      </p>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setSL] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOL] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getAdminStats()
      .then((d) => setStats(d.data))
      .catch(() => {})
      .finally(() => setSL(false));

    getOrders({ limit: 8 })
      .then((d) => setOrders(d.data || []))
      .catch(() => {})
      .finally(() => setOL(false));
  }, []);

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

  // Build pie chart data from stats
  const pieData = stats?.commandes
    ? [
        {
          name: "En attente",
          value: stats.commandes.pending || 0,
          color: STATUS_COLORS.pending,
        },
        {
          name: "Transmises",
          value: stats.commandes.transmitted || 0,
          color: STATUS_COLORS.transmitted,
        },
        {
          name: "Livrées",
          value: stats.commandes.delivered || 0,
          color: STATUS_COLORS.delivered,
        },
        {
          name: "Commission",
          value: stats.commandes.commission_paid || 0,
          color: STATUS_COLORS.commission_paid,
        },
      ].filter((d) => d.value > 0)
    : [];

  const statCards = [
    {
      icon: HiShoppingBag,
      label: "Total commandes",
      value: stats?.commandes?.total,
      sub: "Historique",
      color: "bg-blue-400/15 text-blue-400",
    },
    {
      icon: HiCurrencyDollar,
      label: "Commissions",
      value: stats?.revenuCommission,
      color: "bg-orange-400/15 text-orange-400",
      suffix: " FCFA",
    },
    {
      icon: HiCollection,
      label: "Produits actifs",
      value: stats?.produits?.total,
      color: "bg-green-400/15 text-green-400",
    },
    {
      icon: HiOfficeBuilding,
      label: "Boutiques",
      value: stats?.boutiques?.total,
      color: "bg-purple-400/15 text-purple-400",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/boutiques/add"
            className="btn-primary text-sm py-2.5 px-4"
          >
            <HiPlus className="w-4 h-4" /> Nouvelle boutique
          </Link>
          <Link
            to="/admin/products/add"
            className="btn-secondary text-sm py-2.5 px-4"
          >
            <HiPlus className="w-4 h-4" /> Nouveau produit
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c, i) =>
            statsLoading ? (
              <div key={i} className="glass-card p-5 h-36 skeleton" />
            ) : (
              <StatCard key={i} {...c} index={i} />
            ),
          )}
        </div>

        {/* Charts + quick info */}
        {!statsLoading && pieData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            <div className="glass-card p-6 lg:col-span-1">
              <h3 className="text-white font-bold text-sm mb-4">
                Répartition commandes
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(17,24,48,0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {pieData.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-slate-400"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: d.color }}
                    />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-center">
              <h3 className="text-white font-bold text-sm mb-4">
                Résumé rapide
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  <p className="text-slate-500 text-xs mb-1">
                    Commandes en attente
                  </p>
                  <p className="text-2xl font-bold text-amber-400">
                    {stats?.commandes?.pending || 0}
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  <p className="text-slate-500 text-xs mb-1">
                    Commandes livrées
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats?.commandes?.delivered || 0}
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  <p className="text-slate-500 text-xs mb-1">
                    Produits en rupture
                  </p>
                  <p className="text-2xl font-bold text-red-400">
                    {stats?.produits?.outOfStock || 0}
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  <p className="text-slate-500 text-xs mb-1">
                    Boutiques vérifiées
                  </p>
                  <p className="text-2xl font-bold text-blue-400">
                    {stats?.boutiques?.verified || stats?.boutiques?.total || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-lg">Commandes récentes</h2>
            <Link
              to="/admin/orders"
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              Voir tout →
            </Link>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-premium">
                <thead>
                  <tr>
                    {[
                      "Client",
                      "Téléphone",
                      "Produit",
                      "Montant",
                      "Statut",
                      "Date",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-3 first:pl-5">
                            <div className="h-4 skeleton rounded-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
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
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="text-white font-medium">
                          {order.customerName}
                        </td>
                        <td className="text-slate-400">
                          {order.customerPhone}
                        </td>
                        <td className="text-slate-300 max-w-[140px] truncate">
                          {order.product?.name || "—"}
                        </td>
                        <td className="text-orange-400 font-semibold whitespace-nowrap">
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
                        <td onClick={(e) => e.stopPropagation()}>
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
                                className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-xs text-white cursor-pointer hover:border-orange-500/50 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                          )}
                        </td>
                        <td className="text-slate-500 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
