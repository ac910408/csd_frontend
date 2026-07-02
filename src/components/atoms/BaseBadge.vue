<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  variant: {
    type: String,
    default: 'solid',
    validator: (v) => ['solid', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v),
  },
  color: {
    type: String,
    default: 'primary',
  },
})

const inherited = injectColor(props.color)
provideColor(inherited)

const c = computed(() => resolveColor(inherited.value))

const sizeMap = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-0.5 text-sm' }

const classes = computed(() => {
  const color = c.value
  const base = [
    'inline-flex items-center justify-center rounded-full whitespace-nowrap font-medium',
    sizeMap[props.size],
  ]

  if (props.variant === 'outline') {
    base.push(`border border-${color} text-${color}`)
  } else {
    base.push(`bg-${color}/10 text-${color}`)
  }

  return base
})
</script>
