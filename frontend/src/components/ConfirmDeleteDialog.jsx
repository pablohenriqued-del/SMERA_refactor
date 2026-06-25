import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export const ConfirmDeleteDialog = ({ open, onClose, onConfirm, itemName }) => (
  <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
    <AlertDialogContent className="glass-dark border-white/10 text-white" data-testid="confirm-delete-dialog">
      <AlertDialogHeader>
        <AlertDialogTitle className="font-heading uppercase tracking-wide">Confirmar Exclusão</AlertDialogTitle>
        <AlertDialogDescription className="text-zinc-400">
          Tem certeza que deseja excluir {itemName ? <span className="text-white font-medium">{`"${itemName}"`}</span> : 'este registro'}? Esta ação não pode ser desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="btn-sony-outline border-white/10" data-testid="cancel-delete-btn">Cancelar</AlertDialogCancel>
        <AlertDialogAction
          className="bg-sony-red hover:bg-red-600 text-white"
          onClick={onConfirm}
          data-testid="confirm-delete-btn"
        >
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
