# 🧭 Carpeta Scouter Digital — Frontend

> Documento de desarrollo autónomo para construir la interfaz de usuario de la CSD.
> Este archivo contiene **todo** lo que un agente frontend necesita saber sin consultar la documentación del backend.

---

## 📦 Stack Tecnológico

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| Vite | 6+ | Bundler y dev server |
| Vue 3 | 3.5+ | Framework SFC con Composition API + `<script setup>` |
| Vue Router | 5.x | File-based routing |
| Pinia | 2+ | Estado global y stores |
| Tailwind CSS | v4 | Estilos utilitarios |
| Lucide Vue Next | — | Iconos SVG |
| ApexCharts Vue | — | Gráficas para reportes (barras, radar, linea) |
| unplugin-vue-components | — | Auto-import de componentes |
| unplugin-auto-import | — | Auto-import de composables, `ref`, `computed`, etc. |
| TypeScript | 5.x | Tipado estático |

> **Manejador de paquetes:** `pnpm` — usar `pnpm add`, `pnpm remove`, `pnpm dlx` en lugar de npm.

---

## 🧱 Orden de codificación

1. **Instalación y configuración del stack:** Vite + Vue 3 + TS + Tailwind v4 + auto-imports + Pinia + Router
2. **Diseño de layouts** — `AuthLayout`, `DashboardLayout`, `EmptyLayout` (organismos + templates primero)
3. **Componentes atómicos y moleculares** — BaseButton, BaseInput, BaseModal, FormField, CatalogoAutocomplete, etc.
4. **Composables globales** — `useApi`, `useAuth`, `useTheme`, validators
5. **Stores** — `auth.store`, `user.store`, `organization.store`, `ui.store`
6. **Vistas** — cada página conecta stores + componentes + layout

### 📐 Estructura de archivos Vue

Cada archivo `.vue` debe seguir el orden:

```vue
<template>
  <!-- 1. Template primero -->
</template>

<script setup lang="ts">
// 2. Script despuÃ©s (siempre TypeScript + Composition API)
</script>

<style scoped>
/* 3. Style al final */
</style>
```

**Responsabilidades separadas:**
- `views/` → orquestan datos (llamadas a stores/composables) y deciden layout
- `components/` → solo presentan y emiten eventos. Sin llamadas directas a la API
- `composables/` → lógica reusable (fetch, validación, formateo)
- `stores/` → estado global (autenticación, organización, UI)

## 🧪 Metodología de Componentes: Atomic Design

Toda la UI se organiza siguiendo Atomic Design (niveles 0–5). Las reglas de composición son estrictas:

```
Nivel           Importa desde                  Propósito
─────           ─────────────                  ────────
0. Quarks       —                              Design tokens (colores, espaciados, tipografía)
1. Atoms        Quarks                         Bloques básicos (botones, inputs, badges, iconos)
2. Molecules    Atoms                          Grupos funcionales (SearchForm, CardField, Modal)
3. Organisms    Molecules + Atoms              Secciones complejas (Header, Sidebar, DataTable, FormLayout)
4. Templates    Organisms                      Layouts de página sin datos reales
5. Pages        Templates + Stores             Vistas finales con datos y lógica de negocio
```

### 📁 Estructura de carpetas

```
src/
├── assets/                       # Imágenes, fuentes
├── auto-imports.d.ts             # Generado por unplugin-auto-import
├── components.d.ts               # Generado por unplugin-vue-components
├── composables/                  # Lógica reusable (useAuth, useApi)
├── components/
│   ├── atoms/
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseBadge.vue
│   │   ├── BaseModal.vue
│   │   ├── BaseCard.vue
│   │   ├── BaseIcon.vue          # Wrapper sobre Lucide
│   │   ├── BaseAvatar.vue
│   │   ├── BaseSpinner.vue
│   │   └── BaseTable.vue
│   ├── molecules/
│   │   ├── SearchBar.vue
│   │   ├── FormField.vue
│   │   ├── PaginationBar.vue
│   │   ├── FilterChips.vue
│   │   ├── AlertMessage.vue
│   │   ├── EmptyState.vue
│   │   └── ConfirmDialog.vue
│   ├── organisms/
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   ├── ProfileCard.vue
│   │   ├── HealthSection.vue
│   │   ├── ProgressionMap.vue
│   │   ├── DataTableView.vue
│   │   ├── ActivityTimeline.vue
│   │   └── CouncilMinuteForm.vue
│   └── templates/
│       ├── AuthLayout.vue
│       ├── DashboardLayout.vue
│       └── EmptyLayout.vue
├── router/
│   └── index.ts                  # DefiniciÃ³n de rutas
├── services/
│   └── api.ts                    # Cliente HTTP con fetch nativo + interceptores
├── stores/
│   ├── auth.store.ts             # Autenticación JWT
│   ├── user.store.ts             # Perfil y roles activos
│   ├── organization.store.ts     # Provincia, grupo, sección activos
│   └── ui.store.ts               # Sidebar, modales, toasts
├── types/
│   ├── api.ts                    # Interfaces de respuesta del backend
│   ├── models.ts                 # Interfaces de dominio
│   └── enums.ts                  # Constantes y enums
├── utils/
│   ├── format.ts                 # Formateo de fechas, monedas, CUM
│   └── validators.ts             # Validaciones de formulario
├── views/                        # Páginas (file-based routing)
│   ├── auth/
│   │   ├── login.vue
│   │   └── register.vue
│   ├── dashboard.vue
│   ├── perfil/
│   │   ├── index.vue
│   │   └── salud.vue
│   ├── progresion/
│   │   ├── index.vue
│   │   └── acciones.vue
│   ├── grupos/
│   ├── secciones/
│   ├── admin/
│   └── ...
├── main.ts
├── App.vue
└── style.css                     # Tailwind directives
```

---

## 🔐 Autenticación y RBAC

### Roles del sistema (6)

| Rol | Quién es | Alcance |
|-----|----------|---------|
| `admin` | Administrador del sistema | Todo el sistema |
| `scout` | Beneficiario (joven) | Solo su perfil |
| `scouter` | Educador de sección | Su sección |
| `dirigente` | Líder de grupo | Todo su grupo |
| `dirigente_provincia` | Líder provincial | Su provincia |
| `nacional` | Autoridad nacional | Nacional |

### Múltiples roles simultáneos

Un usuario puede tener varios roles. Al iniciar sesión, **selecciona con cuál contexto opera**. Ejemplo: un joven del Clan que es scouter en Manada tiene roles `scout` + `scouter`.

### Regla de permisos

```
Rol (quién eres) + Cargo (Jefe/Subjefe/Colaborador) + Contexto (sección/grupo/provincia)
```

