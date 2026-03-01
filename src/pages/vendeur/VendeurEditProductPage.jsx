import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft, HiSave, HiX } from "react-icons/hi";
import VendeurLayout from "../../layouts/VendeurLayout";
import ImageUploader from "../../components/ImageUploader";
import {
  getVendeurProducts,
  updateVendeurProduct,
  uploadImageVendeur,
} from "../../services/api";
import toast from "react-hot-toast";

export default function VendeurEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch all products and find the one we need
        const data = await getVendeurProducts({ limit: 200 });
        const product = (data.data || []).find((p) => p._id === id);
        if (!product) {
          toast.error("Produit introuvable");
          navigate("/vendeur/products");
          return;
        }
        setForm({
          name: product.name || "",
          price: product.price?.toString() || "",
          description: product.description || "",
          stock: product.stock?.toString() || "",
          images: product.images || [],
        });
      } catch (err) {
        toast.error(err.message);
        navigate("/vendeur/products");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleImageUploaded = (url) => {
    setForm((f) => ({ ...f, images: [...f.images, url] }));
  };

  const removeImage = (index) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Le nom et le prix sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      await updateVendeurProduct(id, {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        stock: form.stock ? Number(form.stock) : 0,
        images: form.images,
      });
      toast.success("Produit mis à jour !");
      navigate("/vendeur/products");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <VendeurLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="glass-card p-6 h-96 skeleton" />
        </div>
      </VendeurLayout>
    );
  }

  return (
    <VendeurLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost p-2 rounded-xl"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Modifier le produit
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Modifiez les informations de votre produit
            </p>
          </div>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-5"
        >
          {/* Name */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Robe en wax"
              className="input-field"
              required
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Prix (FCFA) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="5000"
                min="0"
                className="input-field"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="10"
                min="0"
                className="input-field"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Décrivez votre produit..."
              rows={4}
              className="input-field resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-slate-500 mt-1">
              {form.description.length}/1000 caractères
            </p>
          </div>

          {/* Images */}
          <div>
            <ImageUploader
              endpoint="/upload/product-image"
              label="Images du produit"
              onUploadComplete={handleImageUploaded}
              onRemove={() => {}}
              uploadFn={uploadImageVendeur}
            />

            {/* Current images grid */}
            {form.images.length > 0 && (
              <div className="mt-4">
                <p className="text-slate-400 text-xs font-medium mb-2">
                  {form.images.length} image
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
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-emerald-500/80 rounded-md text-[9px] text-white font-bold backdrop-blur-sm">
                          Principale
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Mise à jour en cours...
              </span>
            ) : (
              <>
                <HiSave className="w-5 h-5" /> Enregistrer les modifications
              </>
            )}
          </button>
        </motion.form>
      </div>
    </VendeurLayout>
  );
}
