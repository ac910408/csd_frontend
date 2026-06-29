<template>
  <DashboardLayout>
    <div class="max-w-2xl mx-auto">
      <a
        :href="`/ciclos/${programa?.id_ciclo}/programas`"
        class="text-sm text-primary hover:underline mb-4 inline-block"
      >
        ← Volver a programas
      </a>
      <h1 class="text-2xl font-bold text-base-content mb-6">Asistencia</h1>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />

      <template v-else>
        <BaseCard>
          <template #header
            ><h2 class="text-lg">{{ programa?.nombre || 'Programa' }}</h2></template
          >

          <AlertMessage v-if="exito" type="success" :mensaje="exito" class="mb-4" />

          <div v-if="miembros.length" class="space-y-2">
            <label
              v-for="m in miembros"
              :key="m.id_perfil"
              class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 cursor-pointer"
            >
              <input
                v-model="asistencia[m.id_perfil]"
                type="checkbox"
                class="rounded"
                @change="guardarAsistencia(m.id_perfil)"
              />
              <span class="text-sm text-base-content">{{
                m.nombre || `Perfil #${m.id_perfil}`
              }}</span>
            </label>
          </div>
          <EmptyState
            v-else
            titulo="Sin miembros"
            descripcion="No hay perfiles para registrar asistencia"
          />
        </BaseCard>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { operationService } from '@/services/operation.service'

const route = useRoute()
const cargando = ref(true)
const programa = ref(null)
const miembros = ref([])
const asistencia = reactive({})
const exito = ref('')

async function guardarAsistencia(idPerfil) {
  try {
    await operationService.registrarAsistencia(route.params.id, {
      id_perfil: idPerfil,
      presente: asistencia[idPerfil],
    })
    exito.value = 'Asistencia actualizada'
    setTimeout(() => (exito.value = ''), 3000)
  } catch {
    // revertir
    asistencia[idPerfil] = !asistencia[idPerfil]
  }
}

onMounted(async () => {
  try {
    const res = await operationService.getMiembros(programa.value?.id_seccion || route.params.id)
    miembros.value = res.data || []
  } finally {
    cargando.value = false
  }
})
</script>
