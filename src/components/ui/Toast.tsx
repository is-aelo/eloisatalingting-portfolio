"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { LuCheck, LuX, LuCircleAlert } from "react-icons/lu";

type ToastType = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextIdRef.current++;
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 rounded-full border px-4 py-3 text-sm shadow-sm transition-all ${
              item.type === "success"
                ? "border-accent-tertiary/30 bg-accent-tertiary/10 text-accent-tertiary"
                : "border-accent-quaternary/30 bg-accent-quaternary/10 text-accent-quaternary"
            }`}
          >
            {item.type === "success" ? (
              <LuCheck size={18} />
            ) : (
              <LuCircleAlert size={18} />
            )}
            <span className="font-body">{item.message}</span>
            <button
              onClick={() =>
                setItems((prev) => prev.filter((t) => t.id !== item.id))
              }
              className="ml-2 cursor-pointer opacity-60 hover:opacity-100"
            >
              <LuX size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
