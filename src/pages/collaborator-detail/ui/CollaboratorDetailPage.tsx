import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@app/providers/store';
import {
  fetchCollaboratorById,
  fetchDocumentsByCollaborator,
  selectCollaboratorById,
  selectDocumentsByCollaborator,
  selectExpedienteStatus,
} from '@entities/collaborator';
import { Tabs } from '@shared/ui';
import { ROUTES } from '@shared/lib/routes';
import { getContractTypeLabel } from '@entities/collaborator';
import type { CollaboratorDocument } from '@entities/collaborator';
import styles from './CollaboratorDetailPage.module.scss';

/**
 * Página de detalle de colaborador con tabs de documentos
 */
export function CollaboratorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const collaborator = useSelector((state: RootState) =>
    id ? selectCollaboratorById(id)(state) : null
  );
  const documents = useSelector((state: RootState) =>
    id ? selectDocumentsByCollaborator(id)(state) : []
  );
  const expedienteStatus = useSelector((state: RootState) =>
    id ? selectExpedienteStatus(id)(state) : null
  );

  // Cargar colaborador y documentos
  useEffect(() => {
    if (id) {
      dispatch(fetchCollaboratorById(id));
      dispatch(fetchDocumentsByCollaborator(id));
    }
  }, [id, dispatch]);

  if (!id) {
    return <div>ID de colaborador no válido</div>;
  }

  if (!collaborator) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>Cargando colaborador...</div>
      </div>
    );
  }

  // Agrupar documentos por tipo
  const documentsByKind = documents.reduce(
    (acc, doc) => {
      if (!acc[doc.kind]) {
        acc[doc.kind] = [];
      }
      acc[doc.kind].push(doc);
      return acc;
    },
    {} as Record<string, CollaboratorDocument[]>
  );

  // Componente para mostrar lista de documentos
  const DocumentList = ({ docs }: { docs: CollaboratorDocument[] }) => {
    if (docs.length === 0) {
      return (
        <div className={styles.emptyDocuments}>
          <p>No hay documentos de este tipo.</p>
        </div>
      );
    }

    return (
      <div className={styles.documentList}>
        {docs.map((doc) => (
          <div key={doc.id} className={styles.documentCard}>
            <div className={styles.documentInfo}>
              <h4 className={styles.documentName}>{doc.fileName}</h4>
              {doc.descripcion && (
                <p className={styles.documentDescription}>{doc.descripcion}</p>
              )}
              {doc.periodo && (
                <span className={styles.documentPeriodo}>Período: {doc.periodo}</span>
              )}
              <span className={styles.documentDate}>
                Subido: {new Date(doc.uploadedAt).toLocaleDateString('es-MX')}
              </span>
            </div>
            <div className={styles.documentActions}>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewButton}
              >
                Ver
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    {
      id: 'datos',
      label: 'Datos Generales',
      content: (
        <div className={styles.dataSection}>
          <div className={styles.dataGrid}>
            <div className={styles.dataField}>
              <label>Nombre Completo</label>
              <p>{`${collaborator.nombre} ${collaborator.apellidos}`}</p>
            </div>
            <div className={styles.dataField}>
              <label>RPE</label>
              <p>{collaborator.rpe}</p>
            </div>
            {collaborator.rtt && (
              <div className={styles.dataField}>
                <label>RTT</label>
                <p>{collaborator.rtt}</p>
              </div>
            )}
            <div className={styles.dataField}>
              <label>Tipo de Contrato</label>
              <p>{getContractTypeLabel(collaborator.tipoContrato)}</p>
            </div>
            <div className={styles.dataField}>
              <label>RFC</label>
              <p>{collaborator.rfc}</p>
            </div>
            <div className={styles.dataField}>
              <label>CURP</label>
              <p>{collaborator.curp}</p>
            </div>
            <div className={styles.dataField}>
              <label>IMSS</label>
              <p>{collaborator.imss}</p>
            </div>
            <div className={styles.dataField}>
              <label>Estado</label>
              <p>
                <span
                  className={`${styles.statusBadge} ${
                    collaborator.isActive ? styles.active : styles.inactive
                  }`}
                >
                  {collaborator.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'bateria',
      label: 'Batería de Capacitación',
      content: <DocumentList docs={documentsByKind.bateria || []} />,
    },
    {
      id: 'historial',
      label: 'Historial / Kárdex',
      content: <DocumentList docs={documentsByKind.historial || []} />,
    },
    {
      id: 'perfil',
      label: 'Perfil de Puesto',
      content: <DocumentList docs={documentsByKind.perfil || []} />,
    },
    {
      id: 'constancias',
      label: 'Constancias',
      content: <DocumentList docs={documentsByKind.constancia || []} />,
    },
    {
      id: 'otros',
      label: 'Otros Documentos',
      content: <DocumentList docs={documentsByKind.otro || []} />,
    },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link to={ROUTES.COLLABORATORS} className={styles.backButton}>
            ← Volver a Colaboradores
          </Link>
          <h1 className={styles.title}>
            {collaborator.nombre} {collaborator.apellidos}
          </h1>
          <p className={styles.subtitle}>RPE: {collaborator.rpe}</p>
        </div>

        {/* Estado del expediente */}
        {expedienteStatus && (
          <div className={styles.expedienteStatus}>
            <div className={styles.statusHeader}>
              <h3>Estado del Expediente</h3>
              <span
                className={`${styles.statusBadge} ${
                  styles[expedienteStatus.status]
                }`}
              >
                {expedienteStatus.status === 'completo'
                  ? 'Completo'
                  : expedienteStatus.status === 'incompleto'
                  ? 'Incompleto'
                  : 'Sin Documentos'}
              </span>
            </div>
            <div className={styles.statusDetails}>
              <div className={styles.statusItem}>
                <span
                  className={
                    expedienteStatus.hasBateria ? styles.check : styles.cross
                  }
                >
                  {expedienteStatus.hasBateria ? '✓' : '✗'}
                </span>
                Batería
              </div>
              <div className={styles.statusItem}>
                <span
                  className={
                    expedienteStatus.hasHistorial ? styles.check : styles.cross
                  }
                >
                  {expedienteStatus.hasHistorial ? '✓' : '✗'}
                </span>
                Historial
              </div>
              <div className={styles.statusItem}>
                <span
                  className={
                    expedienteStatus.hasPerfil ? styles.check : styles.cross
                  }
                >
                  {expedienteStatus.hasPerfil ? '✓' : '✗'}
                </span>
                Perfil
              </div>
              <div className={styles.statusItem}>
                <span
                  className={
                    expedienteStatus.hasConstancias ? styles.check : styles.cross
                  }
                >
                  {expedienteStatus.hasConstancias ? '✓' : '✗'}
                </span>
                Constancias ({documentsByKind.constancia?.length || 0})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.content}>
        <Tabs tabs={tabs} defaultTabId="datos" />
      </div>
    </div>
  );
}
