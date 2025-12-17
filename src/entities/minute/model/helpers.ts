/**
 * Obtiene el nombre legible del tipo de minuta
 */
export function getMinuteTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    reunion: 'Reunión',
    junta: 'Junta',
    acuerdo: 'Acuerdo',
    memorandum: 'Memorándum',
    otro: 'Otro',
  };
  return labels[type] || type;
}
