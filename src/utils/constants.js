/**
 * Constantes del dominio CSD.
 * Objetos congelados para evitar mutación accidental.
 */

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  SCOUT: 'scout',
  SCOUTER: 'scouter',
  DIRIGENTE: 'dirigente',
  DIRIGENTE_PROVINCIA: 'dirigente_provincia',
  NACIONAL: 'nacional',
})

export const ROLES_INFO = Object.freeze({
  admin: { label: 'Administrador', alcance: 'Todo el sistema' },
  scout: { label: 'Beneficiario', alcance: 'Solo su perfil' },
  scouter: { label: 'Educador de sección', alcance: 'Su sección' },
  dirigente: { label: 'Líder de grupo', alcance: 'Todo su grupo' },
  dirigente_provincia: { label: 'Líder provincial', alcance: 'Su provincia' },
  nacional: { label: 'Autoridad nacional', alcance: 'Nacional' },
})

export const CARGOS = Object.freeze([
  'Jefe de Grupo',
  'Subjefe de Grupo',
  'Jefe de Sección',
  'Subjefe de Sección',
  'Colaborador de Sección',
  'Jefe de Provincia',
  'Subjefe de Provincia',
  'Comisionado Provincial',
  'Director Nacional',
  'Subdirector Nacional',
  'Comisionado Nacional',
  'Formador',
  'Capellán',
  'Representante de Grupo',
  'Tesorero de Grupo',
  'Secretario de Grupo',
  'Vocal de Grupo',
  'Coordinador de Rama',
  'Asistente de Sección',
])

export const TIPOS_SECCION = Object.freeze({
  MANADA: 'manada',
  TROPA: 'tropa',
  COMUNIDAD: 'comunidad',
  CLAN: 'clan',
})

export const TIPOS_SECCION_INFO = Object.freeze({
  manada: { label: 'Manada', edades: '7-11', color: 'manada' },
  tropa: { label: 'Tropa', edades: '11-14', color: 'tropa' },
  comunidad: { label: 'Comunidad', edades: '14-17', color: 'comunidad' },
  clan: { label: 'Clan', edades: '17-21', color: 'clan' },
})

export const ESTADO_ACCION = Object.freeze({
  PENDIENTE: 'pendiente',
  EN_PROGRESO: 'en_progreso',
  COMPLETADO: 'completado',
})

export const TIPO_TRANSACCION = Object.freeze({
  INGRESO: 'ingreso',
  EGRESO: 'egreso',
})

export const TIPO_ACTA = Object.freeze({
  ORDINARIA: 'ordinaria',
  EXTRAORDINARIA: 'extraordinaria',
  CONSEJO_UNIDAD: 'consejo_unidad',
  CONSEJO_GRUPO: 'consejo_grupo',
})

export const TIPO_PROGRAMA = Object.freeze({
  INTERNO: 'interno',
  EXTERNO: 'externo',
})

export const TIPO_TRANSPORTE = Object.freeze({
  CONTRATADO: 'contratado',
  PARTICULAR: 'particular',
  PUBLICO: 'publico',
  AEREO: 'aereo',
})

export const SEVERIDAD = Object.freeze({
  LEVE: 'leve',
  MODERADA: 'moderada',
  SEVERA: 'severa',
})

export const ESTADO_FISICO = Object.freeze({
  BUENO: 'Bueno',
  REGULAR: 'Regular',
  MALO: 'Malo',
})

export const ESTADO_SUGERENCIA = Object.freeze({
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado',
})

export const TIPO_GRUPO = Object.freeze({
  REGULAR: 'regular',
  PROVINCIA: 'provincia',
  SIN_GRUPO: 'sin_grupo',
})

/**
 * Catálogos expandibles (aceptan sugerencias de usuario).
 */
export const CATALOGOS_EXPANDIBLES = Object.freeze([
  'cat_religion',
  'cat_alergeno',
  'cat_tipo_reaccion_alergia',
  'cat_vacuna',
  'cat_antecedente',
  'cat_alimentacion',
  'cat_proveedor_salud',
])
