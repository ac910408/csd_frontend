<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <a :href="`/secciones/${seccionId}/ciclos`" class="text-sm text-primary hover:underline mb-1 inline-block">← Ciclos</a>
          <h1 class="text-2xl font-bold text-base-content">Programas</h1>
        </div>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" /> Nuevo programa
        </BaseButton>
      </div>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />

      <template v-else>
        <div v-if="programas.length" class="space-y-3">
          <BaseCard v-for="p in programas" :key="p.id">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-base-content">{{ p.nombre }}</p>
                <p class="text-xs text-neutral">
                  {{ p.tipo }} · {{ p.fecha ? new Date(p.fecha).toLocaleDateString('es-MX') : '—' }}
                </p>
              </div>
              <div class="flex gap-2">
                <BaseButton variant="ghost" size="sm" @click="router.push(`/programas/${p.id}/asistencia`)">
                  Asistencia
                </BaseButton>
                <BaseButton variant="ghost" size="sm" @click="router.push(`/programas/${p.id}/seguridad`)">
                  Seguridad
                </BaseButton>
                <BaseButton variant="ghost" size="sm" @click="router.push(`/programas/${p.id}/traslado`)">
                  Traslado
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </div>
        <EmptyState v-else titulo="Sin programas" />
      </template>

      <BaseModal :open="showCreate" title="Nuevo programa" @close="showCreate = false">
        <form class="space-y-4" @submit.prevent="crear">
          <FormField label="Nombre" required>
            <BaseInput v-model="form.nombre" placeholder="Nombre del programa" />
          </FormField>
          <FormField label="Responsable">
            <CatalogoAutocomplete v-model="form.id_responsable" catalogo="perfiles" :items="[]" placeholder="Buscar…" />
          </FormField>
          <FormField label="Tipo" required>
            <select v-model="form.tipo" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm">
              <option value="interno">Interno</option>
              <option value="externo">Externo</option>
            </select>
          </FormField>
          <div class="flex justify-end gap-3">
            <BaseButton variant="ghost" size="sm" @click="showCreate = false">Cancelar</BaseButton>
            <BaseButton type="submit" variant="primary" size="sm" :loading="guardando">Crear</BaseButton>
          </div>
        </form>
      </BaseModal>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus } from '@lucide/vue'
import { operationService } from '@/services/operation.service'


const route = useRoute()
const router = useRouter()
const cargando = ref(true)
const programas = ref([])
const showCreate = ref(false)
const guardando = ref(false)
const seccionId = ref(null)
const form = reactive({ nombre: '', id_responsable: null, tipo: 'interno' })

async function cargar() {
  cargando.value = true
  try {
    const res = await operationService.getProgramas(route.params.id)
    programas.value = res.data || []
    seccionId.value = programas.value[0]?.id_seccion || null
  } finally {
    cargando.value = false
  }
}

async function crear() {
  guardando.value = true
  try {
    await operationService.createPrograma(route.params.id, {
      id_seccion: seccionId.value,
      ...form,
    })
    showCreate.value = false
    form.nombre = ''
    form.tipo = 'interno'
    await cargar()
  } finally {
    guardando.value = false
  }
}

onMounted(cargar)
</script>
