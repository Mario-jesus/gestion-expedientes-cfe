import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '@app/providers/store';
import {
  selectCollaborators,
  selectDocuments,
} from '@entities/collaborator/model/selectors';
import { fetchCollaborators } from '@entities/collaborator/model/collaboratorsThunks';
import { fetchDocuments } from '@entities/collaborator/model/documentsThunks';
import { ROUTES } from '@shared/lib/routes';
import styles from './DashboardPage.module.scss';

export function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const collaborators = useSelector(selectCollaborators);
  const documents = useSelector(selectDocuments);

  // Cargar datos al montar el componente
  useEffect(() => {
    // Solo cargar si no hay datos
    if (collaborators.length === 0) {
      dispatch(fetchCollaborators(undefined));
    }
    if (documents.length === 0) {
      dispatch(fetchDocuments());
    }
  }, [dispatch, collaborators.length, documents.length]);

  // Calcular estadísticas
  const totalCollaborators = collaborators.length;
  const totalActiveCollaborators = collaborators.filter((c) => c.isActive).length;
  const totalDocuments = documents.filter((d) => d.isActive).length;
  const totalExpedientes = totalCollaborators; // Cada colaborador tiene un expediente

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Control</h1>
        <p className={styles.subtitle}>
          Bienvenido, <strong>{currentUser?.name}</strong>
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>📁</div>
          <h3 className={styles.cardTitle}>Expedientes</h3>
          <p className={styles.cardValue}>{totalExpedientes}</p>
          <p className={styles.cardLabel}>Total de expedientes</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>👥</div>
          <h3 className={styles.cardTitle}>Colaboradores</h3>
          <p className={styles.cardValue}>{totalCollaborators}</p>
          <p className={styles.cardLabel}>
            {totalActiveCollaborators} activos de {totalCollaborators} registrados
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>📄</div>
          <h3 className={styles.cardTitle}>Documentos</h3>
          <p className={styles.cardValue}>{totalDocuments}</p>
          <p className={styles.cardLabel}>Archivos almacenados</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>⚡</div>
          <h3 className={styles.cardTitle}>Accesos Rápidos</h3>
          <div className={styles.actions}>
            <Link to={ROUTES.COLLABORATOR_NEW} className={styles.actionBtn}>
              Nuevo Colaborador
            </Link>
            <Link to={ROUTES.COLLABORATORS} className={styles.actionBtn}>
              Ver Listado
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.infoBox}>
        <h3>🎯 Información del Usuario</h3>
        <div className={styles.infoGrid}>
          <div>
            <strong>Usuario:</strong> {currentUser?.username}
          </div>
          <div>
            <strong>Rol:</strong> {currentUser?.role === 'admin' ? 'Administrador' : 'Operador'}
          </div>
          <div>
            <strong>Estado:</strong> {currentUser?.isActive ? '✅ Activo' : '❌ Inactivo'}
          </div>
        </div>
      </div>
    </div>
  );
}
