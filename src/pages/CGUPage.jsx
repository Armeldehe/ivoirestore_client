import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import usePageMeta from "../hooks/usePageMeta";

export default function CGUPage() {
  usePageMeta(
    "Conditions Générales d'Utilisation — IvoireStore",
    "Consultez les conditions générales d'utilisation de la plateforme IvoireStore, marketplace en ligne en Côte d'Ivoire.",
  );

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <h1 className="section-title mb-8">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-slate-500 text-sm mb-10">
          Dernière mise à jour : Février 2026
        </p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              1. Présentation de la plateforme
            </h2>
            <p>
              IvoireStore est une marketplace en ligne opérant en Côte d'Ivoire,
              permettant à des boutiques partenaires vérifiées de proposer leurs
              produits aux consommateurs ivoiriens. La plateforme facilite la
              mise en relation entre acheteurs et vendeurs, le traitement des
              commandes et la coordination de la livraison.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              2. Rôle de la plateforme
            </h2>
            <p>
              IvoireStore agit en qualité d'intermédiaire technique. La
              plateforme n'est ni vendeur ni acheteur. Elle met à disposition un
              espace numérique sécurisé pour la publication d'offres
              commerciales par les boutiques partenaires et la passation de
              commandes par les clients. IvoireStore perçoit une commission sur
              chaque vente réalisée via la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              3. Compte utilisateur
            </h2>
            <p>
              La navigation et l'achat sur IvoireStore ne nécessitent pas la
              création d'un compte client. Les informations nécessaires à la
              commande (nom, téléphone, adresse de livraison) sont collectées
              lors du processus de commande. Les comptes administrateurs sont
              réservés à l'équipe IvoireStore pour la gestion de la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              4. Responsabilités de l'utilisateur
            </h2>
            <p>
              L'utilisateur s'engage à fournir des informations exactes lors de
              sa commande, à ne pas utiliser la plateforme à des fins
              frauduleuses ou illicites, à respecter les droits de propriété
              intellectuelle des contenus publiés et à ne pas perturber le
              fonctionnement technique de la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              5. Responsabilités du vendeur
            </h2>
            <p>
              Chaque boutique partenaire est responsable de l'exactitude des
              informations produits (description, prix, disponibilité), de la
              qualité et conformité des produits livrés, du respect des délais
              de livraison annoncés et du traitement des réclamations liées à
              ses produits.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              6. Limitations de responsabilité
            </h2>
            <p>
              IvoireStore ne saurait être tenu responsable des défauts, vices
              cachés ou non-conformités des produits vendus par les boutiques
              partenaires, des retards ou incidents de livraison imputables aux
              transporteurs, de l'indisponibilité temporaire de la plateforme
              pour maintenance ou raison technique, ni des pertes indirectes
              résultant de l'utilisation de la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              7. Suspension et résiliation
            </h2>
            <p>
              IvoireStore se réserve le droit de suspendre ou résilier l'accès à
              la plateforme pour tout utilisateur ne respectant pas les
              présentes CGU, sans préavis ni indemnité. Les boutiques
              partenaires peuvent voir leur compte suspendu en cas de plaintes
              récurrentes, de non-respect des standards de qualité ou de
              pratiques commerciales déloyales.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              8. Droit applicable
            </h2>
            <p>
              Les présentes conditions sont régies par le droit ivoirien. En cas
              de litige, les parties s'engagent à rechercher une solution
              amiable avant de saisir les juridictions compétentes de Côte
              d'Ivoire.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">9. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions, vous pouvez
              nous contacter à{" "}
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
              </a>
              .
            </p>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
}
