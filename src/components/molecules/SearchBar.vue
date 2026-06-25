<template>
  <div class="relative">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral" />
    <input
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full pl-10 pr-4 py-2 text-sm bg-base-100 border border-base-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-colors"
      :class="inputColor"
      @input="onInput"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Search } from '@lucide/vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar…' },
  debounce: { type: Number, default: 300 },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

const emit = defineEmits(['update:modelValue'])

const inheritedColor = injectColor(props.color)

const inputColor = computed(
  () => `focus:border-${inheritedColor.value} focus-visible:ring-${inheritedColor.value}`,
)

let timer = null
function onInput(e) {
  clearTimeout(timer)
  const val = e.target.value
  timer = setTimeout(() => emit('update:modelValue', val), props.debounce)
}
</script>
