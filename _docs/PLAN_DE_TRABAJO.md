# 🪓 Plan de Trabajo — CSD Frontend

> Checklist por fases. Cada fase = funcionalidad pequeña e independiente.
> Marcar `[x]` al completar. Orden estricto: no saltar fases.
> Stack: Vite + Vue 3 (JS, no TS) + Tailwind v4 + unplugin-vue-components + Pinia + Router.

---

## ✅ Fase 0: Corrección de stack y deuda técnica

- [x] **0.1** Instalar dependencia faltante: `@lucide/vue`
- [x] **0.2** Remover `unplugin-auto-import` si está instalado (no se usará)
- [x] **0.3** Verificar `tailwind.config.mjs` y `style.css` — colores de identidad como clases Tailwind
- [x] **0.4** Eliminar archivos placeholder: `stores/counter.js`, `components/_dev/TestComponent.vue`, `pages/index.vue` temporal
- [x] **0.5** Crear estructura de carpetas Atomic Design: `atoms/`, `molecules/`, `organisms/`, `templates/` dentro de `components/`
- [x] **0.6** Crear carpetas: `composables/`, `services/`, `utils/`
- [x] **0.7** Actualizar `vite.config.js`: solo `unplugin-vue-components` (sin `AutoImport`). Alias `@` apuntando a `./src`

---

## ✅ Fase 1: Constantes y Utilidades Base

- [x] **1.1** `utils/constants.js` — Enumeraciones como objetos congelados: `ROLES`, `CARGOS`, `TIPOS_SECCION`, `ESTADO_ACCION`, `TIPO_TRANSACCION`, `TIPO_ACTA`
- [x] **1.2** `utils/format.js` — Formateo: `formatDate(ts)`, `formatCurrency(monto)`, `formatCUM(cum)`
- [x] **1.3** `utils/validators.js` — Validadores: `requerido`, `email`, `minLength(n)`, `maxLength(n)`, `telefono`, `cum` + composable `useForm()`

---

## ✅ Fase 2: Atoms — Componentes Atómicos

- [x] **2.1** `BaseButton.vue` — Variantes: `primary`, `secondary`, `ghost`, `danger`, `outline`. Sizes: `sm`, `md`, `lg`. Props: `color`, `disabled`, `loading`
- [x] **2.2** `BaseInput.vue` — Tipos: `text`, `email`, `password`, `number`, `tel`, `date`. Props: `modelValue`, `placeholder`, `disabled`, `error`
- [x] **2.3** `BaseBadge.vue` — Variantes semánticas: `primary`, `secondary`, `info`, `success`, `warning`, `error`. Content por slot
- [x] **2.4** `BaseModal.vue` — Props: `open`, `title`, `size`. Slots: `default`, `footer`. Emit: `close`. Con `Teleport` y backdrop
- [x] **2.5** `BaseCard.vue` — Props: `padding`, `hover`. Slots: `header`, `default`, `footer`
- [x] **2.6** `BaseIcon.vue` — Wrapper sobre `@lucide/vue`. Props: `name`, `size`, `color`. Pasar color vía `provideColor` cascade
- [x] **2.7** `BaseAvatar.vue` — Props: `src`, `alt`, `size`, `fallback` (iniciales). Con estado de carga
- [x] **2.8** `BaseSpinner.vue` — Props: `size`, `color`. SVG animado
- [x] **2.9** `BaseTable.vue` — Props: `data`, `columnas` (keys + labels), `cargando`, `vacio`. Slots para celdas custom. Ordenamiento por columna. Solo Tailwind

---

## ✅ Fase 3: Molecules — Componentes Moleculares

- [x] **3.1** `FormField.vue` — Wrapper label + error + slot input. Props: `label`, `error`, `required`, `help`
- [x] **3.2** `SearchBar.vue` — Props: `modelValue`, `placeholder`. Emit: `update:modelValue` con debounce. Ícono `Search` de `@lucide/vue`
- [x] **3.3** `PaginationBar.vue` — Props: `pagina`, `totalPaginas`, `total`. Emit: `cambiarPagina`
- [x] **3.4** `FilterChips.vue` — Props: `opciones`, `seleccionados`. Emit: `update:seleccionados`. Chips toggle
- [x] **3.5** `AlertMessage.vue` — Props: `type` (info/success/warning/error), `mensaje`, `cerrable`
- [x] **3.6** `EmptyState.vue` — Props: `titulo`, `descripcion`, `icono`, `accion` (label + callback)
- [x] **3.7** `ConfirmDialog.vue` — Compone `BaseModal` + `BaseButton`. Emit: `confirmar`, `cancelar`

