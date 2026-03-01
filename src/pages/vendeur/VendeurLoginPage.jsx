import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiLockClosed, HiMail, HiEye, HiEyeOff } from "react-icons/hi";
import { useVendeurAuth } from "../../context/VendeurAuthContext";

export default function VendeurLoginPage() {
  const { login, isAuth } = useVendeurAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuth) {
    return <Navigate to="/vendeur" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Remplissez tous les champs.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/vendeur", { replace: true });
    } catch (err) {
      setError(err.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="absolute inset-0 hero-bg pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          {/* Header */}
          <div
            className="px-8 pt-8 pb-6 text-center"
            style={{ borderBottom: "1px solid var(--border-color)" }}
          >
            <div className="flex justify-center mb-4">
              <img
                src="/logo_ivoirestore.png"
                alt="IvoireStore"
                className="h-12 w-auto"
              />
            </div>
            <h1
              className="text-xl font-black"
              style={{ color: "var(--text-primary)" }}
            >
              Espace Vendeur
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Connectez-vous pour gérer votre boutique
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <div>
              <label
                className="block text-sm font-medium mb-2 flex items-center gap-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                <HiMail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="vendeur@boutique.ci"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="input-field"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2 flex items-center gap-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                <HiLockClosed className="w-4 h-4" /> Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-3.5 text-base mt-2 flex items-center gap-2 rounded-xl font-semibold transition-all duration-300 text-white"
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
                  Connexion...
                </span>
              ) : (
                <>
                  <HiLockClosed className="w-4 h-4" /> Se connecter
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          IvoireStore Vendeur © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}
