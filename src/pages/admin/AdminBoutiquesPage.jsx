import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiShieldCheck, HiPlus, HiSearch, HiTrash } from "react-icons/hi";
import AdminLayout from "../../layouts/AdminLayout";
import { getBoutiques, deleteBoutique } from "../../services/api";
import toast from "react-hot-toast";

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

export default function AdminBoutiquesPage() {
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchBoutiques = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBoutiques({
        page,
        limit: 15,
        search: search || undefined,
      });
      setBoutiques(data.data || []);
      setTP(data.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchBoutiques();
  }, [fetchBoutiques]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget._id);
    try {
      await deleteBoutique(deleteTarget._id);
      setBoutiques((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast.success("Boutique supprimée !");
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
            Boutiques
          </h2>
          <Link
            to="/admin/boutiques/add"
            className="btn-primary text-sm py-2.5 px-4"
          >
            <HiPlus className="w-4 h-4" /> Ajouter boutique
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="search"
            placeholder="Rechercher une boutique..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-premium">
              <thead>
                <tr>
                  {[
                    "Boutique",
                    "Adresse",
                    "Téléphone",
                    "Commission",
                    "Vérifié",
                    "Date",
                    "",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j}>
                          <div className="h-4 skeleton rounded-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : boutiques.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-16 text-slate-500"
                    >
                      Aucune boutique
                    </td>
                  </tr>
                ) : (
                  boutiques.map((b, i) => (
                    <motion.tr
                      key={b._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <td>
                        <div>
                          <p className="text-[var(--text-primary)] font-semibold">
                            {b.name}
                          </p>
                          {b.description && (
                            <p className="text-slate-500 text-xs line-clamp-1 max-w-[180px]">
                              {b.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="text-[var(--text-secondary)] max-w-[140px] truncate">
                        {b.address || "—"}
                      </td>
                      <td className="text-[var(--text-secondary)]">
                        {b.phone || "—"}
                      </td>
                      <td className="text-orange-400 font-semibold">
                        {b.commissionRate}%
                      </td>
                      <td>
                        {b.isVerified ? (
                          <span className="badge-green flex items-center gap-1 w-fit">
                            <HiShieldCheck className="w-3 h-3" /> Oui
                          </span>
                        ) : (
                          <span className="badge-amber">En attente</span>
                        )}
                      </td>
                      <td className="text-slate-500 text-xs whitespace-nowrap">
                        {new Date(b.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-2 bg-[var(--bg-hover)] hover:bg-red-500/10 rounded-lg text-[var(--text-secondary)] hover:text-red-400 transition-all"
                          title="Supprimer"
                        >
                          <HiTrash className="w-3.5 h-3.5" />
                        </button>
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
        title="Supprimer la boutique"
        message={`Êtes-vous sûr de vouloir supprimer « ${deleteTarget?.name} » ? Tous les produits associés pourraient être affectés.`}
        loading={!!deleting}
      />
    </AdminLayout>
  );
}
