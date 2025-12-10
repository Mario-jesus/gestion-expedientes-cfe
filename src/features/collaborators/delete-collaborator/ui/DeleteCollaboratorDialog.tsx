import type { Collaborator } from '@entities/collaborator';
import { ConfirmDialog } from '@shared/ui';
import { useDeleteCollaborator } from '../model/useDeleteCollaborator';

interface DeleteCollaboratorDialogProps {
  collaborator: Collaborator | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Diálogo de confirmación para eliminar colaborador (baja lógica)
 */
export function DeleteCollaboratorDialog({
  collaborator,
  isOpen,
  onClose,
  onSuccess,
}: DeleteCollaboratorDialogProps) {
  const { deleteCollaborator, isLoading } = useDeleteCollaborator(() => {
    onSuccess();
    onClose();
  });

  const handleConfirm = async () => {
    if (!collaborator) return;
    await deleteCollaborator(collaborator.id);
  };

  if (!collaborator) return null;

  const message = `¿Estás seguro de que deseas eliminar al colaborador "${collaborator.nombre} ${collaborator.apellidos}" (RPE: ${collaborator.rpe})? Esta acción marcará al colaborador como inactivo y no aparecerá en las búsquedas.`;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Eliminar Colaborador"
      message={message}
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      variant="danger"
      isLoading={isLoading}
    />
  );
}
