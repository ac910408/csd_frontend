<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-base-content mb-6">Reporte Mensual</h1>

      <BaseCard class="mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Sección" required>
            <CatalogoAutocomplete v-model="seccionId" catalogo="secciones" endpoint="/secciones" :items="[]" placeholder="Seleccionar…" />
          </FormField>
          <FormField label="Año">
            <BaseInput v-model.number="anio" type="number" placeholder="2025" />
          </FormField>
          <FormField label="Mes">
            <select v-model="mes" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm">
              <option v-for="m in meses" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </FormField>
        </div>
        <BaseButton variant="primary" class="mt-4" :loading="cargando" @click="cargarReporte">
          Generar reporte
        </BaseButton>
      </BaseCard>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />
      <EmptyState v-else-if="!datos" titulo="Sin datos" descripcion="Selecciona sección, año y mes para generar el reporte" />

      <template v-else>
        <BaseCard class="mb-6">
          <template #header><h2 class="text-lg">Planeado vs Real</h2></template>
          <div class="h-64">
            <apexchart
              v-if="chartOptions"
              type="bar"
              height="100%"
              :options="chartOptions"
              :series="chartSeries"
            />
          </div>
        </BaseCard>

        <BaseCard>
          <template #header><h2 class="text-lg">Resumen</h2></template>
          <dl class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt class="text-neutral">Actividades planeadas</dt>
              <dd class="font-bold text-base-content">{{ datos.planeadas || 0 }}</dd>
            </div>
            <div>
              <dt class="text-neutral">Actividades realizadas</dt>
              <dd class="font-bold text-success">{{ datos.realizadas || 0 }}</dd>
            </div>
            <div>
              <dt class="text-neutral">% Cumplimiento</dt>
              <dd class="font-bold text-info">{{ cumplimiento }}%</dd>
            </div>
          </dl>
        </BaseCard>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { reportesService } from '@/services/catalog.service'


const seccionId = ref(null)
const anio = ref(new Date().getFullYear())
const mes = ref(new Date().getMonth() + 1)
const cargando = ref(false)
const datos = ref(null)

const meses = [
  { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
]

const cumplimiento = computed(() => {
  if (!datos.value?.planeadas) return 0
  return Math.round((datos.value.realizadas / datos.value.planeadas) * 100)
})

const chartSeries = computed(() => [
  { name: 'Planeado', data: [datos.value?.planeadas || 0] },
  { name: 'Real', data: [datos.value?.realizadas || 0] },
])

const chartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, foreColor: 'var(--color-base-content)' },
  colors: ['var(--color-primary)', 'var(--color-success)'],
  xaxis: { categories: ['Actividades'] },
  plotOptions: { bar: { horizontal: false } },
}))

async function cargarReporte() {
  if (!seccionId.value) return
  cargando.value = true
  try {
    const res = await reportesService.getMensual({
      seccion_id: seccionId.value,
      anio: anio.value,
      mes: mes.value,
    })
    datos.value = res.data
  } catch { datos.value = { planeadas: 0, realizadas: 0 } }
  finally { cargando.value = false }
}
</script>
