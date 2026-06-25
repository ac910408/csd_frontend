<template>
  <Component
    :is="iconComponent"
    v-if="iconComponent"
    :style="iconStyle"
    :stroke-width="strokeWidth"
    class="flex-shrink-0"
    aria-hidden="true"
  />
</template>

<script setup>
import { computed, shallowRef, watch } from 'vue'
import * as Lucide from '@lucide/vue'
import { injectColor, provideColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  name: { type: String, required: true },
  size: {
    type: [String, Number],
    default: 20,
  },
  color: {
    type: String,
    default: 'neutral',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
  strokeWidth: { type: [String, Number], default: 2 },
})

const inheritedColor = injectColor(props.color)
provideColor(inheritedColor)

const iconComponent = shallowRef(null)

function resolveIcon() {
  const pascalName = props.name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')

  iconComponent.value = Lucide[pascalName] || null
}

resolveIcon()
watch(() => props.name, resolveIcon)

const iconStyle = computed(() => {
  const sz = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: sz,
    height: sz,
    color: `var(--color-${inheritedColor.value})`,
  }
})
</script>
