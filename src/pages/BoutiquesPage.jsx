import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import { HiBuildingStorefront } from "react-icons/hi2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BoutiqueCard from "../components/BoutiqueCard";
import PlaceholderBoutiqueCard from "../components/PlaceholderBoutiqueCard";
import { getBoutiques } from "../services/api";

export default function BoutiquesPage() {
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getBoutiques()
      .then((res) => {
        setBoutiques(res.data || []);
      })
      .catch((err) => {
        console.error("Erreur boutiques:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredBoutiques = boutiques.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.description &&
        b.description.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-orange-500 mb-2"
            >
              <HiBuildingStorefront className="w-6 h-6" />
              <span className="text-sm font-bold tracking-widest uppercase">
                IvoireStore Partners
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Nos <span className="text-orange-500">Boutiques</span> Partenaires
            </motion.h1>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative max-w-xl"
            >
              <HiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: "var(--text-tertiary)" }}
              />
              <input
                type="text"
                placeholder="Rechercher une boutique..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field w-full py-4 pl-12 pr-6"
              />
            </motion.div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl skeleton" />
              ))}
            </div>
          ) : boutiques.length === 0 ? (
            /* No boutiques in DB → show placeholder cards */
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[0, 1, 2, 3].map((i) => (
                <PlaceholderBoutiqueCard key={i} index={i} />
              ))}
            </motion.div>
          ) : filteredBoutiques.length === 0 ? (
            /* Search returned nothing */
            <div
              className="text-center py-20 rounded-3xl"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <span className="text-6xl mb-4 block">🔍</span>
              <h3
                className="text-xl font-bold"
                style={{ color: "var(--text-secondary)" }}
              >
                Aucune boutique trouvée
              </h3>
              <p className="mt-2" style={{ color: "var(--text-tertiary)" }}>
                Essayez un autre mot-clé ou parcourez nos produits.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredBoutiques.map((boutique, idx) => (
                <BoutiqueCard
                  key={boutique._id}
                  boutique={boutique}
                  index={idx}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
