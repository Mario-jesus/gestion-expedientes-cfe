import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { createMinute } from '@entities/minute';
import { logger } from '@shared/config';
import { useToast } from '@shared/providers';
import type { MinuteType } from '@entities/minute';

interface CreateMinuteErrors {
  titulo?: string;
  tipo?: string;
  fecha?: string;
  file?: string;
  general?: string;
}

export function useCreateMinute(onSuccess?: () => void) {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<CreateMinuteErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearFieldError = (field: keyof CreateMinuteErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const create = async (data: {
    titulo: string;
    tipo: MinuteType;
    fecha: string;
    file: File;
    descripcion?: string;
  }) => {
    // Validar
    const newErrors: CreateMinuteErrors = {};

    if (!data.titulo || data.titulo.trim() === '') {
      newErrors.titulo = 'El título es requerido';
    }

    if (!data.tipo) {
      newErrors.tipo = 'El tipo de minuta es requerido';
    }

    if (!data.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!data.file) {
      newErrors.file = 'El archivo es requerido';
    } else {
      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (data.file.size > maxSize) {
        newErrors.file = 'El archivo no puede ser mayor a 10MB';
      }

      // Validar tipo de archivo (solo PDF e imágenes)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];
      if (!allowedTypes.includes(data.file.type)) {
        newErrors.file = 'Solo se permiten archivos PDF, JPG o PNG';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSubmitError(null);

    try {
      logger.info('Creando minuta...', {
        fileName: data.file.name,
        titulo: data.titulo,
        tipo: data.tipo,
      });

      // Llamar al thunk con el File directamente
      await dispatch(createMinute({
        file: data.file,
        titulo: data.titulo.trim(),
        tipo: data.tipo,
        fecha: data.fecha,
        descripcion: data.descripcion?.trim(),
      })).unwrap();

      logger.info('Minuta creada exitosamente');
      showSuccess('Minuta creada exitosamente');
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al crear la minuta';
      logger.error('Error creando minuta:', error);
      setSubmitError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    create,
    isLoading,
    errors,
    submitError,
    clearFieldError,
  };
}
