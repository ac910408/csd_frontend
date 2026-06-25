<template>
  <div class="relative">
    <div class="space-y-1">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="relative flex items-start gap-4 pb-1"
      >
        <!-- Línea vertical -->
        <div class="flex flex-col items-center">
          <div
            :class="dotClasses(item)"
            class="w-3 h-3 rounded-full border-2 flex-shrink-0 z-10"
          />
          <div
            v-if="i < items.length - 1"
            class="w-0.5 flex-1 min-h-[2rem]"
            :class="lineColor"
          />
        </div>

        <!-- Contenido -->
        <div class="flex-1 pb-4">
          <p class="text-sm font-medium text-base-content">
            {{ item.titulo }}
          </p>
          <p v-if="item.descripcion" class="text-xs text-neutral mt-0.5">
            {{ item.descripcion }}
          </p>
          <p v-if="item.fecha" class="text-xs text-neutral mt-1">
            {{ item.fecha }}
          </p>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="!items.length"
      titulo="Sin actividades"
      descripcion="Aún no hay acciones registradas"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
    // { titulo, descripcion?, fecha?, estado }
  },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

const inheritedColor = injectColor(props.color)

const lineColor = computed(() => `bg-${inheritedColor.value}-200`)

function dotClasses(item) {
  const c = inheritedColor.value
  const base = 'border-2'
  if (item.estado === 'completado') return `${base} bg-${c} border-${c}`
  if (item.estado === 'en_progreso') return `${base} bg-base-100 border-${c}`
  return `${base} bg-base-100 border-base-300`
}
</script>
