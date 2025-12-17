import type { CollaboratorDocument } from '@entities/collaborator';
import { ConfirmDialog } from '@shared/ui';
import { useDeleteDocument } from '../model/useDeleteDocument';

interface DeleteDocumentDialogProps {
  document: CollaboratorDocument | null;
  collaboratorId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Diálogo de confirmación para eliminar documento (baja lógica)
 */
export function DeleteDocumentDialog({
  document,
  collaboratorId,
  isOpen,
  onClose,
  onSuccess,
}: DeleteDocumentDialogProps) {
  const { deleteDocument, isLoading } = useDeleteDocument(collaboratorId, () => {
    onSuccess();
    onClose();
  });

  const handleConfirm = async () => {
    if (!document) return;
    await deleteDocument(document.id);
  };

  if (!document) return null;

  const message = `¿Estás seguro de que deseas eliminar el documento "${document.fileName}"? Esta acción marcará el documento como inactivo y no aparecerá en las búsquedas.`;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Eliminar Documento"
      message={message}
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      variant="danger"
      isLoading={isLoading}
    />
  );
}
