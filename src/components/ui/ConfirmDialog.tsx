"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white p-8 text-left align-middle shadow-2xl transition-all border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-serif font-bold leading-6 text-slate-900"
                  >
                    {title}
                  </Dialog.Title>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 rounded-xl h-12 font-semibold text-slate-600 hover:bg-slate-50"
                    onClick={onClose}
                  >
                    Volver
                  </Button>
                  <Button
                    type="button"
                    disabled={loading}
                    className="flex-1 rounded-xl h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                    onClick={onConfirm}
                  >
                    {loading ? "Cancelando..." : "Confirmar Cancelación"}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
