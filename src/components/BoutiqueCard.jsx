import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight, HiShieldCheck } from "react-icons/hi";

export default function BoutiqueCard({ boutique, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="group glass-card overflow-hidden flex flex-col hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500"
    >
      {/* Bannière */}
      <div className="h-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-navy-500/20 to-navy-900 group-hover:from-orange-500/30 transition-all duration-700" />

        {boutique.banner ? (
          <img
            src={boutique.banner}
            alt=""
            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-all duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/[0.06] rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/[0.08]">
              <span className="text-3xl">🏪</span>
            </div>
          </div>
        )}

        {/* Verified badge top right */}
        {boutique.isVerified && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/20 backdrop-blur-md border border-green-500/20 rounded-lg text-green-400 text-[10px] font-bold shadow-lg shadow-green-500/10">
              <HiShieldCheck className="w-3.5 h-3.5" />
              Vérifiée
            </span>
          </div>
        )}

        {/* Decorative dots */}
        <div className="absolute top-3 left-3 flex gap-1.5 opacity-40">
          <div className="w-2 h-2 bg-orange-400 rounded-full" />
          <div className="w-2 h-2 bg-orange-400/60 rounded-full" />
          <div className="w-2 h-2 bg-orange-400/30 rounded-full" />
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-bold text-base leading-snug group-hover:text-orange-300 transition-colors duration-300">
            {boutique.name}
          </h3>
        </div>

        {boutique.description && (
          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {boutique.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-slate-500 text-xs">
            {boutique.address || "Côte d'Ivoire"}
          </span>
          <Link
            to={`/boutiques/${boutique._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/40 rounded-xl text-orange-400 text-xs font-semibold transition-all duration-300 group/btn"
          >
            Voir boutique
            <HiArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
