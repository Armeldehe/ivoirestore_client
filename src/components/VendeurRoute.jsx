import { Navigate } from "react-router-dom";
import { useVendeurAuth } from "../context/VendeurAuthContext";
import PageLoader from "./PageLoader";

export default function VendeurRoute({ children }) {
  const { isAuth, loading } = useVendeurAuth();

  if (loading) return <PageLoader />;
  if (!isAuth) return <Navigate to="/vendeur/login" replace />;

  return children;
}
