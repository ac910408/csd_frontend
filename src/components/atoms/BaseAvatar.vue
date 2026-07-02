<template>
  <div :class="avatarClasses">
    <img
      v-if="src && !imgError"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="imgError = true"
    />
    <span v-else class="font-medium text-current">
      {{ initials }}
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  name: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v),
  },
  color: {
    type: String,
    default: 'primary',
  },
})

const imgError = ref(false)

const inherited = injectColor(props.color)
provideColor(inherited)

const c = computed(() => resolveColor(inherited.value))

const sizeMap = {
  xs: 'size-6 text-xs',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
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
  'rounded-full inline-flex items-center justify-center overflow-hidden flex-shrink-0',
  `bg-${c.value}/15 text-${c.value}`,
])
</script>