---

## ✅ Fase 4: Servicios y Comunicación con API

- [x] **4.1** `services/api.js` — Cliente HTTP con `fetch` nativo. Interceptor 401 → redirect login. Interceptor errores → throw. Métodos: `get`, `post`, `put`, `del`. `BASE_URL` desde `VITE_API_URL`
- [x] **4.2** `.env` + `.env.example` — `VITE_API_URL=http://localhost:8080`
- [x] **4.3** `services/auth.service.js` — `login(creds)`, `register(data)` *(actualizado: requiere `codigo_invitacion`)*
- [x] **4.4** `services/profile.service.js` — CRUD perfil *(actualizado: `nombre`, `apellido_paterno` requeridos)*, salud, alergias, antecedentes, vacunas, contactos, afiliaciones
- [x] **4.5** `services/progresion.service.js` — Acciones, especialidades, logros ✅/❌
- [x] **4.6** `services/organization.service.js` — Provincias, grupos, secciones CRUD
- [x] **4.7** `services/operation.service.js` — Ciclos, programas, asistencia, actas, protocolos
- [x] **4.8** `services/finance.service.js` — Transacciones, inventario
- [x] **4.9** `services/catalog.service.js` — Catálogos, sugerencias, admin *(actualizado: + `getInvitaciones`, `createInvitacion`)*

---

## ✅ Fase 5: Autenticación y RBAC

- [x] **5.1** `stores/auth.store.js` — Estado: `token`, `usuario`, `roles`, `rolActivo`. Acciones: `login()`, `register()`, `logout()`, `seleccionarRol()`. Getters: `isLoggedIn`, `hasRole`
- [x] **5.2** `composables/useAuth.js` — Acceso reactivo al auth store. Función `requireAuth()` para guards
- [x] **5.3** `composables/useApi.js` — Composable con estados `loading`, `error`, `data`, `execute(fn)`
- [x] **5.4** Router guards — `beforeEach`: si ruta requiere auth y no hay token → `/login`. Si rol insuficiente → `/dashboard`
- [x] **5.5** `composables/useNavigation.js` — Sidebar dinámico según `rolActivo`

---

## ✅ Fase 6: Layouts y Organismos Principales

- [x] **6.1** `templates/EmptyLayout.vue` — `<slot />` puro. Para `/login`, `/register`
- [x] **6.2** `organisms/AppHeader.vue` — Logo CSD, toggle tema, avatar + dropdown (perfil, logout, selector rol)
- [x] **6.3** `organisms/AppSidebar.vue` — Navegación por rol. Colapsable mobile. Íconos `@lucide/vue`
- [x] **6.4** `templates/DashboardLayout.vue` — `AppHeader` + `AppSidebar` + `<slot />`
- [x] **6.5** `composables/useColor.js` — `provideColor(color)` + `injectColor()`. Padre setea, hijos heredan vía `provide`/`inject`

---

## ✅ Fase 7: Login y Registro

- [x] **7.1** `pages/auth/login.vue` — `EmptyLayout`. Form: email + password. Validación `useForm`. Submit → `authStore.login()`. Error → `AlertMessage`
- [x] **7.2** `pages/auth/register.vue` — `EmptyLayout`. Form: nombre_usuario + email + **código invitación** + password + confirmar. Validación. Submit → `authStore.register()` con `codigo_invitacion`
- [ ] **7.3** `organisms/ProfileCard.vue` — Resumen sidebar: nombre, rol activo, avatar *(pendiente, se hará junto con perfil)*

---

## ✅ Fase 8: CatalogoAutocomplete (Componente Reusable Crítico)

- [x] **8.1** `molecules/CatalogoAutocomplete.vue` — Props: `catalogo`, `modelValue`, `items`, `expandible`, `tablaDestino`. Búsqueda local con debounce. Botón "+ Sugerir" si expandible. Usa `useApi`
- [x] **8.2** Integrar con `FormField` para labels y errores

---

## ✅ Fase 9: Perfil de Usuario

