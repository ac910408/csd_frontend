# 🪓 Plan de Trabajo — CSD Frontend

> Checklist por fases. Cada fase = funcionalidad pequeña e independiente.
> Marcar `[x]` al completar. Orden estricto: no saltar fases.
> Stack: Vite + Vue 3 (JS, no TS) + Tailwind v4 + unplugin-vue-components + Pinia + Router.

---

## 🔰 Fase 0: Corrección de stack y deuda técnica

- [ ] **0.1** Instalar dependencia faltante: `@lucide/vue`
- [ ] **0.2** Remover `unplugin-auto-import` si está instalado (no se usará)
- [ ] **0.3** Verificar `tailwind.config.mjs` y `style.css` — colores de identidad como clases Tailwind
- [ ] **0.4** Eliminar archivos placeholder: `stores/counter.js`, `components/_dev/TestComponent.vue`, `pages/index.vue` temporal
- [ ] **0.5** Crear estructura de carpetas Atomic Design: `atoms/`, `molecules/`, `organisms/`, `templates/` dentro de `components/`
- [ ] **0.6** Crear carpetas: `composables/`, `services/`, `utils/`
- [ ] **0.7** Actualizar `vite.config.js`: solo `unplugin-vue-components` (sin `AutoImport`). Alias `@` apuntando a `./src`

---

## 📋 Fase 1: Constantes y Utilidades Base

- [ ] **1.1** `utils/constants.js` — Enumeraciones como objetos congelados: `ROLES`, `CARGOS`, `TIPOS_SECCION`, `ESTADO_ACCION`, `TIPO_TRANSACCION`, `TIPO_ACTA`
- [ ] **1.2** `utils/format.js` — Formateo: `formatDate(ts)`, `formatCurrency(monto)`, `formatCUM(cum)`
- [ ] **1.3** `utils/validators.js` — Validadores: `requerido`, `email`, `minLength(n)`, `maxLength(n)`, `telefono`, `cum` + composable `useForm()`

---

## 🧱 Fase 2: Atoms — Componentes Atómicos

- [ ] **2.1** `BaseButton.vue` — Variantes: `primary`, `secondary`, `ghost`, `danger`, `outline`. Sizes: `sm`, `md`, `lg`. Props: `color`, `disabled`, `loading`
- [ ] **2.2** `BaseInput.vue` — Tipos: `text`, `email`, `password`, `number`, `tel`, `date`. Props: `modelValue`, `placeholder`, `disabled`, `error`
- [ ] **2.3** `BaseBadge.vue` — Variantes semánticas: `primary`, `secondary`, `info`, `success`, `warning`, `error`. Content por slot
- [ ] **2.4** `BaseModal.vue` — Props: `open`, `title`, `size`. Slots: `default`, `footer`. Emit: `close`. Con `Teleport` y backdrop
- [ ] **2.5** `BaseCard.vue` — Props: `padding`, `hover`. Slots: `header`, `default`, `footer`
- [ ] **2.6** `BaseIcon.vue` — Wrapper sobre `@lucide/vue`. Props: `name`, `size`, `color`. Pasar color vía `provideColor` cascade
- [ ] **2.7** `BaseAvatar.vue` — Props: `src`, `alt`, `size`, `fallback` (iniciales). Con estado de carga
- [ ] **2.8** `BaseSpinner.vue` — Props: `size`, `color`. SVG animado
- [ ] **2.9** `BaseTable.vue` — Props: `data`, `columnas` (keys + labels), `cargando`, `vacio`. Slots para celdas custom. Ordenamiento por columna. Solo Tailwind

---

## 🧩 Fase 3: Molecules — Componentes Moleculares

- [ ] **3.1** `FormField.vue` — Wrapper label + error + slot input. Props: `label`, `error`, `required`, `help`
- [ ] **3.2** `SearchBar.vue` — Props: `modelValue`, `placeholder`. Emit: `update:modelValue` con debounce. Ícono `Search` de `@lucide/vue`
- [ ] **3.3** `PaginationBar.vue` — Props: `pagina`, `totalPaginas`, `total`. Emit: `cambiarPagina`
- [ ] **3.4** `FilterChips.vue` — Props: `opciones`, `seleccionados`. Emit: `update:seleccionados`. Chips toggle
- [ ] **3.5** `AlertMessage.vue` — Props: `type` (info/success/warning/error), `mensaje`, `cerrable`
- [ ] **3.6** `EmptyState.vue` — Props: `titulo`, `descripcion`, `icono`, `accion` (label + callback)
- [ ] **3.7** `ConfirmDialog.vue` — Compone `BaseModal` + `BaseButton`. Emit: `confirmar`, `cancelar`

