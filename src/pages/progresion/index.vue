<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-base-content mb-6">Mi Progresión</h1>

      <BaseSpinner v-if="cargando" class="mx-auto py-12" size="lg" />

      <AlertMessage
        v-else-if="error"
        type="error"
        :mensaje="error"
        class="mb-4"
      />

      <template v-else>
        <!-- Mapa de progresión -->
        <BaseCard class="mb-6">
          <template #header>
            <h2 class="text-lg">Mapa de competencias</h2>
          </template>
          <ProgressionMap v-if="etapas.length" :etapas="etapas" color="primary" />
          <EmptyState v-else titulo="Sin datos" descripcion="Completa tu perfil para ver tu progresión" />
        </BaseCard>

        <!-- Resumen rápido -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <BaseCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-success">{{ totalCompletadas }}</p>
              <p class="text-xs text-neutral">Completadas</p>
            </div>
          </BaseCard>
          <BaseCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-warning">{{ totalPendientes }}</p>
              <p class="text-xs text-neutral">En progreso</p>
            </div>
          </BaseCard>
          <BaseCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-primary">{{ especialidades.length }}</p>
              <p class="text-xs text-neutral">Especialidades</p>
            </div>
          </BaseCard>
          <BaseCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-info">{{ insignias.length }}</p>
              <p class="text-xs text-neutral">Insignias</p>
            </div>
          </BaseCard>
        </div>

        <!-- Enlaces -->
        <div class="flex flex-wrap gap-3">
          <a href="/progresion/acciones" class="text-sm text-primary hover:underline font-medium">
            Ver Hoja de Caminata →
          </a>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProgresionStore } from '@/stores/progresion.store'


const store = useProgresionStore()
const cargando = ref(true)
const error = ref('')

const acciones = computed(() => store.acciones)
const especialidades = computed(() => store.especialidades)
const insignias = computed(() => store.insigniasFinales)

const totalCompletadas = computed(
  () => acciones.value.filter((a) => a.completado).length,
)
const totalPendientes = computed(
  () => acciones.value.filter((a) => !a.completado).length,
)

// Construir etapas para ProgressionMap
const etapas = computed(() => {
  if (!store.resumen?.etapas) return []
  return store.resumen.etapas
})

onMounted(async () => {
  try {
    await store.cargarTodo()
  } catch (e) {
    error.value = e?.mensaje || 'Error al cargar'
  } finally {
    cargando.value = false
  }
})
</script>
