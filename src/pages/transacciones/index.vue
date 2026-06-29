<template>
  <DashboardLayout>
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-base-content">Finanzas</h1>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" /> Nueva transacción
        </BaseButton>
      </div>

      <div class="mb-4">
        <FormField label="Filtrar por sección">
          <CatalogoAutocomplete v-model="filtroSeccion" catalogo="secciones" endpoint="/secciones" :items="[]" placeholder="Todas" />
        </FormField>
      </div>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />
      <template v-else>
        <BaseCard class="mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-neutral">Balance total</span>
            <span :class="balance >= 0 ? 'text-success font-bold' : 'text-error font-bold'">
              {{ formatCurrency(balance) }}
            </span>
          </div>
        </BaseCard>

        <BaseTable :data="filtered" :columnas="columnas" vacio="Sin transacciones" color="primary">
          <template #cell-tipo="{ value }">
            <BaseBadge :color="value === 'ingreso' ? 'success' : 'error'" outline>{{ value }}</BaseBadge>
          </template>
          <template #cell-monto="{ value, row }">
            <span :class="row.tipo === 'ingreso' ? 'text-success' : 'text-error'">
              {{ row.tipo === 'ingreso' ? '+' : '-' }}{{ formatCurrency(value) }}
            </span>
          </template>
          <template #cell-fecha="{ value }">
            {{ value ? new Date(value).toLocaleDateString('es-MX') : '—' }}
          </template>
        </BaseTable>

        <BaseModal :open="showCreate" title="Nueva transacción" @close="showCreate = false">
          <form class="space-y-4" @submit.prevent="crear">
            <FormField label="Sección" required>
              <CatalogoAutocomplete v-model="form.id_seccion" catalogo="secciones" endpoint="/secciones" :items="[]" placeholder="Seleccionar…" />
            </FormField>
            <div class="grid grid-cols-2 gap-4">
              <FormField label="Monto" required>
                <BaseInput v-model.number="form.monto" type="number" placeholder="0.00" />
              </FormField>
              <FormField label="Tipo" required>
                <select v-model="form.tipo" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm">
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </FormField>
            </div>
            <FormField label="Concepto" required>
              <BaseInput v-model="form.concepto" placeholder="Descripción" />
            </FormField>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@lucide/vue'
import { financeService } from '@/services/finance.service'
import { formatCurrency } from '@/utils/format'


const cargando = ref(true)
const transacciones = ref([])
const filtroSeccion = ref(null)
const showCreate = ref(false)
const guardando = ref(false)
const form = reactive({ id_seccion: null, monto: null, tipo: 'ingreso', concepto: '' })

const columnas = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'concepto', label: 'Concepto' },
  { key: 'monto', label: 'Monto' },
]

const filtered = computed(() => {
  if (!filtroSeccion.value) return transacciones.value
  return transacciones.value.filter((t) => t.id_seccion === filtroSeccion.value)
})

const balance = computed(() =>
  filtered.value.reduce((acc, t) => t.tipo === 'ingreso' ? acc + t.monto : acc - t.monto, 0),
)

async function crear() {
  guardando.value = true
  try {
    await financeService.createTransaccion({ ...form })
    showCreate.value = false
    form.monto = null; form.concepto = ''
    await cargar()
  } finally { guardando.value = false }
}

async function cargar() {
  cargando.value = true
  try {
    const res = await financeService.getTransacciones(filtroSeccion.value || 1)
    transacciones.value = res.data || []
  } finally { cargando.value = false }
}

onMounted(cargar)
</script>