---

## 🌐 Fase 4: Servicios y Comunicación con API

- [ ] **4.1** `services/api.js` — Cliente HTTP con `fetch` nativo. Interceptor 401 → redirect login. Interceptor errores → throw. Métodos: `get`, `post`, `put`, `del`. `BASE_URL` desde `VITE_API_URL`
- [ ] **4.2** `.env` + `.env.example` — `VITE_API_URL=http://localhost:8080`
- [ ] **4.3** `services/auth.service.js` — `login(creds)`, `register(data)`
- [ ] **4.4** `services/profile.service.js` — CRUD perfil, salud, alergias, antecedentes, vacunas, contactos, afiliaciones
- [ ] **4.5** `services/progresion.service.js` — Acciones, especialidades, logros ✅/❌
- [ ] **4.6** `services/organization.service.js` — Provincias, grupos, secciones CRUD
- [ ] **4.7** `services/operation.service.js` — Ciclos, programas, asistencia, actas, protocolos
- [ ] **4.8** `services/finance.service.js` — Transacciones, inventario
- [ ] **4.9** `services/catalog.service.js` + `services/admin.service.js` — Catálogos, sugerencias, usuarios

---

## 🔐 Fase 5: Autenticación y RBAC

- [ ] **5.1** `stores/auth.store.js` — Estado: `token`, `usuario`, `roles`, `rolActivo`. Acciones: `login()`, `register()`, `logout()`, `seleccionarRol()`. Getters: `isLoggedIn`, `hasRole`
- [ ] **5.2** `composables/useAuth.js` — Acceso reactivo al auth store. Función `requireAuth()` para guards
- [ ] **5.3** `composables/useApi.js` — Composable con estados `loading`, `error`, `data`, `execute(fn)`
- [ ] **5.4** Router guards — `beforeEach`: si ruta requiere auth y no hay token → `/login`. Si rol insuficiente → `/dashboard`
- [ ] **5.5** `composables/useNavigation.js` — Sidebar dinámico según `rolActivo`

---

## 🏗️ Fase 6: Layouts y Organismos Principales

- [ ] **6.1** `templates/EmptyLayout.vue` — `<slot />` puro. Para `/login`, `/register`
- [ ] **6.2** `organisms/AppHeader.vue` — Logo CSD, toggle tema, avatar + dropdown (perfil, logout)
- [ ] **6.3** `organisms/AppSidebar.vue` — Navegación por rol. Colapsable mobile. Íconos `@lucide/vue`
- [ ] **6.4** `templates/DashboardLayout.vue` — `AppHeader` + `AppSidebar` + `<slot />`
- [ ] **6.5** `composables/useColor.js` — `provideColor(color)` + `injectColor()`. Padre setea, hijos heredan vía `provide`/`inject`

---

## 🔑 Fase 7: Login y Registro

- [ ] **7.1** `pages/auth/login.vue` — `EmptyLayout`. Form: email + password. Validación `useForm`. Submit → `authStore.login()`. Error → `AlertMessage`
- [ ] **7.2** `pages/auth/register.vue` — `EmptyLayout`. Form: nombre_usuario + email + password + confirmar. Validación. Submit → `authStore.register()` → redirect login
- [ ] **7.3** `organisms/ProfileCard.vue` — Resumen sidebar: nombre, rol activo, avatar

---

## 📋 Fase 8: CatalogoAutocomplete (Componente Reusable Crítico)

- [ ] **8.1** `molecules/CatalogoAutocomplete.vue` — Props: `catalogo`, `modelValue`, `items`, `expandible`, `tablaDestino`. Búsqueda local con debounce. Botón "+ Sugerir" si expandible. Usa `useApi`
- [ ] **8.2** Integrar con `FormField` para labels y errores

---

## 👤 Fase 9: Perfil de Usuario

- [ ] **9.1** `stores/user.store.js` — Estado: `perfil`, `salud`, `alergias`, `antecedentes`, `vacunas`, `contactos`, `afiliaciones`
- [ ] **9.2** `pages/perfil/index.vue` — Form datos personales. Guardar → `PUT /perfil`. Cargar → `GET /perfil`
- [ ] **9.3** `pages/perfil/salud.vue` — Ficha médica. Secciones plegables con modales add/edit cada sub-sección
- [ ] **9.4** `organisms/HealthSection.vue` — Sub-sección reutilizable (alergias, vacunas, etc.)
- [ ] **9.5** Botón "Derecho al olvido" → `DELETE /perfil/salud` con `ConfirmDialog`

---

