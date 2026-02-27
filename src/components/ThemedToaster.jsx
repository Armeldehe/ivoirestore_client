import { Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

export default function ThemedToaster() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isDark ? "#111830" : "#ffffff",
          color: isDark ? "#fff" : "#0f172a",
          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(0,0,0,0.08)",
          borderRadius: "12px",
          fontSize: "14px",
          padding: "12px 16px",
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.3)"
            : "0 4px 24px rgba(0,0,0,0.1)",
        },
        success: {
          iconTheme: {
            primary: "#F7841D",
            secondary: isDark ? "#fff" : "#fff",
          },
        },
        error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }}
    />
  );
}
