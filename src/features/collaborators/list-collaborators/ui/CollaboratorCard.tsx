import { Link } from 'react-router-dom';
import { buildRoute } from '@shared/lib/routes';
import { getContractTypeLabel } from '@entities/collaborator';
import type { Collaborator } from '@entities/collaborator';
import styles from './CollaboratorCard.module.scss';

interface CollaboratorCardProps {
  collaborator: Collaborator;
}

export function CollaboratorCard({ collaborator }: CollaboratorCardProps) {
  return (
    <Link
      to={buildRoute.collaboratorDetail(collaborator.id)}
      className={styles.card}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>
          {collaborator.nombre} {collaborator.apellidos}
        </h3>
        <span
          className={`${styles.status} ${
            collaborator.isActive ? styles.active : styles.inactive
          }`}
        >
          {collaborator.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.infoRow}>
          <span className={styles.label}>RPE:</span>
          <span className={styles.value}>{collaborator.rpe}</span>
        </div>

        {collaborator.rtt && (
          <div className={styles.infoRow}>
            <span className={styles.label}>RTT:</span>
            <span className={styles.value}>{collaborator.rtt}</span>
          </div>
        )}

        <div className={styles.infoRow}>
          <span className={styles.label}>Tipo de Contrato:</span>
          <span className={styles.value}>
            {getContractTypeLabel(collaborator.tipoContrato)}
          </span>
        </div>
      </div>
    </Link>
  );
}
