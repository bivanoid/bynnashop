import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteLoadingBar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400); // durasi tampil
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "2px",
        width: "100%",
        background: "linear-gradient(90deg, var(--cl1), var(--cl2))",
        zIndex: 9999,
        animation: "loadingBarAnim 0.4s ease-in-out",
      }}
    />
  );
}