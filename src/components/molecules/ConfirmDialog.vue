<template>
  <BaseModal :open="open" :title="titulo" size="sm" :color="color" @close="$emit('cancelar')">
    <p class="text-sm text-base-content">{{ mensaje }}</p>

    <template #footer>
      <BaseButton variant="ghost" size="sm" :color="color" @click="$emit('cancelar')">
        {{ cancelarLabel }}
      </BaseButton>
      <BaseButton variant="primary" size="sm" :color="color" @click="$emit('confirmar')">
        {{ confirmarLabel }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

defineProps({
  open: { type: Boolean, default: false },
  titulo: { type: String, default: 'Confirmar' },
  mensaje: { type: String, default: '¿Estás seguro?' },
  confirmarLabel: { type: String, default: 'Confirmar' },
  cancelarLabel: { type: String, default: 'Cancelar' },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

defineEmits(['confirmar', 'cancelar'])

// eslint-disable-next-line no-unused-vars
const inheritedColor = injectColor('primary')
</script>
