<template>
  <div class="flex items-center justify-between gap-2">
    <p class="text-xs text-neutral">{{ total }} resultado{{ total !== 1 ? 's' : '' }}</p>
    <div class="flex items-center gap-1">
      <button
        :disabled="pagina <= 1"
        class="inline-flex size-8 items-center justify-center rounded-md border border-base-300 text-base-contrast transition-colors hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed"
        @click="cambiar(pagina - 1)"
      >
        <ChevronLeft class="size-4" />
      </button>

      <template v-for="p in paginas" :key="p">
        <span v-if="p === '...'" class="px-1 text-neutral">…</span>
        <button
          v-else
          :class="[
            'inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
            p === pagina
              ? 'bg-primary text-white'
              : 'border border-base-300 text-base-contrast hover:bg-base-200',
          ]"
          @click="cambiar(p)"
        >
          {{ p }}
        </button>
      </template>

      <button
        :disabled="pagina >= totalPaginas"
        class="inline-flex size-8 items-center justify-center rounded-md border border-base-300 text-base-contrast transition-colors hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed"
        @click="cambiar(pagina + 1)"
      >
        <ChevronRight class="size-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps({
  pagina: { type: Number, required: true },
  totalPaginas: { type: Number, required: true },
  total: { type: Number, default: 0 },
})

const emit = defineEmits(['cambio'])

const paginas = computed(() => {
  const p = props.pagina
  const tp = props.totalPaginas
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const r = []
  r.push(1)
  if (p > 3) r.push('...')
  for (let i = Math.max(2, p - 1); i <= Math.min(tp - 1, p + 1); i++) r.push(i)
  if (p < tp - 2) r.push('...')
  r.push(tp)
  return r
})

function cambiar(p) {
  if (p >= 1 && p <= props.totalPaginas) emit('cambio', p)
}
</script>
