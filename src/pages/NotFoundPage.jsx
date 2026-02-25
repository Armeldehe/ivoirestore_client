import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiShoppingBag } from 'react-icons/hi';
import MainLayout from '../layouts/MainLayout';

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="text-[120px] font-black text-gradient leading-none mb-6">404</div>
          <h1 className="text-2xl font-bold text-white mb-3">Page introuvable</h1>
          <p className="text-slate-400 mb-8">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary"><HiHome className="w-4 h-4" /> Accueil</Link>
            <Link to="/products" className="btn-secondary"><HiShoppingBag className="w-4 h-4" /> Catalogue</Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