- [x] **9.1** `stores/user.store.js` — Estado: `perfil`, `salud`, `alergias`, `antecedentes`, `vacunas`, `contactos`, `afiliaciones`
- [x] **9.2** `pages/perfil/index.vue` — Form datos personales con CatalogoAutocomplete
- [x] **9.3** `pages/perfil/salud.vue` — Ficha médica con secciones plegables
- [x] **9.4** `organisms/HealthSection.vue` — Sub-sección reutilizable
- [x] **9.5** Derecho al olvido → `DELETE /perfil/salud` con `ConfirmDialog`

---

## ✅ Fase 10: Progresión Juvenil

- [x] **10.1** `stores/progresion.store.js` — Estado: `etapas`, `competencias`, `acciones`, `especialidades`, `logros`, `resumen`
- [x] **10.2** `organisms/ProgressionMap.vue` — Mapa etapas → competencias → saberes con colores por estado
- [x] **10.3** `pages/progresion/index.vue` — Dashboard con ProgressionMap + resumen stats
- [x] **10.4** `pages/progresion/acciones.vue` — Hoja de Caminata con filtros + modal crear
- [x] **10.5** `organisms/ActivityTimeline.vue` — Timeline vertical de acciones

---

## ✅ Fase 11: Organización (Provincias, Grupos, Secciones)

- [x] **11.1** `stores/organization.store.js` — Estado: `provincias`, `grupos`, `secciones`, activos
- [x] **11.2** `pages/provincias/index.vue` — Tabla + SearchBar + Modal CRUD
- [x] **11.3** `pages/provincias/[id].vue` — Detalle con grupos anidados + crear grupo inline
- [x] **11.4** `pages/grupos/index.vue` — Tabla con filtro provincia CatalogoAutocomplete + modal crear
- [x] **11.5** `pages/grupos/[id].vue` — Detalle con secciones anidadas + crear sección inline
- [x] **11.6** `pages/secciones/index.vue` — Tabla con filtro grupo + badges color por tipo
- [x] **11.7** `pages/secciones/[id].vue` — Detalle + accesos rápidos a ciclos, actas, finanzas

---

## ✅ Fase 12: Operación (Ciclos, Programas, Actas, Protocolos)

- [x] **12.1** `pages/secciones/[id]/ciclos.vue` — Lista + modal crear
- [x] **12.2** `pages/ciclos/[id]/programas.vue` — Lista + crear + enlaces asistencia/seguridad/traslado
- [x] **12.3** `pages/programas/[id]/asistencia.vue` — Toggle checkboxes por miembro
- [x] **12.4** `pages/secciones/[id]/actas.vue` — Lista + modal con `CouncilMinuteForm`
- [x] **12.5** `organisms/CouncilMinuteForm.vue` — Form acta: tipo, orden día, acuerdos, preside, elabora, asistencia
- [x] **12.6** `pages/programas/[id]/seguridad.vue` — Protocolo seguridad programa
- [x] **12.7** `pages/grupos/[id]/seguridad.vue` — Seguridad genérica grupo
- [x] **12.8** `pages/programas/[id]/traslado.vue` — Traslado + lista pasajeros + modal agregar

---

## ✅ Fase 13: Finanzas

- [x] **13.1** `pages/transacciones/index.vue` — Tabla con filtro sección, colores ingreso/egreso, balance, modal crear
- [x] **13.2** `pages/secciones/[id]/inventario.vue` — Inventario tabla + modal add con estado físico

---

## ✅ Fase 14: Admin

- [x] **14.1** `pages/admin/usuarios/index.vue` — Lista usuarios con búsqueda, modal asignar rol
- [x] **14.2** `pages/admin/sugerencias/index.vue` — Tabs sugerencias/invitaciones, aprobar/rechazar, crear invitación

---

## ✅ Fase 15: Reportes

- [x] **15.1** `pages/reportes/mensual.vue` — Selector sección+año+mes, gráfico barras planeado vs real, resumen stats
- [x] **15.2** `pages/reportes/mensual-completo.vue` — 6 secciones en tabs con gráficos individuales

---

## ✅ Fase 16: Pulido Transversal

