import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiShoppingBag,
  HiArrowLeft,
  HiStar,
  HiLocationMarker,
  HiPhone,
} from "react-icons/hi";
import { HiShieldCheck } from "react-icons/hi2";
import MainLayout from "../layouts/MainLayout";
import OrderModal from "../components/OrderModal";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../context/CartContext";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";
function formatPrice(n) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="aspect-square skeleton rounded-2xl" />
      <div className="space-y-4 pt-4">
        <div className="h-4 skeleton rounded-full w-1/4" />
        <div className="h-8 skeleton rounded-full w-3/4" />
        <div className="h-6 skeleton rounded-full w-1/3" />
        <div className="h-20 skeleton rounded-xl" />
        <div className="h-12 skeleton rounded-xl" />
        <div className="h-12 skeleton rounded-xl" />
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addItem } = useCart();
  const [selectedImg, setSelectedImg] = useState(0);
  const [orderOpen, setOrderOpen] = useState(false);

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-6xl mb-5">⚠️</p>
          <p
            className="text-xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Produit introuvable
          </p>
          <p className="text-slate-400 text-sm mb-6">
            Ce produit n'existe pas ou a été retiré.
          </p>
          <Link to="/products" className="btn-primary">
            ← Retour au catalogue
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/products" className="btn-ghost inline-flex mb-8 -ml-2">
          <HiArrowLeft className="w-4 h-4" /> Retour au catalogue
        </Link>

        {loading ? (
          <Skeleton />
        ) : product ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
          >
            {/* Images */}
            <div className="space-y-4">
              <div
                className="aspect-square rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <img
                  src={product.images?.[selectedImg] || PLACEHOLDER}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER;
                  }}
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? "border-orange-500" : "hover:border-[var(--border-hover)]"}`}
                      style={{
                        borderColor:
                          selectedImg === i ? undefined : "var(--border-color)",
                      }}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              {/* Boutique + verified */}
              {product.boutique && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge-orange">{product.boutique.name}</span>
                  {product.boutique.isVerified && (
                    <span className="badge-green flex items-center gap-1">
                      <HiShieldCheck className="w-3 h-3" /> Vérifié
                    </span>
                  )}
                </div>
              )}

              <h1
                className="text-3xl lg:text-4xl font-black leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="w-4 h-4 text-amber-400" />
                ))}
                <span className="text-slate-500 text-sm">(128 avis)</span>
              </div>

              {/* Price */}
              <p className="text-4xl font-black text-orange-400">
                {formatPrice(product.price)}
              </p>

              {/* Stock */}
              <p
                className={`text-sm font-semibold ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}
              >
                {product.stock > 0
                  ? `✓ En stock — ${product.stock} disponible${product.stock > 1 ? "s" : ""}`
                  : "✗ Rupture de stock"}
              </p>

              {/* Description */}
              {product.description && (
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {product.description}
                  </p>
                </div>
              )}

              {/* Boutique info card */}
              {product.boutique && (
                <div className="card-flat p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Vendu par {product.boutique.name}
                    </p>
                    <Link
                      to={`/boutiques/${product.boutique._id}`}
                      className="text-orange-400 text-xs font-bold hover:text-orange-300"
                    >
                      Voir la boutique →
                    </Link>
                  </div>
                  <div className="space-y-1.5">
                    {product.boutique.address && (
                      <p className="text-slate-500 text-xs flex items-center gap-1.5">
                        <HiLocationMarker className="w-3 h-3 text-orange-400" />{" "}
                        {product.boutique.address}
                      </p>
                    )}
                    {product.boutique.phone && (
                      <p className="text-slate-500 text-xs flex items-center gap-1.5">
                        <HiPhone className="w-3 h-3 text-orange-400" />{" "}
                        {product.boutique.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  disabled={!product.isActive || product.stock === 0}
                  onClick={() => setOrderOpen(true)}
                  className="btn-primary flex-1 justify-center py-4 text-base glow-orange"
                >
                  <HiShoppingBag className="w-5 h-5" />
                  Commander maintenant
                </button>
                <button
                  disabled={!product.isActive || product.stock === 0}
                  onClick={() => addItem(product)}
                  className="btn-secondary flex-1 justify-center py-4 text-base"
                >
                  + Panier
                </button>
              </div>

              {/* COD badge */}
              <div className="flex items-center gap-3 bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3">
                <span className="text-orange-400 text-xl">🛡️</span>
                <p className="text-orange-300 text-xs leading-snug">
                  Paiement intégralement à la livraison. Aucun prépaiement
                  requis. Retours acceptés.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>

      <OrderModal
        product={product}
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
      />
    </MainLayout>
  );
}
