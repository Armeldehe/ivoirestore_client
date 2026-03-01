import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiCollection,
  HiShoppingBag,
  HiCurrencyDollar,
  HiTrendingUp,
  HiPlus,
} from "react-icons/hi";
import VendeurLayout from "../../layouts/VendeurLayout";
import {
  getVendeurProducts,
  getVendeurOrders,
  getVendeurCommissions,
} from "../../services/api";

function StatCard({ icon: Icon, label, value, color, suffix = "", index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass-card p-5 hover:border-emerald-500/20 transition-all duration-500 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-[var(--text-secondary)] text-xs font-medium mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-[var(--text-primary)]">
        {value != null
          ? new Intl.NumberFormat("fr-FR").format(value) + suffix
          : "—"}
      </p>
    </motion.div>
  );
}

export default function VendeurDashboardPage() {
  const [products, setProducts] = useState({ total: 0 });
  const [orders, setOrders] = useState({ total: 0, data: [] });
  const [commissions, setCommissions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getVendeurProducts({ limit: 1 }).catch(() => ({ total: 0 })),
      getVendeurOrders({ limit: 5 }).catch(() => ({ total: 0, data: [] })),
      getVendeurCommissions().catch(() => ({
        data: {
          commissionDue: 0,
          commissionPaid: 0,
          totalRevenue: 0,
          totalOrders: 0,
        },
      })),
    ]).then(([p, o, c]) => {
      setProducts(p);
      setOrders(o);
      setCommissions(c.data);
      setLoading(false);
    });
  }, []);

  const statCards = [
    {
      icon: HiCollection,
      label: "Mes Produits",
      value: products.total,
      color: "bg-blue-400/15 text-blue-400",
    },
    {
      icon: HiShoppingBag,
      label: "Commandes reçues",
      value: commissions?.totalOrders || 0,
      color: "bg-emerald-400/15 text-emerald-400",
    },
    {
      icon: HiCurrencyDollar,
      label: "Commission due",
      value: commissions?.commissionDue || 0,
      suffix: " FCFA",
      color: "bg-amber-400/15 text-amber-400",
    },
    {
      icon: HiTrendingUp,
      label: "Chiffre d'affaires",
      value: commissions?.totalRevenue || 0,
      suffix: " FCFA",
      color: "bg-purple-400/15 text-purple-400",
    },
  ];

  return (
    <VendeurLayout>
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/vendeur/products/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            <HiPlus className="w-4 h-4" /> Ajouter un produit
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c, i) =>
            loading ? (
              <div key={i} className="glass-card p-5 h-36 skeleton" />
            ) : (
              <StatCard key={i} {...c} index={i} />
            ),
          )}
        </div>

        {/* Commission Info */}
        {!loading && commissions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-[var(--text-primary)] font-bold text-sm mb-4">
              💰 Résumé des commissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
                <p className="text-slate-500 text-xs mb-1">Commission due</p>
                <p className="text-2xl font-bold text-amber-400">
                  {new Intl.NumberFormat("fr-FR").format(
                    commissions.commissionDue || 0,
                  )}{" "}
                  FCFA
                </p>
              </div>
              <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
                <p className="text-slate-500 text-xs mb-1">Commission payée</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {new Intl.NumberFormat("fr-FR").format(
                    commissions.commissionPaid || 0,
                  )}{" "}
                  FCFA
                </p>
              </div>
              <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
                <p className="text-slate-500 text-xs mb-1">
                  Total commandes traitées
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {commissions.totalOrders || 0}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[var(--text-primary)] font-bold text-lg">
              Commandes récentes
            </h2>
            <Link
              to="/vendeur/orders"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
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
                      "Produit",
                      "Montant",
                      "Commission",
                      "Statut",
                      "Date",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-3 first:pl-5">
                            <div className="h-4 skeleton rounded-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (orders.data || []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-10 text-slate-500"
                      >
                        Aucune commande reçue pour le moment
                      </td>
                    </tr>
                  ) : (
                    (orders.data || []).map((order, i) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <td className="text-[var(--text-primary)] font-medium">
                          {order.customerName}
                        </td>
                        <td className="text-[var(--text-secondary)] max-w-[140px] truncate">
                          {order.product?.name || "—"}
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
                                  : "bg-purple-500/15 text-purple-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                order.status === "transmitted"
                                  ? "bg-blue-400"
                                  : order.status === "delivered"
                                    ? "bg-emerald-400"
                                    : "bg-purple-400"
                              }`}
                            />
                            {order.status === "transmitted"
                              ? "Transmise"
                              : order.status === "delivered"
                                ? "Livrée"
                                : "Commission payée"}
                          </span>
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
    </VendeurLayout>
  );
}
