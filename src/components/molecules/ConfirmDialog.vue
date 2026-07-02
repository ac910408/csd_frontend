<template>
  <BaseModal :open="open" :title="titulo" size="sm" @close="$emit('close')">
    <p class="text-sm text-base-contrast">{{ mensaje }}</p>
    <div class="flex justify-end gap-2 mt-4">
      <BaseButton variant="ghost" size="sm" @click="$emit('close')">{{ cancelarLabel }}</BaseButton>
      <BaseButton :variant="danger ? 'danger' : 'primary'" size="sm" @click="$emit('confirmar')">
        {{ confirmarLabel }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  titulo: { type: String, default: 'Confirmar' },
  mensaje: { type: String, default: '¿Estás seguro?' },
  confirmarLabel: { type: String, default: 'Confirmar' },
  cancelarLabel: { type: String, default: 'Cancelar' },
  danger: { type: Boolean, default: false },
})

defineEmits(['close', 'confirmar'])
</script>
