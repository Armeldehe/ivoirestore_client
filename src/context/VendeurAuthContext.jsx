import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  loginVendeur as loginVendeurAPI,
  getVendeurProfile,
} from "../services/api";
import toast from "react-hot-toast";

const VendeurAuthContext = createContext(null);

export function VendeurAuthProvider({ children }) {
  const [vendeur, setVendeur] = useState(null);
  const [boutique, setBoutique] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ivoire_vendeur_token");
    if (!token) {
      setLoading(false);
      return;
    }
    getVendeurProfile()
      .then((data) => {
        setVendeur(data.vendeur);
        setBoutique(data.vendeur?.boutique);
      })
      .catch(() => {
        localStorage.removeItem("ivoire_vendeur_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginVendeurAPI({ email, password });
    localStorage.setItem("ivoire_vendeur_token", data.token);
    setVendeur(data.vendeur);
    setBoutique(data.vendeur?.boutique);
    toast.success("Connexion réussie !");
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ivoire_vendeur_token");
    setVendeur(null);
    setBoutique(null);
    toast.success("Déconnecté avec succès");
  }, []);

  return (
    <VendeurAuthContext.Provider
      value={{ vendeur, boutique, loading, login, logout, isAuth: !!vendeur }}
    >
      {children}
    </VendeurAuthContext.Provider>
  );
}

export const useVendeurAuth = () => {
  const ctx = useContext(VendeurAuthContext);
  if (!ctx)
    throw new Error("useVendeurAuth must be used within VendeurAuthProvider");
  return ctx;
};
