<template>
  <article class="flex items-center gap-4 rounded-lg border border-base-200 bg-base-100 p-5">
    <span class="rounded-full p-3 shrink-0" :class="`bg-${c}/10 text-${c}`">
      <component :is="icon" class="size-6" />
    </span>
    <div class="min-w-0">
      <p class="text-2xl font-bold text-base-contrast">{{ value }}</p>
      <p class="text-sm text-neutral truncate">{{ label }}</p>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, provideColor, resolveColor } from '@/composables/useColor'

const props = defineProps({
  icon: { type: Object, required: true },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  color: { type: String, default: 'primary' },
})

const inherited = injectColor(props.color)
provideColor(inherited)
const c = computed(() => resolveColor(inherited.value))
</script>
