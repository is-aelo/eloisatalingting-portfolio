"use client";

import { createContext, useContext, useState, useCallback } from "react";
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
  let nextId = 0;

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId++;
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
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm transition-all ${
              item.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
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
