import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import usePageMeta from "../hooks/usePageMeta";
import {
  HiShieldCheck,
  HiGlobe,
  HiLightBulb,
  HiUserGroup,
} from "react-icons/hi";

const values = [
  {
    icon: HiGlobe,
    title: "Accessibilité",
    text: "Rendre le commerce en ligne accessible à toutes les boutiques ivoiriennes, des plus grandes aux plus modestes.",
  },
  {
    icon: HiShieldCheck,
    title: "Confiance",
    text: "Des boutiques vérifiées, des produits authentiques et un paiement sécurisé à la livraison.",
  },
  {
    icon: HiLightBulb,
    title: "Innovation",
    text: "Une plateforme moderne et intuitive, conçue pour offrir l'expérience d'achat la plus fluide possible.",
  },
  {
    icon: HiUserGroup,
    title: "Communauté",
    text: "Un écosystème où commerçants et consommateurs ivoiriens grandissent ensemble.",
  },
];

export default function AboutPage() {
  usePageMeta(
    "À Propos — IvoireStore",
    "Découvrez IvoireStore, la marketplace premium ivoirienne. Notre mission, notre vision et nos objectifs.",
  );

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="section-tag mb-3">Qui sommes-nous ?</p>
          <h1 className="section-title mb-6">À Propos d'IvoireStore</h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            IvoireStore est la première marketplace premium de Côte d'Ivoire,
            connectant les meilleures boutiques locales aux consommateurs à
            travers tout le pays.
          </p>
        </motion.div>

        {/* Mission card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 sm:p-10 mb-12"
        >
          <h2 className="text-white font-bold text-xl mb-4">
            🎯 Notre Mission
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Démocratiser l'accès au commerce en ligne en Côte d'Ivoire en
            offrant une plateforme fiable, moderne et accessible. Nous croyons
            que chaque boutique ivoirienne mérite une vitrine numérique de
            qualité, et chaque consommateur mérite une expérience d'achat
            sécurisée avec le paiement à la livraison.
          </p>
        </motion.div>

        {/* Vision + Objectif */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <h2 className="text-white font-bold text-xl mb-4">
              🔭 Notre Vision
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Devenir la référence incontournable du e-commerce en Afrique de
              l'Ouest, en créant un écosystème numérique où confiance, qualité
              et accessibilité sont au cœur de chaque transaction.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <h2 className="text-white font-bold text-xl mb-4">
              🚀 Notre Objectif
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Accompagner 1 000 boutiques partenaires dans leur transformation
              numérique et servir 100 000 clients satisfaits d'ici 2027, tout en
              maintenant les standards les plus élevés de qualité et de service.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-white font-bold text-xl text-center mb-8">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center hover:border-orange-500/30 transition-all duration-500"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-500/15 rounded-xl flex items-center justify-center">
                  <v.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{v.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {v.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
