"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { createBrowserClient } from "@supabase/ssr";
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

  // Instancia inicial genérica para leer la sesión actual
  const [baseClient] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

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
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions for compression (e.g., 1200px)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                resolve(blob);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.8 // Quality
          );
        };
      };
    });
  };

  const handleUpload = async () => {
    if (!file) { setError("Seleccioná un archivo para continuar."); return; }
    setUploading(true);
    setError(null);

    try {
      // 1. Recuperamos la sesión activa antes de cada intento usando getSession()
      const { data: { session } } = await baseClient.auth.getSession();
      if (!session) throw new Error("No autorizado. Inicia sesión nuevamente.");

      // 2. Cliente dedicado con Header Implícito forzado
      const authClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        }
      );

      // 3. Compresión opcional para móviles
      const fileToUpload = await compressImage(file);
      
      // 4. Ruta simplificada pedida (raíz + Date + name)
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const path = `${Date.now()}-${safeName}`;

      // 5. Intento de subida con log exhaustivo, MIME type dinámico, timeout extendido
      const uploadPromise = authClient.storage
        .from("comprobantes")
        .upload(path, fileToUpload, { 
          upsert: true, 
          contentType: file.type || "application/octet-stream"
        });

      const timeoutPromise = new Promise<{ data: { path: string } | null, error: Error | null }>((_, reject) => 
        setTimeout(() => reject(new Error("La subida tardó demasiado. Comprobá tu conexión.")), 30000)
      );

      const { data, error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]);

      if (uploadError) {
        // ── Verbose diagnostic log ────────────────────────────────────────
        console.error('[STORAGE ERROR] Full details:', {
          message: uploadError.message,
          rawError: uploadError,
          fileInfo: {
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            type: file.type || 'UNKNOWN MIME',
          },
          compressedSize: fileToUpload instanceof Blob ? `${(fileToUpload.size / 1024).toFixed(1)} KB` : 'no compress',
          path,
          bucket: 'comprobantes',
          sessionPresent: !!session,
        });
        throw new Error(uploadError.message || "Error al subir archivo.");
      }

      console.log('[STORAGE] Upload successful:', {
        path: data?.path,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      });

      const result = await uploadReceipt(rentalId, path);
      if (!result.success) throw new Error(result.error);

      toast.success("Comprobante recibido. En breve confirmaremos tu reserva");
      onSuccess();
      onClose();
      
      router.refresh();
      setTimeout(() => window.location.reload(), 1500);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Error inesperado. Intentá nuevamente.";
      console.error('[STORAGE] Caught error:', errMsg, e);
      setError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    /* ── Portal backdrop ── */
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm"
      style={{ zIndex: 9999 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Modal pago de seña"
    >
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-stone-900/30 overflow-hidden animate-[fadeInScale_0.2s_ease-out_both]">

        {/* ── Header ── */}
        <div className="bg-stone-900 px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-stone-500 uppercase mb-1">
              Paso final
            </p>
            <h2 className="font-serif text-2xl font-bold text-white leading-tight">
              Confirmar con Seña
            </h2>
          </div>
          {/* Close button — prominent X */}
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="rounded-full bg-white/10 border border-white/20 p-2.5 text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 py-7 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Deposit amount highlight */}
          {depositAmount && (
            <div className="flex items-center justify-between bg-[#FCFAF5] border border-[#EAE3D5] rounded-2xl px-6 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Monto de la seña (20%)
                </p>
                <p className="font-serif text-3xl font-bold text-stone-900 mt-1">
                  ${depositAmount.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Para confirmar
                </p>
                <p className="text-sm font-semibold text-[#B89B72] mt-1">{startDate}</p>
              </div>
            </div>
          )}

          {/* Bank info */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Datos de transferencia
            </p>
            <div className="space-y-2">
              {[
                { label: "Tipo de cuenta", value: BANK_INFO.banco, key: "banco" },
                { label: "Titular", value: BANK_INFO.titular, key: "titular" },
                { label: "CVU ★ Copiar para transferir", value: BANK_INFO.cvu, key: "cvu", highlight: true },
                { label: "Alias (más fácil)", value: BANK_INFO.alias, key: "alias" },
                { label: "CUIT / CUIL", value: BANK_INFO.cuil, key: "cuil" },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                    item.highlight
                      ? "bg-[#FFF9EC] border-2 border-[#D4AF37]/40 shadow-sm"
                      : "bg-stone-50 border border-stone-100"
                  }`}
                >
                  <div>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${item.highlight ? "text-[#B89B72]" : "text-stone-400"}`}>
                      {item.label}
                    </p>
                    <p className={`text-sm font-semibold font-mono mt-0.5 ${item.highlight ? "text-stone-900 text-base tracking-wider" : "text-stone-800"}`}>
                      {item.value}
                    </p>
                  </div>
                  <button
                    onClick={() => copy(item.value, item.key)}
                    className={`rounded-lg border p-2 transition-colors ${
                      item.highlight
                        ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#B89B72] hover:text-stone-900"
                        : "bg-white border-stone-200 text-stone-400 hover:text-[#B89B72]"
                    }`}
                  >
                    {copiedField === item.key ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Comprobante de transferencia
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-[#EAE3D5] hover:border-[#D4AF37]/50 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-300 bg-[#FCFAF5]/50 hover:bg-[#FCFAF5]"
            >
              <div className="rounded-2xl bg-white border border-[#EAE3D5] p-3 shadow-sm group-hover:scale-105 transition-transform">
                <Upload className="h-6 w-6 text-[#B89B72]" />
              </div>
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-bold text-stone-800">{file.name}</p>
                  <p className="text-xs text-stone-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-semibold text-stone-600">
                    Tocá para seleccionar el comprobante
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    JPG, PNG, PDF · Máx. 5 MB
                  </p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setFile(f); setError(null); }
                }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] hover:bg-[#B89B72] disabled:bg-stone-200 disabled:text-stone-400 text-stone-900 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-[0.2em] py-4 transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-lg shadow-[#D4AF37]/20 disabled:shadow-none"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo comprobante...
              </>
            ) : (
              "Confirmar envío de seña"
            )}
          </button>

          <p className="text-center text-[10px] text-stone-400 leading-relaxed">
            Tenés <strong className="text-stone-600">24 horas</strong> para subir el comprobante.
            Pasado ese plazo, la reserva podrá cancelarse automáticamente.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
