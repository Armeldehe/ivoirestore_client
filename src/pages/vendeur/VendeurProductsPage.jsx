import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiSearch } from "react-icons/hi";
import VendeurLayout from "../../layouts/VendeurLayout";
import { getVendeurProducts, deleteVendeurProduct } from "../../services/api";
import toast from "react-hot-toast";

export default function VendeurProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = async (p = 1, s = "") => {
    setLoading(true);
    try {
      const data = await getVendeurProducts({ page: p, limit: 12, search: s });
      setProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, search);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer le produit "${name}" ?`)) return;
    setDeleting(id);
    try {
      await deleteVendeurProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Produit supprimé !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
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
              Mes Produits
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Gérez les produits de votre boutique
            </p>
          </div>
          <Link
            to="/vendeur/products/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            <HiPlus className="w-4 h-4" /> Ajouter un produit
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-secondary px-4 py-2.5 text-sm">
            Rechercher
          </button>
        </form>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-64 skeleton" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-500 text-lg mb-4">Aucun produit trouvé</p>
            <Link
              to="/vendeur/products/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
              }}
            >
              <HiPlus className="w-4 h-4" /> Ajouter votre premier produit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden group"
              >
                {/* Image */}
                <div className="h-40 bg-[var(--bg-hover)] overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <HiPlus className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="font-semibold text-sm truncate mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-emerald-400 font-bold text-lg">
                      {new Intl.NumberFormat("fr-FR").format(product.price)}{" "}
                      FCFA
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        product.stock > 0
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      Stock: {product.stock}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/vendeur/products/edit/${product._id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      <HiPencil className="w-3.5 h-3.5" /> Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      disabled={deleting === product._id}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchProducts(i + 1, search)}
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
    </VendeurLayout>
  );
}
