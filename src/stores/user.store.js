/**
 * Store de perfil de usuario y ficha médica.
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { profileService } from '@/services/profile.service'

export const useUserStore = defineStore('user', () => {
  const perfil = ref(null)
  const salud = ref(null)
  const alergias = ref([])
  const antecedentes = ref([])
  const vacunas = ref([])
  const contactos = ref([])
  const afiliaciones = ref([])

  const cargando = ref(false)
  const error = ref(null)

  // ── Perfil ────────────────────────────────────────────────
  async function cargarPerfil() {
    cargando.value = true
    error.value = null
    try {
      const res = await profileService.getPerfil()
      perfil.value = res.data
    } catch (e) {
      error.value = e?.mensaje || 'Error al cargar perfil'
    } finally {
      cargando.value = false
    }
  }

  async function guardarPerfil(data) {
    const res = await profileService.savePerfil(data)
    perfil.value = res.data
    return res
  }

  // ── Salud ─────────────────────────────────────────────────
  async function cargarSalud() {
    try {
      const res = await profileService.getSalud()
      salud.value = res.data
    } catch {
      salud.value = null
    }
  }

  async function guardarSalud(data) {
    const res = await profileService.saveSalud(data)
    salud.value = res.data
    return res
  }

  async function eliminarSalud() {
    await profileService.deleteSalud()
    salud.value = null
    alergias.value = []
    antecedentes.value = []
    vacunas.value = []
    contactos.value = []
    afiliaciones.value = []
  }

  // ── Alergias ──────────────────────────────────────────────
  async function cargarAlergias() {
    const res = await profileService.getAlergias()
    alergias.value = res.data || []
  }

  async function addAlergia(data) {
    const res = await profileService.addAlergia(data)
    await cargarAlergias()
    return res
  }

  // ── Antecedentes ─────────────────────────────────────────
  async function cargarAntecedentes() {
    const res = await profileService.getAntecedentes()
    antecedentes.value = res.data || []
  }

  async function addAntecedente(data) {
    const res = await profileService.addAntecedente(data)
    await cargarAntecedentes()
    return res
  }

  // ── Vacunas ───────────────────────────────────────────────
  async function cargarVacunas() {
    const res = await profileService.getVacunas()
    vacunas.value = res.data || []
  }

  async function addVacuna(data) {
    const res = await profileService.addVacuna(data)
    await cargarVacunas()
    return res
  }

  // ── Contactos emergencia ──────────────────────────────────
  async function cargarContactos() {
    const res = await profileService.getContactos()
    contactos.value = res.data || []
  }

  async function addContacto(data) {
    const res = await profileService.addContacto(data)
    await cargarContactos()
    return res
  }

  // ── Afiliaciones ──────────────────────────────────────────
  async function cargarAfiliaciones() {
    const res = await profileService.getAfiliaciones()
    afiliaciones.value = res.data || []
  }

  async function addAfiliacion(data) {
    const res = await profileService.addAfiliacion(data)
    await cargarAfiliaciones()
    return res
  }

  // ── Carga completa ───────────────────────────────────────
  async function cargarTodo() {
    await Promise.allSettled([
      cargarPerfil(),
      cargarSalud(),
      cargarAlergias(),
      cargarAntecedentes(),
      cargarVacunas(),
      cargarContactos(),
      cargarAfiliaciones(),
    ])
  }

  return {
    perfil,
    salud,
    alergias,
    antecedentes,
    vacunas,
    contactos,
    afiliaciones,
    cargando,
    error,
    cargarPerfil,
    guardarPerfil,
    cargarSalud,
    guardarSalud,
    eliminarSalud,
    cargarAlergias,
    addAlergia,
    cargarAntecedentes,
    addAntecedente,
    cargarVacunas,
    addVacuna,
    cargarContactos,
    addContacto,
    cargarAfiliaciones,
    addAfiliacion,
    cargarTodo,
  }
})
