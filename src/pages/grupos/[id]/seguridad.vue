<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto">
      <a href="/grupos" class="text-sm text-primary hover:underline mb-4 inline-block">← Grupos</a>
      <h1 class="text-2xl font-bold text-base-content mb-6">Seguridad Genérica del Grupo</h1>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />

      <template v-else>
        <AlertMessage v-if="exito" type="success" :mensaje="exito" class="mb-4" />

        <BaseCard>
          <template #header><h2 class="text-lg">Protocolo base</h2></template>
          <form class="space-y-4" @submit.prevent="guardar">
            <FormField label="Riesgos generales">
              <textarea v-model="form.riesgos" rows="3" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Riesgos típicos…" />
            </FormField>
            <FormField label="Medidas de prevención">
              <textarea v-model="form.medidas_prevencion" rows="3" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Medidas generales…" />
            </FormField>
            <FormField label="Plan de emergencia">
              <textarea v-model="form.plan_emergencia" rows="3" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Procedimiento…" />
            </FormField>
            <FormField label="Contactos de emergencia">
              <textarea v-model="form.contactos_emergencia" rows="2" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Bomberos, Cruz Roja…" />
            </FormField>
            <BaseButton type="submit" variant="primary" :loading="guardando">Guardar</BaseButton>
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
const exito = ref('')

const form = reactive({ riesgos: '', medidas_prevencion: '', plan_emergencia: '', contactos_emergencia: '' })

async function guardar() {
  guardando.value = true
  try {
    await operationService.saveSeguridadGrupo(route.params.id, { ...form })
    exito.value = 'Seguridad guardada'
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  try {
    const res = await operationService.getSeguridadGrupo(route.params.id)
    if (res.data) Object.assign(form, res.data)
  } finally {
    cargando.value = false
  }
})
</script>
