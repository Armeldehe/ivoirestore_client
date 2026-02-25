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

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              1. Conditions de remboursement
            </h2>
            <p className="mb-3">
              Un remboursement peut être demandé dans les cas suivants :
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 ml-4">
              <li>Produit reçu défectueux ou endommagé</li>
              <li>Produit non conforme à la description sur la plateforme</li>
              <li>Produit non livré après le délai maximum annoncé</li>
              <li>Erreur de commande imputable à la boutique partenaire</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Délais</h2>
            <p>
              La demande de remboursement doit être effectuée dans un délai de{" "}
              <strong className="text-orange-400">48 heures</strong> après
              réception du produit. Au-delà de ce délai, la demande pourra être
              refusée sauf circonstances exceptionnelles. Le traitement de la
              demande prend généralement 3 à 5 jours ouvrables après réception
              du produit retourné par la boutique.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Procédure</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="w-7 h-7 bg-orange-500/15 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                  1
                </span>
                <p>
                  Contactez notre support à{" "}
                  <a
                    href="mailto:contact@ivoirestore.com"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    contact@ivoirestore.com
                  </a>{" "}
                  ou au{" "}
                  <a
                    href="tel:+2250702838206"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    +225 07 02 83 82 06
                  </a>{" "}
                  en précisant votre numéro de commande et le motif.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-7 h-7 bg-orange-500/15 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                  2
                </span>
                <p>
                  Fournissez des photos du produit si celui-ci est défectueux ou
                  non conforme.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-7 h-7 bg-orange-500/15 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                  3
                </span>
                <p>
                  Après validation de votre demande, retournez le produit dans
                  son emballage d'origine à la boutique partenaire.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-7 h-7 bg-orange-500/15 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                  4
                </span>
                <p>
                  Le remboursement est effectué après vérification du retour par
                  la boutique.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              4. Produits éligibles
            </h2>
            <p className="mb-3">
              Sont éligibles au remboursement les produits retournés dans leur
              état d'origine, avec leurs accessoires et emballage. Ne sont{" "}
              <strong className="text-white">pas éligibles</strong> :
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 ml-4">
              <li>Les produits endommagés par le client après réception</li>
              <li>Les produits utilisés ou dont l'emballage a été jeté</li>
              <li>Les produits périssables ou sur-mesure</li>
              <li>
                Les commandes annulées après expédition et refusées à la
                livraison sans motif valable
              </li>
            </ul>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
}
