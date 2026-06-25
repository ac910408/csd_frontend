<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'neutral'].includes(v),
  },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
  outline: { type: Boolean, default: false },
})

const inheritedColor = injectColor(props.color)
provideColor(inheritedColor)

const badgeClasses = computed(() => {
  const c = inheritedColor.value
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

  if (props.outline) {
    return `${base} border border-${c} text-${c}`
  }

  return `${base} bg-${c} text-${c}-contrast`
})
</script>
