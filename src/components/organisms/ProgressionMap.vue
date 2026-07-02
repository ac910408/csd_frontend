<template>
  <div class="space-y-3">
    <div
      v-for="etapa in etapas"
      :key="etapa.nombre"
      class="border border-base-200 rounded-lg overflow-hidden"
    >
      <button
        class="w-full flex items-center justify-between px-4 py-3 bg-base-200 hover:bg-base-300 transition-colors"
        @click="toggleEtapa(etapa.nombre)"
      >
        <div class="flex items-center gap-3">
          <BaseBadge :color="etapaColor(etapa)" size="sm"
            >{{ etapa.completadas }}/{{ etapa.total }}</BaseBadge
          >
          <span class="font-medium text-base-contrast">{{ etapa.nombre }}</span>
        </div>
        <ChevronDown
          :class="[
            'size-4 text-neutral transition-transform',
            expanded === etapa.nombre ? 'rotate-180' : '',
          ]"
        />
      </button>

      <div v-if="expanded === etapa.nombre" class="px-4 py-3 space-y-2 border-t border-base-200">
        <div
          v-for="comp in etapa.competencias"
          :key="comp.nombre"
          class="pl-2 border-l-2"
          :class="competenciaBorder(comp)"
        >
          <p class="text-sm font-medium text-base-contrast">{{ comp.nombre }}</p>
          <div class="mt-1 space-y-1">
            <div
              v-for="saber in comp.saberes"
              :key="saber.nombre"
              class="flex items-center gap-2 text-xs"
            >
              <CircleCheck v-if="saber.completado" class="size-3.5 text-success" />
              <Circle v-else class="size-3.5 text-neutral/50" />
              <span :class="saber.completado ? 'text-base-contrast' : 'text-neutral'">{{
                saber.nombre
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="!etapas.length"
      titulo="Sin progresión"
      descripcion="No se encontraron datos"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, CircleCheck, Circle } from '@lucide/vue'

defineProps({
  etapas: { type: Array, default: () => [] },
})

const expanded = ref(null)
function toggleEtapa(name) {
  expanded.value = expanded.value === name ? null : name
}

function etapaColor(etapa) {
  if (etapa.completadas === etapa.total) return 'success'
  if (etapa.completadas > 0) return 'warning'
  return 'neutral'
}

function competenciaBorder(comp) {
  const total = comp.saberes?.length || 0
  const done = comp.saberes?.filter((s) => s.completado).length || 0
  if (total && done === total) return 'border-success'
  if (done > 0) return 'border-warning'
  return 'border-base-300'
}
</script>
