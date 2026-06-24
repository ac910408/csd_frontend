/**
 * Validadores y composable useForm para formularios CSD.
 */
import { reactive } from 'vue'

const VALIDADORES = {
  requerido: (v) => (!v && v !== 0 ? 'Campo obligatorio' : null),
  email: (v) =>
    v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Correo inválido' : null,
  minLength: (v, r) =>
    v && v.length < (r.minLength ?? 0)
      ? `Mínimo ${r.minLength} caracteres`
      : null,
  maxLength: (v, r) =>
    v && v.length > (r.maxLength ?? 999)
      ? `Máximo ${r.maxLength} caracteres`
      : null,
  telefono: (v) =>
    v && !/^\d{10}$/.test(v) ? 'Teléfono debe tener 10 dígitos' : null,
  cum: (v) =>
    v && !/^[A-Z]{3}\d{7}$/.test(v)
      ? 'Formato CUM inválido (ej: ASO1234567)'
      : null,
}

/**
 * @typedef {Object} Regla
 * @property {boolean} [requerido]
 * @property {boolean} [email]
 * @property {number} [minLength]
 * @property {number} [maxLength]
 * @property {RegExp} [patron]
 * @property {boolean} [telefono]
 * @property {boolean} [cum]
 * @property {string} [mensaje] — mensaje de error personalizado
 */

/**
 * Composable de validación de formularios.
 * @param {Record<string, Regla>} reglas — mapa de campo → reglas
 * @returns {{ errors: Record<string, string|null>, tocar: Function, validarValor: Function, validarTodo: Function }}
 */
export function useForm(reglas) {
  const errors = reactive({})
  const tocados = reactive({})

  /**
   * Valida un solo campo y retorna el error (o null si es válido).
   * @param {string} campo
   * @param {*} valor
   * @returns {string|null}
   */
  function validarValor(campo, valor) {
    const r = reglas[campo]
    if (!r) return null
    for (const [key, fn] of Object.entries(VALIDADORES)) {
      if (r[key]) {
        const err = fn(valor, r)
        if (err) return r.mensaje || err
      }
    }
    return null
  }

  /**
   * Marca un campo como tocado y lo valida.
   * @param {string} campo
   * @param {*} valor
   */
  function tocar(campo, valor) {
    tocados[campo] = true
    errors[campo] = validarValor(campo, valor)
  }

  /**
   * Valida todos los campos y retorna true si no hay errores.
   * @param {Record<string, *>} data
   * @returns {boolean}
   */
  function validarTodo(data) {
    let valido = true
    for (const campo of Object.keys(reglas)) {
      tocados[campo] = true
      const err = validarValor(campo, data[campo])
      errors[campo] = err
      if (err) valido = false
    }
    return valido
  }

  return { errors, tocados, tocar, validarValor, validarTodo }
}
