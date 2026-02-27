import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiShoppingBag, HiArrowRight } from 'react-icons/hi';
import MainLayout from '../layouts/MainLayout';

function formatPrice(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  if (!state?.order) {
    navigate('/', { replace: true });
    return null;
  }

  const { order, product } = state;

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="card max-w-lg w-full p-8 text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <HiCheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-2">Commande confirmée !</h1>
          <p className="text-slate-400 mb-8">
            Votre commande a été transmise avec succès à la boutique.
            Vous serez contacté pour la livraison.
          </p>

          {/* Order card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 text-left space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Statut</span>
              <span className="badge bg-amber-500/20 text-amber-400">En attente</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Client</span>
              <span className="text-white">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Téléphone</span>
              <span className="text-white">{order.customerPhone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Localisation</span>
              <span className="text-white text-right max-w-[200px]">{order.customerLocation}</span>
            </div>
            {product && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Produit</span>
                <span className="text-white">{product.name}</span>
              </div>
            )}
            <div className="border-t border-white/[0.06] pt-3 flex justify-between">
              <span className="text-slate-400 font-medium">Total à payer</span>
              <span className="text-white font-bold text-lg">{product ? formatPrice(product.price * (order.quantity || 1)) : '—'}</span>
            </div>
          </div>

          <div className="bg-green-400/5 border border-green-400/20 rounded-xl px-4 py-3 text-sm text-green-400 mb-8">
            💳 Vous paierez <strong>{product ? formatPrice(product.price * (order.quantity || 1)) : ''}</strong> plus les frais de livraison
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
