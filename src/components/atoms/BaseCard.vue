<template>
  <div :class="classes">
    <div v-if="$slots.header" class="border-b border-base-200 px-4 py-3">
      <slot name="header" />
    </div>
    <div :class="paddingMap[padding]">
      <slot />
    </div>
    <div v-if="$slots.footer" class="border-t border-base-200 px-4 py-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  padding: { type: String, default: 'md' },
  hover: { type: Boolean, default: false },
  color: { type: String, default: 'primary' },
})

const inherited = injectColor(props.color)
provideColor(inherited)

const c = computed(() => resolveColor(inherited.value))

const paddingMap = { sm: 'px-3 py-3', md: 'px-4 py-4', lg: 'px-6 py-5' }

const classes = computed(() => [
  'rounded-lg bg-base-100 shadow-sm border border-base-200',
  props.hover ? 'transition-all hover:shadow-md cursor-pointer' : '',
])
</script>
