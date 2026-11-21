import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import AlertOn from "../components/commonts/AlertOn";

interface AlertData {
  icon: ReactNode;
  text: string;
}

interface AlertContextType {
  showAlert: (icon: ReactNode, text: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);
const EXIT_DURATION = 400; // harus sama dengan durasi transition di CSS (ms)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeAlert = useCallback(() => {
    setIsOpen(false); // trigger animasi keluar (slide ke atas)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setAlert(null); // baru unmount setelah animasi selesai
    }, EXIT_DURATION);
  }, []);

  const showAlert = useCallback((icon: ReactNode, text: string) => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

    setAlert({ icon, text });
    // requestAnimationFrame supaya transition sempat terdaftar sebelum isOpen jadi true
    requestAnimationFrame(() => setIsOpen(true));

    showTimeoutRef.current = setTimeout(() => {
      closeAlert();
    }, 5000);
  }, [closeAlert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <AlertOn
          icon={alert.icon}
          text={alert.text}
          isOpen={isOpen}
          onClose={closeAlert}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert harus dipakai di dalam AlertProvider");
  return ctx;
}