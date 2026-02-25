import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOfficeBuilding, HiArrowLeft } from "react-icons/hi";
import AdminLayout from "../../layouts/AdminLayout";
import { createBoutique } from "../../services/api";
import ImageUploader from "../../components/ImageUploader";
import toast from "react-hot-toast";

const INITIAL = {
  name: "",
  phone: "",
  address: "",
  description: "",
  commissionRate: 10,
  banner: "",
};

export default function AddBoutiquePage() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!form.phone.trim()) errs.phone = "Le téléphone est requis";
    if (!form.address.trim()) errs.address = "L'adresse est requise";
    if (form.commissionRate < 0 || form.commissionRate > 100)
      errs.commissionRate = "Entre 0 et 100";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createBoutique(form);
      toast.success("Boutique créée avec succès !");
      navigate("/admin/boutiques");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/admin/boutiques")}
          className="btn-ghost text-sm mb-6 -ml-2"
        >
          <HiArrowLeft className="w-4 h-4" /> Retour aux boutiques
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-orange-500/15 rounded-xl flex items-center justify-center">
              <HiOfficeBuilding className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">
                Nouvelle boutique
              </h2>
              <p className="text-slate-500 text-sm">
                Remplissez le formulaire pour créer une boutique
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Nom de la boutique *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Ex: Boutique Elegance"
                className={`input-field ${errors.name ? "border-red-500/50 focus:ring-red-500/50" : ""}`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Banner — Drag & Drop Upload */}
            <ImageUploader
              endpoint="/upload/boutique-image"
              label="Bannière de la boutique"
              currentImage={form.banner}
              onUploadComplete={(url) =>
                setForm((prev) => ({ ...prev, banner: url }))
              }
              onRemove={() => setForm((prev) => ({ ...prev, banner: "" }))}
            />

            {/* Phone + Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="+225 07 00 00 00"
                  className={`input-field ${errors.phone ? "border-red-500/50 focus:ring-red-500/50" : ""}`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={handleChange("address")}
                  placeholder="Abidjan, Cocody"
                  className={`input-field ${errors.address ? "border-red-500/50 focus:ring-red-500/50" : ""}`}
                />
                {errors.address && (
                  <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={handleChange("description")}
                rows={3}
                placeholder="Décrivez la boutique..."
                className="input-field resize-none"
              />
            </div>

            {/* Commission */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Commission (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.commissionRate}
                onChange={handleChange("commissionRate")}
                className={`input-field sm:w-32 ${errors.commissionRate ? "border-red-500/50 focus:ring-red-500/50" : ""}`}
              />
              {errors.commissionRate && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.commissionRate}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-white/[0.06]">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full sm:w-auto justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer la boutique"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
