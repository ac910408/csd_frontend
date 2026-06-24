<template>
  <div class="h-full flex justify-center items-center" style="min-height: 100vh">
    <div
      class="max-w-sm p-6 bg-base-100 border border-base-300 rounded-2xl shadow-lg transition-colors duration-300"
    >
      <div class="flex p-1 bg-base-200 rounded-lg">
        <button
          v-for="option in options"
          :key="option.id"
          @click="setTheme(option.id)"
          :class="[
            'flex-1 py-2 text-sm font-semibold rounded-md transition-all',
            theme === option.id
              ? 'bg-primary text-primary-contrast shadow-sm'
              : 'text-base-content hover:bg-base-300',
          ]"
        >
          {{ option.label }}
        </button>
      </div>

      <div>
        <VueApexCharts type="line" :options="chartOptions" :series="series" height="200" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Al estar en la carpeta composables, el estándar es nombrarlos con 'use'
import { useTheme } from '@/composables/useTheme'
import VueApexCharts from 'vue3-apexcharts'

const { theme, setTheme } = useTheme()

const options = [
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Oscuro' },
  { id: 'system', label: 'Sistema' },
]
// Datos de prueba
const series = ref([
  {
    name: 'Actividad Mundial',
    data: [30, 40, 35, 50, 49, 60, 70],
  },
])

// Configuración de la gráfica usando variables CSS para que respete tu tema
const chartOptions = {
  chart: {
    type: 'line',
    toolbar: { show: false },
    background: 'transparent',
  },
  colors: ['var(--color-primary)'], // ¡Aquí usamos tu color semántico!
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    labels: { style: { colors: 'var(--color-base-content)' } },
  },
  yaxis: {
    labels: { style: { colors: 'var(--color-base-content)' } },
  },
  grid: {
    borderColor: 'var(--color-base-300)',
  },
}
</script>
