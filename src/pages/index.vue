<template>
  <DashboardLayout>
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold text-base-content mb-2">Dashboard</h1>
      <p class="text-sm text-neutral mb-6">
        Bienvenido, {{ auth.usuario?.nombre_usuario || 'Scout' }} · Rol activo:
        <BaseBadge color="primary">{{ auth.rolActivo || '—' }}</BaseBadge>
      </p>

      <!-- Accesos rápidos -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <a href="/perfil">
          <BaseCard hover>
            <div class="text-center py-2">
              <User class="w-8 h-8 mx-auto text-primary mb-2" />
              <p class="text-sm font-medium text-base-content">Mi Perfil</p>
            </div>
          </BaseCard>
        </a>

        <a href="/perfil/salud">
          <BaseCard hover>
            <div class="text-center py-2">
              <Heart class="w-8 h-8 mx-auto text-error mb-2" />
              <p class="text-sm font-medium text-base-content">Ficha Médica</p>
            </div>
          </BaseCard>
        </a>

        <a v-if="auth.hasRole(ROLES.SCOUT)" href="/progresion">
          <BaseCard hover>
            <div class="text-center py-2">
              <Mountain class="w-8 h-8 mx-auto text-success mb-2" />
              <p class="text-sm font-medium text-base-content">Progresión</p>
            </div>
          </BaseCard>
        </a>

        <a
          v-if="auth.hasAnyRole([ROLES.ADMIN, ROLES.DIRIGENTE, ROLES.SCOUTER])"
          href="/transacciones"
        >
          <BaseCard hover>
            <div class="text-center py-2">
              <DollarSign class="w-8 h-8 mx-auto text-success mb-2" />
              <p class="text-sm font-medium text-base-content">Finanzas</p>
            </div>
          </BaseCard>
        </a>
      </div>

      <!-- Secciones por rol -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Perfil rápido -->
        <BaseCard v-if="user.perfil">
          <template #header><h2 class="text-lg">Perfil</h2></template>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-neutral">Nombre</dt>
              <dd class="text-base-content">
                {{ user.perfil.nombre }} {{ user.perfil.apellido_paterno }}
              </dd>
            </div>
            <div v-if="user.perfil.cum" class="flex justify-between">
              <dt class="text-neutral">CUM</dt>
              <dd class="text-base-content">{{ formatCUM(user.perfil.cum) }}</dd>
            </div>
          </dl>
        </BaseCard>

        <!-- Progresión rápida -->
        <BaseCard v-if="auth.hasRole(ROLES.SCOUT) && prog.acciones.length">
          <template #header><h2 class="text-lg">Progresión</h2></template>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-neutral">Acciones totales</span>
              <span class="text-base-content font-medium">{{ prog.acciones.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral">Completadas</span>
              <span class="text-success font-medium">
                {{ prog.acciones.filter((a) => a.completado).length }}
              </span>
            </div>
          </div>
          <a
            href="/progresion/acciones"
            class="text-xs text-primary hover:underline mt-2 inline-block"
          >
            Ver Hoja de Caminata →
          </a>
        </BaseCard>

        <!-- Organización rápida -->
        <BaseCard
          v-if="
            auth.hasAnyRole([
              ROLES.ADMIN,
              ROLES.DIRIGENTE_PROVINCIA,
              ROLES.DIRIGENTE,
              ROLES.SCOUTER,
            ])
          "
        >
          <template #header><h2 class="text-lg">Organización</h2></template>
          <div class="flex flex-wrap gap-2">
            <a v-if="auth.hasAnyRole(['admin', 'dirigente_provincia'])" href="/provincias">
              <BaseBadge color="info" outline>Provincias</BaseBadge>
            </a>
            <a v-if="auth.hasAnyRole(['admin', 'dirigente'])" href="/grupos">
              <BaseBadge color="secondary" outline>Grupos</BaseBadge>
            </a>
            <a v-if="auth.hasAnyRole(['admin', 'dirigente', 'scouter'])" href="/secciones">
              <BaseBadge color="primary" outline>Secciones</BaseBadge>
            </a>
          </div>
        </BaseCard>

        <!-- Operación rápida -->
        <BaseCard v-if="auth.hasAnyRole([ROLES.ADMIN, ROLES.SCOUTER])">
          <template #header><h2 class="text-lg">Operación</h2></template>
          <div class="flex flex-wrap gap-2">
            <a href="/secciones"
              ><BaseBadge color="warning" outline>Ciclos y programas</BaseBadge></a
            >
            <a href="/reportes/mensual"><BaseBadge color="info" outline>Reportes</BaseBadge></a>
          </div>
        </BaseCard>

        <!-- Admin rápido -->
        <BaseCard v-if="auth.hasRole(ROLES.ADMIN)">
          <template #header><h2 class="text-lg">Administración</h2></template>
          <div class="flex flex-wrap gap-2">
            <a href="/admin/usuarios"><BaseBadge color="error" outline>Usuarios</BaseBadge></a>
            <a href="/admin/sugerencias"
              ><BaseBadge color="warning" outline>Sugerencias</BaseBadge></a
            >
          </div>
        </BaseCard>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { User, Heart, Mountain, DollarSign } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'
import { useProgresionStore } from '@/stores/progresion.store'
import { ROLES } from '@/utils/constants'
import { formatCUM } from '@/utils/format'


const auth = useAuthStore()
const user = useUserStore()
const prog = useProgresionStore()

onMounted(async () => {
  user.cargarPerfil().catch(() => {})
  if (auth.hasRole(ROLES.SCOUT)) {
    prog.cargarAcciones().catch(() => {})
  }
})
</script>
