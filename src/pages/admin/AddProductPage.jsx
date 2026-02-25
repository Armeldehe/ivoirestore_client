import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiCollection, HiArrowLeft, HiX } from "react-icons/hi";
import AdminLayout from "../../layouts/AdminLayout";
import { createProduct, getBoutiques } from "../../services/api";
import ImageUploader from "../../components/ImageUploader";
import toast from "react-hot-toast";

const INITIAL = {
  name: "",
  boutique: "",
  price: "",
  stock: "",
  description: "",
  images: [],
};

export default function AddProductPage() {
  const [form, setForm] = useState(INITIAL);
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getBoutiques({ limit: 100 })
      .then((d) => setBoutiques(d.data || []))
      .catch(() => toast.error("Impossible de charger les boutiques"));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!form.boutique) errs.boutique = "Sélectionnez une boutique";
    if (!form.price || Number(form.price) <= 0) errs.price = "Prix invalide";
    if (form.stock === "" || Number(form.stock) < 0)
      errs.stock = "Stock invalide";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        boutique: form.boutique,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        images: form.images,
      };
      await createProduct(payload);
      toast.success("Produit créé avec succès !");
      navigate("/admin/products");
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

  const handleImageUploaded = (url) => {
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/admin/products")}
          className="btn-ghost text-sm mb-6 -ml-2"
        >
          <HiArrowLeft className="w-4 h-4" /> Retour aux produits
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-green-500/15 rounded-xl flex items-center justify-center">
              <HiCollection className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Nouveau produit</h2>
              <p className="text-slate-500 text-sm">
                Le produit sera associé à une boutique existante
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Boutique select */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Boutique *
              </label>
              <select
                value={form.boutique}
                onChange={handleChange("boutique")}
                className={`input-field ${errors.boutique ? "border-red-500/50 focus:ring-red-500/50" : ""}`}
              >
                <option value="" className="bg-navy-900">
                  Sélectionner une boutique
                </option>
                {boutiques.map((b) => (
                  <option key={b._id} value={b._id} className="bg-navy-900">
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.boutique && (
                <p className="text-red-400 text-xs mt-1">{errors.boutique}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Nom du produit *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Ex: iPhone 15 Pro Max"
                className={`input-field ${errors.name ? "border-red-500/50 focus:ring-red-500/50" : ""}`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Product Images — Drag & Drop Uploader */}
            <div>
              <ImageUploader
                endpoint="/upload/product-image"
                label="Images du produit"
                onUploadComplete={handleImageUploaded}
                onRemove={() => {}}
              />

              {/* Uploaded images grid */}
              {form.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-slate-400 text-xs font-medium mb-2">
                    {form.images.length} image
                    {form.images.length > 1 ? "s" : ""} ajoutée
                    {form.images.length > 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {form.images.map((url, idx) => (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group aspect-square"
                      >
                        <img
                          src={url}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-full object-cover rounded-xl border border-white/[0.08]"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <HiX className="w-3 h-3 text-white" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-orange-500/80 rounded-md text-[9px] text-white font-bold backdrop-blur-sm">
                            Principale
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange("price")}
                  placeholder="25000"
                  className={`input-field ${errors.price ? "border-red-500/50 focus:ring-red-500/50" : ""}`}
                />
                {errors.price && (
                  <p className="text-red-400 text-xs mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange("stock")}
                  placeholder="50"
                  className={`input-field ${errors.stock ? "border-red-500/50 focus:ring-red-500/50" : ""}`}
                />
                {errors.stock && (
                  <p className="text-red-400 text-xs mt-1">{errors.stock}</p>
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
                rows={4}
                placeholder="Décrivez le produit..."
                className="input-field resize-none"
              />
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
                  "Créer le produit"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
