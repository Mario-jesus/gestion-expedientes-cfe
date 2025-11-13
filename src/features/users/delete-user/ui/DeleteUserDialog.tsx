import type { User } from '@entities/user';
import { ConfirmDialog } from '@shared/ui';
import { useDeleteUser } from '../model/useDeleteUser';
import { logger } from '@/shared/config';

interface DeleteUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Diálogo de confirmación para eliminar usuario
 */
export function DeleteUserDialog({
  user,
  isOpen,
  onClose,
  onSuccess,
}: DeleteUserDialogProps) {
  const { deleteUser, isLoading } = useDeleteUser(() => {
    onSuccess();
    onClose();
  });

  const handleConfirm = async () => {
    if (!user) return;
    await deleteUser(user.id);
  };

  if (!user) return null;

  logger.log(user);
  logger.log(user.username);

  const message = `¿Estás seguro de que deseas eliminar al usuario "${user.name}" (@${user.username})? Esta acción no se puede deshacer.`;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Eliminar Usuario"
      message={message}
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      variant="danger"
      isLoading={isLoading}
    />
  );
}
