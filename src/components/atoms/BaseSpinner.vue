<template>
  <div :class="['flex items-center justify-center', sizeMap[size]]" role="status">
    <svg
      class="animate-spin"
      :class="`text-${color}`"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      :style="{ width: sizePx, height: sizePx }"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <span class="sr-only">Cargando…</span>
  </div>
</template>

<script setup>
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  color: {
    type: String,
    default: 'primary',
  },
})

const inherited = injectColor(props.color)
provideColor(inherited)

const c = resolveColor(inherited.value)

const sizeMap = { sm: 'py-1', md: 'py-4', lg: 'py-8' }
const sizePxMap = { sm: '16', md: '24', lg: '32' }
const sizePx = sizePxMap[props.size]
</script>
