<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto">
      <a
        :href="`/ciclos/${programa?.id_ciclo}/programas`"
        class="text-sm text-primary hover:underline mb-4 inline-block"
      >
        ← Volver a programas
      </a>
      <h1 class="text-2xl font-bold text-base-content mb-6">Protocolo de Seguridad</h1>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />

      <template v-else>
        <AlertMessage v-if="exito" type="success" :mensaje="exito" class="mb-4" />

        <BaseCard>
          <template #header
            ><h2 class="text-lg">{{ programa?.nombre || 'Programa' }}</h2></template
          >

          <form class="space-y-4" @submit.prevent="guardar">
            <FormField label="Servicios disponibles">
              <textarea
                v-model="form.servicios_disponibles"
                rows="3"
                class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Agua, baños, electricidad…"
              />
            </FormField>

            <FormField label="Teléfono de policía / emergencias">
              <BaseInput v-model="form.tel_policia" placeholder="911" />
            </FormField>

            <div class="flex justify-end gap-3">
              <BaseButton type="submit" variant="primary" :loading="guardando">Guardar</BaseButton>
            </div>
          </form>
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
const guardando = ref(false)
const programa = ref(null)
const exito = ref('')

const form = reactive({
  servicios_disponibles: '',
  tel_policia: '',
})

async function guardar() {
  guardando.value = true
  try {
    await operationService.saveSeguridadPrograma(route.params.id, { ...form })
    exito.value = 'Protocolo de seguridad guardado'
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  cargando.value = true
  try {
    const res = await operationService.getSeguridadPrograma(route.params.id)
    programa.value = res.data
    if (res.data) Object.assign(form, res.data)
  } catch {
    // Sin seguridad aún, usar fallback del grupo
  } finally {
    cargando.value = false
  }
})
</script>