- [x] **16.1** Estados de carga — `BaseSpinner` en todas las vistas
- [x] **16.2** Estados vacíos — `EmptyState` en todas las tablas/listas
- [x] **16.3** Estados de error — `AlertMessage` con mensaje en todas las vistas
- [x] **16.4** Toasts — `ui.store.js` + contenedor en `DashboardLayout` con animación slide-up
- [x] **16.5** Responsive — sidebar colapsa mobile, tablas `overflow-x-auto`
- [x] **16.6** Modo oscuro — variables CSS definidas en `style.css` (colores semánticos activos)
- [x] **16.7** Accesibilidad — `aria-label` en interactivos, `role="alert"` en toasts, focus-visible rings

---

## ✅ Fase 17: Tests

- [x] **17.1** Tests `utils/validators.js` — 6 tests: requerido, email, teléfono, CUM, validarTodo
- [x] **17.2** Tests `utils/format.js` — 8 tests: fecha, moneda, CUM, capitalize
- [x] **17.3** Tests componentes — `BaseBadge`: renderizado + clases de color

---

## 📝 Notas

- **Cada fase debe ser probada antes de avanzar.** `pnpm dev` + `pnpm test:unit`.
- **No TypeScript.** Todo JavaScript con `<script setup>`. Sin `lang="ts"`.
- **Componentes se auto-importan** por `unplugin-vue-components`. No escribir `import` para componentes.
- **Vue API, stores, servicios, composables** se importan manualmente (`import { ref } from 'vue'`, etc.).
- **Íconos Lucide** se importan de `@lucide/vue`: `import { Search, Moon, Sun } from '@lucide/vue'`.
- **Colores:** clases semánticas Tailwind (`bg-primary`, `text-success`, `border-error`). No hardcodear hex.
- **Mobile-first con Tailwind:** empezar móvil, expandir `sm:`, `md:`, `lg:`.
- **Color cascade:** `provideColor`/`injectColor` para herencia de color entre componentes.

---

## ✅ Fase 18: Correcciones de Seguridad y Robustez

> Hallazgos del análisis post-implementación. Críticos abordar antes de producción.

### 🔒 18.1 — Protección de rutas real (CRÍTICO)

- [x] **18.1.1** Router guard: whitelist de rutas públicas (`/auth/login`, `/auth/register`). Todo lo demás requiere auth.
- [x] **18.1.2** Mapeo de rutas → roles requeridos en el guard (`/admin` → admin, `/progresion` → scout, etc.).

### 🔐 18.2 — Verificación de sesión al iniciar (CRÍTICO)

- [x] **18.2.1** `auth.checkSession()` llama a `GET /perfil` para validar token. Si falla → logout automático.
- [x] **18.2.2** `main.js` ejecuta `auth.checkSession()` antes de montar router.
- [x] **18.2.3** Login page: si hay sesión, el guard redirige automáticamente.

### 🛡️ 18.3 — Interceptor 401 usa redirect por router (MODERADO)

- [x] **18.3.1** `services/api.js` usa callback `onSessionExpired` en vez de `window.location.href`.
- [x] **18.3.2** Callback configurado desde router para usar `router.push('/auth/login')`.

### 📦 18.4 — Persistencia de datos de usuario al refrescar (MODERADO)

- [x] **18.4.1** `checkSession()` popula `usuario` y `roles` desde `GET /perfil`.

### 🔗 18.5 — Navegación y redirecciones (MENOR)

- [x] **18.5.1** Logout redirige a `/auth/login` (ya funcionaba).
- [x] **18.5.2** Sidebar ya marca item activo con `route.path` (ya implementado).
- [x] **18.5.3** `CatalogoAutocomplete` ya tiene spinner mientras carga (ya implementado).

### 🧹 18.6 — Limpieza de código

- [x] **18.6.1** Postman `POST /auth/register` actualizado con `codigo_invitacion`.
- [x] **18.6.2** `SearchBar.vue` import de `ref` no usado eliminado.
- [x] **18.6.3** Código limpio, sin TODOs pendientes.

---

## ✅ Fase 19: Sincronización Postman ↔ Frontend

> Endpoints detectados en Postman que faltaban en servicios o viceversa.

