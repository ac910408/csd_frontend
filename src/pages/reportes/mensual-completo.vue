<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-base-content mb-6">Reporte Mensual Completo</h1>

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
      <EmptyState v-else-if="!datos" titulo="Sin datos" descripcion="Selecciona sección, año y mes" />

      <template v-else>
        <!-- Tabs de secciones -->
        <div class="flex gap-2 mb-4 overflow-x-auto">
          <BaseButton
            v-for="s in secciones"
            :key="s.key"
            :variant="tab === s.key ? 'primary' : 'ghost'"
            size="sm"
            @click="tab = s.key"
          >
            {{ s.label }}
          </BaseButton>
        </div>

        <BaseCard>
          <template #header><h2 class="text-lg">{{ tabLabel }}</h2></template>
          <div class="h-72">
            <apexchart
              v-if="chartData[tab]"
              type="bar"
              height="100%"
              :options="chartOptions"
              :series="chartData[tab]"
            />
            <EmptyState v-else titulo="Sin datos para esta sección" />
          </div>
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
const tab = ref('membresia')

const meses = [
  { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
]

const secciones = [
  { key: 'membresia', label: 'Membresía' },
  { key: 'actividades', label: 'Actividades' },
  { key: 'enlaces', label: 'Enlaces' },
  { key: 'progresiones', label: 'Progresiones' },
  { key: 'tesoreria', label: 'Tesorería' },
  { key: 'modificaciones', label: 'Modificaciones' },
]

const tabLabel = computed(() => secciones.find((s) => s.key === tab.value)?.label || '')

const chartData = computed(() => {
  if (!datos.value) return {}
  const d = datos.value
  return {
    membresia: [{ name: 'Miembros', data: [d.membresia || 0] }],
    actividades: [{ name: 'Actividades', data: [d.actividades || 0] }],
    enlaces: [{ name: 'Enlaces', data: [d.enlaces || 0] }],
    progresiones: [{ name: 'Progresiones', data: [d.progresiones || 0] }],
    tesoreria: [{ name: 'Ingresos', data: [d.ingresos || 0] }, { name: 'Egresos', data: [d.egresos || 0] }],
    modificaciones: [{ name: 'Altas', data: [d.altas || 0] }, { name: 'Bajas', data: [d.bajas || 0] }],
  }
})

const chartOptions = {
  chart: { type: 'bar', toolbar: { show: false }, foreColor: 'var(--color-base-content)' },
  colors: ['var(--color-primary)', 'var(--color-error)'],
  xaxis: { categories: [''] },
}

async function cargarReporte() {
  if (!seccionId.value) return
  cargando.value = true
  try {
    const res = await reportesService.getMensualCompleto({
      seccion_id: seccionId.value,
      anio: anio.value,
      mes: mes.value,
    })
    datos.value = res.data
  } catch { datos.value = {} }
  finally { cargando.value = false }
}
</script>
