import { motion } from "framer-motion";
import { HiOfficeBuilding } from "react-icons/hi";

/**
 * Premium placeholder card shown when no real boutiques exist.
 * Displays a "Boutique à louer" call-to-action with glassmorphism design.
 */
export default function PlaceholderBoutiqueCard({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.12,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group glass-card overflow-hidden relative"
    >
      {/* Animated gradient border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(247,132,29,0.15), transparent 40%, rgba(52,67,111,0.12))",
        }}
      />

      {/* Image section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src="/boutique_placeholder.png"
          alt="Espace boutique disponible"
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-full shadow-lg shadow-orange-500/30">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Boutique à louer
          </span>
        </div>
        {/* Icon */}
        <div className="absolute bottom-3 right-3 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
          <HiOfficeBuilding className="w-5 h-5 text-orange-400" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3
            className="font-bold text-base mb-1.5"
            style={{ color: "var(--text-primary)" }}
          >
            Espace disponible
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Espace boutique disponible gratuitement. Contactez-nous pour vendre
            sur IvoireStore.
          </p>
        </div>

        {/* CTA Button */}
        <a
          href="mailto:contact@ivoirestore.ci"
          className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-gradient-to-r from-orange-500/15 to-orange-600/10 border border-orange-500/25 text-orange-400 text-sm font-semibold rounded-xl hover:from-orange-500/25 hover:to-orange-600/20 hover:border-orange-500/40 transition-all duration-300 group/btn"
        >
          <HiOfficeBuilding className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          Devenir partenaire
        </a>
      </div>
    </motion.div>
  );
}
