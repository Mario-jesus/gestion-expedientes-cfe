import { useEffect, useState } from 'react';
import type { Area, CreateAreaDto } from '@entities/collaborator';
import { catalogsApi } from '@entities/collaborator';
import { Modal, ConfirmDialog } from '@shared/ui';
import { CreateAreaForm } from './CreateAreaForm';
import { EditAreaForm } from './EditAreaForm';
import styles from './AreasManagement.module.scss';

/**
 * Componente para gestionar el catálogo de Áreas
 */
export function AreasManagement() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  // Cargar áreas
  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setIsLoading(true);
      const data = await catalogsApi.areas.getAll();
      setAreas(data);
    } catch (error) {
      console.error('Error cargando áreas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    loadAreas();
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedArea(null);
    loadAreas();
  };

  const handleDelete = (area: Area) => {
    setSelectedArea(area);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedArea) return;

    try {
      await catalogsApi.areas.delete(selectedArea.id);
      setIsDeleteDialogOpen(false);
      setSelectedArea(null);
      loadAreas();
    } catch (error) {
      console.error('Error eliminando área:', error);
      alert('Error al eliminar el área. Intenta nuevamente.');
    }
  };

  const handleToggleStatus = async (area: Area) => {
    try {
      await catalogsApi.areas.update(area.id, {
        nombre: area.nombre,
        descripcion: area.descripcion,
        isActive: !area.isActive,
      } as Partial<CreateAreaDto>);
      loadAreas();
    } catch (error) {
      console.error('Error actualizando estado del área:', error);
      alert('Error al actualizar el estado. Intenta nuevamente.');
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando áreas...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Áreas</h2>
        <button
          className={styles.createButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          ➕ Nueva Área
        </button>
      </div>

      {areas.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay áreas registradas.</p>
          <button
            className={styles.createButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear Primera Área
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
              {areas.map((area) => (
                <tr key={area.id}>
                  <td>{area.nombre}</td>
                  <td>{area.descripcion || '-'}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        area.isActive ? styles.active : styles.inactive
                      }`}
                    >
                      {area.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(area)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.toggleButton}
                        onClick={() => handleToggleStatus(area)}
                        title={area.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {area.isActive ? '🔒' : '🔓'}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(area)}
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
        title="Nueva Área"
        size="medium"
      >
        <CreateAreaForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal de edición */}
      {selectedArea && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedArea(null);
          }}
          title="Editar Área"
          size="medium"
        >
          <EditAreaForm
            area={selectedArea}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedArea(null);
            }}
          />
        </Modal>
      )}

      {/* Diálogo de eliminación */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedArea(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Área"
        message={`¿Estás seguro de que deseas eliminar el área "${selectedArea?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
}
