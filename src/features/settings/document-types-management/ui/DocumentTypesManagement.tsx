import { useEffect, useState } from 'react';
import type { DocumentType, CreateDocumentTypeDto } from '@entities/collaborator';
import { catalogsApi, getDocumentKindLabel } from '@entities/collaborator';
import { Modal, ConfirmDialog } from '@shared/ui';
import { CreateDocumentTypeForm } from './CreateDocumentTypeForm';
import { EditDocumentTypeForm } from './EditDocumentTypeForm';
import styles from '../../areas-management/ui/AreasManagement.module.scss';

/**
 * Componente para gestionar el catálogo de Tipos de Documento
 */
export function DocumentTypesManagement() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);

  useEffect(() => {
    loadDocumentTypes();
  }, []);

  const loadDocumentTypes = async () => {
    try {
      setIsLoading(true);
      const data = await catalogsApi.documentTypes.getAll();
      setDocumentTypes(data);
    } catch (error) {
      console.error('Error cargando tipos de documento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    loadDocumentTypes();
  };

  const handleEdit = (documentType: DocumentType) => {
    setSelectedDocumentType(documentType);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedDocumentType(null);
    loadDocumentTypes();
  };

  const handleDelete = (documentType: DocumentType) => {
    setSelectedDocumentType(documentType);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDocumentType) return;

    try {
      await catalogsApi.documentTypes.delete(selectedDocumentType.id);
      setIsDeleteDialogOpen(false);
      setSelectedDocumentType(null);
      loadDocumentTypes();
    } catch (error) {
      console.error('Error eliminando tipo de documento:', error);
      alert('Error al eliminar el tipo de documento. Intenta nuevamente.');
    }
  };

  const handleToggleStatus = async (documentType: DocumentType) => {
    try {
      await catalogsApi.documentTypes.update(documentType.id, {
        nombre: documentType.nombre,
        kind: documentType.kind,
        descripcion: documentType.descripcion,
        isActive: !documentType.isActive,
      } as Partial<CreateDocumentTypeDto>);
      loadDocumentTypes();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado. Intenta nuevamente.');
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando tipos de documento...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tipos de Documento</h2>
        <button
          className={styles.createButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          ➕ Nuevo Tipo
        </button>
      </div>

      {documentTypes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay tipos de documento registrados.</p>
          <button
            className={styles.createButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear Primer Tipo
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo Principal</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documentTypes.map((documentType) => (
                <tr key={documentType.id}>
                  <td>{documentType.nombre}</td>
                  <td>{getDocumentKindLabel(documentType.kind)}</td>
                  <td>{documentType.descripcion || '-'}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        documentType.isActive ? styles.active : styles.inactive
                      }`}
                    >
                      {documentType.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(documentType)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.toggleButton}
                        onClick={() => handleToggleStatus(documentType)}
                        title={documentType.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {documentType.isActive ? '🔒' : '🔓'}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(documentType)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Tipo de Documento"
        size="medium"
      >
        <CreateDocumentTypeForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {selectedDocumentType && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDocumentType(null);
          }}
          title="Editar Tipo de Documento"
          size="medium"
        >
          <EditDocumentTypeForm
            documentType={selectedDocumentType}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedDocumentType(null);
            }}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedDocumentType(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Tipo de Documento"
        message={`¿Estás seguro de que deseas eliminar el tipo "${selectedDocumentType?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
}
