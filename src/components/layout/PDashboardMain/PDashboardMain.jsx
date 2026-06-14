import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function PDashboardMain({ children }) {
  const mainRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <main ref={mainRef} className="flex-1 overflow-y-auto">
      {children}
    </main>
  );
}
