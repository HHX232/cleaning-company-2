"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import ContactModal from "./ContactModal";

const ContactModalContext = createContext<(() => void) | null>(null);

export function useContactModal() {
  const openContactModal = useContext(ContactModalContext);
  if (!openContactModal) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return openContactModal;
}

const SESSION_KEY = "contactModalAutoShown";
const AUTO_OPEN_DELAY_MS = 60_000;

export default function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openContactModal = useCallback(() => setOpen(true), []);
  const closeContactModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ContactModalContext.Provider value={openContactModal}>
      {children}
      <ContactModal open={open} onClose={closeContactModal} />
    </ContactModalContext.Provider>
  );
}
