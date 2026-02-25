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

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              1. Données collectées
            </h2>
            <p className="mb-3">
              Dans le cadre de l'utilisation de notre plateforme, nous
              collectons les données suivantes :
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 ml-4">
              <li>
                <strong className="text-slate-300">Nom complet</strong> — pour
                identifier la commande
              </li>
              <li>
                <strong className="text-slate-300">Numéro de téléphone</strong>{" "}
                — pour la coordination de livraison
              </li>
              <li>
                <strong className="text-slate-300">Adresse de livraison</strong>{" "}
                — pour acheminer votre commande
              </li>
              <li>
                <strong className="text-slate-300">
                  Historique de commandes
                </strong>{" "}
                — pour le suivi et le support client
              </li>
              <li>
                <strong className="text-slate-300">Adresse email</strong> — si
                fournie, pour les notifications de commande
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              2. Utilisation des données
            </h2>
            <p>
              Vos données sont utilisées exclusivement pour le traitement et le
              suivi de vos commandes, la communication relative à vos achats,
              l'amélioration de nos services et de l'expérience utilisateur, et
              le respect de nos obligations légales. Nous ne vendons, ne louons
              et ne partageons jamais vos données personnelles avec des tiers à
              des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              3. Protection des données
            </h2>
            <p>
              IvoireStore met en œuvre des mesures de sécurité techniques et
              organisationnelles pour protéger vos données contre tout accès non
              autorisé, modification, divulgation ou destruction. Les
              communications entre votre navigateur et nos serveurs sont
              chiffrées via le protocole HTTPS. L'accès aux données est
              strictement limité au personnel autorisé.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. Cookies</h2>
            <p>
              Notre site utilise des cookies essentiels au bon fonctionnement de
              la plateforme (authentification, panier d'achat, préférences).
              Aucun cookie publicitaire ou de pistage tiers n'est utilisé. En
              continuant à naviguer sur IvoireStore, vous consentez à
              l'utilisation de ces cookies fonctionnels.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              5. Durée de conservation
            </h2>
            <p>
              Les données de commande sont conservées pendant une durée de 3 ans
              à compter de la dernière commande, conformément aux obligations
              légales en vigueur en Côte d'Ivoire. Au-delà de cette période, les
              données sont anonymisées ou supprimées.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Vos droits</h2>
            <p>
              Vous disposez d'un droit d'accès, de rectification et de
              suppression de vos données personnelles. Pour exercer ces droits,
              contactez-nous à{" "}
              <a
                href="mailto:contact@ivoirestore.com"
                className="text-orange-400 hover:text-orange-300"
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