| Grupo de rutas (backend) | Roles permitidos |
|--------------------------|------------------|
| `/auth`, `/catalogos` | **Público** |
| `/perfil/*`, `/progresion/*`, `/sugerencias` (propias) | **Cualquier autenticado** |
| `/provincias` | `admin`, `dirigente_provincia` |
| `/grupos` | `admin`, `dirigente` |
| `/secciones`, `/transacciones` | `admin`, `dirigente`, `scouter` |
| `/ciclos`, `/programas`, `/actas`, `/protocolos` | `admin`, `scouter` |
| `/usuarios/*`, `/admin/*` | `admin` |

### Flujo de autenticación

```
1. POST /auth/login → { data: { token: "eyJ...", usuario: {...} } }
2. Almacenar token en localStorage / Pinia
3. Enviar en cada request como: Authorization: Bearer <token>
4. El backend responde 401 si el token expiró (24h) o es inválido
5. El frontend redirige a /login al recibir 401
```

---

## 📡 API: Contrato de comunicación

### Base URL

- Desarrollo: `http://localhost:8080`
- Producción: variable de entorno `VITE_API_URL`

### Formato de respuestas

**Éxito:**
```json
{"data": { ... }}
{"data": [ ... ]}
{"data": { ... }, "mensaje": "operación exitosa"}
```

**Error:**
```json
{
  "error": {
    "codigo": "VALIDATION_ERROR",
    "mensaje": "mensaje legible",
    "detalles": [{"campo": "email", "motivo": "formato inválido"}]
  }
}
```

### Códigos HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK (GET, PUT) |
| 201 | Creado (POST) |
| 400 | Solicitud inválida |
| 401 | No autenticado |
| 403 | No autorizado (rol insuficiente) |
| 404 | No encontrado |
| 409 | Conflicto/duplicado |
| 422 | Error de validación |
| 500 | Error interno |

---

## 📋 Endpoints por módulo

### 🔐 Autenticación

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| `POST` | `/auth/register` | `{nombre_usuario, correo_electronico, contrasena}` | 201: datos usuario |
| `POST` | `/auth/login` | `{correo_electronico, contrasena}` | 200: `{token, usuario}` |

### 📋 Catálogos públicos (no requieren auth)

| GET | `/catalogos/roles` | 5 roles del sistema |
| GET | `/catalogos/cargos` | 19 cargos organizacionales |
| GET | `/catalogos/tipos-seccion` | 4 tipos de sección con edades |
| GET | `/catalogos/ods` | 17 ODS de la ONU |

### 👤 Perfil

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/perfil` | Datos de identidad |
| `PUT` | `/perfil` | Crear o actualizar perfil |
| `GET` | `/perfil/salud` | Ficha médica |
| `PUT` | `/perfil/salud` | Crear o actualizar salud |
| `DELETE` | `/perfil/salud` | Derecho al olvido médico |
| `GET` | `/perfil/salud/alergias` | Alergias del perfil |
| `POST` | `/perfil/salud/alergias` | `{id_alergeno, severidad}` |
| `GET` | `/perfil/salud/antecedentes` | Antecedentes |
| `POST` | `/perfil/salud/antecedentes` | `{id_antecedente, presenta}` |
| `GET` | `/perfil/salud/vacunas` | Vacunas |
| `POST` | `/perfil/salud/vacunas` | `{id_vacuna, aplico}` |
| `GET` | `/perfil/salud/contactos` | Contactos de emergencia |
| `POST` | `/perfil/salud/contactos` | `{contacto: {...}, vinculo: {...}}` |
| `GET` | `/perfil/salud/afiliaciones` | Afiliaciones médicas |
| `POST` | `/perfil/salud/afiliaciones` | `{proveedor_id, numero_poliza, id_tipo_beneficiario}` |

### ⚜️ Progresión Juvenil

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/perfil/progresion/acciones` | Acciones personales (Hoja de Caminata) |
| `POST` | `/perfil/progresion/acciones` | `{id_saber, id_ciclo, descripcion}` |
| `PUT` | `/perfil/progresion/acciones/:id` | Actualizar reflexión/estado |
| `GET` | `/perfil/progresion/especialidades` | Especialidades del joven |
| `POST` | `/perfil/progresion/especialidades` | Formato CONOZCO/APLICO/COMPARTO |
| `GET` | `/perfil/progresion/logros/compromiso` | Promesa scout |
| `PUT` | `/perfil/progresion/logros/compromiso` | `{obtenido_el, lugar}` |
| `GET` | `/perfil/progresion/logros/insignias-finales` | Insignias finales |
| `POST` | `/perfil/progresion/logros/insignias-finales` | `{id_insignia_final, obtenido_el}` |
| `GET` | `/perfil/progresion/completa` | Resumen ✅/❌ de todas las progresiones |

### 🏕️ Organización

| Método | Ruta | Auth |
|--------|------|------|
| `GET` | `/provincias` | admin, dirigente_provincia |
| `POST` | `/provincias` | `{nombre, clave, id_estado}` |
| `GET` | `/provincias/:id` | Público |
| `GET` | `/grupos` | admin, dirigente |
| `GET` | `/grupos?provincia_id=1` | Filtro por provincia |
| `POST` | `/grupos` | `{id_provincia, numero, nombre}` |
| `GET` | `/grupos/:id` | Público |
| `GET` | `/secciones` | admin, dirigente, scouter |
| `GET` | `/secciones?grupo_id=1` | Filtro por grupo |
| `POST` | `/secciones` | `{id_grupo, id_tipo_seccion, nombre_propio}` |
| `GET` | `/secciones/:id` | Público |

### 📅 Operación (ciclos, programas, actas)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/secciones/:id/ciclos` | Ciclos de programa |
| `POST` | `/secciones/:id/ciclos` | `{id_responsable, nombre, id_categoria_desarrollo}` |
| `GET` | `/ciclos/:id/programas` | Programas del ciclo |
| `POST` | `/ciclos/:id/programas` | `{id_seccion, id_responsable, tipo, nombre}` |
| `POST` | `/programas/:id/asistencia` | `{id_perfil, presente}` |
| `GET` | `/secciones/:id/actas` | Actas de consejo |
| `POST` | `/secciones/:id/actas` | `{tipo_acta, orden_del_dia, acuerdos, id_preside, id_elabora}` |
| `POST` | `/actas/:id/asistencia` | `{id_perfil, presente}` |

### 🛡️ Protocolos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/programas/:id/seguridad` | Seguridad (fallback a genérico del grupo) |
| `PUT` | `/programas/:id/seguridad` | Crear/actualizar seguridad del programa |
| `GET` | `/grupos/:id/seguridad` | Seguridad genérica del grupo |
| `PUT` | `/grupos/:id/seguridad` | Crear/actualizar seguridad genérica |
| `GET` | `/programas/:id/traslado` | Protocolo de traslado |
| `PUT` | `/programas/:id/traslado` | Crear/actualizar traslado |
| `GET` | `/traslados/:id/pasajeros` | Lista nominal de pasajeros |
| `POST` | `/traslados/:id/pasajeros` | `{id_perfil, seccion, cum}` |

