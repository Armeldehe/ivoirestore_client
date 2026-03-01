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
  HiPaperAirplane,
} from "react-icons/hi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminStats,
  getOrders,
  transmitOrder,
  markCommissionPaid,
  getCommissionStats,
} from "../../services/api";
import OrderDetailModal from "../../components/OrderDetailModal";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: "#f59e0b",
  transmitted: "#3b82f6",
  delivered: "#10b981",
  commission_paid: "#a855f7",
};

const STATUS_LABELS = {
  pending: "En attente",
  transmitted: "Transmise",
  delivered: "Livrée",
  commission_paid: "Commission payée",
};

const STATUS_BADGE = {
  pending: "bg-amber-500/15 text-amber-400",
  transmitted: "bg-blue-500/15 text-blue-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  commission_paid: "bg-purple-500/15 text-purple-400",
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
      <p className="text-[var(--text-secondary)] text-xs font-medium mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-[var(--text-primary)]">
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
  const [commissionData, setCommissionData] = useState(null);
  const [commissionLoading, setCL] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [acting, setActing] = useState(null);

  useEffect(() => {
    getAdminStats()
      .then((d) => setStats(d.data))
      .catch(() => {})
      .finally(() => setSL(false));

    getOrders({ limit: 20 })
      .then((d) =>
        setOrders((d.data || []).filter((o) => o.status !== "commission_paid")),
      )
      .catch(() => {})
      .finally(() => setOL(false));

    getCommissionStats()
      .then((d) => setCommissionData(d))
      .catch(() => {})
      .finally(() => setCL(false));
  }, []);

  const handleTransmit = async (orderId) => {
    setActing(orderId);
    try {
      await transmitOrder(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "transmitted" } : o,
        ),
      );
      toast.success("Commande transmise !");
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
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.success("Commission payée !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActing(null);
    }
  };

  // Build pie chart data
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
      value: commissionData?.totals?.totalPaid || 0,
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

        {/* Charts + Quick Summary */}
        {!statsLoading && pieData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            <div className="glass-card p-6 lg:col-span-1">
              <h3 className="text-[var(--text-primary)] font-bold text-sm mb-4">
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
              <h3 className="text-[var(--text-primary)] font-bold text-sm mb-4">
                Résumé rapide
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
                  <p className="text-slate-500 text-xs mb-1">
                    Commandes en attente
                  </p>
                  <p className="text-2xl font-bold text-amber-400">
                    {stats?.commandes?.pending || 0}
                  </p>
                </div>
                <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
                  <p className="text-slate-500 text-xs mb-1">
                    Commandes livrées
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats?.commandes?.delivered || 0}
                  </p>
                </div>
                <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
                  <p className="text-slate-500 text-xs mb-1">
                    Produits en rupture
                  </p>
                  <p className="text-2xl font-bold text-red-400">
                    {stats?.produits?.outOfStock || 0}
                  </p>
                </div>
                <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
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

        {/* Commission Summary by Boutique */}
        {!commissionLoading && commissionData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-[var(--text-primary)] font-bold text-sm mb-4">
              💰 Commissions dues par boutique
            </h3>

            {/* Global totals */}
            <div className="mb-6">
              <div className="bg-[var(--bg-hover)] rounded-xl p-5 border border-amber-500/20 max-w-sm">
                <p className="text-amber-500/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  Total des commissions dues
                </p>
                <p className="text-3xl font-black text-amber-400">
                  {new Intl.NumberFormat("fr-FR").format(
                    commissionData.totals?.totalDue || 0,
                  )}{" "}
                  FCFA
                </p>
              </div>
            </div>

            {/* Per-boutique breakdown */}
            {commissionData.data &&
            commissionData.data.filter((b) => b.commissionDue > 0).length >
              0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-premium">
                  <thead>
                    <tr>
                      {["Boutique", "Commandes", "Commission due"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {commissionData.data
                      .filter((b) => b.commissionDue > 0)
                      .map((b, i) => (
                        <motion.tr
                          key={b.boutique._id || i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <td className="text-[var(--text-primary)] font-semibold">
                            {b.boutique.name || "—"}
                          </td>
                          <td className="text-[var(--text-secondary)]">
                            {b.deliveredOrders || 0}
                          </td>
                          <td className="text-amber-400 font-semibold whitespace-nowrap">
                            {new Intl.NumberFormat("fr-FR").format(
                              b.commissionDue || 0,
                            )}{" "}
                            FCFA
                          </td>
                        </motion.tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm bg-[var(--bg-hover)] rounded-xl border border-[var(--border-color)]">
                Toutes les commissions ont été réglées ou il n'y a aucune
                commission en attente.
              </div>
            )}
          </motion.div>
        )}

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[var(--text-primary)] font-bold text-lg">
              Commandes récentes
            </h2>
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
                      "Action",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(7)].map((_, j) => (
                          <td key={j} className="px-4 py-3 first:pl-5">
                            <div className="h-4 skeleton rounded-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
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
                        className="cursor-pointer"
                      >
                        <td className="text-[var(--text-primary)] font-medium">
                          {order.customerName}
                        </td>
                        <td className="text-[var(--text-secondary)]">
                          {order.customerPhone}
                        </td>
                        <td className="text-[var(--text-secondary)] max-w-[140px] truncate">
                          {order.product?.name || "—"}
                        </td>
                        <td className="text-orange-400 font-semibold whitespace-nowrap">
                          {order.totalPrice != null
                            ? new Intl.NumberFormat("fr-FR").format(
                                order.totalPrice,
                              ) + " FCFA"
                            : "—"}
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              STATUS_BADGE[order.status] || STATUS_BADGE.pending
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                order.status === "pending"
                                  ? "bg-amber-400"
                                  : order.status === "transmitted"
                                    ? "bg-blue-400"
                                    : order.status === "delivered"
                                      ? "bg-emerald-400"
                                      : "bg-purple-400"
                              }`}
                            />
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </td>
                        <td className="text-slate-500 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            {order.status === "pending" && (
                              <button
                                onClick={() => handleTransmit(order._id)}
                                disabled={acting === order._id}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors disabled:opacity-50"
                                title="Transmettre"
                              >
                                {acting === order._id ? (
                                  <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <HiPaperAirplane className="w-3.5 h-3.5" />
                                )}
                                Transmettre
                              </button>
                            )}
                            {order.status === "delivered" && (
                              <button
                                onClick={() => handleCommissionPaid(order._id)}
                                disabled={acting === order._id}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 transition-colors disabled:opacity-50"
                                title="Commission payée"
                              >
                                {acting === order._id ? (
                                  <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <HiCurrencyDollar className="w-3.5 h-3.5" />
                                )}
                                Payée
                              </button>
                            )}
                          </div>
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
        onStatusUpdate={() => {}}
      />
    </AdminLayout>
  );
}
