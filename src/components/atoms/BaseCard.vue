<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  padding: { type: String, default: 'md' },
  hover: { type: Boolean, default: false },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

const inheritedColor = injectColor(props.color)
provideColor(inheritedColor)

const paddingMap = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-8' }

const cardClasses = computed(() => [
  'bg-base-100 rounded-xl border border-base-200 shadow-sm',
  props.hover ? 'hover:shadow-md hover:border-base-300 transition-shadow' : '',
  `ring-1 ring-${inheritedColor.value}/5`,
])

const headerClasses = computed(() => [
  paddingMap[props.padding],
  'border-b border-base-200 font-semibold text-base-content',
])

const bodyClasses = paddingMap[props.padding]

const footerClasses = computed(() => [
  paddingMap[props.padding],
  'border-t border-base-200 flex justify-end gap-3',
])
</script>