### 💰 Finanzas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/transacciones?seccion_id=1` | Transacciones |
| `POST` | `/transacciones` | `{id_seccion, monto, tipo, concepto, id_registrado_por}` |
| `GET` | `/secciones/:id/inventario` | Inventario |
| `POST` | `/secciones/:id/inventario` | `{nombre, cantidad, estado_fisico}` |

### 💡 Sugerencias de catálogo

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/sugerencias` | Todos | `{tabla, nombre, datos_extra}` |
| `GET` | `/sugerencias` | Todos | Mis sugerencias |
| `GET` | `/admin/sugerencias` | admin | Pendientes |
| `POST` | `/admin/sugerencias/:id/resolver` | admin | `{accion, id_existente, motivo_rechazo}` |

### 👤 Usuarios (admin)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/usuarios/:id/roles` | Roles del usuario |
| `POST` | `/usuarios/:id/roles` | `{id_rol, id_grupo}` Asignar rol |

### 📊 Reportes

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/reportes/mensual?seccion_id=X&anio=2025&mes=6` | scouter, dirigente | Reporte mensual planeado vs real |
| `GET` | `/reportes/mensual-completo?seccion_id=X&anio=2025&mes=6` | scouter, dirigente | Reporte mensual completo: membresía, actividades, enlaces, progresiones, tesorería, modificaciones |

---

## 🧠 Dominio de Negocio (Conceptos Esenciales)

### Estructura organizacional

```
Provincia
 └── Grupo Scout (regular / provincia / sin_grupo)
      └── Sección (instancia concreta de un tipo educativo)
```

**Tipos de sección educativa:**

| Tipo | Edad | Rama |
|------|------|------|
| Manada de Lobatos | 6–10 años | Menor |
| Tropa Scout | 10–14 años | Intermedia |
| Comunidad de Caminantes | 14–18 años | Mayor |
| Clan de Rovers | 18–22 años | Mayor |

**Grupos comodín:**
- `provincia`: Para equipo directivo provincial (sin número, nombre fijo "Equipo de Provincia")
- `sin_grupo`: Para scouts cuyo grupo desapareció o están inactivos

### Progresión Juvenil (5 niveles)

| Nivel | Genérico | Manada | Tropa | Comunidad | Clan |
|-------|----------|--------|-------|-----------|------|
| 1 | Eje temático | Eje | Eje | Eje | Eje |
| 2 | Etapa | Cazadero | Rumbo | Sendero | Ruta/Horquilla |
| 3 | Competencia | Presa | Territorio | Desafío | Meta |
| 4 | Saber (atómico) | Dentellada | Exploración | Camino | Objetivo competencial |
| 5 | Acción educativa | Rastro | Escenario | Hoja de Caminata | PPV |

**4 Ejes temáticos:**
1. Salud y Bienestar
2. Habilidades para la Vida
3. Paz y Participación Comunitaria
4. Medio Ambiente y Sustentabilidad

**4 Planos de Relación** (agrupan competencias, constantes para todas las secciones):
1. Relación conmigo mismo (Saber Ser)
2. Relación con los demás (Saber Convivir)
3. Relación con el entorno (Saber Hacer)
4. Relación con lo trascendente (Saber Conocer)

### Malla de Competencias (matriz)

Las competencias son **filas**, los ejes temáticos son **columnas**. Cada celda = un **Saber**:

```
                     Eje Salud    Eje Habil.   Eje Paz   Eje MA
Plano Conmigo ──┐
  Competencia 1  │  Saber 1.1    Saber 1.2       —         —
  Competencia 2  │  Saber 2.1    Saber 2.2    Saber 2.3    —
Plano Demás ────┤
  Competencia 3  │     —         Saber 3.2    Saber 3.3    —
