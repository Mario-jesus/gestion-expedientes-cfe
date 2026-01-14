import type { UpdateCollaboratorDto } from '@entities/collaborator';

export interface EditFormErrors {
  nombre?: string;
  apellidos?: string;
  rpe?: string;
  rtt?: string;
  areaId?: string;
  adscripcionId?: string;
  puestoId?: string;
  tipoContrato?: string;
  rfc?: string;
  curp?: string;
  imss?: string;
}

/**
 * Valida el formulario de edición de colaborador
 * Los campos son opcionales pero si se proporcionan deben ser válidos
 */
export const validateEditCollaboratorForm = (
  data: UpdateCollaboratorDto
): EditFormErrors => {
  const errors: EditFormErrors = {};

  // Nombre (opcional pero si se proporciona debe ser válido)
  if (data.nombre !== undefined) {
    if (!data.nombre.trim()) {
      errors.nombre = 'El nombre no puede estar vacío';
    } else if (data.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
  }

  // Apellidos (opcional pero si se proporciona debe ser válido)
  if (data.apellidos !== undefined) {
    if (!data.apellidos.trim()) {
      errors.apellidos = 'Los apellidos no pueden estar vacíos';
    } else if (data.apellidos.trim().length < 2) {
      errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    }
  }

  // RPE (opcional pero si se proporciona debe ser válido)
  if (data.rpe !== undefined && data.rpe.trim()) {
    if (!/^[A-Z0-9]+$/i.test(data.rpe.trim())) {
      errors.rpe = 'El RPE solo puede contener letras y números';
    } else if (data.rpe.trim().length < 4) {
      errors.rpe = 'El RPE debe tener al menos 4 caracteres';
    }
  }

  // RTT (opcional, pero si se proporciona debe ser válido)
  if (data.rtt !== undefined && data.rtt.trim()) {
    if (!/^[A-Z0-9]+$/i.test(data.rtt.trim())) {
      errors.rtt = 'El RTT solo puede contener letras y números';
    }
  }

  // RFC (opcional pero si se proporciona debe ser válido)
  if (data.rfc !== undefined && data.rfc.trim()) {
    const rfcClean = data.rfc.trim().toUpperCase();
    if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfcClean)) {
      errors.rfc = 'El formato del RFC no es válido';
    }
  }

  // CURP (opcional pero si se proporciona debe ser válido)
  if (data.curp !== undefined && data.curp.trim()) {
    const curpClean = data.curp.trim().toUpperCase();
    if (!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/.test(curpClean)) {
      errors.curp = 'El formato de la CURP no es válido';
    }
  }

  // IMSS (opcional pero si se proporciona debe ser válido)
  if (data.imss !== undefined && data.imss.trim()) {
    if (!/^\d{11}$/.test(data.imss.trim())) {
      errors.imss = 'El número de IMSS debe tener 11 dígitos';
    }
  }

  // Tipo de contrato (opcional pero si se proporciona debe ser válido)
  if (data.tipoContrato !== undefined) {
    const validTypes = ['confianza', 'temporal_de_confianza', 'sindicalizados', 'temporal_sindicalizado', 'otro'];
    if (!validTypes.includes(data.tipoContrato)) {
      errors.tipoContrato = 'Tipo de contrato no válido';
    }
  }

  return errors;
};

/**
 * Verifica si hay errores en el formulario
 */
export const hasErrors = (errors: EditFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
