import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import usePageMeta from "../hooks/usePageMeta";

export default function PrivacyPage() {
  usePageMeta(
    "Politique de Confidentialité — IvoireStore",
    "Découvrez comment IvoireStore protège vos données personnelles et respecte votre vie privée.",
  );

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <h1 className="section-title mb-8">Politique de Confidentialité</h1>
        <p className="text-slate-500 text-sm mb-10">
          Dernière mise à jour : Février 2026
        </p>

        <div className="space-y-8 text-[var(--text-secondary)] text-sm leading-relaxed">
          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              1. Données collectées (Clients)
            </h2>
            <p className="mb-3">
              Dans le cadre de l'utilisation de notre plateforme par les
              acheteurs, nous collectons les données suivantes :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong className="text-[var(--text-primary)]">
                  Nom complet
                </strong>{" "}
                — pour identifier la commande
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">
                  Numéro de téléphone
                </strong>{" "}
                — pour la coordination de la livraison
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">
                  Adresse de livraison
                </strong>{" "}
                — pour acheminer la commande à destination
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              2. Données collectées (Vendeurs)
            </h2>
            <p className="mb-3">
              Pour les boutiques partenaires enregistrées sur IvoireStore, les
              informations suivantes sont conservées :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong className="text-[var(--text-primary)]">
                  Informations d'identité
                </strong>{" "}
                — nom de la boutique, adresse physique, téléphone
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">
                  Identifiants de connexion
                </strong>{" "}
                — adresse email professionnelle (chiffrée) et mot de passe
                (haché)
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">
                  Données commerciales
                </strong>{" "}
                — historique des ventes, catalogue produits, statistiques de
                commissions
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              3. Utilisation des données
            </h2>
            <p>
              Vos données sont utilisées exclusivement pour le traitement de vos
              commandes via les boutiques partenaires, le fonctionnement de
              l'Espace Vendeur, le calcul analytique des ventes, et le respect
              de nos obligations légales (traitement des commissions). Nous ne
              vendons jamais vos données personnelles avec des tiers à des fins
              commerciales publicitaires.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              4. Sécurité
            </h2>
            <p>
              IvoireStore chiffre les mots de passe et met en œuvre des mesures
              de sécurité pour protéger les connexions et la base de données.
              Toutefois, chaque vendeur reste garant de la sécurité de ses
              propres accès.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              5. Durée de conservation
            </h2>
            <p>
              Les données de commande sont conservées pendant une durée de 3 ans
              à compter de la dernière commande, conformément aux obligations
              légales en vigueur en Côte d'Ivoire. Les comptes boutiques sont
              conservés tant que le partenariat est actif.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              6. Vos droits
            </h2>
            <p>
              Vous disposez d'un droit d'accès, de rectification et de
              suppression de vos données personnelles. Pour exercer ces droits,
              contactez-nous à{" "}
              <a
                href="mailto:contact@ivoirestore.com"
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                contact@ivoirestore.com
              </a>
              .
            </p>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
}
