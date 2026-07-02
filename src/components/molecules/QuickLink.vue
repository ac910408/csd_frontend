<template>
  <a
    :href="to"
    class="flex flex-col items-center gap-2 rounded-lg border border-base-200 bg-base-100 p-4 transition-all hover:shadow-md"
  >
    <component :is="icon" class="size-7 shrink-0" :class="`text-${c}`" />
    <span class="text-sm font-medium text-base-contrast text-center">{{ label }}</span>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  icon: { type: Object, required: true },
  label: { type: String, required: true },
  to: { type: String, required: true },
  color: { type: String, default: 'primary' },
})

const inherited = injectColor(props.color)
provideColor(inherited)
const c = computed(() => resolveColor(inherited.value))
</script>