```

### Progresiones disponibles por sección

| Tipo de progresión | Manada | Tropa | Comunidad | Clan |
|-------------------|--------|-------|-----------|------|
| **Etapa inicial** | Mi primer rastro | Encuentro | Bienvenida | Inducción |
| **Etapas** (4) | Raksha, Baloo, Hno. Gris, Bagheera | Tortuga, Ocelote, Quetzal, Venado | Cenit, Cima, Cumbre, Cúspide | Kikapú, Otomí, Paipai, Seri |
| **Competencias** | 11 Presas | 12 Territorios | 11 Desafíos | 9 Metas |
| **Especialidades** | 8 campos | 12 campos | 8 campos | 4 (1 por eje) |
| **Insignias técnicas** | Mohwa, Dhâk, Flor Roja, Tregua del Agua | Ajolote, Jaguar, Mapache, Águila Solitaria | Terra Nova, Kon-Tiki, 7 Cimas, Discovery | Tierra, Viento, Fuego, Agua |
| **Insignias finales** | Alfa (Jade/Obsidiana) | Águila Real (Jade/Obsidiana) | Everest (Jade/Obsidiana) | Baden-Powell (Jade/Obsidiana) |
| **Insignias mundiales** | MoP, Earth Tribe | MoP, Earth Tribe | MoP, Earth Tribe | MoP, Earth Tribe, RSdM |
| **Cargos juveniles** | Seisenero, Subseisenero | Guía, Subguía de Patrulla | Coordinador, Subcoordinador, Líder de Proyecto | Promotor Rover, ES, Líder de Proyecto |
| **Compromiso** | Promesa | Promesa | Promesa | Compromiso Rover |

### Especialidades

Metodología **CONOZCO / APLICO / COMPARTO**:
- **CONOZCO**: Lo que aprendo sobre el tema
- **APLICO**: Cómo demuestro lo aprendido
- **COMPARTO**: Cómo comparto con otros

### Calidades (transversales, no otorgan permisos)

| Calidad | Descripción |
|---------|-------------|
| Representante Juvenil | Joven del Clan electo, voz en Consejo |
| Asociado | Adulto registrado, vota en Asambleas |
| Asesor de Red de Jóvenes | Adulto que apoya redes juveniles |
| Punta de Flecha | Certificación de liderazgo (Comunidad/Clan) |

### Operación

- **Ciclo de programa**: Periodo estratégico (3–4 meses), pertenece a una sección, tiene un eje temático rector.
- **Programa de actividad**: Día concreto. Puede ser `interno` (la sección organiza) o `externo` (asiste a evento provincial/nacional).
- **FAES**: Plantilla reusable de actividad educativa, vinculable a saberes.
- **Evento**: Actividad externa. La sección asiste pero no organiza.
- **Proyecto scout**: Acción autónoma con ODS, presupuesto, participantes. Al validarse, aporta a la progresión.
- **Acta de consejo**: Formaliza acuerdos. Tipos: ordinaria, extraordinaria, consejo de unidad, consejo de grupo.

### Protocolos

| Protocolo | ¿Cuándo aplica? | ¿Se vincula a? |
|-----------|----------------|----------------|
| **Seguridad genérico** | Actividades diarias en el local | `id_grupo` |
| **Seguridad específico** | Salidas y campamentos | `id_programa` (fallback al genérico) |
| **Traslado** | Cuando hay desplazamiento | `id_programa` |

### Finanzas

- Transacciones por: `sección`, `grupo` o `provincia`.
- Cada transacción: `monto`, `tipo` (ingreso/egreso), `concepto`, `fecha`, `registrado_por`.
- Inventario simple por sección: `nombre`, `cantidad`, `estado_físico`.

### Derecho al olvido

Los datos médicos (`perfil_salud`) se pueden eliminar independientemente del perfil de identidad. Al eliminar salud, se borran en cascada: alergias, antecedentes, vacunas, contactos de emergencia y afiliaciones.

---

## 🗂️ Tipos de datos importantes

### Fechas

Todas las fechas viajan como **Unix timestamp en milisegundos** (número entero):
```json
{"creado_el": 1719000000000, "actualizado_el": 1719086400000}
```

Convertir en JS:
```ts
new Date(1719000000000) // ✅
date.getTime()           // ✅ para enviar al backend
```

### IDs

Todos los IDs son numéricos (`uint` → BIGINT en BD). Ej: `{"id": 1}`.

### CUM (Clave Única de Membresía)

String alfanumérico (ej: `"ASO1234567"`). Puede estar vacío para invitados o scouts no registrados aún.

### Enumeraciones (strings fijos)

| Campo | Valores |
|-------|---------|
| `grupo_scout.tipo` | `regular`, `provincia`, `sin_grupo` |
| `programa_actividad.tipo` | `interno`, `externo` |
| `transaccion.tipo` | `ingreso`, `egreso` |
| `sugerencia_catalogo.estado` | `pendiente`, `aprobado`, `rechazado` |
| `tipo_acta` | `ordinaria`, `extraordinaria`, `consejo_unidad`, `consejo_grupo` |
| `tipo_transporte` | `contratado`, `particular`, `publico`, `aereo` |
| `severidad` (alergias) | `leve`, `moderada`, `severa` |
| `estado_fisico` (inventario) | `Bueno`, `Regular`, `Malo` |

### Catálogos expandibles

Los siguientes catálogos pueden crecer mediante **sugerencias de usuario** (flujo de aprobación por admin):

- `cat_religion`
- `cat_alergeno`
- `cat_tipo_reaccion_alergia`
- `cat_vacuna`
- `cat_antecedente`
- `cat_alimentacion`
- `cat_proveedor_salud`

### Componente `CatalogoAutocomplete`

Para todos los catálogos (sean expandibles o no) se debe usar un **Autocomplete** y no un `<select>` tradicional. Esto permite buscar por tipeo, esencial cuando un catálogo tiene muchos elementos (ej: 12 especialidades de Tropa, 17 ODS, 32 estados).

**Comportamiento:**

| Escenario | Acción del componente |
|-----------|----------------------|
| Catálogo no expandible | Autocomplete con búsqueda local. El usuario selecciona un valor existente |
| Catálogo expandible + valor existe | Autocomplete con búsqueda local. Selecciona normalmente |
| Catálogo expandible + valor NO existe | Al no encontrar coincidencia, muestra al final del dropdown: **"+ Sugerir «texto escrito»"** como opción clickeable |
| Usuario hace clic en "+ Sugerir" | Aparece un `ConfirmDialog` con mensaje "¿Enviar «texto» como sugerencia a revisión?" y al confirmar se hace POST a `/sugerencias` |
| Sugerencia enviada | Se muestra un `AlertMessage` tipo `warning` con texto "Sugerencia enviada. Pendiente de aprobación del admin." y el campo se limpia |
| Admin revisa | En `/admin/sugerencias` puede aprobar (crea registro o vincula a existente) o rechazar con motivo |

**Props del componente `CatalogoAutocomplete`:**

```ts
interface CatalogoAutocompleteProps {
  /** Nombre del catálogo (ej: 'cat_religion', 'cat_alergeno') */
  catalogo: string
  /** Array de items a mostrar en el dropdown */
  items: Array<{ id: number; nombre: string }>
  /** v-model del ID seleccionado */
  modelValue: number | null
  /** Si true, muestra la opción de sugerir nuevo */
  expandible?: boolean
  /** Tabla destino para la sugerencia (obligatorio si expandible=true) */
  tablaDestino?: string
  /** Label del campo */
  label?: string
  /** Placeholder del input */
  placeholder?: string
  /** Si true muestra error styling */
  error?: string
  /** Deshabilitado */
  disabled?: boolean
}
```

**Ejemplo de uso (recordar: NO requiere import):**

```vue
<template>
  <CatalogoAutocomplete
    catalogo="cat_alergeno"
    :items="alergenos"
    v-model="alergenoId"
    :expandible="true"
    tabla-destino="cat_alergeno"
    label="Alérgeno"
    placeholder="Buscar alérgeno…"
  />
</template>

<script setup lang="ts">
// ⚠️ No importar CatalogoAutocomplete ni ref
// unplugin-vue-components los auto-importa por estar en components/molecules/

const alergenos = ref<Array<{ id: number; nombre: string }>>([])
const alergenoId = ref<number | null>(null)

onMounted(async () => {
  const res = await api.get('/catalogos/alergenos')
  alergenos.value = res.data.data
})
</script>
```

---

## 🧭 Navegación y Vistas (Sugeridas)

### Sidebar / Navigation (por rol)

```
🏠 Dashboard
├── 👤 Mi Perfil
│   ├── Datos personales
│   └── Salud / Ficha Médica
├── ⚜️ Mi Progresión
│   ├── Acciones personales
│   ├── Especialidades
│   ├── Compromiso
│   └── Insignias finales
├── 🏕️ Organización
│   ├── Provincias
│   ├── Grupos
│   └── Secciones
├── 📅 Operación (scouter+)
│   ├── Ciclos
│   ├── Programas
│   ├── Asistencias
│   ├── Actas de Consejo
│   └── Protocolos
├── 💰 Finanzas (dirigente+)
│   ├── Transacciones
│   └── Inventario
└── ⚙️ Admin (admin only)
    ├── Usuarios y roles
    ├── Sugerencias de catálogo
    └── Catálogos
