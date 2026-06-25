/**
 * Store de organización: provincias, grupos, secciones.
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { organizationService } from '@/services/organization.service'

export const useOrganizationStore = defineStore('organization', () => {
  const provincias = ref([])
  const grupos = ref([])
  const secciones = ref([])
  const provinciaActiva = ref(null)
  const grupoActivo = ref(null)
  const seccionActiva = ref(null)
  const cargando = ref(false)
  const error = ref(null)

  // ── Provincias ──────────────────────────────────────────
  async function cargarProvincias() {
    cargando.value = true
    try {
      const res = await organizationService.getProvincias()
      provincias.value = res.data || []
    } catch (e) {
      error.value = e?.mensaje
    } finally {
      cargando.value = false
    }
  }

  async function getProvincia(id) {
    const res = await organizationService.getProvincia(id)
    provinciaActiva.value = res.data
    return res.data
  }

  async function crearProvincia(data) {
    await organizationService.createProvincia(data)
    await cargarProvincias()
  }

  // ── Grupos ──────────────────────────────────────────────
  async function cargarGrupos(params) {
    cargando.value = true
    try {
      const res = await organizationService.getGrupos(params)
      grupos.value = res.data || []
    } catch (e) {
      error.value = e?.mensaje
    } finally {
      cargando.value = false
    }
  }

  async function getGrupo(id) {
    const res = await organizationService.getGrupo(id)
    grupoActivo.value = res.data
    return res.data
  }

  async function crearGrupo(data) {
    await organizationService.createGrupo(data)
    await cargarGrupos({ provincia_id: data.id_provincia })
  }

  // ── Secciones ───────────────────────────────────────────
  async function cargarSecciones(params) {
    cargando.value = true
    try {
      const res = await organizationService.getSecciones(params)
      secciones.value = res.data || []
    } catch (e) {
      error.value = e?.mensaje
    } finally {
      cargando.value = false
    }
  }

  async function getSeccion(id) {
    const res = await organizationService.getSeccion(id)
    seccionActiva.value = res.data
    return res.data
  }

  async function crearSeccion(data) {
    await organizationService.createSeccion(data)
    await cargarSecciones({ grupo_id: data.id_grupo })
  }

  return {
    provincias,
    grupos,
    secciones,
    provinciaActiva,
    grupoActivo,
    seccionActiva,
    cargando,
    error,
    cargarProvincias,
    getProvincia,
    crearProvincia,
    cargarGrupos,
    getGrupo,
    crearGrupo,
    cargarSecciones,
    getSeccion,
    crearSeccion,
  }
})
