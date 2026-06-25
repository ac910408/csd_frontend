/**
 * Store de progresión juvenil.
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { progresionService } from '@/services/progresion.service'

export const useProgresionStore = defineStore('progresion', () => {
  const acciones = ref([])
  const especialidades = ref([])
  const compromiso = ref(null)
  const insigniasFinales = ref([])
  const resumen = ref(null)
  const cargando = ref(false)
  const error = ref(null)

  // ── Acciones personales ─────────────────────────────────
  async function cargarAcciones() {
    const res = await progresionService.getAcciones()
    acciones.value = res.data || []
  }

  async function crearAccion({ id_saber, id_ciclo, descripcion }) {
    await progresionService.createAccion({ id_saber, id_ciclo, descripcion })
    await cargarAcciones()
  }

  async function actualizarAccion(id, data) {
    await progresionService.updateAccion(id, data)
    await cargarAcciones()
  }

  // ── Especialidades ──────────────────────────────────────
  async function cargarEspecialidades() {
    const res = await progresionService.getEspecialidades()
    especialidades.value = res.data || []
  }

  async function crearEspecialidad(data) {
    await progresionService.createEspecialidad(data)
    await cargarEspecialidades()
  }

  // ── Compromiso ──────────────────────────────────────────
  async function cargarCompromiso() {
    try {
      const res = await progresionService.getCompromiso()
      compromiso.value = res.data
    } catch {
      compromiso.value = null
    }
  }

  async function guardarCompromiso(data) {
    await progresionService.saveCompromiso(data)
    await cargarCompromiso()
  }

  // ── Insignias finales ───────────────────────────────────
  async function cargarInsignias() {
    const res = await progresionService.getInsigniasFinales()
    insigniasFinales.value = res.data || []
  }

  async function crearInsignia(data) {
    await progresionService.createInsigniaFinal(data)
    await cargarInsignias()
  }

  // ── Resumen ─────────────────────────────────────────────
  async function cargarResumen() {
    cargando.value = true
    try {
      const res = await progresionService.getResumen()
      resumen.value = res.data
    } catch (e) {
      error.value = e?.mensaje || 'Error al cargar progresión'
    } finally {
      cargando.value = false
    }
  }

  // ── Carga completa ──────────────────────────────────────
  async function cargarTodo() {
    await Promise.allSettled([
      cargarAcciones(),
      cargarEspecialidades(),
      cargarCompromiso(),
      cargarInsignias(),
      cargarResumen(),
    ])
  }

  return {
    acciones,
    especialidades,
    compromiso,
    insigniasFinales,
    resumen,
    cargando,
    error,
    cargarAcciones,
    crearAccion,
    actualizarAccion,
    cargarEspecialidades,
    crearEspecialidad,
    cargarCompromiso,
    guardarCompromiso,
    cargarInsignias,
    crearInsignia,
    cargarResumen,
    cargarTodo,
  }
})
