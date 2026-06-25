<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <BaseSpinner v-if="cargando" class="mx-auto py-12" size="lg" />

      <template v-else-if="seccion">
        <a href="/secciones" class="text-sm text-primary hover:underline mb-4 inline-block">
          ← Volver a secciones
        </a>

        <h1 class="text-2xl font-bold text-base-content mb-2">
          {{ seccion.nombre_propio || seccion.tipo_seccion }}
        </h1>
        <BaseBadge :color="seccionColor(seccion.tipo_seccion)" class="mb-6">
          {{ seccion.tipo_seccion }}
        </BaseBadge>

        <!-- Accesos rápidos -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <a :href="`/secciones/${seccion.id}/ciclos`">
            <BaseCard hover>
              <div class="flex items-center gap-3">
                <Calendar class="w-8 h-8 text-primary" />
                <div>
                  <p class="font-medium text-base-content">Ciclos</p>
                  <p class="text-xs text-neutral">Programas y actividades</p>
                </div>
              </div>
            </BaseCard>
          </a>

          <a :href="`/secciones/${seccion.id}/actas`">
            <BaseCard hover>
              <div class="flex items-center gap-3">
                <ClipboardList class="w-8 h-8 text-info" />
                <div>
                  <p class="font-medium text-base-content">Actas</p>
                  <p class="text-xs text-neutral">Actas de consejo</p>
                </div>
              </div>
            </BaseCard>
          </a>

          <a :href="`/transacciones?seccion_id=${seccion.id}`">
            <BaseCard hover>
              <div class="flex items-center gap-3">
                <DollarSign class="w-8 h-8 text-success" />
                <div>
                  <p class="font-medium text-base-content">Finanzas</p>
                  <p class="text-xs text-neutral">Transacciones e inventario</p>
                </div>
              </div>
            </BaseCard>
          </a>
        </div>

        <!-- Info -->
        <BaseCard>
          <template #header><h2 class="text-lg">Información</h2></template>
          <dl class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt class="text-neutral">Grupo</dt>
              <dd class="font-medium text-base-content">{{ seccion.grupo_nombre }}</dd>
            </div>
            <div>
              <dt class="text-neutral">Tipo</dt>
              <dd class="font-medium text-base-content">{{ seccion.tipo_seccion }}</dd>
            </div>
          </dl>
        </BaseCard>
      </template>

      <EmptyState v-else titulo="Sección no encontrada" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar, ClipboardList, DollarSign } from '@lucide/vue'
import { useOrganizationStore } from '@/stores/organization.store'
import { TIPOS_SECCION_INFO } from '@/utils/constants'


const route = useRoute()
const store = useOrganizationStore()
const cargando = ref(true)
const seccion = ref(null)

function seccionColor(tipo) {
  return TIPOS_SECCION_INFO[tipo]?.color || 'primary'
}

onMounted(async () => {
  try {
    seccion.value = await store.getSeccion(route.params.id)
  } finally {
    cargando.value = false
  }
})
</script>
