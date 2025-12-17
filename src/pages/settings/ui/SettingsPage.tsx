import { Tabs } from '@shared/ui';
import { AreasManagement } from '@features/settings/areas-management';
import { AdscripcionesManagement } from '@features/settings/adscripciones-management';
import { PuestosManagement } from '@features/settings/puestos-management';
import { DocumentTypesManagement } from '@features/settings/document-types-management';
import styles from './SettingsPage.module.scss';

/**
 * Página de configuración del sistema
 * Permite gestionar los catálogos (Áreas, Adscripciones, Puestos, Tipos de Documento)
 */
export function SettingsPage() {
  const tabs = [
    {
      id: 'areas',
      label: 'Áreas',
      content: <AreasManagement />,
    },
    {
      id: 'adscripciones',
      label: 'Adscripciones',
      content: <AdscripcionesManagement />,
    },
    {
      id: 'puestos',
      label: 'Puestos',
      content: <PuestosManagement />,
    },
    {
      id: 'documentTypes',
      label: 'Tipos de Documento',
      content: <DocumentTypesManagement />,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configuración</h1>
        <p className={styles.subtitle}>
          Gestiona los catálogos del sistema (Áreas, Adscripciones, Puestos, Tipos de Documento)
        </p>
      </div>

      <div className={styles.content}>
        <Tabs tabs={tabs} defaultTabId="areas" />
      </div>
    </div>
  );
}
