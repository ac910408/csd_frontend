<template>
  <button :class="classes" :disabled="disabled || loading" v-bind="$attrs">
    <span v-if="loading" class="mr-2">
      <svg
        class="animate-spin size-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </span>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v),
  },
  color: {
    type: String,
    default: 'primary',
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const inherited = injectColor(props.color)
provideColor(inherited)

const c = computed(() => resolveColor(inherited.value))

const sizeMap = {
  xs: 'px-2 py-1 text-xs rounded-md gap-1',
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2',
}

const classes = computed(() => {
  const base = [
    'inline-flex items-center justify-center font-semibold transition-colors',
    'focus-visible:ring-4 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    sizeMap[props.size],
  ]

  const color = c.value

  switch (props.variant) {
    case 'primary':
      base.push(
        `bg-${color} text-white shadow-sm hover:opacity-90`,
        `focus-visible:ring-${color}/30`,
      )
      break
    case 'secondary':
      base.push(
        `bg-${color}/10 text-${color} hover:bg-${color}/20`,
        `focus-visible:ring-${color}/30`,
      )
      break
    case 'ghost':
      base.push(`text-${color} hover:bg-base-200`, `focus-visible:ring-${color}/30`)
      break
    case 'danger':
      base.push('bg-error text-white shadow-sm hover:opacity-90 focus-visible:ring-error/30')
      break
    case 'outline':
      base.push(
        `border border-${color} text-${color} hover:bg-base-200`,
        `focus-visible:ring-${color}/30`,
      )
      break
  }

  return base
})
</script>
