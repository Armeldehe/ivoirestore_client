import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginAdmin, getAdminProfile } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]       = useState(null);
  const [loading, setLoading]   = useState(true); // check initial token

  // Charge le profil depuis le token stocké
  useEffect(() => {
    const token = localStorage.getItem('ivoire_admin_token');
    if (!token) { setLoading(false); return; }
    getAdminProfile()
      .then((data) => setAdmin(data.admin))
      .catch(() => {
        localStorage.removeItem('ivoire_admin_token');
        localStorage.removeItem('ivoire_admin_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginAdmin({ email, password });
    localStorage.setItem('ivoire_admin_token', data.token);
    setAdmin(data.admin);
    toast.success('Connexion réussie !');
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ivoire_admin_token');
    localStorage.removeItem('ivoire_admin_user');
    setAdmin(null);
    toast.success('Déconnecté avec succès');
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuth: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
