<template>
  <div>
    <label v-if="label" :for="inputId" class="block mb-1">
      <span class="text-sm font-medium text-base-contrast">
        {{ label }}
        <span v-if="required" class="text-error">*</span>
      </span>
    </label>

    <slot>
      <BaseInput
        :id="inputId"
        :model-value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :error="error"
        :color="color"
        @update:model-value="$emit('update:modelValue', $event)"
        @blur="$emit('blur')"
      >
        <template v-if="$slots.prefix" #prefix>
          <slot name="prefix" />
        </template>
        <template v-if="$slots.suffix" #suffix>
          <slot name="suffix" />
        </template>
      </BaseInput>
    </slot>

    <Transition name="field-error">
      <p v-if="error" class="mt-1 text-xs text-error">{{ error }}</p>
    </Transition>
    <p v-if="!error && help" class="mt-1 text-xs text-neutral">{{ help }}</p>
  </div>
</template>

<script setup>
import { injectColor, provideColor } from '@/composables/useColor'

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number, Boolean], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  help: { type: String, default: '' },
  color: { type: String, default: 'primary' },
})

defineEmits(['update:modelValue', 'blur'])

const inputId = `field-${Math.random().toString(36).slice(2, 8)}`

const inherited = injectColor(props.color)
provideColor(inherited)
</script>

<style scoped>
.field-error-enter-active {
  transition: all 0.2s ease-out;
}
.field-error-leave-active {
  transition: all 0.15s ease-in;
}
.field-error-enter-from,
.field-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
