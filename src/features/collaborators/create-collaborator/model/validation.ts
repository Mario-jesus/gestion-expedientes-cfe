import type { CreateCollaboratorDto } from '@entities/collaborator';

export interface FormErrors {
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
 * Valida el formulario de creación de colaborador
 * Retorna un objeto con los errores encontrados
 */
export const validateCollaboratorForm = (
  data: CreateCollaboratorDto
): FormErrors => {
  const errors: FormErrors = {};

  // Nombre
  if (!data.nombre?.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  } else if (data.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  // Apellidos
  if (!data.apellidos?.trim()) {
    errors.apellidos = 'Los apellidos son obligatorios';
  } else if (data.apellidos.trim().length < 2) {
    errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
  }

  // RPE
  if (!data.rpe?.trim()) {
    errors.rpe = 'El RPE es obligatorio';
  } else if (!/^[A-Z0-9]+$/i.test(data.rpe.trim())) {
    errors.rpe = 'El RPE solo puede contener letras y números';
  } else if (data.rpe.trim().length < 4) {
    errors.rpe = 'El RPE debe tener al menos 4 caracteres';
  }

  // RTT (opcional, pero si se proporciona debe ser válido)
  if (data.rtt && data.rtt.trim()) {
    if (!/^[A-Z0-9]+$/i.test(data.rtt.trim())) {
      errors.rtt = 'El RTT solo puede contener letras y números';
    }
  }

  // Área
  if (!data.areaId?.trim()) {
    errors.areaId = 'Debes seleccionar un área';
  }

  // Adscripción
  if (!data.adscripcionId?.trim()) {
    errors.adscripcionId = 'Debes seleccionar una adscripción';
  }

  // Puesto
  if (!data.puestoId?.trim()) {
    errors.puestoId = 'Debes seleccionar un puesto';
  }

  // Tipo de contrato
  if (!data.tipoContrato) {
    errors.tipoContrato = 'Debes seleccionar un tipo de contrato';
  }

  // RFC
  if (!data.rfc?.trim()) {
    errors.rfc = 'El RFC es obligatorio';
  } else {
    // RFC puede ser persona física (13 caracteres) o moral (12 caracteres)
    const rfcClean = data.rfc.trim().toUpperCase();
    if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfcClean)) {
      errors.rfc = 'El formato del RFC no es válido';
    }
  }

  // CURP
  if (!data.curp?.trim()) {
    errors.curp = 'La CURP es obligatoria';
  } else {
    const curpClean = data.curp.trim().toUpperCase();
    // CURP tiene 18 caracteres: 4 letras, 6 números, 1 letra, 1 número, 1 letra, 5 caracteres
    if (!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/.test(curpClean)) {
      errors.curp = 'El formato de la CURP no es válido';
    }
  }

  // IMSS
  if (!data.imss?.trim()) {
    errors.imss = 'El número de IMSS es obligatorio';
  } else if (!/^\d{11}$/.test(data.imss.trim())) {
    errors.imss = 'El número de IMSS debe tener 11 dígitos';
  }

  return errors;
};

/**
 * Verifica si hay errores en el formulario
 */
export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
