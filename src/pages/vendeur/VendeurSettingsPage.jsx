import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiSave,
  HiLockClosed,
  HiPhotograph,
  HiLocationMarker,
} from "react-icons/hi";
import VendeurLayout from "../../layouts/VendeurLayout";
import { useVendeurAuth } from "../../context/VendeurAuthContext";
import { updateVendeurProfile, uploadImageVendeur } from "../../services/api";
import toast from "react-hot-toast";

export default function VendeurSettingsPage() {
  const { vendeur, boutique } = useVendeurAuth();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Boutique info form
  const [boutiqueForm, setBoutiqueForm] = useState({
    address: boutique?.address || "",
    description: boutique?.description || "",
    banner: boutique?.banner || "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    try {
      await updateVendeurProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Mot de passe mis à jour !");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBoutiqueUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateVendeurProfile({
        address: boutiqueForm.address,
        description: boutiqueForm.description,
        banner: boutiqueForm.banner,
      });
      toast.success("Informations de la boutique mises à jour !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadImageVendeur("/upload/banner", file);
      setBoutiqueForm((f) => ({ ...f, banner: data.url }));
      toast.success("Bannière uploadée !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <VendeurLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Paramètres
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Gérez votre compte et votre boutique
          </p>
        </div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            👤 Informations du compte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
              <p className="text-xs text-slate-500 mb-1">Email</p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {vendeur?.email || "—"}
              </p>
            </div>
            <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
              <p className="text-xs text-slate-500 mb-1">Boutique</p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {boutique?.name || "—"}
              </p>
            </div>
            <div className="bg-[var(--bg-hover)] rounded-xl p-4 border border-[var(--border-color)]">
              <p className="text-xs text-slate-500 mb-1">Taux de commission</p>
              <p className="text-sm font-medium text-amber-400">
                {boutique?.commissionRate != null
                  ? `${boutique.commissionRate}%`
                  : "—"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.form
          onSubmit={handlePasswordChange}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 space-y-4"
        >
          <h2
            className="text-lg font-bold flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <HiLockClosed className="w-5 h-5" /> Changer le mot de passe
          </h2>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((f) => ({
                  ...f,
                  currentPassword: e.target.value,
                }))
              }
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    newPassword: e.target.value,
                  }))
                }
                className="input-field"
                required
                minLength={6}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Confirmer
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }))
                }
                className="input-field"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <HiSave className="w-4 h-4" /> Mettre à jour
          </button>
        </motion.form>

        {/* Boutique Settings */}
        <motion.form
          onSubmit={handleBoutiqueUpdate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 space-y-4"
        >
          <h2
            className="text-lg font-bold flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            🏪 Paramètres de la boutique
          </h2>

          {/* Banner */}
          <div>
            <label
              className="block text-sm font-medium mb-2 flex items-center gap-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              <HiPhotograph className="w-4 h-4" /> Photo de bannière
            </label>
            {boutiqueForm.banner && (
              <div className="mb-3 rounded-xl overflow-hidden h-32 bg-[var(--bg-hover)]">
                <img
                  src={boutiqueForm.banner}
                  alt="Bannière"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-emerald-500/10 hover:text-emerald-400 transition-all cursor-pointer border border-[var(--border-color)]">
              <HiPhotograph className="w-4 h-4" />
              {uploading ? "Upload en cours..." : "Changer la bannière"}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Address */}
          <div>
            <label
              className="block text-sm font-medium mb-2 flex items-center gap-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              <HiLocationMarker className="w-4 h-4" /> Adresse
            </label>
            <input
              type="text"
              value={boutiqueForm.address}
              onChange={(e) =>
                setBoutiqueForm((f) => ({ ...f, address: e.target.value }))
              }
              className="input-field"
              placeholder="Adresse de votre boutique"
            />
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
              value={boutiqueForm.description}
              onChange={(e) =>
                setBoutiqueForm((f) => ({ ...f, description: e.target.value }))
              }
              className="input-field resize-none"
              rows={3}
              placeholder="Décrivez votre boutique..."
              maxLength={500}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <HiSave className="w-4 h-4" /> Enregistrer
          </button>
        </motion.form>
      </div>
    </VendeurLayout>
  );
}
