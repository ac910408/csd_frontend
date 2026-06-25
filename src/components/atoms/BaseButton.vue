<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <BaseSpinner v-if="loading" size="sm" :color="color" class="mr-2" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger', 'outline'].includes(v),
  },
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
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const inheritedColor = injectColor(props.color)
provideColor(inheritedColor)

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
}

const classes = computed(() => {
  const c = inheritedColor.value
  const base = [
    'inline-flex items-center justify-center font-medium transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[props.size],
  ]

  switch (props.variant) {
    case 'primary':
      base.push(`bg-${c} text-${c}-contrast hover:opacity-90 focus-visible:ring-${c}`)
      break
    case 'secondary':
      base.push(`bg-${c}-100 text-${c}-700 hover:bg-${c}-200 focus-visible:ring-${c}`)
      break
    case 'ghost':
      base.push(`text-${c} hover:bg-${c}-50 focus-visible:ring-${c}`)
      break
    case 'danger':
      base.push('bg-error text-error-contrast hover:opacity-90 focus-visible:ring-error')
      break
    case 'outline':
      base.push(`border-2 border-${c} text-${c} hover:bg-${c}-50 focus-visible:ring-${c}`)
      break
  }

  return base
})
</script>
