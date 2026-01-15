import type {
  CollaboratorDocument,
  ExpedienteStatus,
  ExpedienteStatusInfo,
} from './types';

/**
 * Calcula el estado del expediente basado en los documentos del colaborador
 */
export function calculateExpedienteStatus(
  documents: CollaboratorDocument[]
): ExpedienteStatusInfo {
  // Filtrar solo documentos activos
  const activeDocuments = documents.filter((doc) => doc.isActive);

  // Verificar cada tipo de documento
  const hasBateria = activeDocuments.some((doc) => doc.kind === 'bateria');
  const hasHistorial = activeDocuments.some((doc) => doc.kind === 'historial');
  const hasPerfil = activeDocuments.some((doc) => doc.kind === 'perfil');
  const hasConstancias = activeDocuments.some((doc) => doc.kind === 'constancia');
  const hasCchl = activeDocuments.some((doc) => doc.kind === 'cchl');
  const hasC0_03 = activeDocuments.some((doc) => doc.kind === 'c0_03');

  // Documentos requeridos para expediente completo
  const documentosRequeridos = ['bateria', 'historial', 'perfil'];
  const documentosCompletos = documentosRequeridos.filter((kind) => {
    return activeDocuments.some((doc) => doc.kind === kind);
  }).length;

  // Determinar estado general
  let status: ExpedienteStatus;
  if (activeDocuments.length === 0) {
    status = 'sin_documentos';
  } else if (documentosCompletos === documentosRequeridos.length) {
    status = 'completo';
  } else {
    status = 'incompleto';
  }

  return {
    status,
    hasBateria,
    hasHistorial,
    hasPerfil,
    hasConstancias,
    hasCchl,
    hasC0_03,
    totalDocumentos: activeDocuments.length,
    documentosCompletos,
  };
}

/**
 * Agrupa documentos por tipo (kind)
 */
export function groupDocumentsByKind(
  documents: CollaboratorDocument[]
): Record<string, CollaboratorDocument[]> {
  return documents.reduce((acc, doc) => {
    if (!acc[doc.kind]) {
      acc[doc.kind] = [];
    }
    acc[doc.kind].push(doc);
    return acc;
  }, {} as Record<string, CollaboratorDocument[]>);
}

/**
 * Obtiene el nombre legible del tipo de contrato
 */
export function getContractTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    confianza: 'Confianza',
    temporal_de_confianza: 'Temporal de confianza',
    sindicalizados: 'Sindicalizados',
    temporal_sindicalizado: 'Temporal sindicalizado',
    otro: 'Otro',
  };
  return labels[type] || type;
}

/**
 * Obtiene el nombre legible del tipo de documento
 */
export function getDocumentKindLabel(kind: string): string {
  const labels: Record<string, string> = {
    perfil: 'Perfil de Puesto',
    bateria: 'Batería',
    historial: 'Historial de Capacitación',
    cchl: 'CCHL',
    c0_03: 'Formato C0-03',
    constancia: 'Constancias',
  };
  return labels[kind] || kind;
}
