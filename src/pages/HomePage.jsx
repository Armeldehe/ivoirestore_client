import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import ProductCard from "../components/ProductCard";
import BoutiqueCard from "../components/BoutiqueCard";
import PlaceholderBoutiqueCard from "../components/PlaceholderBoutiqueCard";
import HorizontalCarousel from "../components/HorizontalCarousel";
import ReviewsSection from "../components/ReviewsSection";
import { useProducts } from "../hooks/useProducts";
import { getBoutiques } from "../services/api";

/* ── Skeleton loaders ── */
function SkeletonProduct() {
  return (
    <div className="glass-card overflow-hidden h-full">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-3 skeleton rounded-full w-1/3" />
        <div className="h-4 skeleton rounded-full w-3/4" />
        <div className="h-4 skeleton rounded-full w-1/2" />
      </div>
    </div>
  );
}

function SkeletonBoutique() {
  return (
    <div className="glass-card overflow-hidden h-full">
      <div className="h-32 skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 skeleton rounded-full w-2/3" />
        <div className="h-3 skeleton rounded-full w-full" />
        <div className="h-3 skeleton rounded-full w-1/2" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { products, loading: prodLoading } = useProducts({
    limit: 12,
    page: 1,
  });
  const [boutiques, setBoutiques] = useState([]);
  const [boutLoading, setBoutLoading] = useState(true);

  useEffect(() => {
    getBoutiques({ limit: 10 })
      .then((data) => setBoutiques(data.data || []))
      .catch(() => {})
      .finally(() => setBoutLoading(false));
  }, []);

  return (
    <MainLayout>
      {/* Hero */}
      <HeroSection />

      {/* ═══════════════════ PRODUITS POPULAIRES ═══════════════════ */}
      <section className="py-20 relative overflow-hidden">
        {/* Decorative background orb */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="section-tag mb-2"
              >
                Sélection du moment
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title"
              >
                Produits populaires
              </motion.h2>
            </div>
            <Link
              to="/products"
              className="btn-secondary hidden sm:flex items-center gap-2"
            >
              Tout voir <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Carousel */}
          {prodLoading ? (
            <div className="flex gap-5 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="shrink-0"
                  style={{ width: "clamp(260px, 28vw, 320px)" }}
                >
                  <SkeletonProduct />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <HorizontalCarousel autoScrollSpeed={4500}>
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </HorizontalCarousel>
          ) : (
            <div className="py-14 text-center">
              <p className="text-slate-500">Aucun produit disponible.</p>
            </div>
          )}

          {/* Mobile see all link */}
          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="btn-primary px-6 text-sm">
              Explorer le catalogue <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BOUTIQUES VÉRIFIÉES ═══════════════════ */}
      <section
        id="boutiques"
        className="py-20 relative overflow-hidden"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* Decorative background orb */}
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-navy-500/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="section-tag mb-2"
              >
                Nos boutiques partenaires
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title"
              >
                Boutiques vérifiées
              </motion.h2>
            </div>
            <Link
              to="/boutiques"
              className="btn-secondary hidden sm:flex items-center gap-2"
            >
              Voir tout <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Carousel */}
          {boutLoading ? (
            <div className="flex gap-5 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="shrink-0"
                  style={{ width: "clamp(260px, 28vw, 320px)" }}
                >
                  <SkeletonBoutique />
                </div>
              ))}
            </div>
          ) : boutiques.length > 0 ? (
            <HorizontalCarousel autoScrollSpeed={5000}>
              {boutiques.map((boutique, i) => (
                <BoutiqueCard
                  key={boutique._id}
                  boutique={boutique}
                  index={i}
                />
              ))}
            </HorizontalCarousel>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[0, 1, 2, 3].map((i) => (
                <PlaceholderBoutiqueCard key={i} index={i} />
              ))}
            </div>
          )}

          {/* Mobile see all link */}
          <div className="text-center mt-8 sm:hidden">
            <Link to="/boutiques" className="btn-primary px-6 text-sm">
              Voir les boutiques <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection />

      {/* Features */}
      <FeaturesSection />

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-navy-600 p-10 md:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <p className="text-orange-100 text-sm font-semibold uppercase tracking-widest mb-3">
                Vous avez une boutique ?
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Rejoignez IvoireStore
              </h2>
              <p className="text-orange-100 text-base mb-8 max-w-xl mx-auto">
                Vendez vos produits à travers toute la Côte d'Ivoire. Commission
                transparente, support dédié.
              </p>
              <a
                href="mailto:contact@ivoirestore.ci"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-xl"
              >
                Nous contacter →
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
