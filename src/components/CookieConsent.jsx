import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiShieldCheck } from "react-icons/hi";

const STORAGE_KEY = "ivoirestore_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Show after short delay for better UX
      const t = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[999] p-4"
        >
          <div className="max-w-3xl mx-auto bg-navy-900/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/40 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-orange-500/15 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <HiShieldCheck className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium mb-1">
                  Nous utilisons des cookies
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Ce site utilise des cookies essentiels pour le fonctionnement
                  de la plateforme. En continuant, vous acceptez notre{" "}
                  <Link
                    to="/confidentialite"
                    className="text-orange-400 hover:text-orange-300 underline"
                  >
                    politique de confidentialité
                  </Link>
                  .
                </p>
              </div>
            </div>
            <button
              onClick={accept}
              className="btn-primary text-sm shrink-0 px-6"
            >
              Accepter
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
