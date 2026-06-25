<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 transition-opacity" />

      <!-- Panel -->
      <div :class="panelClasses" role="dialog" aria-modal="true">
        <!-- Header -->
        <div v-if="title || $slots.header" class="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <h2 v-if="title" class="text-lg font-semibold text-base-content">{{ title }}</h2>
          <slot name="header" />
          <button
            class="p-1 rounded-md text-neutral hover:text-base-content hover:bg-base-200 transition-colors"
            @click="$emit('close')"
            aria-label="Cerrar"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div :class="bodyClasses">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="px-6 py-4 border-t border-base-200 flex justify-end gap-3">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X } from '@lucide/vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
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

defineEmits(['close'])

const inheritedColor = injectColor(props.color)

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

const panelClasses = computed(() => [
  'relative w-full bg-base-100 rounded-xl shadow-xl',
  'border border-base-200',
  `ring-1 ring-${inheritedColor.value}/10`,
  sizeMap[props.size],
])

const bodyClasses = computed(() => {
  const noHeader = !props.title
  return noHeader ? 'px-6 py-6' : 'px-6 py-4'
})
</script>
