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

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <section className="glass-card p-6">
            <h2 className="text-white font-bold text-lg mb-4">
              Éditeur du site
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Nom :</span>{" "}
                <strong className="text-white">IvoireStore</strong>
              </div>
              <div>
                <span className="text-slate-500">Statut :</span> Plateforme
                e-commerce
              </div>
              <div>
                <span className="text-slate-500">Pays :</span> Côte d'Ivoire
              </div>
              <div>
                <span className="text-slate-500">Ville :</span> Abidjan
              </div>
              <div>
                <span className="text-slate-500">Téléphone :</span>{" "}
                <a
                  href="tel:+2250702838206"
                  className="text-orange-400 hover:text-orange-300"
                >
                  +225 07 02 83 82 06
                </a>
              </div>
              <div>
                <span className="text-slate-500">Email :</span>{" "}
                <a
                  href="mailto:contact@ivoirestore.com"
                  className="text-orange-400 hover:text-orange-300"
                >
                  contact@ivoirestore.com
                </a>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Activité</h2>
            <p>
              IvoireStore est une plateforme de mise en relation entre des
              boutiques partenaires vérifiées et des consommateurs en Côte
              d'Ivoire. La plateforme permet la consultation de catalogues
              produits, la passation de commandes et la coordination de la
              livraison avec paiement à la réception.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Hébergement</h2>
            <p>
              Le site IvoireStore est hébergé sur des infrastructures cloud
              sécurisées assurant la disponibilité, la performance et la
              protection des données conformément aux standards internationaux
              de sécurité.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Propriété intellectuelle
            </h2>
            <p>
              L'ensemble du contenu du site IvoireStore (textes, images, logos,
              graphismes, icônes) est protégé par le droit de la propriété
              intellectuelle. Toute reproduction, représentation ou exploitation
              non autorisée est strictement interdite. Le logo et le nom «
              IvoireStore » sont des marques déposées.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Responsabilité
            </h2>
            <p>
              IvoireStore s'efforce d'assurer l'exactitude des informations
              publiées sur la plateforme. Toutefois, la plateforme ne peut
              garantir l'exactitude de toutes les informations fournies par les
              boutiques partenaires. IvoireStore ne saurait être tenu
              responsable des dommages directs ou indirects résultant de
              l'utilisation du site.
            </p>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
}
