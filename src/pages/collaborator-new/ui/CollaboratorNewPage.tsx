import { useNavigate } from 'react-router-dom';
import { CreateCollaboratorForm } from '@features/collaborators/create-collaborator';
import { ROUTES } from '@shared/lib/routes';
import styles from './CollaboratorNewPage.module.scss';

/**
 * Página para crear un nuevo colaborador
 */
export function CollaboratorNewPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.COLLABORATORS);
  };

  const handleCancel = () => {
    navigate(ROUTES.COLLABORATORS);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nuevo Colaborador</h1>
        <p className={styles.subtitle}>
          Completa el formulario para registrar un nuevo colaborador en el sistema
        </p>
      </div>

      <div className={styles.content}>
        <CreateCollaboratorForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
