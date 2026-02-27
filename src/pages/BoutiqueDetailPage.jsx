import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiLocationMarker,
  HiPhone,
  HiShieldCheck,
  HiShoppingBag,
  HiSearch,
} from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import { getBoutique, getProducts } from "../services/api";

const PLACEHOLDER_BANNER =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80";

export default function BoutiqueDetailPage() {
  const { id } = useParams();
  const [boutique, setBoutique] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [boutiqueRes, productsRes] = await Promise.all([
          getBoutique(id),
          getProducts({ boutique: id, limit: 50 }),
        ]);
        setBoutique(boutiqueRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()),
  );

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-6xl mb-6">🏪</p>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Boutique introuvable
          </h2>
          <p className="text-slate-400 mb-8 max-w-md">
            Nous n'avons pas pu charger les informations de cette boutique. Elle
            a peut-être été fermée ou l'adresse est incorrecte.
          </p>
          <Link to="/boutiques" className="btn-primary">
            Voir toutes les boutiques
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Banner & Header */}
      <div className="relative h-64 lg:h-80 w-full overflow-hidden">
        <img
          src={boutique?.banner || PLACEHOLDER_BANNER}
          alt=""
          className="w-full h-full object-cover opacity-60 scale-105 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
            <Link
              to="/boutiques"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm mb-6"
            >
              <HiArrowLeft className="w-4 h-4" /> Retour aux boutiques
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-5xl font-black text-white">
                    {loading ? "..." : boutique.name}
                  </h1>
                  {!loading && boutique.isVerified && (
                    <span className="badge-green flex items-center gap-1 py-1 px-3">
                      <HiShieldCheck className="w-4 h-4" /> Vérifié
                    </span>
                  )}
                </div>
                {!loading && boutique.description && (
                  <p className="text-slate-300 max-w-2xl leading-relaxed">
                    {boutique.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 pt-2">
                  {!loading && boutique.address && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <HiLocationMarker className="w-4 h-4 text-orange-500" />{" "}
                      {boutique.address}
                    </div>
                  )}
                  {/* Phone number hidden for customers as requested */}
                </div>
              </div>

              {!loading && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center flex-shrink-0">
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">
                    Articles en vente
                  </p>
                  <p className="text-white text-3xl font-black">
                    {products.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <h2
            className="text-2xl font-bold flex items-center gap-3"
            style={{ color: "var(--text-primary)" }}
          >
            <HiShoppingBag className="w-6 h-6 text-orange-500" />
            Catalogue de la boutique
          </h2>

          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Rechercher dans cette boutique..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 h-12"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-3xl"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="text-5xl mb-4">📦</p>
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Aucun produit trouvé
            </h3>
            <p className="text-slate-500">
              {search
                ? `Aucun résultat pour "${search}"`
                : "Cette boutique n'a pas encore de produits en vente."}
            </p>
          </div>
        )}
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-orange-500/10 to-navy-800 rounded-3xl p-8 lg:p-12 border border-white/5 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <HiShieldCheck className="w-10 h-10 text-orange-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Achat sécurisé sur IvoireStore
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Toutes les boutiques listées sur notre plateforme sont soumises à
              une vérification stricte. Pour votre sécurité,{" "}
              <strong>le paiement s'effectue uniquement à la livraison</strong>{" "}
              après inspection de vos articles. Aucun frais n'est requis à
              l'avance.
            </p>
          </div>
          <button className="btn-primary whitespace-nowrap px-8">
            Signaler un abus
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
