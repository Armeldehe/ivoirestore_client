import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPhotograph, HiX, HiUpload, HiCheckCircle } from "react-icons/hi";
import { uploadImage } from "../services/api";
import toast from "react-hot-toast";

/**
 * ImageUploader — Premium drag & drop image upload component
 *
 * Props:
 * - endpoint: string  — API path, e.g. "/upload/product-image"
 * - onUploadComplete: (url: string) => void
 * - currentImage?: string — existing image URL for preview
 * - label?: string — form label text
 * - onRemove?: () => void — callback when image is removed
 */
export default function ImageUploader({
  endpoint,
  onUploadComplete,
  currentImage,
  label = "Image",
  onRemove,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Format non supporté. Utilisez JPEG, PNG ou WebP.";
    }
    if (file.size > MAX_SIZE) {
      return "Le fichier dépasse 5 MB.";
    }
    return null;
  };

  const handleUpload = useCallback(
    async (file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }

      setError(null);
      setUploading(true);
      setProgress(0);

      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      try {
        const data = await uploadImage(endpoint, file, (pct) =>
          setProgress(pct),
        );
        if (data.success && data.url) {
          setPreview(data.url);
          onUploadComplete(data.url);
          toast.success("Image uploadée !");
        }
      } catch (err) {
        setError(err.message || "Erreur d'upload");
        toast.error(err.message || "Erreur d'upload");
        setPreview(null);
      } finally {
        setUploading(false);
        URL.revokeObjectURL(localUrl);
      }
    },
    [endpoint, onUploadComplete],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const handleRemove = () => {
    setPreview(null);
    setProgress(0);
    setError(null);
    onRemove?.();
  };

  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-2">
        {label}
      </label>

      <AnimatePresence mode="wait">
        {preview && !uploading ? (
          /* ── Preview Mode ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="glass-card overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 sm:h-56 object-cover rounded-xl"
              />
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 rounded-xl">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all text-white"
                  title="Remplacer"
                >
                  <HiUpload className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl backdrop-blur-sm transition-all text-red-400"
                  title="Supprimer"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>
              {/* Success indicator */}
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/20 backdrop-blur-md border border-green-500/20 rounded-lg text-green-400 text-[10px] font-bold">
                  <HiCheckCircle className="w-3.5 h-3.5" /> Uploadée
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Drop Zone ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all duration-300 text-center ${
              dragOver
                ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                : error
                  ? "border-red-500/40 bg-red-500/5"
                  : "border-white/[0.12] bg-white/[0.02] hover:border-orange-500/40 hover:bg-white/[0.04]"
            }`}
          >
            {uploading ? (
              /* Uploading state */
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 bg-orange-500/15 rounded-2xl flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <HiUpload className="w-6 h-6 text-orange-400" />
                  </motion.div>
                </div>
                <div className="w-full max-w-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white text-xs font-medium">
                      Upload en cours...
                    </span>
                    <span className="text-orange-400 text-xs font-bold">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Idle drop zone */
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={
                    dragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }
                  }
                  transition={{ duration: 0.2 }}
                  className="w-14 h-14 bg-white/[0.05] rounded-2xl flex items-center justify-center border border-white/[0.08]"
                >
                  <HiPhotograph
                    className={`w-7 h-7 ${dragOver ? "text-orange-400" : "text-slate-500"} transition-colors`}
                  />
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {dragOver
                      ? "Relâchez pour uploader"
                      : "Glisser-déposer une image ici"}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    ou{" "}
                    <span className="text-orange-400 font-semibold">
                      cliquez pour parcourir
                    </span>
                  </p>
                </div>
                <p className="text-slate-600 text-[10px]">
                  JPEG, PNG, WebP — 5 MB max
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error display */}
      {error && !uploading && (
        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {error}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
