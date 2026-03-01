import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import usePageMeta from "../hooks/usePageMeta";

export default function RefundPage() {
  usePageMeta(
    "Politique de Remboursement — IvoireStore",
    "Politique de remboursement IvoireStore : conditions, délais, procédure et produits éligibles.",
  );

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <h1 className="section-title mb-8">Politique de Remboursement</h1>
        <p className="text-slate-500 text-sm mb-10">
          Dernière mise à jour : Février 2026
        </p>

        <div className="space-y-8 text-[var(--text-secondary)] text-sm leading-relaxed">
          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              1. Conditions de remboursement
            </h2>
            <p className="mb-3">
              Un remboursement (ou échange) peut être négocié avec la boutique
              vendeuse dans les cas suivants :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Produit reçu défectueux ou endommagé</li>
              <li>
                Produit non conforme à la description publiée par la boutique
              </li>
              <li>Produit de contrefaçon avérée</li>
              <li>
                Erreur matérielle de commande imputable à la boutique partenaire
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              2. Délais
            </h2>
            <p>
              La réclamation doit être effectuée auprès de la boutique (ou du
              support plateforme en cas de litige insoluble) dans un délai de{" "}
              <strong className="text-orange-400">48 à 72 heures</strong> après
              réception du produit, conformément aux politiques spécifiques de
              chaque vendeur. Le client ayant payé à la livraison (COD) doit
              s'adresser directement au vendeur pour la restitution des fonds.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              3. Procédure relative au vendeur
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="w-7 h-7 bg-orange-500/15 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                  1
                </span>
                <p>
                  Contactez immédiatement le transporteur ou le numéro de la
                  boutique partenaire qui vous a livré.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-7 h-7 bg-orange-500/15 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                  2
                </span>
                <p>
                  Fournissez des photos preuves du produit s'il est défectueux
                  ou non conforme.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-7 h-7 bg-orange-500/15 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                  3
                </span>
                <p>
                  Retournez le produit dans son emballage d'origine à la
                  boutique partenaire.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-7 h-7 bg-orange-500/15 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                  4
                </span>
                <p>
                  En cas de silence ou de refus infondé de la boutique
                  partenaire, le client avertit l'administration d'IvoireStore
                  via{" "}
                  <a
                    href="mailto:contact@ivoirestore.com"
                    className="text-orange-400 hover:underline"
                  >
                    contact@ivoirestore.com
                  </a>
                  . La plateforme se réserve le droit de bloquer le vendeur
                  fautif.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              4. Limites d'intervention d'IvoireStore
            </h2>
            <p className="mb-3">
              IvoireStore agissant comme intermédiaire, les fonds issus des
              commandes validées transitent historiquement de la main du client
              à la main du vendeur de façon directe (COD). De ce fait, le
              remboursement d'un article{" "}
              <strong className="text-[var(--text-primary)] font-semibold">
                incombe juridiquement et financièrement au vendeur d'origine
              </strong>
              . IvoireStore veille toutefois à sanctionner (jusqu'à la
              radiation) les vendeurs ayant de mauvaises pratiques.
            </p>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
}
