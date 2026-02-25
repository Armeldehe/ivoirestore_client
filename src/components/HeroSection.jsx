import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight, HiShoppingBag, HiStar } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";

const STAGGER = 0.12;

function FloatingDot({ className, delay = 0 }) {
  return (
    <motion.div
      animate={{ y: [-6, 6, -6], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute w-1.5 h-1.5 bg-orange-400/40 rounded-full ${className}`}
    />
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Animated BGS */}
      <div className="absolute inset-0 hero-bg pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-navy-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-orange-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating dots */}
      <FloatingDot className="top-[15%] left-[10%]" delay={0} />
      <FloatingDot className="top-[25%] right-[15%]" delay={1} />
      <FloatingDot className="bottom-[30%] left-[20%]" delay={2} />
      <FloatingDot className="top-[40%] left-[40%]" delay={0.5} />
      <FloatingDot className="bottom-[20%] right-[30%]" delay={1.5} />
      <FloatingDot className="top-[60%] right-[10%]" delay={3} />

      {/* Animated gradient orb */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-navy-500/10 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left — Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: STAGGER * 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-orange-500/30 text-orange-300 text-sm font-medium mb-7"
            >
              <HiSparkles className="w-4 h-4 text-orange-400 animate-pulse" />
              La marketplace premium de Côte d'Ivoire
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: STAGGER * 1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.06] tracking-tight mb-5"
            >
              IvoireStore
              <br />
              <span className="text-gradient-orange">Vos boutiques</span>
              <br />
              <span className="text-slate-300">locales en un clic</span>
            </motion.h1>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: STAGGER * 2 }}
              className="text-lg text-slate-400 font-medium mb-3 italic"
            >
              "Vos boutiques, vos offres, votre livraison"
            </motion.p>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: STAGGER * 3 }}
              className="text-slate-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Des milliers de produits authentiques des meilleures boutiques
              ivoiriennes. Paiement à la livraison, aucun prépaiement requis.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: STAGGER * 4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/products"
                className="btn-primary text-base px-8 py-4 glow-orange group"
              >
                <HiShoppingBag className="w-5 h-5" />
                Commander maintenant
                <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#boutiques"
                className="btn-secondary text-base px-8 py-4"
              >
                Nos boutiques
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: STAGGER * 5 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-white/[0.06] max-w-sm mx-auto lg:mx-0"
            >
              {[
                // { v: "500+", l: "Produits" },
                // { v: "50+", l: "Boutiques" },
                // { v: "100%", l: "COD" },
              ].map((s) => (
                <div key={s.l} className="text-center lg:text-left">
                  <p className="text-2xl font-black text-gradient-orange">
                    {s.v}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Logo animé + floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: STAGGER * 2,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-1 flex items-center justify-center relative"
          >
            {/* Glow behind logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-72 h-72 bg-orange-500/15 rounded-full blur-[80px]"
              />
            </div>

            {/* Logo large */}
            <div className="relative z-10 animate-float">
              <div className="w-full max-w-lg aspect-square glass-card p-3 overflow-hidden shadow-2xl">
                <img
                  src="/affiche.png"
                  alt="Affiche IvoireStore"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Floating badge 1 */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-4 right-4 md:right-8 glass-card px-3 py-2 border border-orange-500/20 shadow-lg"
            >
              <div className="flex items-center gap-1">
                <HiStar className="w-4 h-4 text-amber-400" />
                <span className="text-white text-xs font-bold">4.9/5</span>
              </div>
              <p className="text-slate-400 text-[10px]">128 avis</p>
            </motion.div>

            {/* Floating badge 2 */}
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-4 left-4 md:left-8 glass-card px-3 py-2 border border-green-500/20 shadow-lg"
            >
              <p className="text-green-400 text-xs font-bold">✓ Paiement COD</p>
              <p className="text-slate-400 text-[10px]">100% sécurisé</p>
            </motion.div>

            {/* Floating badge 3 */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              className="absolute top-1/2 -left-2 md:left-0 glass-card px-3 py-2 border border-blue-500/20 shadow-lg hidden lg:block"
            >
              <p className="text-blue-400 text-xs font-bold">
                🏪 50+ Boutiques
              </p>
              <p className="text-slate-400 text-[10px]">Vérifiées</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
