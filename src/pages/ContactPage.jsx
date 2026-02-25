import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import usePageMeta from "../hooks/usePageMeta";
import {
  HiPhone,
  HiMail,
  HiLocationMarker,
  HiPaperAirplane,
} from "react-icons/hi";
import toast from "react-hot-toast";

export default function ContactPage() {
  usePageMeta(
    "Contact — IvoireStore",
    "Contactez l'équipe IvoireStore. Nous sommes disponibles par téléphone, email et via notre formulaire de contact.",
  );

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!form.email.trim()) errs.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email invalide";
    if (!form.message.trim()) errs.message = "Le message est requis";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      toast.success(
        "Message envoyé ! Nous vous répondrons dans les plus brefs délais.",
      );
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: HiPhone,
      label: "Téléphone",
      value: "+225 07 02 83 82 06",
      href: "tel:+2250702838206",
    },
    {
      icon: HiMail,
      label: "Email",
      value: "contact@ivoirestore.com",
      href: "mailto:contact@ivoirestore.com",
    },
    {
      icon: HiLocationMarker,
      label: "Adresse",
      value: "Abidjan, Côte d'Ivoire",
      href: null,
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="section-tag mb-3">Besoin d'aide ?</p>
          <h1 className="section-title mb-4">Contactez-nous</h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((c) => (
              <div
                key={c.label}
                className="glass-card p-5 flex items-center gap-4 hover:border-orange-500/20 transition-all duration-300"
              >
                <div className="w-11 h-11 bg-orange-500/15 rounded-xl flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="text-white font-medium text-sm hover:text-orange-400 transition-colors"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-white font-medium text-sm">{c.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="glass-card p-5 mt-4">
              <p className="text-slate-500 text-xs mb-3">Horaires de support</p>
              <p className="text-white text-sm font-medium">Lundi — Samedi</p>
              <p className="text-slate-400 text-sm">8h00 — 20h00 (GMT)</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="glass-card p-6 sm:p-8 space-y-5"
            >
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Votre nom"
                  className={`input-field ${errors.name ? "border-red-500/50" : ""}`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="votre@email.com"
                  className={`input-field ${errors.email ? "border-red-500/50" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Message *
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  rows={5}
                  placeholder="Votre message..."
                  className={`input-field resize-none ${errors.message ? "border-red-500/50" : ""}`}
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <HiPaperAirplane className="w-4 h-4 rotate-90" /> Envoyer le
                    message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
