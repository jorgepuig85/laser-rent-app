"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, description, loading }: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">{title}</h3>
          </div>
          <p className="text-stone-600 font-medium text-sm leading-relaxed pl-16">
            {description}
          </p>
        </div>
        
        <div className="bg-stone-50 p-4 sm:px-6 border-t border-stone-100 flex items-center justify-end gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-full font-bold text-sm text-stone-500 bg-white border border-stone-200 hover:bg-stone-100 hover:text-stone-700 transition-colors w-full sm:w-auto"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-600/20 transition-all w-full sm:w-auto hover:scale-[1.02] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
