import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiExternalLink, HiPlus, HiSearch, HiTrash, HiX } from "react-icons/hi";
import AdminLayout from "../../layouts/AdminLayout";
import { getProducts, getBoutiques, deleteProduct } from "../../services/api";
import toast from "react-hot-toast";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&q=70";

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card p-6 max-w-sm w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-[var(--text-primary)] font-bold text-lg mb-2">
            {title}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="btn-ghost text-sm">
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="btn-danger"
            >
              {loading ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [boutiqueFilter, setBoutiqueFilter] = useState("");
  const [boutiques, setBoutiques] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch boutiques for filter dropdown
  useEffect(() => {
    getBoutiques({ limit: 100 })
      .then((d) => setBoutiques(d.data || []))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        page,
        limit: 15,
        search: search || undefined,
        boutique: boutiqueFilter || undefined,
      });
      setProducts(data.data || []);
      setTP(data.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, boutiqueFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget._id);
    try {
      await deleteProduct(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Produit supprimé !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h2 className="text-[var(--text-primary)] font-bold text-lg">
            Produits
          </h2>
          <Link
            to="/admin/products/add"
            className="btn-primary text-sm py-2.5 px-4"
          >
            <HiPlus className="w-4 h-4" /> Ajouter produit
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-field pl-10 py-2.5 text-sm"
            />
          </div>
          <select
            value={boutiqueFilter}
            onChange={(e) => {
              setBoutiqueFilter(e.target.value);
              setPage(1);
            }}
            className="input-field sm:w-56 py-2.5 text-sm"
          >
            <option value="" className="bg-[var(--bg-input)]">
              Toutes les boutiques
            </option>
            {boutiques.map((b) => (
              <option
                key={b._id}
                value={b._id}
                className="bg-[var(--bg-input)]"
              >
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-premium">
              <thead>
                <tr>
                  {[
                    "Produit",
                    "Boutique",
                    "Prix",
                    "Stock",
                    "Statut",
                    "Actions",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j}>
                          <div className="h-4 skeleton rounded-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-16 text-slate-500"
                    >
                      Aucun produit
                    </td>
                  </tr>
                ) : (
                  products.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || PLACEHOLDER}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-xl bg-navy-800"
                            onError={(e) => {
                              e.target.src = PLACEHOLDER;
                            }}
                          />
                          <span className="text-[var(--text-primary)] font-medium line-clamp-1 max-w-[160px]">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-[var(--text-secondary)]">
                        {p.boutique?.name || "—"}
                      </td>
                      <td className="text-orange-400 font-bold whitespace-nowrap">
                        {new Intl.NumberFormat("fr-FR").format(p.price)} FCFA
                      </td>
                      <td>
                        <span
                          className={
                            p.stock === 0
                              ? "badge-red"
                              : p.stock <= 5
                                ? "badge-amber"
                                : "badge-green"
                          }
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <span
                          className={p.isActive ? "badge-green" : "badge-red"}
                        >
                          {p.isActive ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/products/${p._id}`}
                            target="_blank"
                            className="p-2 bg-[var(--bg-hover)] hover:bg-[var(--bg-card)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                            title="Voir"
                          >
                            <HiExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 bg-[var(--bg-hover)] hover:bg-red-500/10 rounded-lg text-[var(--text-secondary)] hover:text-red-400 transition-all"
                            title="Supprimer"
                          >
                            <HiTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer « ${deleteTarget?.name} » ? Cette action est irréversible.`}
        loading={!!deleting}
      />
    </AdminLayout>
  );
}
