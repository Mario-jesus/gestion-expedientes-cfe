import type { Minute } from '@entities/minute';
import { ConfirmDialog } from '@shared/ui';
import { useDeleteMinute } from '../model/useDeleteMinute';

interface DeleteMinuteDialogProps {
  minute: Minute | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Diálogo de confirmación para eliminar minuta (baja lógica)
 */
export function DeleteMinuteDialog({
  minute,
  isOpen,
  onClose,
  onSuccess,
}: DeleteMinuteDialogProps) {
  const { deleteMinute, isLoading } = useDeleteMinute(() => {
    onSuccess();
    onClose();
  });

  const handleConfirm = async () => {
    if (!minute) return;
    await deleteMinute(minute.id);
  };

  if (!minute) return null;

  const message = `¿Estás seguro de que deseas eliminar la minuta "${minute.titulo}"? Esta acción marcará la minuta como inactiva y no aparecerá en las búsquedas.`;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Eliminar Minuta"
      message={message}
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      variant="danger"
      isLoading={isLoading}
    />
  );
}
