import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiShoppingBag, HiShieldCheck } from "react-icons/hi";
import { HiTruck } from "react-icons/hi2";
import { useCart } from "../context/CartContext";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";

function formatPrice(n) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const image = product.images?.[0] || PLACEHOLDER;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group glass-card overflow-hidden flex flex-col hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500"
    >
      {/* Image */}
      <Link
        to={`/products/${product._id}`}
        className="relative block overflow-hidden bg-navy-900/50"
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = PLACEHOLDER;
            }}
          />
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Badges top */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/20 backdrop-blur-md border border-green-500/20 rounded-lg text-green-400 text-[10px] font-bold">
            <HiTruck className="w-3 h-3" />
            Paiement à la livraison
          </span>
          {product.boutique?.isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/20 backdrop-blur-md border border-blue-500/20 rounded-lg text-blue-400 text-[10px] font-bold">
              <HiShieldCheck className="w-3 h-3" />
              Boutique vérifiée
            </span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-red-500/90 text-white text-[10px] px-2">
              Rupture
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="badge bg-amber-500/90 text-black text-[10px] px-2">
              Presque épuisé
            </span>
          )}
        </div>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 text-sm active:scale-95 disabled:opacity-50"
          >
            <HiShoppingBag className="w-4 h-4" />
            Commander
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        {product.boutique && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
            <span className="text-xs text-orange-400 font-semibold truncate">
              {product.boutique.name}
            </span>
          </div>
        )}

        <Link to={`/products/${product._id}`}>
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 hover:text-orange-300 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
          <span className="text-white font-bold text-base">
            {formatPrice(product.price)}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors group/link"
          >
            Voir
            <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