```

### Vistas por módulo

| Ruta | Vista | Roles |
|------|-------|-------|
| `/login` | Login | Público |
| `/register` | Registro | Público |
| `/dashboard` | Dashboard (resumen) | Autenticado |
| `/perfil` | Datos personales | Autenticado |
| `/perfil/salud` | Ficha médica | Autenticado |
| `/progresion` | Mapa de progresión | Autenticado (scout) |
| `/progresion/acciones` | Acciones personales | Autenticado (scout) |
| `/provincias` | Lista de provincias | admin, dirigente_provincia |
| `/provincias/:id` | Detalle provincia | admin, dirigente_provincia |
| `/grupos` | Lista de grupos | admin, dirigente |
| `/grupos/:id` | Detalle grupo | admin, dirigente |
| `/secciones` | Lista de secciones | admin, dirigente, scouter |
| `/secciones/:id` | Detalle sección | admin, dirigente, scouter |
| `/secciones/:id/ciclos` | Ciclos de programa | scouter+ |
| `/progresion/completa` | Resumen completo | scouter+ (ver joven) |
| `/admin/usuarios` | Gestión de usuarios | admin |
| `/admin/sugerencias` | Sugerencias pendientes | admin |
| `/reportes/mensual` | Reporte mensual planeado vs real | scouter+ |
| `/reportes/mensual-completo` | Reporte mensual completo (6 secciones) | scouter+ |

---

## 🧩 Consideraciones Técnicas

### Manejo de errores (fetch con interceptores)

Usar **fetch nativo** (no axios) con un wrapper centralizado en `services/api.ts` que implementa interceptores de forma manual:

```ts
// services/api.ts — se auto-importa, NO escribir import

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem('csd-token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Interceptor de error global: 401 → logout automático
  if (res.status === 401) {
    localStorage.removeItem('csd-token')
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }

  const json = await res.json()

  if (!res.ok) {
    const err = json.error || { codigo: 'UNKNOWN', mensaje: 'Error desconocido' }
    throw err
  }

  return json as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
}
```

**Uso en vistas (sin import):**
```ts
const res = await api.get<DataResponse<Perfil>>('/perfil')
perfil.value = res.data
```

**Interceptor 401:** cualquier respuesta `401` redirige al login automáticamente.
**Interceptor de errores:** los errores `4xx/5xx` se lanzan como objeto `{ codigo, mensaje, detalles? }` para mostrarlos al usuario.

### Estados de carga

Cada vista debe manejar 3 estados:
1. **Cargando** → `BaseSpinner` o skeleton
2. **Error** → `AlertMessage` con reintento
3. **Vacío** → `EmptyState` con mensaje contextual

### Validación de formularios

Crear un composable `useForm` que centraliza reglas de validación reutilizables. Cada campo expone errores en tiempo real.

**Validadores disponibles:** `requerido`, `email`, `minLength(n)`, `maxLength(n)`, `patron(regex)`, `telefono`, `cum`.

```ts
// composables/useForm.ts — se auto-importa

type Regla = {
  requerido?: boolean
  email?: boolean
  minLength?: number
  maxLength?: number
  patron?: RegExp
  telefono?: boolean
  cum?: boolean
  mensaje?: string
}

interface ReglasMap { [campo: string]: Regla }

const VALIDADORES: Record<string, (val: any, regla: Regla) => string | null> = {
  requerido: (v) => !v ? 'Campo obligatorio' : null,
  email: (v) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Correo inválido' : null,
  minLength: (v, r) => v && v.length < (r.minLength ?? 0) ? `Mínimo ${r.minLength} caracteres` : null,
  maxLength: (v, r) => v && v.length > (r.maxLength ?? 999) ? `Máximo ${r.maxLength} caracteres` : null,
  telefono: (v) => v && !/^\d{10}$/.test(v) ? 'Teléfono debe tener 10 dígitos' : null,
  cum: (v) => v && !/^[A-Z]{3}\d{7}$/.test(v) ? 'Formato CUM inválido (ej: ASO1234567)' : null,
}

export function useForm(reglas: ReglasMap) {
  const errors = reactive<Record<string, string | null>>({})
  const tocados = reactive<Record<string, boolean>>({})

  function validarValor(campo: string, valor: any): string | null {
    const r = reglas[campo]
    if (!r) return null
    for (const [key, fn] of Object.entries(VALIDADORES)) {
      if ((r as any)[key]) {
        const err = fn(valor, r)
        if (err) return r.mensaje || err
      }
    }
    return null
  }

  function tocar(campo: string) {
    tocados[campo] = true
  }

  function validarTodo(data: Record<string, any>): boolean {
    let valido = true
    for (const campo of Object.keys(reglas)) {
      tocados[campo] = true
      const err = validarValor(campo, data[campo])
      errors[campo] = err
      if (err) valido = false
    }
    return valido
  }

  return { errors, tocar, validarValor, validarTodo }
}
```

**En el template:**
```vue
<FormField label="Correo" :error="errors.correo">
  <BaseInput v-model="form.correo" @blur="tocar('correo')" type="email" />
</FormField>
<BaseButton @click="if (validarTodo(form)) guardar()" :disabled="!!Object.values(errors).find(Boolean)">
  Guardar
