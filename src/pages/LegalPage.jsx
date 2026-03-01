import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import usePageMeta from "../hooks/usePageMeta";

export default function LegalPage() {
  usePageMeta(
    "Mentions Légales — IvoireStore",
    "Mentions légales de IvoireStore, plateforme ecommerce en Côte d'Ivoire.",
  );

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <h1 className="section-title mb-8">Mentions Légales</h1>

        <div className="space-y-8 text-[var(--text-secondary)] text-sm leading-relaxed">
          <section className="bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-2xl p-6">
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-4">
              Éditeur de la plateforme
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--text-secondary)]">Nom :</span>{" "}
                <strong className="text-[var(--text-primary)]">
                  IvoireStore
                </strong>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Statut :</span>{" "}
                Plateforme e-commerce multi-vendeurs
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Pays :</span>{" "}
                Côte d'Ivoire
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Ville :</span>{" "}
                Abidjan
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">
                  Téléphone :
                </span>{" "}
                <a
                  href="tel:+2250702838206"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  +225 07 02 83 82 06
                </a>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Email :</span>{" "}
                <a
                  href="mailto:contact@ivoirestore.com"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  contact@ivoirestore.com
                </a>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              Activité
            </h2>
            <p>
              IvoireStore est une plateforme technologique de mise en relation
              (marketplace) entre des boutiques partenaires vérifiées et des
              consommateurs en Côte d'Ivoire. La plateforme fournit des services
              d'hébergement de catalogues, de passation de commandes, et de
              calcul analytique pour les vendeurs, le tout avec un système de
              commissionnement sur les ventes confirmées.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              Hébergement
            </h2>
            <p>
              L'infrastructure technique d'IvoireStore (front-end et back-end)
              est hébergée sur des serveurs cloud internationaux (Vercel /
              Render) assurant une très haute disponibilité, le chiffrement des
              données de bout en bout et des sauvegardes redondantes de la base
              de données (MongoDB Atlas).
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              Propriété intellectuelle
            </h2>
            <p>
              Le code source, le design, le logo et la marque "IvoireStore"
              appartiennent exclusivement à ses concepteurs. Toutefois,{" "}
              <strong className="text-[var(--text-primary)] font-semibold">
                les textes, images de produits et logos de boutiques
              </strong>{" "}
              appartiennent à leurs propriétaires/boutiques respectifs sous leur
              entière responsabilité légale.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              Responsabilité
            </h2>
            <p>
              En sa qualité stricte d'hébergeur de données au sens de la loi,
              IvoireStore ne procède qu'à un contrôle a posteriori. Ainsi, la
              plateforme ne peut être tenue pour responsable des contenus
              frauduleux, trompeurs ou contrefaits uploadés par les boutiques
              partenaires, et s'engage uniquement au retrait de ces contenus dès
              notification probante.
            </p>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
}
