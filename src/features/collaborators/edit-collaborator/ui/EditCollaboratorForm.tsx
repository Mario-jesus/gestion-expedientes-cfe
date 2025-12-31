import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import type {
  Collaborator,
  UpdateCollaboratorDto
} from '@entities/collaborator';
import { useEditCollaborator } from '../model/useEditCollaborator';
import { catalogsApi } from '@entities/collaborator';
import type { Area, Adscripcion, Puesto } from '@entities/collaborator';
import styles from './EditCollaboratorForm.module.scss';

interface EditCollaboratorFormProps {
  collaborator: Collaborator;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para editar un colaborador existente
 * No permite cambiar el RPE (es único e inmutable)
 */
export function EditCollaboratorForm({
  collaborator,
  onSuccess,
  onCancel,
}: EditCollaboratorFormProps) {
  const [formData, setFormData] = useState<UpdateCollaboratorDto>({
    nombre: collaborator.nombre,
    apellidos: collaborator.apellidos,
    rtt: collaborator.rtt || '',
    areaId: collaborator.areaId,
    adscripcionId: collaborator.adscripcionId,
    puestoId: collaborator.puestoId,
    tipoContrato: collaborator.tipoContrato,
    rfc: collaborator.rfc,
    curp: collaborator.curp,
    imss: collaborator.imss,
    isActive: collaborator.isActive,
  });

  const [areas, setAreas] = useState<Area[]>([]);
  const [adscripciones, setAdscripciones] = useState<Adscripcion[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  const {
    editCollaborator,
    isLoading,
    errors,
    submitError,
    clearFieldError,
  } = useEditCollaborator(collaborator.id, onSuccess);

  // Cargar catálogos
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        const [areasResponse, puestosResponse] = await Promise.all([
          catalogsApi.areas.getAll(),
          catalogsApi.puestos.getAll(),
        ]);
        setAreas(areasResponse.data);
        setPuestos(puestosResponse.data);

        // Cargar adscripciones del área actual
        if (collaborator.areaId) {
          const adscripcionesResponse = await catalogsApi.adscripciones.getByArea(
            collaborator.areaId
          );
          setAdscripciones(adscripcionesResponse.data);
        }
      } catch (err) {
        console.error('Error cargando catálogos:', err);
      } finally {
        setLoadingCatalogs(false);
      }
    };