</BaseButton>
```

### Stepper con auto-guardado

Los formularios de **Perfil** (datos generales) y **Salud** (datos médicos) deben implementarse como **steppers** con auto-guardado para conservar el estado si el usuario cierra sin terminar.

**Estructura del Stepper:**

| Paso | Perfil | Salud |
|------|--------|-------|
| 1 | Datos personales (nombre, CUM, fecha nacimiento, género) | Tipo de sangre, peso, talla, alimentación |
| 2 | Dirección (colonia, calle, número) | Alergias (autocomplete expandible) |
| 3 | Datos del grupo y religión | Antecedentes médicos y psicológicos |
| 4 | — | Vacunas |
| 5 | — | Contactos de emergencia |
| 6 | — | Afiliaciones médicas |

**Mecanismo de auto-guardado:**

```ts
// En cada paso, al cambiar un campo:
watch(form, async () => {
  if (pendingSave.value) return
  pendingSave.value = true
  
  clearTimeout(timer.value)
  timer.value = setTimeout(async () => {
    try {
      await api.put('/perfil', {
        ...datosPaso1.value,
        paso_completado: pasoActual.value
      })
      notificar('Guardado automáticamente', 'success')
    } catch {
      // No bloquear al usuario, reintentar en el siguiente cambio
    } finally {
      pendingSave.value = false
    }
  }, 2000) // 2 segundos despuÃ©s del Ãºltimo cambio
})
```

**Reglas del auto-guardado:**
- Guarda 2 segundos después del último cambio (debounce)
- NO bloquea la UI mientras guarda
- Si falla, reintenta en el siguiente cambio sin mostrar error al usuario
- Muestra un indicador visual: "Guardado..." (amarillo) → "Guardado" (verde) → oculto
- Al volver a la vista, restaura el último paso completado desde la respuesta de la API

### Protección de rutas

Usar `beforeEach` en el router:
```ts
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.roles && !authStore.hasAnyRole(to.meta.roles)) {
    next('/dashboard')
  } else {
    next()
  }
})
```

### Uso de auto-imports

### ⚠️ Regla de oro: NO importes nada manualmente

Gracias a `unplugin-auto-import` y `unplugin-vue-components`, **no se escribe NINGÚN `import`** en los componentes. El plugin resuelve automáticamente:

| Categoría | Se auto-importa | Ejemplo en template/script |
|-----------|----------------|---------------------------|
| APIs de Vue | `ref`, `computed`, `watch`, `onMounted`, `onUnmounted`, `nextTick`, `reactive`, `toRef`, etc. | `const count = ref(0)` |
| APIs de Router | `useRouter`, `useRoute` | `const router = useRouter()` |
| APIs de Pinia | `defineStore`, `storeToRefs`, `acceptHMRUpdate` | `const store = useAuthStore()` |
| Stores propias | `useAuthStore`, `useUserStore`, `useOrganizationStore`, `useUiStore` | `const auth = useAuthStore()` |
| Composables propios | `useApi`, `useAuth`, `useTheme`, `useForm` | `const { get } = useApi()` |
| Componentes atómicos | `BaseButton`, `BaseInput`, `BaseBadge`, `BaseModal`, `BaseCard`, `BaseIcon`, `BaseSpinner`, `BaseTable`, `BaseAvatar` | `<BaseButton>Enviar</BaseButton>` |
| Componentes moleculares | `FormField`, `SearchBar`, `PaginationBar`, `ConfirmDialog`, `AlertMessage`, `EmptyState`, `FilterChips`, `CatalogoAutocomplete` | `<CatalogoAutocomplete … />` |
| Componentes organismo | `AppHeader`, `AppSidebar`, `ProfileCard`, `HealthSection`, `ProgressionMap`, `DataTableView`, `ActivityTimeline`, `CouncilMinuteForm` | `<AppSidebar />` |
| Layouts | `AuthLayout`, `DashboardLayout`, `EmptyLayout` | `<DashboardLayout>...</DashboardLayout>` |
| Iconos Lucide | Todos los iconos como componente PascalCase | `<LucideUser />`, `<LucideMoon />`, `<LucideSun />` |

**Ejemplo concreto — un componente completo sin imports:**

```vue
<template>
  <div class="p-4">
    <BaseInput v-model="busqueda" placeholder="Buscar…" />
    <BaseButton @click="cargar">
      <LucideSearch class="w-4 h-4" />
      Buscar
    </BaseButton>
    <AlertMessage v-if="error" type="error" :mensaje="error" />
    <BaseSpinner v-else-if="cargando" />
    <BaseTable v-else :data="resultados" :columnas="columnas" />
  </div>
</template>

<script setup lang="ts">
// ⚠️ Sin imports: ref, onMounted, useApi, BaseInput, BaseButton,
//    LucideSearch, AlertMessage, BaseSpinner, BaseTable se auto-importan

