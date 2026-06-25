<template>
  <div :class="avatarClasses">
    <img
      v-if="src && !error"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="error = true"
    />
    <span v-else class="font-medium text-current">
      {{ initials }}
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { injectColor, provideColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  name: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

const error = ref(false)

const inheritedColor = injectColor(props.color)
provideColor(inheritedColor)

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
}

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
})

const avatarClasses = computed(() => [
  sizeMap[props.size],
  'rounded-full inline-flex items-center justify-center overflow-hidden',
  `bg-${inheritedColor.value}-100 text-${inheritedColor.value}-700`,
  'ring-2 ring-base-100',
  'flex-shrink-0',
])
</script>
