import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiCheckCircle, HiShoppingBag, HiArrowRight } from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";

function formatPrice(n) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.order) {
    navigate("/", { replace: true });
    return null;
  }

  const { order, product } = state;

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="card max-w-lg w-full p-8 text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 15 }}
            className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <HiCheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>

          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Commande confirmée !
          </h1>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            Votre commande a été transmise avec succès à la boutique. Vous serez
            contacté pour la livraison.
          </p>

          {/* Order card */}
          <div className="bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-2xl p-5 text-left space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Statut</span>
              <span className="badge bg-amber-500/20 text-amber-500 font-semibold">
                En attente
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Client</span>
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {order.customerName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Téléphone</span>
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {order.customerPhone}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>
                Localisation
              </span>
              <span
                className="font-medium text-right max-w-[200px]"
                style={{ color: "var(--text-primary)" }}
              >
                {order.customerLocation}
              </span>
            </div>
            {state.isMulti ? (
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Achat</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Plusieurs articles
                </span>
              </div>
            ) : (
              product && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Produit
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product.name} (x{order.quantity || 1})
                  </span>
                </div>
              )
            )}
            <div className="border-t border-[var(--border-color)] pt-3 flex justify-between">
              <span
                className="font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Total à payer
              </span>
              <span className="font-bold text-lg text-gradient-orange">
                {state.totalPrice
                  ? formatPrice(state.totalPrice)
                  : product
                    ? formatPrice(product.price * (order.quantity || 1))
                    : "—"}
              </span>
            </div>
          </div>

          <div className="bg-green-400/5 border border-green-400/20 rounded-xl px-4 py-3 text-sm text-green-500 mb-8 font-medium">
            💳 Vous paierez{" "}
            <strong className="text-xl">
              {state.totalPrice
                ? formatPrice(state.totalPrice)
                : product
                  ? formatPrice(product.price * (order.quantity || 1))
                  : ""}
            </strong>{" "}
            plus les frais de livraison
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/products" className="btn-primary flex-1 justify-center">
              <HiShoppingBag className="w-4 h-4" />
              Continuer mes achats
            </Link>
            <Link to="/" className="btn-secondary flex-1 justify-center">
              Accueil <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
