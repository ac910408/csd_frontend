<script setup>
// Al estar en la carpeta composables, el estándar es nombrarlos con 'use'
import { useTheme } from '../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <div
    class="max-w-sm p-6 bg-base-100 border border-base-300 rounded-2xl shadow-lg transition-colors duration-300"
  >
    <div class="flex gap-3">
      <button
        @click="toggleTheme"
        class="flex-1 bg-primary text-primary-contrast py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 transition-all"
      >
        {{ isDark ? 'Cambiar a Claro' : 'Cambiar a Oscuro' }}
      </button>

      <button
        class="flex-1 bg-base-200 text-base-content py-2.5 rounded-lg font-semibold text-sm hover:bg-base-300 transition-all"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>
