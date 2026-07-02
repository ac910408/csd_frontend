<template>
  <div class="relative">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral" />
    <input
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-base-300 bg-base-100 py-2 pl-9 pr-3 text-sm transition-colors placeholder:text-neutral focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { Search } from '@lucide/vue'

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar…' },
})

defineEmits(['update:modelValue'])
</script>
