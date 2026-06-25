<template>
  <div v-if="totalPaginas > 1" class="flex items-center justify-between gap-4 py-3">
    <span class="text-sm text-neutral">
      {{ total }} resultado{{ total !== 1 ? 's' : '' }}
    </span>
    <div class="flex items-center gap-1">
      <BaseButton
        variant="ghost"
        size="sm"
        :color="color"
        :disabled="pagina <= 1"
        @click="$emit('cambiarPagina', pagina - 1)"
      >
        <ChevronLeft class="w-4 h-4" />
      </BaseButton>

      <template v-for="p in paginas" :key="p">
        <span v-if="p === '...'" class="px-2 text-neutral text-sm">…</span>
        <BaseButton
          v-else
          :variant="p === pagina ? 'primary' : 'ghost'"
          size="sm"
          :color="color"
          @click="$emit('cambiarPagina', p)"
        >
          {{ p }}
        </BaseButton>
      </template>

      <BaseButton
        variant="ghost"
        size="sm"
        :color="color"
        :disabled="pagina >= totalPaginas"
        @click="$emit('cambiarPagina', pagina + 1)"
      >
        <ChevronRight class="w-4 h-4" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  pagina: { type: Number, required: true },
  totalPaginas: { type: Number, required: true },
  total: { type: Number, default: 0 },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

defineEmits(['cambiarPagina'])

// eslint-disable-next-line no-unused-vars
const inheritedColor = injectColor(props.color)

const paginas = computed(() => {
  const p = props.pagina
  const t = props.totalPaginas
  const r = []

  if (t <= 7) {
    for (let i = 1; i <= t; i++) r.push(i)
    return r
  }

  r.push(1)
  if (p > 3) r.push('...')

  const start = Math.max(2, p - 1)
  const end = Math.min(t - 1, p + 1)
  for (let i = start; i <= end; i++) r.push(i)

  if (p < t - 2) r.push('...')
  r.push(t)

  return r
})
</script>
