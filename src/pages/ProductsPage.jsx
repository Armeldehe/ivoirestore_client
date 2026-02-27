import { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { useProducts } from "../hooks/useProducts";
import { HiAdjustments, HiX } from "react-icons/hi";

const SORT_OPTIONS = [
  { value: "", label: "Plus récents" },
  { value: "price", label: "Prix croissant" },
  { value: "-price", label: "Prix décroissant" },
];

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { products, loading, total, totalPages, params, setParams } =
    useProducts({ limit: 12 });

  const set = (updates) => setParams((p) => ({ ...p, ...updates, page: 1 }));

  const handleSearch = (val) => set({ search: val });
  const handleSort = (val) => set({ sort: val });
  const handlePage = (n) => setParams((p) => ({ ...p, page: n }));

  const applyPrice = () =>
    set({ minPrice: minPrice || undefined, maxPrice: maxPrice || undefined });
  const resetPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    set({ minPrice: undefined, maxPrice: undefined });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="section-tag mb-1">Nos produits</p>
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-3xl font-black text-white">Catalogue</h1>
            <p className="text-slate-500 text-sm">
              {loading ? "..." : `${total} produit${total !== 1 ? "s" : ""}`}
            </p>
          </div>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar value={params.search || ""} onChange={handleSearch} />
          </div>
          <select
            onChange={(e) => handleSort(e.target.value)}
            className="input-field sm:w-52"
          >
            {SORT_OPTIONS.map((o) => (
              <option
                key={o.value}
                value={o.value}
                className="bg-[var(--bg-input)]"
              >
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2 whitespace-nowrap"
          >
            <HiAdjustments className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {/* Price filter */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card-flat p-4 mb-6 flex flex-wrap gap-4 items-end"
          >
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Prix min (FCFA)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="input-field w-36 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Prix max (FCFA)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="500 000"
                className="input-field w-36 py-2.5 text-sm"
              />
            </div>
            <button onClick={applyPrice} className="btn-primary py-2.5 text-sm">
              Filtrer
            </button>
            <button
              onClick={resetPrice}
              className="btn-ghost py-2.5 text-sm flex items-center gap-1"
            >
              <HiX className="w-3 h-3" /> Réinitialiser
            </button>
          </motion.div>
        )}

        {/* Grid */}
        <ProductGrid products={products} loading={loading} cols={4} />

        {/* Pagination */}
        <Pagination
          currentPage={params.page || 1}
          totalPages={totalPages}
          onPageChange={handlePage}
        />
      </div>
    </MainLayout>
  );
}