- [x] **19.1** `operation.service.js` + `getMiembros(seccionId)` → `GET /secciones/:id/miembros`
- [x] **19.2** `operation.service.js` + `createEnlace()` / `cerrarEnlace()` → enlaces entre secciones
- [x] **19.3** `operation.service.js` + `cancelarPrograma()` / `reprogramarPrograma()` → `PUT /programas/:id/estado`
- [x] **19.4** `operation.service.js` + `getCambiosPrograma()` → `GET /programas/:id/cambios`
- [x] **19.5** `operation.service.js` + `darBaja(perfilId)` → `POST /perfil/:id/baja`
- [x] **19.6** `pages/programas/[id]/asistencia.vue` — usa `getMiembros()` en vez de lista vacía
- [x] **19.7** `CouncilMinuteForm.vue` — miembros de sección vía `getMiembros()`
- [x] **19.8** Postman `POST /auth/register` → `codigo_invitacion` agregado

### 🔧 Correcciones de payload (análisis response body)

- [x] **19.9** `auth.store.js` login: `roles` viene en `data.roles`, no `data.usuario.roles`
- [x] **19.10** `PUT /perfil/salud`: `peso_kg` → `peso`, `talla_cm` → `talla`
- [x] **19.11** `PUT /programas/:id/seguridad`: campos `servicios_disponibles`, `tel_policia`
- [x] **19.12** `PUT /programas/:id/traslado`: campos `tipo_transporte`, `salida_fecha_hora`, `salida_punto`
- [x] **19.13** `POST /secciones/:id/actas`: agregado campo `fecha` (ISO)
- [x] **19.14** `PUT /programas/:id/estado`: body `{estado, motivo}` en vez de `{accion}`
- [x] **19.15** `POST /perfil/:id/baja`: body `{tipo, motivo}`

---

## 🔴 Fase 20: Corrección de Roles y Persistencia de Usuario

> Roles eran tratados como objetos `{rol_nombre}` pero la API los retorna como strings `["admin"]`.
> Al refrescar, `checkSession` llamaba `GET /perfil` que no retorna roles ni `nombre_usuario`.

- [x] **20.1** `hasRole()`: `roles.value.includes(rol)` en vez de `.some(r => r.rol_nombre === rol)`
- [x] **20.2** `rolesDisponibles`: mapea `nombreRol` directamente, no `r.rol_nombre`
- [x] **20.3** `seleccionarRol()`: `roles.value.includes(rol)` en vez de `hasRole(rol)`
- [x] **20.4** `login()` persiste `roles` y `usuario` en localStorage (`csd-roles`, `csd-usuario`)
- [x] **20.5** `logout()` limpia `csd-usuario` y `csd-roles` de localStorage
- [x] **20.6** `checkSession()` solo valida token (no sobrescribe usuario ni roles)
- [x] **20.7** `usuario` se inicializa desde localStorage (`csd-usuario`)
- [x] **20.8** Login con múltiples roles: auto-selecciona admin, o el primer rol

---

## 🔵 Fase 21: Corrección de endpoints en CatalogoAutocomplete

> `CatalogoAutocomplete` llamaba `/catalogos/{catalogo}` para todo, pero provincias/grupos/secciones tienen sus propias rutas.

- [x] **21.1** Prop `endpoint` agregado a `CatalogoAutocomplete`. Si se define, usa `api.get(endpoint)` en vez de `/catalogos/`.
- [x] **21.2** `catalogo="provincias"` → `endpoint="/provincias"` en 2 archivos
- [x] **21.3** `catalogo="grupos"` → `endpoint="/grupos"` en 5 archivos
- [x] **21.4** `catalogo="secciones"` → `endpoint="/secciones"` en 4 archivos

---

## 🎨 Fase 22: Sidebar Rediseñado

- [x] **22.1** Compacto por defecto (w-16), expandible (w-64). Animación `transition-all duration-300`.
- [x] **22.2** Logo con ícono Mountain + botón expandir/colapsar (PanelLeftClose/Open) visible en hover.
- [x] **22.3** Submenús: modo expandido = acordeón inline con ChevronDown rotado. Modo compacto = popover flotante a la derecha.
- [x] **22.4** Footer: avatar con iniciales + dropdown (perfil, selector de rol, selector de tema claro/oscuro/sistema, cerrar sesión).
- [x] **22.5** Sidebar `h-screen sticky`, scroll independiente en nav.
- [x] **22.6** AppHeader simplificado: solo breadcrumbs + botón menú mobile. Tema y avatar movidos al sidebar.
- [x] **22.7** Color `mundial` como tema del sidebar.
- [x] **22.8** Sin CSS personalizado, solo Tailwind.
