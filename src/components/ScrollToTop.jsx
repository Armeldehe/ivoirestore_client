import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Composant utilitaire qui remonte le défilement en haut de la page
 * à chaque changement de route.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
