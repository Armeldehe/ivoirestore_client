import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import usePageMeta from "../hooks/usePageMeta";

export default function CGVPage() {
  usePageMeta(
    "Conditions Générales de Vente — IvoireStore",
    "Les conditions générales de vente de IvoireStore : commande, paiement, livraison, annulation et remboursement.",
  );

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <h1 className="section-title mb-8">Conditions Générales de Vente</h1>
        <p className="text-slate-500 text-sm mb-10">
          Dernière mise à jour : Février 2026
        </p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              1. Processus de commande
            </h2>
            <p>
              Pour passer commande sur IvoireStore, le client sélectionne les
              produits souhaités et les ajoute au panier. Il renseigne ses
              informations de livraison (nom, téléphone, adresse). Après
              validation de la commande, celle-ci est transmise à la boutique
              partenaire concernée. Le client reçoit une confirmation avec un
              récapitulatif de sa commande.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Paiement</h2>
            <p>
              IvoireStore fonctionne exclusivement avec le{" "}
              <strong className="text-orange-400">
                paiement à la livraison (COD)
              </strong>
              . Le client ne paie que lorsqu'il reçoit physiquement sa commande
              et vérifie la conformité des produits. Aucun paiement en ligne
              n'est requis. Le montant total inclut le prix des produits tel
              qu'affiché sur la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Livraison</h2>
            <p>
              La livraison est assurée sur l'ensemble du territoire de la Côte
              d'Ivoire. Les délais de livraison varient selon la localisation du
              client et la disponibilité du produit. Les délais indicatifs sont
              communiqués lors de la commande. IvoireStore et ses boutiques
              partenaires s'engagent à livrer dans les meilleurs délais. En cas
              de retard significatif, le client est informé par téléphone.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              4. Annulation de commande
            </h2>
            <p>
              Le client peut annuler sa commande sans frais tant que celle-ci
              n'a pas été expédiée par la boutique partenaire. Pour annuler une
              commande, le client doit contacter le support IvoireStore par
              téléphone ou email. Une fois la commande expédiée, l'annulation
              n'est plus possible et le client devra procéder à un retour.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              5. Remboursement
            </h2>
            <p>
              Un remboursement peut être accordé si le produit reçu est
              défectueux ou non conforme à la description, si le produit n'est
              jamais livré après le délai annoncé, ou si le client refuse le
              produit à la livraison pour non-conformité. La procédure de
              remboursement est détaillée dans notre{" "}
              <a
                href="/remboursement"
                className="text-orange-400 hover:text-orange-300"
              >
                Politique de Remboursement
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              6. Responsabilité des vendeurs
            </h2>
            <p>
              Chaque boutique partenaire est responsable de la conformité de ses
              produits aux descriptions publiées, de la qualité des produits
              vendus, du respect des réglementations en vigueur et du traitement
              des retours pour ses propres produits. IvoireStore agit comme
              intermédiaire et facilite la résolution des litiges entre
              acheteurs et vendeurs.
            </p>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
}
