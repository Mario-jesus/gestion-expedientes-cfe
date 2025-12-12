import type { CollaboratorDocument } from '@entities/collaborator';
import { useDeleteDocument } from '../model/useDeleteDocument';
import { Modal } from '@shared/ui';
import styles from './DeleteDocumentDialog.module.scss';

interface DeleteDocumentDialogProps {
  document: CollaboratorDocument;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Diálogo de confirmación para eliminar un documento
 */
export function DeleteDocumentDialog({
  document,
  isOpen,
  onClose,
  onSuccess,
}: DeleteDocumentDialogProps) {
  const { deleteDocument, isLoading, error } = useDeleteDocument({
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleConfirm = async () => {
    await deleteDocument(document.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Documento">
      <div className={styles.content}>
        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <p>
          ¿Estás seguro de que deseas eliminar el documento{' '}
          <strong>{document.fileName}</strong>?
        </p>
        <p className={styles.warning}>
          Esta acción no se puede deshacer. El documento será marcado como
          inactivo.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={styles.deleteButton}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