const busqueda = ref('')
const cargando = ref(false)
const error = ref('')
const resultados = ref([])

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    const res = await api.get('/catalogos/...')
    resultados.value = res.data.data
  } catch (e: any) {
    error.value = e.response?.data?.error?.mensaje || 'Error al cargar'
  } finally {
    cargando.value = false
  }
}
</script>
```

### Configuración recomendada de `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', { pinia: ['defineStore', 'storeToRefs', 'acceptHMRUpdate'] }],
      dirs: ['src/composables', 'src/stores'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dirs: [
        'src/components/atoms',
        'src/components/molecules',
        'src/components/organisms',
        'src/components/templates',
      ],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

---

## 📦 Estructura de tipos TypeScript recomendada

```ts
// types/models.ts

interface Usuario {
  id: number
  nombre_usuario: string
  correo_electronico: string
  fecha_vencimiento_cum?: number
  roles: UsuarioRol[]
}

interface UsuarioRol {
  id_rol: number
  rol_nombre: string
  id_grupo?: number
  grupo_nombre?: string
}

interface Perfil {
  id: number
  id_usuario: number
  cum?: string
  nombre: string
  apellido_paterno: string
  apellido_materno?: string
  fecha_nacimiento: number // Unix ms
  lugar_nacimiento?: string
  genero?: string // 'M', 'F', 'O'
  id_seccion_actual?: number
  id_religion?: number
  id_grupo?: number
  calle?: string
  num_exterior?: string
  id_colonia?: number
}

interface PerfilSalud {
  id: number
  id_perfil: number
  id_tipo_sangre?: number
  peso_kg?: number
  talla_cm?: number
  id_alimentacion?: number
  alerta_medica?: string
  tiene_alergias: boolean
  tiene_antecedentes: boolean
  tiene_vacunas: boolean
  tratamientos?: string
  observaciones?: string
}

interface Alergia {
  id_alergeno: number
  alergeno_nombre: string
  id_reaccion?: number
  severidad: string
  medicamento_alternativo?: string
}

interface Antecedente {
  id_antecedente: number
  antecedente_nombre: string
  presenta: boolean
  descripcion?: string
}

interface Vacuna {
  id_vacuna: number
  vacuna_nombre: string
  aplico: boolean
  padecio: boolean
  fecha_aplicacion?: number
  notas?: string
}

interface ContactoEmergencia {
  id_contacto: number
  nombre: string
  telefono: string
  parentesco: string
  orden: number
}

interface Afiliacion {
  id: number
  proveedor_nombre: string
  numero_poliza: string
  tipo_beneficiario: string
}

interface EtapaProgresion {
  id: number
  id_tipo_seccion: number
  nombre: string
  orden: number
  es_inicial: boolean
}

interface Competencia {
  id: number
  id_tipo_seccion: number
  id_etapa?: number
  nombre: string // genérico
  plano_relacion: string
}

interface Saber {
  id: number
  id_competencia: number
  id_categoria_desarrollo: number
  nombre: string
  descripcion: string
}

interface AccionPersonal {
  id: number
  id_saber: number
  id_perfil: number
  id_ciclo?: number
  descripcion: string
  inspiracion?: string
  sensacion?: string
  retos?: string
  mejoras?: string
  completado: boolean
  creado_el: number
}

interface CicloPrograma {
  id: number
  id_seccion: number
  nombre: string
  id_responsable: number
  id_categoria_desarrollo: number
  fecha_inicio: number
  fecha_fin: number
  activo: boolean
}

interface ProgramaActividad {
  id: number
  id_ciclo: number
  id_seccion: number
  id_responsable: number
  tipo: 'interno' | 'externo'
  nombre: string
  fecha: number
}

interface ActaConsejo {
  id: number
  id_seccion: number
  tipo_acta: string
  fecha: number
  orden_del_dia: string
  acuerdos: string
  id_preside: number
  id_elabora: number
}

interface Transaccion {
  id: number
  id_seccion: number
  monto: number
  tipo: 'ingreso' | 'egreso'
  concepto: string
  fecha: number
  id_registrado_por: number
}

interface SugerenciaCatalogo {
  id: number
  tabla: string
  nombre: string
  datos_extra?: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  id_sugerido_por: number
  id_revisado_por?: number
  id_registro_creado?: number
  motivo_rechazo?: string
  creado_el: number
}

interface BajaMiembro {
  id: number
  id_perfil: number
  fecha_baja: number
  tipo: 'vencimiento' | 'manual' | 'reingreso'
  motivo: string
  id_registrado_por: number
}

interface EnlaceSeccion {
  id: number
  id_perfil: number
  id_seccion_origen: number
  id_seccion_destino?: number
  fecha_inicio: number
  fecha_fin_estimada: number
  fecha_fin_real?: number
  activo: boolean
  tipo_destino: 'seccion' | 'vida_adulta'
}

// types/api.ts

interface DataResponse<T> {
  data: T
}

interface ListResponse<T> {
  data: T[]
}

interface ErrorResponse {
  error: {
    codigo: string
    mensaje: string
    detalles?: Array<{ campo: string; motivo: string }>
  }
}
```

---

## 🔧 Configuración del proyecto (vite.config.ts)

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dirs: ['src/composables', 'src/stores'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dirs: [
        'src/components/atoms',
        'src/components/molecules',
        'src/components/organisms',
        'src/components/templates',
      ],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

---

## ⚙️ Variables de entorno

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=CSD
```

---

## 🌗 Modo Claro / Oscuro

La app debe soportar modo claro y oscuro usando la clase `.dark` en el elemento `<html>`. El cambio se gestiona mediante el composable `useTheme` y un toggle en `AppHeader`.

### Composable `useTheme`

```ts
// composables/useTheme.ts — se auto-importa, NO escribir import

export function useTheme() {
  const isDark = ref(false)

  function init() {
    const saved = localStorage.getItem('csd-theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('csd-theme', isDark.value ? 'dark' : 'light')
  }

  // Inicializar al llamar el composable
  init()

  return { isDark, toggle }
}
```

### Toggle en AppHeader

```vue
<template>
  <header>
    <BaseButton @click="theme.toggle" variant="ghost">
      <LucideSun v-if="theme.isDark.value" class="w-5 h-5" />
      <LucideMoon v-else class="w-5 h-5" />
    </BaseButton>
  </header>
</template>

<script setup lang="ts">
const theme = useTheme()
</script>
```

### Colores de Tailwind (CSS custom properties)

Agregar los siguientes colores temáticos al `style.css`. Permiten usar clases como `bg-clan-500`, `text-comunidad-700`, `border-tropa-300`, etc.

Las paletas están calibradas para contraste **en ambos modos**: el bloque `.dark` sobrescribe los tonos 300-400 para garantizar legibilidad en botones outline sobre fondos oscuros.

```css
@import "tailwindcss";

/*
| Sección     | Hex      | CSS variable      |
|-------------|----------|-------------------|
| **Clan**    | #E30613  | --color-clan      |
| **Comunidad** | #0063A5 | --color-comunidad |
| **Grupo**   | #182857  | --color-grupo     |
| **Manada**  | #D5A940  | --color-manada    |
| **Mundial** | #5D2F88  | --color-mundial   |
| **Nacional**| #6C1C45  | --color-nacional  |
| **Scouters**| #A8D1EC  | --color-scouters  |
| **Tropa**   | #007E37  | --color-tropa     |
| **Slate**   | —        | --color-slate     |
*/

@theme static {
  /* ── Clan · #E30613 ──────────────────────────────────── */
  --color-clan: oklch(56% 0.255 25);
  --color-clan-50: oklch(86.599% 0.05488 15.461);
  --color-clan-100: oklch(82.75% 0.0724 16.597);
  --color-clan-200: oklch(75.053% 0.10923 17.132);
  --color-clan-300: oklch(68.023% 0.14807 19.24);
  --color-clan-400: oklch(62.098% 0.18276 21.943);
  --color-clan-500: oklch(56% 0.255 25);
  --color-clan-600: oklch(44% 0.215 25);
  --color-clan-700: oklch(34% 0.165 25);
  --color-clan-800: oklch(26% 0.12 25);
  --color-clan-900: oklch(19% 0.085 25);
  --color-clan-950: oklch(14% 0.06 25);

  /* ── Comunidad · #0063A5 ──────────────────────────────── */
  --color-comunidad: oklch(48% 0.145 250);
  --color-comunidad-50: oklch(77.103% 0.1287 241.59);
  --color-comunidad-100: oklch(74.615% 0.14307 242.4);
  --color-comunidad-200: oklch(69.891% 0.16841 245.79);
  --color-comunidad-300: oklch(65.266% 0.1839 249.83);
  --color-comunidad-400: oklch(57.254% 0.15961 249.41);
  --color-comunidad-500: oklch(48% 0.145 250);
  --color-comunidad-600: oklch(42% 0.13 250);
  --color-comunidad-700: oklch(34% 0.105 250);
  --color-comunidad-800: oklch(26% 0.08 250);
  --color-comunidad-900: oklch(19% 0.055 250);
  --color-comunidad-950: oklch(14% 0.04 250);

  /* ── Grupo · #182857 ──────────────────────────────────── */
  --color-grupo: oklch(27% 0.098 270);
  --color-grupo-50: oklch(58.321% 0.14398 267.65);
  --color-grupo-100: oklch(54.511% 0.15963 266.91);
  --color-grupo-200: oklch(47.897% 0.16171 266.09);
  --color-grupo-300: oklch(41.877% 0.1384 266.61);
  --color-grupo-400: oklch(35.809% 0.11301 266.43);
  --color-grupo-500: oklch(27% 0.098 270);
  --color-grupo-600: oklch(25% 0.09 270);
  --color-grupo-700: oklch(22% 0.07 270);
  --color-grupo-800: oklch(18% 0.05 270);
  --color-grupo-900: oklch(13% 0.03 270);
  --color-grupo-950: oklch(9% 0.02 270);

  /* ── Manada · #D5A940 ─────────────────────────────────── */
  --color-manada: oklch(72% 0.165 85);
  --color-manada-50: oklch(97% 0.015 85);
  --color-manada-100: oklch(93% 0.035 85);
  --color-manada-200: oklch(86% 0.08 86);
  --color-manada-300: oklch(79% 0.13 87);
  --color-manada-400: oklch(73% 0.155 88);
  --color-manada-500: oklch(72% 0.165 85);
  --color-manada-600: oklch(58% 0.14 84);
  --color-manada-700: oklch(46% 0.11 83);
  --color-manada-800: oklch(34% 0.08 82);
  --color-manada-900: oklch(24% 0.055 82);
  --color-manada-950: oklch(17% 0.038 81);

  /* ── Mundial · #5D2F88 ────────────────────────────────── */
  --color-mundial: oklch(41% 0.165 310);
  --color-mundial-50: oklch(74.271% 0.11146 311.7);
  --color-mundial-100: oklch(70.374% 0.12928 311.58);
  --color-mundial-200: oklch(62.909% 0.16245 310.95);
  --color-mundial-300: oklch(55.892% 0.19344 309.67);
  --color-mundial-400: oklch(49.53% 0.18722 309.18);
  --color-mundial-500: oklch(41% 0.165 310);
  --color-mundial-600: oklch(35% 0.14 310);
  --color-mundial-700: oklch(30% 0.115 310);
  --color-mundial-800: oklch(23% 0.085 310);
  --color-mundial-900: oklch(17% 0.06 310);
  --color-mundial-950: oklch(12% 0.045 310);

  /* ── Nacional · #6C1C45 ───────────────────────────────── */
  --color-nacional: oklch(36% 0.16 355);
  --color-nacional-50: oklch(67.283% 0.15313 350.74);
  --color-nacional-100: oklch(64.251% 0.16884 351.75);
  --color-nacional-200: oklch(58.554% 0.19495 354.37);
  --color-nacional-300: oklch(52.084% 0.17848 354.6);
  --color-nacional-400: oklch(45.132% 0.15214 354.88);
  --color-nacional-500: oklch(36% 0.16 355);
  --color-nacional-600: oklch(33% 0.14 355);
  --color-nacional-700: oklch(29% 0.115 355);
  --color-nacional-800: oklch(23% 0.085 355);
  --color-nacional-900: oklch(17% 0.06 355);
  --color-nacional-950: oklch(12% 0.045 355);

  /* ── Scouters · #A8D1EC ───────────────────────────────── */
  --color-scouters: oklch(82% 0.06 250);
  --color-scouters-50: oklch(92.584% 0.02188 250.22);
  --color-scouters-100: oklch(91.318% 0.02654 251.67);
  --color-scouters-200: oklch(89.026% 0.0337 251);
  --color-scouters-300: oklch(86.801% 0.04033 251.79);
  --color-scouters-400: oklch(84.502% 0.04765 251.34);
  --color-scouters-500: oklch(82% 0.06 250);
  --color-scouters-600: oklch(54% 0.075 248);
  --color-scouters-700: oklch(40% 0.065 248);
  --color-scouters-800: oklch(28% 0.05 250);
  --color-scouters-900: oklch(20% 0.035 250);
  --color-scouters-950: oklch(14% 0.025 250);

  /* ── Tropa · #007E37 ──────────────────────────────────── */
  --color-tropa: oklch(52% 0.16 150);
  --color-tropa-50: oklch(88.604% 0.19761 156.56);
  --color-tropa-100: oklch(88.135% 0.21054 155.05);
  --color-tropa-200: oklch(87.33% 0.22916 152.12);
  --color-tropa-300: oklch(76.752% 0.20055 152.31);
  --color-tropa-400: oklch(65.509% 0.17055 152.48);
  --color-tropa-500: oklch(52% 0.16 150);
  --color-tropa-600: oklch(43% 0.135 150);
  --color-tropa-700: oklch(34% 0.11 150);
  --color-tropa-800: oklch(26% 0.085 150);
  --color-tropa-900: oklch(19% 0.06 150);
  --color-tropa-950: oklch(14% 0.045 150);

  /* ── Slate · referencia de contraste ──────────────────── */
  --color-slate: oklch(18.604% 0.00259 247.97);
  --color-slate-50: oklch(98.809% 0 none);
  --color-slate-100: oklch(94.864% 0.00172 247.84);
  --color-slate-200: oklch(86.896% 0.00352 247.86);
  --color-slate-300: oklch(78.773% 0.00657 255.48);
  --color-slate-400: oklch(70.649% 0.00927 247.96);
  --color-slate-500: oklch(62.035% 0.01149 248.01);
  --color-slate-600: oklch(53.162% 0.01194 248.05);
  --color-slate-700: oklch(44.04% 0.00968 253.93);
  --color-slate-800: oklch(21% 0.005 248);
  --color-slate-900: oklch(11% 0.003 248);
  --color-slate-950: oklch(3% 0.002 248);
}

/* ════════════════════════════════════════════════════════
 * DARK MODE: sobrescribe 300-400 para contraste en
 * botones outline sobre slate-950 (L≈19%).
 * ════════════════════════════════════════════════════════ */
.dark {
  --color-clan-300: oklch(72% 0.2 28);
  --color-clan-400: oklch(64% 0.23 27);

  --color-comunidad-300: oklch(70% 0.17 248);
  --color-comunidad-400: oklch(60% 0.17 249);

  --color-grupo-300: oklch(64% 0.14 266);
  --color-grupo-400: oklch(52% 0.12 268);

  --color-mundial-300: oklch(65% 0.19 306);
  --color-mundial-400: oklch(55% 0.18 308);

  --color-nacional-300: oklch(62% 0.17 350);
  --color-nacional-400: oklch(52% 0.17 353);

  --color-tropa-300: oklch(72% 0.19 153);
  --color-tropa-400: oklch(63% 0.17 152);
}
```

## ✅ Checklist de implementación

- [ ] Setup de proyecto: Vite + Vue 3 + TS + Tailwind v4
- [ ] Configuración de auto-imports (Vue API, componentes, composables)
- [ ] Cliente HTTP (fetch nativo con interceptores 401 y errores)
- [ ] Store de autenticación (login, logout, token, roles)
- [ ] Protección de rutas (beforeEach por auth + rol)
- [ ] Componentes atómicos: BaseButton, BaseInput, BaseBadge, BaseModal, BaseCard, BaseIcon, BaseSpinner, BaseTable
- [ ] Componentes moleculares: FormField, SearchBar, PaginationBar, ConfirmDialog, AlertMessage, EmptyState
- [ ] Layouts: AuthLayout (login/register), DashboardLayout (sidebar + header + main)
- [ ] Organismos: AppHeader, AppSidebar, ProfileCard, HealthSection, DataTableView
- [ ] Vista Login + Register
- [ ] Vista Dashboard
- [ ] Vista Perfil + Salud (con derecho al olvido)
- [ ] Vista Progresión (mapa de progresión + acciones personales)
- [ ] Vista Organización (provincias, grupos, secciones)
- [ ] Vista Operación (ciclos, programas, actas, protocolos)
- [ ] Vista Finanzas (transacciones, inventario)
- [ ] Vista Admin (usuarios, sugerencias)
- [ ] Manejo de estados: loading, error, empty
- [ ] Internacionalización (opcional)
