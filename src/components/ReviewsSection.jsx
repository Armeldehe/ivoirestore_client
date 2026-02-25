import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiStar,
  HiOutlineStar,
  HiChevronLeft,
  HiChevronRight,
  HiUser,
  HiPaperAirplane,
} from "react-icons/hi";
import { getAvis, createAvis } from "../services/api";
import toast from "react-hot-toast";

/* ── Star Rating (interactive) ── */
function StarRating({ value, onChange, size = "w-7 h-7", interactive = true }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onChange?.(star)}
            className={`transition-all duration-200 ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
          >
            {filled ? (
              <HiStar
                className={`${size} text-orange-400 drop-shadow-[0_0_6px_rgba(247,132,29,0.5)]`}
              />
            ) : (
              <HiOutlineStar className={`${size} text-slate-600`} />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Single Review Card ── */
function ReviewCard({ avis }) {
  const date = new Date(avis.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Generate avatar color from name
  const hue =
    avis.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div className="glass-card p-5 sm:p-6 h-full flex flex-col gap-4 hover:border-orange-500/20 transition-all duration-500">
      {/* Header: avatar + name + date */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{
            background: `linear-gradient(135deg, hsl(${hue}, 60%, 45%), hsl(${hue + 40}, 60%, 35%))`,
          }}
        >
          {avis.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {avis.name}
          </p>
          <p className="text-slate-500 text-[11px]">{date}</p>
        </div>
      </div>

      {/* Stars */}
      <StarRating value={avis.rating} interactive={false} size="w-4 h-4" />

      {/* Text */}
      <p className="text-slate-300 text-sm leading-relaxed flex-1">
        {avis.text}
      </p>
    </div>
  );
}

/* ── Skeleton ── */
function SkeletonReview() {
  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 skeleton rounded-full w-24" />
          <div className="h-2 skeleton rounded-full w-16" />
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 skeleton rounded" />
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="h-3 skeleton rounded-full w-full" />
        <div className="h-3 skeleton rounded-full w-4/5" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", text: "", rating: 0 });
  const [errors, setErrors] = useState({});

  // Carousel state
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;

  const fetchReviews = useCallback(() => {
    getAvis({ limit: 50 })
      .then((data) => setReviews(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const totalPages = Math.max(1, Math.ceil(reviews.length / reviewsPerPage));
  const visibleReviews = reviews.slice(
    currentPage * reviewsPerPage,
    currentPage * reviewsPerPage + reviewsPerPage,
  );

  const goTo = (dir) => {
    setCurrentPage((prev) => {
      if (dir === 1) return prev < totalPages - 1 ? prev + 1 : 0;
      return prev > 0 ? prev - 1 : totalPages - 1;
    });
  };

  // ── Form validation & submit ──
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!form.text.trim()) errs.text = "Le commentaire est requis";
    if (!form.rating || form.rating < 1) errs.rating = "Sélectionnez une note";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await createAvis(form);
      toast.success(result.message || "Merci pour votre avis !");
      setForm({ name: "", text: "", rating: 0 });
      setShowForm(false);
      setErrors({});
      fetchReviews();
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  // Average rating
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0";

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative orb */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="section-tag mb-2"
            >
              Témoignages clients
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              Ce que disent nos clients
            </motion.h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Average rating badge */}
            {reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl"
              >
                <HiStar className="w-5 h-5 text-orange-400" />
                <span className="text-white font-bold">{avgRating}</span>
                <span className="text-slate-500 text-sm">/ 5</span>
                <span className="text-slate-600 text-xs">
                  ({reviews.length} avis)
                </span>
              </motion.div>
            )}

            {/* Add review button */}
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onClick={() => setShowForm(!showForm)}
              className="btn-primary text-sm"
            >
              <HiPaperAirplane className="w-4 h-4 rotate-90" />
              {showForm ? "Annuler" : "Laisser un avis"}
            </motion.button>
          </div>
        </div>

        {/* ── Form (collapsible) ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <form
                onSubmit={handleSubmit}
                className="glass-card p-6 sm:p-8 max-w-xl"
              >
                <h3 className="text-white font-bold text-lg mb-5">
                  Partagez votre expérience
                </h3>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Votre nom *
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Jean Kouassi"
                        className={`input-field pl-10 ${
                          errors.name ? "border-red-500/50" : ""
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Note *
                    </label>
                    <StarRating
                      value={form.rating}
                      onChange={(rating) => setForm((p) => ({ ...p, rating }))}
                    />
                    {errors.rating && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.rating}
                      </p>
                    )}
                  </div>

                  {/* Text */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Votre avis *
                    </label>
                    <textarea
                      value={form.text}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, text: e.target.value }))
                      }
                      rows={3}
                      maxLength={500}
                      placeholder="Décrivez votre expérience avec IvoireStore..."
                      className={`input-field resize-none ${
                        errors.text ? "border-red-500/50" : ""
                      }`}
                    />
                    <p className="text-slate-600 text-[10px] mt-1 text-right">
                      {form.text.length}/500
                    </p>
                    {errors.text && (
                      <p className="text-red-400 text-xs mt-0.5">
                        {errors.text}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary mt-5 w-full sm:w-auto justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <HiPaperAirplane className="w-4 h-4 rotate-90" />
                      Envoyer mon avis
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Reviews display (paginated cards) ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <SkeletonReview key={i} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-14 glass-card">
            <p className="text-slate-400 text-lg mb-2">
              Aucun avis pour le moment
            </p>
            <p className="text-slate-600 text-sm">
              Soyez le premier à partager votre expérience !
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {visibleReviews.map((avis) => (
                  <ReviewCard key={avis._id} avis={avis} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => goTo(-1)}
                  className="w-10 h-10 bg-white/[0.05] border border-white/[0.1] hover:bg-orange-500/10 hover:border-orange-500/30 rounded-full flex items-center justify-center text-white hover:text-orange-400 transition-all duration-300"
                >
                  <HiChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1.5">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentPage
                          ? "bg-orange-400 w-6"
                          : "bg-white/[0.15] hover:bg-white/[0.3]"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => goTo(1)}
                  className="w-10 h-10 bg-white/[0.05] border border-white/[0.1] hover:bg-orange-500/10 hover:border-orange-500/30 rounded-full flex items-center justify-center text-white hover:text-orange-400 transition-all duration-300"
                >
                  <HiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