## ⚜️ Fase 10: Progresión Juvenil

- [ ] **10.1** `stores/progresion.store.js` — Estado: `etapas`, `competencias`, `acciones`, `especialidades`, `logros`, `resumen`
- [ ] **10.2** `organisms/ProgressionMap.vue` — Mapa etapas → competencias → saberes. Colores por estado: success, warning, neutral
- [ ] **10.3** `pages/progresion/index.vue` — Mapa de progresión con `ProgressionMap`
- [ ] **10.4** `pages/progresion/acciones.vue` — "Hoja de Caminata". Lista `AccionPersonal` con filtros. Modal CRUD
- [ ] **10.5** `organisms/ActivityTimeline.vue` — Timeline vertical de acciones personales

---

## 🏕️ Fase 11: Organización (Provincias, Grupos, Secciones)

- [ ] **11.1** `stores/organization.store.js` — Estado: `provincias`, `grupos`, `secciones`, activos
- [ ] **11.2** `pages/provincias/index.vue` — Tabla + SearchBar + PaginationBar + Modal CRUD
- [ ] **11.3** `pages/provincias/[id].vue` — Detalle provincia con grupos anidados
- [ ] **11.4** `pages/grupos/index.vue` — Tabla grupos. Filtro por provincia (`CatalogoAutocomplete`)
- [ ] **11.5** `pages/grupos/[id].vue` — Detalle grupo con secciones anidadas
- [ ] **11.6** `pages/secciones/index.vue` — Tabla secciones. Filtro por grupo
- [ ] **11.7** `pages/secciones/[id].vue` — Detalle sección + enlaces a ciclos, actas, finanzas

---

## 📅 Fase 12: Operación (Ciclos, Programas, Actas, Protocolos)

- [ ] **12.1** `pages/secciones/[id]/ciclos.vue` — Lista + crear ciclo
- [ ] **12.2** `pages/ciclos/[id]/programas.vue` — Programas del ciclo. Crear con tipo y responsable
- [ ] **12.3** `pages/programas/[id]/asistencia.vue` — Toggle asistencia por miembro
- [ ] **12.4** `pages/secciones/[id]/actas.vue` — Actas con `CouncilMinuteForm`
- [ ] **12.5** `organisms/CouncilMinuteForm.vue` — Formulario acta con autocomplete asistentes
- [ ] **12.6** `pages/programas/[id]/seguridad.vue` — Protocolo seguridad programa
- [ ] **12.7** `pages/grupos/[id]/seguridad.vue` — Seguridad genérica grupo
- [ ] **12.8** `pages/programas/[id]/traslado.vue` — Protocolo traslado + pasajeros

---

## 💰 Fase 13: Finanzas

- [ ] **13.1** `pages/transacciones/index.vue` — Tabla con filtro sección. Colores ingreso/egreso. Balance total
- [ ] **13.2** `pages/secciones/[id]/inventario.vue` — Inventario tabla + modal add

---

## 👑 Fase 14: Admin

- [ ] **14.1** `pages/admin/usuarios/index.vue` — Gestión usuarios. Asignar/revocar roles
- [ ] **14.2** `pages/admin/sugerencias/index.vue` — Lista pendientes. Aprobar/rechazar

---

## 📊 Fase 15: Reportes

- [ ] **15.1** `pages/reportes/mensual.vue` — Selector sección + año + mes. Gráfico barras (`vue3-apexcharts`)
- [ ] **15.2** `pages/reportes/mensual-completo.vue` — 6 secciones en tabs

---

## 🧹 Fase 16: Pulido Transversal

- [ ] **16.1** Estados de carga en todas las vistas
- [ ] **16.2** Estados vacíos (`EmptyState`) en todas las tablas/listas
- [ ] **16.3** Estados de error con reintento (`AlertMessage` + botón)
- [ ] **16.4** Toasts/notificaciones (`ui.store.js`)
- [ ] **16.5** Responsive: sidebar colapsa mobile, tablas scroll horizontal
- [ ] **16.6** Modo oscuro completo (verificar contraste)
- [ ] **16.7** Accesibilidad básica: `aria-label`, focus visible

---

## 🧪 Fase 17: Tests

- [ ] **17.1** Tests unitarios para `utils/validators.js` (composable `useForm`)
- [ ] **17.2** Tests unitarios para `utils/format.js`
- [ ] **17.3** Tests de componentes: `BaseButton`, `BaseInput`, `BaseBadge`, `BaseModal`
- [ ] **17.4** Tests de stores: `auth.store`, `user.store`
- [ ] **17.5** Tests de `services/api.js` (mock fetch)

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