    loadCatalogs();
  }, [collaborator.areaId]);

  // Cargar adscripciones cuando cambie el área
  useEffect(() => {
    const loadAdscripciones = async () => {
      if (formData.areaId) {
        try {
          const response = await catalogsApi.adscripciones.getByArea(
            formData.areaId
          );
          setAdscripciones(response.data);
          // Si la adscripción actual no pertenece al área seleccionada, limpiarla
          if (
            formData.adscripcionId &&
            !response.data.some((a) => a.id === formData.adscripcionId)
          ) {
            setFormData((prev) => ({ ...prev, adscripcionId: '' }));
          }
        } catch (err) {
          console.error('Error cargando adscripciones:', err);
        }
      } else {
        setAdscripciones([]);
        setFormData((prev) => ({ ...prev, adscripcionId: '' }));
      }
    };

    loadAdscripciones();
  }, [formData.areaId]);

  // Actualizar el formulario si cambia el colaborador
  useEffect(() => {
    setFormData({
      nombre: collaborator.nombre,
      apellidos: collaborator.apellidos,
      rtt: collaborator.rtt || '',
      areaId: collaborator.areaId,
      adscripcionId: collaborator.adscripcionId,
      puestoId: collaborator.puestoId,
      tipoContrato: collaborator.tipoContrato,
      rfc: collaborator.rfc,
      curp: collaborator.curp,
      imss: collaborator.imss,
      isActive: collaborator.isActive,
    });
  }, [collaborator]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof typeof errors]) {
      clearFieldError(name as keyof typeof errors);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Limpiar RTT si está vacío
    const dataToSubmit = {
      ...formData,
      rtt: formData.rtt?.trim() || undefined,
    };
    await editCollaborator(dataToSubmit);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Datos Personales</h3>

        {/* RPE (solo lectura) */}
        <div className={styles.formGroup}>
          <label htmlFor="rpe">RPE</label>
          <input
            id="rpe"
            type="text"
            value={collaborator.rpe}
            disabled
            className={styles.readOnly}
          />
          <span className={styles.hint}>
            El RPE no se puede modificar
          </span>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre">
              Nombre <span className={styles.required}>*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Carlos"
              disabled={isLoading || loadingCatalogs}
              className={errors.nombre ? styles.inputError : ''}
            />
            {errors.nombre && (
              <span className={styles.error}>{errors.nombre}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="apellidos">
              Apellidos <span className={styles.required}>*</span>
            </label>
            <input
              id="apellidos"
              name="apellidos"
              type="text"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Ej: Pérez García"
              disabled={isLoading || loadingCatalogs}
              className={errors.apellidos ? styles.inputError : ''}
            />
            {errors.apellidos && (
              <span className={styles.error}>{errors.apellidos}</span>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="rtt">RTT (Opcional)</label>
            <input
              id="rtt"
              name="rtt"
              type="text"
              value={formData.rtt}
              onChange={handleChange}
              placeholder="Ej: RTT001"
              disabled={isLoading || loadingCatalogs}
              className={errors.rtt ? styles.inputError : ''}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.rtt && (
              <span className={styles.error}>{errors.rtt}</span>
            )}
            <span className={styles.hint}>
              Registro de Trabajadores Temporales
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Datos Laborales</h3>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="areaId">
              Área <span className={styles.required}>*</span>
            </label>
            <select
              id="areaId"
              name="areaId"
              value={formData.areaId}
              onChange={handleChange}
              disabled={isLoading || loadingCatalogs}
              className={errors.areaId ? styles.inputError : ''}
            >
              <option value="">Seleccionar área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
            {errors.areaId && (
              <span className={styles.error}>{errors.areaId}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="adscripcionId">
              Adscripción <span className={styles.required}>*</span>
            </label>
            <select
              id="adscripcionId"
              name="adscripcionId"
              value={formData.adscripcionId}
              onChange={handleChange}
              disabled={isLoading || loadingCatalogs || !formData.areaId}
              className={errors.adscripcionId ? styles.inputError : ''}
            >
              <option value="">
                {formData.areaId
                  ? 'Seleccionar adscripción'
                  : 'Primero selecciona un área'}
              </option>
              {adscripciones.map((adscripcion) => (
                <option key={adscripcion.id} value={adscripcion.id}>
                  {adscripcion.nombre}
                </option>
              ))}
            </select>
            {errors.adscripcionId && (
              <span className={styles.error}>{errors.adscripcionId}</span>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="puestoId">
              Puesto <span className={styles.required}>*</span>
            </label>
            <select
              id="puestoId"
              name="puestoId"
              value={formData.puestoId}
              onChange={handleChange}
              disabled={isLoading || loadingCatalogs}
              className={errors.puestoId ? styles.inputError : ''}
            >
              <option value="">Seleccionar puesto</option>
              {puestos.map((puesto) => (
                <option key={puesto.id} value={puesto.id}>
                  {puesto.nombre}
                </option>
              ))}
            </select>
            {errors.puestoId && (
              <span className={styles.error}>{errors.puestoId}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipoContrato">
              Tipo de Contrato <span className={styles.required}>*</span>
            </label>
            <select
              id="tipoContrato"
              name="tipoContrato"
              value={formData.tipoContrato}
              onChange={handleChange}
              disabled={isLoading || loadingCatalogs}
              className={errors.tipoContrato ? styles.inputError : ''}
            >
              <option value="">Seleccionar tipo</option>
              <option value="base">Base</option>
              <option value="confianza">Confianza</option>
              <option value="eventual">Eventual</option>
              <option value="honorarios">Honorarios</option>
              <option value="otro">Otro</option>
            </select>
            {errors.tipoContrato && (
              <span className={styles.error}>{errors.tipoContrato}</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Datos Fiscales y de Seguridad Social
        </h3>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="rfc">
              RFC <span className={styles.required}>*</span>
            </label>
            <input
              id="rfc"
              name="rfc"
              type="text"
              value={formData.rfc}
              onChange={handleChange}
              placeholder="Ej: PEGJ850101ABC"
              disabled={isLoading || loadingCatalogs}
              className={errors.rfc ? styles.inputError : ''}
              style={{ textTransform: 'uppercase' }}
              maxLength={13}
            />
            {errors.rfc && <span className={styles.error}>{errors.rfc}</span>}
            <span className={styles.hint}>
              Registro Federal de Contribuyentes
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="curp">
              CURP <span className={styles.required}>*</span>
            </label>
            <input
              id="curp"
              name="curp"
              type="text"
              value={formData.curp}
              onChange={handleChange}
              placeholder="Ej: PEGJ850101HDFRRN01"
              disabled={isLoading || loadingCatalogs}
              className={errors.curp ? styles.inputError : ''}
              style={{ textTransform: 'uppercase' }}
              maxLength={18}
            />
            {errors.curp && (
              <span className={styles.error}>{errors.curp}</span>
            )}
            <span className={styles.hint}>
              Clave Única de Registro de Población
            </span>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="imss">
              Número de IMSS <span className={styles.required}>*</span>
            </label>
            <input
              id="imss"
              name="imss"
              type="text"
              value={formData.imss}
              onChange={handleChange}
              placeholder="Ej: 12345678901"
              disabled={isLoading || loadingCatalogs}
              className={errors.imss ? styles.inputError : ''}
              maxLength={11}
            />
            {errors.imss && (
              <span className={styles.error}>{errors.imss}</span>
            )}
            <span className={styles.hint}>
              Debe tener exactamente 11 dígitos
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.formGroup}>
          <div className={styles.checkboxGroup}>
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={isLoading || loadingCatalogs}
            />
            <label htmlFor="isActive" className={styles.checkboxLabel}>
              Colaborador activo
            </label>
          </div>
          <span className={styles.hint}>
            Los colaboradores inactivos no aparecerán en las búsquedas
          </span>
        </div>
      </div>

      {submitError && (
        <div className={styles.submitError}>
          <strong>Error:</strong> {submitError}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isLoading || loadingCatalogs}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || loadingCatalogs}
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
