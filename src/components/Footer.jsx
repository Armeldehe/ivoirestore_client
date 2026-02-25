import { Link } from "react-router-dom";
import { HiHeart, HiShieldCheck, HiPhone, HiMail } from "react-icons/hi";
import { HiTruck } from "react-icons/hi2";
import { FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

const trustBadges = [
  { icon: HiShieldCheck, label: "Paiement sécurisé", color: "text-green-400" },
  { icon: HiTruck, label: "Livraison fiable", color: "text-blue-400" },
  { icon: HiPhone, label: "Support client", color: "text-purple-400" },
  { icon: HiShieldCheck, label: "Données protégées", color: "text-cyan-400" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-navy-950 mt-20 overflow-hidden">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      {/* Trust badges strip */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-3 justify-center"
              >
                <div className="w-9 h-9 bg-white/[0.04] rounded-lg flex items-center justify-center border border-white/[0.06]">
                  <b.icon className={`w-4.5 h-4.5 ${b.color}`} />
                </div>
                <span className="text-slate-300 text-xs font-medium">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="block mb-4 group">
              <img
                src="/logo_ivoirestore.png"
                alt="IvoireStore"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-slate-500 text-sm italic mb-2 font-medium">
              "Vos boutiques, vos offres, votre livraison"
            </p>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-4">
              La marketplace premium ivoirienne. Des produits authentiques des
              meilleures boutiques de Côte d'Ivoire.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-5">
              <a
                href="tel:+2250702838206"
                className="flex items-center gap-2 text-slate-400 text-sm hover:text-orange-400 transition-colors"
              >
                <HiPhone className="w-3.5 h-3.5" /> +225 07 02 83 82 06
              </a>
              <a
                href="mailto:contact@ivoirestore.com"
                className="flex items-center gap-2 text-slate-400 text-sm hover:text-orange-400 transition-colors"
              >
                <HiMail className="w-3.5 h-3.5" /> contact@ivoirestore.com
              </a>
            </div>

            <div className="flex gap-3">
              {[
                { Icon: FiInstagram, href: "#" },
                { Icon: FiTwitter, href: "#" },
                { Icon: FiFacebook, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 glass-card flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/40 hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", l: "Accueil" },
                { to: "/products", l: "Catalogue" },
                { to: "/boutiques", l: "Boutiques" },
                { to: "/a-propos", l: "À propos" },
                { to: "/contact", l: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-orange-400 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5">
              Informations légales
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/cgu", l: "Conditions d'utilisation" },
                { to: "/cgv", l: "Conditions de vente" },
                { to: "/confidentialite", l: "Confidentialité" },
                { to: "/remboursement", l: "Remboursement" },
                { to: "/mentions-legales", l: "Mentions légales" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-orange-400 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5">Services</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-orange-400">📦</span> Paiement à la
                livraison
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400">✅</span> Boutiques vérifiées
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400">🚚</span> Livraison en CI
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400">📞</span> Support client
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400">🔒</span> Données sécurisées
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} IvoireStore. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <HiShieldCheck className="w-4 h-4 text-green-500/60" />
              Site sécurisé
            </div>
            <p className="text-slate-700 text-xs flex items-center gap-1">
              Fait avec{" "}
              <HiHeart className="text-orange-500 w-3 h-3 animate-pulse" /> en
              Côte d'Ivoire
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
