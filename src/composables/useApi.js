/**
 * Composable para manejo de llamadas API con estados loading/error/data.
 */
import { ref } from 'vue'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  /**
   * Ejecuta una función asíncrona manejando estados.
   * @param {Function} fn — función que retorna Promise
   * @returns {Promise<*>} resultado de fn
   */
  async function execute(fn) {
    loading.value = true
    error.value = null
    try {
      const result = await fn()
      data.value = result
      return result
    } catch (e) {
      error.value = e?.mensaje || e?.codigo || 'Error desconocido'
      data.value = null
      throw e
    } finally {
      loading.value = false
    }
  }

  /** Reinicia estados */
  function reset() {
    loading.value = false
    error.value = null
    data.value = null
  }

  return { loading, error, data, execute, reset }
}
