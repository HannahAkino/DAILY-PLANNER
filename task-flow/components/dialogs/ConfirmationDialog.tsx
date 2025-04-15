// components/dialogs/ConfirmationDialog.tsx
"use client";

import { AlertTriangle, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "info";
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger"
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-card text-card-foreground">
        <AlertDialogHeader className="bg-primary/5 p-4 -mx-6 -mt-6 rounded-t-lg border-b">
          <div className="flex items-center gap-2">
            {variant === "danger" ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <Info className="h-5 w-5 text-primary" />
            )}
            <AlertDialogTitle className="text-xl font-semibold">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
          <AlertDialogCancel className="mt-0 focus:ring-2 focus:ring-primary/20">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={variant === "danger" 
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
