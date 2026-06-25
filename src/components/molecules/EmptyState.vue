<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <component :is="iconComponent" class="w-16 h-16 mb-4" :class="iconColor" />
    <h3 class="text-lg font-semibold text-base-content mb-2">{{ titulo }}</h3>
    <p v-if="descripcion" class="text-sm text-neutral max-w-md mb-6">{{ descripcion }}</p>
    <BaseButton
      v-if="accion"
      variant="primary"
      :color="color"
      @click="accion.callback"
    >
      {{ accion.label }}
    </BaseButton>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FileSearch } from '@lucide/vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  titulo: { type: String, default: 'Sin resultados' },
  descripcion: { type: String, default: '' },
  icono: { type: String, default: 'file-search' },
  accion: {
    type: Object,
    default: null,
    // { label: string, callback: Function }
  },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

const inheritedColor = injectColor(props.color)

const iconComponent = computed(() => {
  // Mapa simple; se puede expandir
  const map = { 'file-search': FileSearch }
  return map[props.icono] || FileSearch
})

const iconColor = computed(() => `text-${inheritedColor.value}-300`)
</script>
