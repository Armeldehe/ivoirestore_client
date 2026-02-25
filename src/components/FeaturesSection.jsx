import { motion } from 'framer-motion';
import { HiShieldCheck, HiTruck, HiStar, HiPhone } from 'react-icons/hi';

const features = [
  { icon: HiTruck,       title: 'Livraison rapide',         desc: 'Vos commandes transmises aux boutiques en temps réel.', color: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  { icon: HiShieldCheck, title: 'Paiement à la livraison',  desc: 'Payez uniquement à la réception de votre colis.', color: 'text-green-400',  bg: 'bg-green-400/10'  },
  { icon: HiStar,        title: 'Boutiques vérifiées',      desc: 'Chaque boutique est approuvée par notre équipe.', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { icon: HiPhone,       title: 'Support client 24/7',      desc: 'Notre équipe est disponible à toute heure.', color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-tag mb-3">
            Pourquoi IvoireStore
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title">
            Commerce ivoirien, simplifié
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
