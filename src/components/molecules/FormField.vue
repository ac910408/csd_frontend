<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-error ml-0.5">*</span>
    </label>
    <slot />
    <p v-if="help && !error" class="text-xs text-neutral">{{ help }}</p>
    <p v-if="error" class="text-xs text-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

defineProps({
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  help: { type: String, default: '' },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

const inheritedColor = injectColor('primary')

const labelClasses = computed(() => ['text-sm font-medium', `text-${inheritedColor.value}`])
</script>
