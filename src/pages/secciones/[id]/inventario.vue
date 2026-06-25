<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <a :href="`/secciones/${seccionId}`" class="text-sm text-primary hover:underline">← Sección</a>
          <h1 class="text-2xl font-bold text-base-content">Inventario</h1>
        </div>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" /> Nuevo item
        </BaseButton>
      </div>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />
      <template v-else>
        <BaseTable :data="items" :columnas="columnas" vacio="Sin items en inventario" color="primary">
          <template #cell-estado_fisico="{ value }">
            <BaseBadge :color="value === 'Bueno' ? 'success' : value === 'Regular' ? 'warning' : 'error'" outline>
              {{ value }}
            </BaseBadge>
          </template>
        </BaseTable>

        <BaseModal :open="showCreate" title="Nuevo item" @close="showCreate = false">
          <form class="space-y-4" @submit.prevent="crear">
            <FormField label="Nombre" required>
              <BaseInput v-model="form.nombre" placeholder="Nombre del item" />
            </FormField>
            <div class="grid grid-cols-2 gap-4">
              <FormField label="Cantidad" required>
                <BaseInput v-model.number="form.cantidad" type="number" placeholder="1" />
              </FormField>
              <FormField label="Estado">
                <select v-model="form.estado_fisico" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm">
                  <option value="Bueno">Bueno</option>
                  <option value="Regular">Regular</option>
                  <option value="Malo">Malo</option>
                </select>
              </FormField>
            </div>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" size="sm" @click="showCreate = false">Cancelar</BaseButton>
              <BaseButton type="submit" variant="primary" size="sm" :loading="guardando">Crear</BaseButton>
            </div>
          </form>
        </BaseModal>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Plus } from '@lucide/vue'
import { financeService } from '@/services/finance.service'


const route = useRoute()
const seccionId = route.params.id
const cargando = ref(true)
const items = ref([])
const showCreate = ref(false)
const guardando = ref(false)
const form = reactive({ nombre: '', cantidad: 1, estado_fisico: 'Bueno' })

const columnas = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'estado_fisico', label: 'Estado' },
]

async function crear() {
  guardando.value = true
  try {
    await financeService.createItemInventario(seccionId, { ...form })
    showCreate.value = false
    form.nombre = ''
    await cargar()
  } finally { guardando.value = false }
}

async function cargar() {
  cargando.value = true
  try {
    const res = await financeService.getInventario(seccionId)
    items.value = res.data || []
  } finally { cargando.value = false }
}

onMounted(cargar)
</script>
