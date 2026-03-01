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

        <div className="space-y-8 text-[var(--text-secondary)] text-sm leading-relaxed">
          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
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
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              2. Rôle d'intermédiaire
            </h2>
            <p>
              IvoireStore agit exclusivement en qualité d'intermédiaire
              technique et commercial. La plateforme n'est ni le vendeur ni
              l'acheteur des produits physiques. Elle met à disposition un
              espace numérique sécurisé pour la publication d'offres
              commerciales par les boutiques partenaires (vendeurs) et la
              passation de commandes par les clients.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              3. Espace Vendeur et Accès Boutique
            </h2>
            <p>
              Les boutiques partenaires bénéficient d'un accès dédié (Espace
              Vendeur). Les comptes vendeurs sont créés et validés par
              l'administration d'IvoireStore. Le vendeur est seul responsable de
              la confidentialité de ses identifiants de connexion. Depuis cet
              espace, la boutique s'engage à maintenir son catalogue à jour, à
              mettre à jour les statuts de ses commandes et à régler les
              commissions dues à la plateforme de manière régulière.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              4. Commandes et Clients
            </h2>
            <p>
              La navigation et l'achat sur IvoireStore ne nécessitent pas la
              création d'un compte client. Les informations nécessaires à la
              commande (nom, téléphone, adresse de livraison) sont collectées
              lors du processus et transmises à la boutique partenaire pour
              assurer la livraison. L'utilisateur client s'engage à fournir des
              informations exactes.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              5. Responsabilités du vendeur
            </h2>
            <p>
              Chaque boutique partenaire est{" "}
              <strong className="text-[var(--text-primary)] font-semibold">
                seule responsable
              </strong>{" "}
              de l'exactitude des informations produits (description, prix,
              images), de la qualité et de la conformité des produits livrés, du
              respect des délais de livraison annoncés et du traitement des
              réclamations liées à ses ventes. Le vendeur garantit disposer des
              droits sur les images uploadées.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              6. Limitations de responsabilité d'IvoireStore
            </h2>
            <p>
              IvoireStore ne saurait être tenu responsable des défauts, vices
              cachés ou non-conformités des produits vendus par les boutiques
              partenaires, des retards ou incidents de livraison, de
              l'indisponibilité temporaire de la plateforme pour maintenance, ni
              des litiges commerciaux entre un client et un vendeur.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              7. Suspension et résiliation
            </h2>
            <p>
              IvoireStore se réserve le droit de suspendre ou résilier l'accès à
              la plateforme pour tout utilisateur ou vendeur ne respectant pas
              les présentes CGU, sans préavis ni indemnité. Un compte boutique
              peut être bloqué en cas de commissions impayées persistantes, de
              plaintes clients récurrentes ou de frauduleuses.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
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
            <h2 className="text-[var(--text-primary)] font-bold text-lg mb-3">
              9. Contact
            </h2>
            <p>
              Pour toute question relative aux présentes conditions, vous pouvez
              nous contacter à{" "}
              <a
                href="mailto:contact@ivoirestore.com"
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                contact@ivoirestore.com
              </a>{" "}
              ou au{" "}
              <a
                href="tel:+2250702838206"
                className="text-orange-400 hover:text-orange-300 transition-colors"
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
