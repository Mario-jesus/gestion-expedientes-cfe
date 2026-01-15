import { useEffect, useState } from 'react';
import type { Puesto } from '@entities/collaborator';
import { catalogsApi } from '@entities/collaborator';
import { Modal, ConfirmDialog } from '@shared/ui';
import { useToast } from '@shared/providers';
import { CreatePuestoForm } from './CreatePuestoForm';
import { EditPuestoForm } from './EditPuestoForm';
import styles from '../../areas-management/ui/AreasManagement.module.scss';

/**
 * Componente para gestionar el catálogo de Puestos
 */
export function PuestosManagement() {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);
  const { showError } = useToast();

  useEffect(() => {
    loadPuestos();
  }, []);

  const loadPuestos = async () => {
    try {
      setIsLoading(true);
      const response = await catalogsApi.puestos.getAll();
      const data = response.data;
      setPuestos(data);
    } catch (error) {
      console.error('Error cargando puestos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    loadPuestos();
  };

  const handleEdit = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedPuesto(null);
    loadPuestos();
  };

  const handleDelete = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPuesto) return;

    try {
      await catalogsApi.puestos.delete(selectedPuesto.id);
      setIsDeleteDialogOpen(false);
      setSelectedPuesto(null);
      loadPuestos();
    } catch (error) {
      console.error('Error eliminando puesto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el puesto. Intenta nuevamente.';
      showError(errorMessage);
    }
  };

  const handleToggleStatus = async (puesto: Puesto) => {
    try {
      if (puesto.isActive) {
        await catalogsApi.puestos.deactivate(puesto.id);
      } else {
        await catalogsApi.puestos.activate(puesto.id);
      }
      loadPuestos();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el estado. Intenta nuevamente.';
      showError(errorMessage);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando puestos...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Puestos</h2>
        <button
          className={styles.createButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          ➕ Nuevo Puesto
        </button>
      </div>

      {puestos.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay puestos registrados.</p>
          <button
            className={styles.createButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear Primer Puesto
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {puestos.map((puesto) => (
                <tr key={puesto.id}>
                  <td>{puesto.nombre}</td>
                  <td>{puesto.descripcion || '-'}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        puesto.isActive ? styles.active : styles.inactive
                      }`}
                    >
                      {puesto.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(puesto)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.toggleButton}
                        onClick={() => handleToggleStatus(puesto)}
                        title={puesto.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {puesto.isActive ? '🔒' : '🔓'}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(puesto)}
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
        title="Nuevo Puesto"
        size="medium"
      >
        <CreatePuestoForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {selectedPuesto && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPuesto(null);
          }}
          title="Editar Puesto"
          size="medium"
        >
          <EditPuestoForm
            puesto={selectedPuesto}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedPuesto(null);
            }}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedPuesto(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Puesto"
        message={`¿Estás seguro de que deseas eliminar el puesto "${selectedPuesto?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
}
