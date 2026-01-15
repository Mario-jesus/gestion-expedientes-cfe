import { useEffect, useState } from 'react';
import type { Adscripcion } from '@entities/collaborator';
import { catalogsApi } from '@entities/collaborator';
import { Modal, ConfirmDialog } from '@shared/ui';
import { CreateAdscripcionForm } from './CreateAdscripcionForm';
import { EditAdscripcionForm } from './EditAdscripcionForm';
import styles from '../../areas-management/ui/AreasManagement.module.scss';

/**
 * Componente para gestionar el catálogo de Adscripciones
 */
export function AdscripcionesManagement() {
  const [adscripciones, setAdscripciones] = useState<Adscripcion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdscripcion, setSelectedAdscripcion] = useState<Adscripcion | null>(null);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const adscripcionesResponse = await catalogsApi.adscripciones.getAll();
      setAdscripciones(adscripcionesResponse.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    loadData();
  };

  const handleEdit = (adscripcion: Adscripcion) => {
    setSelectedAdscripcion(adscripcion);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedAdscripcion(null);
    loadData();
  };

  const handleDelete = (adscripcion: Adscripcion) => {
    setSelectedAdscripcion(adscripcion);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAdscripcion) return;

    try {
      await catalogsApi.adscripciones.delete(selectedAdscripcion.id);
      setIsDeleteDialogOpen(false);
      setSelectedAdscripcion(null);
      loadData();
    } catch (error) {
      console.error('Error eliminando adscripción:', error);
      alert('Error al eliminar la adscripción. Intenta nuevamente.');
    }
  };

  const handleToggleStatus = async (adscripcion: Adscripcion) => {
    try {
      if (adscripcion.isActive) {
        await catalogsApi.adscripciones.deactivate(adscripcion.id);
      } else {
        await catalogsApi.adscripciones.activate(adscripcion.id);
      }
      loadData();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado. Intenta nuevamente.');
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando adscripciones...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Adscripciones</h2>
        <button
          className={styles.createButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          ➕ Nueva Adscripción
        </button>
      </div>

      {adscripciones.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay adscripciones registradas.</p>
          <button
            className={styles.createButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear Primera Adscripción
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Adscripción</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {adscripciones.map((adscripcion) => (
                <tr key={adscripcion.id}>
                  <td>{adscripcion.nombre}</td>
                  <td>{adscripcion.adscripcion || '-'}</td>
                  <td>{adscripcion.descripcion || '-'}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        adscripcion.isActive ? styles.active : styles.inactive
                      }`}
                    >
                      {adscripcion.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(adscripcion)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.toggleButton}
                        onClick={() => handleToggleStatus(adscripcion)}
                        title={adscripcion.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {adscripcion.isActive ? '🔒' : '🔓'}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(adscripcion)}
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

      {/* Modal de creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nueva Adscripción"
        size="medium"
      >
        <CreateAdscripcionForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal de edición */}
      {selectedAdscripcion && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAdscripcion(null);
          }}
          title="Editar Adscripción"
          size="medium"
        >
          <EditAdscripcionForm
            adscripcion={selectedAdscripcion}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedAdscripcion(null);
            }}
          />
        </Modal>
      )}

      {/* Diálogo de eliminación */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedAdscripcion(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Adscripción"
        message={`¿Estás seguro de que deseas eliminar la adscripción "${selectedAdscripcion?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
}
