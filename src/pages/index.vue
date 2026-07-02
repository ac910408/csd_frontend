<template>
  <DashboardLayout>
    <div class="w-full px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl font-bold text-base-contrast">Dashboard</h1>
        <p class="text-sm text-neutral mt-1">
          Bienvenido, {{ auth.usuario?.nombre_usuario || 'Scout' }}
          <BaseBadge color="primary" class="ml-1">{{ auth.rolActivo || '—' }}</BaseBadge>
        </p>
      </div>

      <!-- Accesos rápidos -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <QuickLink :icon="User" label="Mi Perfil" to="/perfil" color="primary" />
        <QuickLink :icon="Heart" label="Ficha Médica" to="/perfil/salud" color="error" />
        <QuickLink
          v-if="auth.hasRole(ROLES.SCOUT)"
          :icon="Mountain"
          label="Progresión"
          to="/progresion/acciones"
          color="success"
        />
        <QuickLink
          v-if="auth.hasAnyRole([ROLES.ADMIN, ROLES.DIRIGENTE, ROLES.SCOUTER])"
          :icon="DollarSign"
          label="Finanzas"
          to="/transacciones"
          color="warning"
        />
      </div>

      <!-- Secciones dinámicas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Organización -->
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
          <template #header>
            <h2 class="text-base font-semibold text-base-contrast">Organización</h2>
          </template>
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

        <!-- Operación -->
        <BaseCard v-if="auth.hasAnyRole([ROLES.ADMIN, ROLES.SCOUTER])">
          <template #header>
            <h2 class="text-base font-semibold text-base-contrast">Operación</h2>
          </template>
          <div class="flex flex-wrap gap-2">
            <a href="/secciones">
              <BaseBadge color="warning" outline>Ciclos y programas</BaseBadge>
            </a>
            <a href="/reportes/mensual">
              <BaseBadge color="info" outline>Reportes</BaseBadge>
            </a>
          </div>
        </BaseCard>

        <!-- Admin -->
        <BaseCard v-if="auth.hasRole(ROLES.ADMIN)">
          <template #header>
            <h2 class="text-base font-semibold text-base-contrast">Administración</h2>
          </template>
          <div class="flex flex-wrap gap-2">
            <a href="/admin/usuarios">
              <BaseBadge color="error" outline>Usuarios</BaseBadge>
            </a>
            <a href="/admin/sugerencias">
              <BaseBadge color="warning" outline>Sugerencias</BaseBadge>
            </a>
          </div>
        </BaseCard>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { User, Heart, Mountain, DollarSign } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth.store'
import { ROLES } from '@/utils/constants'

const auth = useAuthStore()
</script>
