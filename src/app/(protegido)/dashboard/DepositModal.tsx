"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { uploadReceipt } from "@/app/(protegido)/dashboard/actions";
import { toast } from "sonner";
import {
  X,
  Copy,
  CheckCircle2,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";

const BANK_INFO = {
  banco: "Cuenta Virtual (CVU) — Mercado Pago / Billetera",
  titular: "Jorge Antonio Puig",
  cvu: "0000003100004637553302",
  alias: "jorgeapuig1985",
  cuil: "27-31379661-8",
};

interface Props {
  rentalId: string;
  depositAmount: number | null;
  startDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DepositModal({ rentalId, depositAmount, startDate, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const copy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const compressImage = (file: File): Promise<Blob | File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) { resolve(file); return; }

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1200;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { URL.revokeObjectURL(objectUrl); resolve(file); return; }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(objectUrl);
          resolve(blob || file);
        }, 'image/jpeg', 0.8);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
    });
  };

  const handleUpload = async () => {
    if (!file) { setError("Seleccioná un archivo para continuar."); return; }
    
    setUploading(true);
    setError(null);

    try {
      // 1. Compresión ligera en el cliente (opcional para ahorrar ancho de banda)
      const processedFile = file.size > 1024 * 1024 
        ? await compressImage(file) 
        : file;

      // 2. Preparar FormData para Server Action
      const formData = new FormData();
      formData.append("rentalId", rentalId);
      formData.append("file", processedFile, file.name);

      // 3. NUCLEAR UPLOAD via Server Action
      // Esto delega la responsabilidad de subir a Supabase al servidor Vercel,
      // que es mucho más estable que un navegador móvil.
      const result = await uploadReceipt(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("¡Comprobante enviado exitosamente!");
      onSuccess();
      onClose();
      
      router.refresh();
      setTimeout(() => window.location.reload(), 1500);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Error al subir el comprobante.";
      setError(errMsg);
      console.error('[UPLOAD_ERROR]', e);
    } finally {
      setUploading(false);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm"
      style={{ zIndex: 9999 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-stone-500 uppercase mb-1">Paso final</p>
            <h2 className="font-serif text-2xl font-bold text-white leading-tight">Confirmar con Seña</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/60 hover:text-white transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 py-7 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
          {/* Amount */}
          {depositAmount && (
            <div className="bg-[#FCFAF5] border border-[#EAE3D5] rounded-2xl px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Monto de la seña (20%)</p>
              <p className="font-serif text-3xl font-bold text-stone-900 mt-1">${depositAmount.toLocaleString("es-AR")}</p>
              <p className="text-sm font-semibold text-[#B89B72] mt-1">{startDate}</p>
            </div>
          )}

          {/* Bank info */}
          <div className="space-y-2">
            {[
              { label: "CVU (Copiar para transferir)", value: BANK_INFO.cvu, key: "cvu", highlight: true },
              { label: "Alias", value: BANK_INFO.alias, key: "alias" },
              { label: "Titular", value: BANK_INFO.titular, key: "titular" },
            ].map((item) => (
              <div key={item.key} className={`flex items-center justify-between rounded-xl px-4 py-3 ${item.highlight ? "bg-[#FFF9EC] border-2 border-[#D4AF37]/40 shadow-sm" : "bg-stone-50 border border-stone-100"}`}>
                <div className="overflow-hidden">
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${item.highlight ? "text-[#B89B72]" : "text-stone-400"}`}>{item.label}</p>
                  <p className={`text-sm font-semibold font-mono truncate ${item.highlight ? "text-stone-900" : "text-stone-800"}`}>{item.value}</p>
                </div>
                <button onClick={() => copy(item.value, item.key)} className="p-2 text-stone-400 hover:text-[#B89B72] transition-colors">
                  {copiedField === item.key ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>

          {/* Upload area */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Comprobante</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-[#EAE3D5] hover:border-[#D4AF37]/50 rounded-2xl p-6 flex flex-col items-center gap-2 transition-all bg-[#FCFAF5]/50 hover:bg-[#FCFAF5]"
            >
              <div className="rounded-xl bg-white p-2 shadow-sm"><Upload className="h-5 w-5 text-[#B89B72]" /></div>
              {file ? (
                <p className="text-sm font-bold text-stone-800 truncate max-w-xs">{file.name}</p>
              ) : (
                <p className="text-sm font-semibold text-stone-600">Tocá para subir foto o PDF</p>
              )}
              <input ref={fileRef} type="file" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Action */}
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] hover:bg-[#B89B72] disabled:bg-stone-200 disabled:text-stone-400 text-stone-900 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg hover:scale-[1.01] active:scale-95"
          >
            {uploading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Subiendo comprobante...</>
            ) : (
              "Confirmar envío de seña"
            )}
          </button>

          <p className="text-center text-[10px] text-stone-400 leading-relaxed uppercase tracking-tighter">
            Tenés <strong className="text-stone-600">24 horas</strong> para subir el comprobante.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
