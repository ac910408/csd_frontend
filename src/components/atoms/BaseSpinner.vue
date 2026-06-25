<template>
  <svg
    :class="spinnerClasses"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="status"
    aria-label="Cargando"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

const inheritedColor = injectColor(props.color)

const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }

const spinnerClasses = computed(() => [
  sizeMap[props.size],
  `text-${inheritedColor.value}`,
  'animate-spin',
])
</script>
