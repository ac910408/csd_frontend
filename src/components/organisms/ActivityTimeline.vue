<template>
  <div class="relative">
    <div class="space-y-1">
      <div v-for="(item, i) in items" :key="i" class="relative flex items-start gap-4 pb-1">
        <div class="flex flex-col items-center">
          <div :class="dotClasses(item)" class="size-3 rounded-full border-2 flex-shrink-0 z-10" />
          <div v-if="i < items.length - 1" class="w-0.5 flex-1 min-h-[2rem] bg-primary/20" />
        </div>
        <div class="flex-1 pb-4">
          <p class="text-sm font-medium text-base-contrast">{{ item.titulo }}</p>
          <p v-if="item.descripcion" class="text-xs text-neutral mt-0.5">{{ item.descripcion }}</p>
          <p v-if="item.fecha" class="text-xs text-neutral mt-1">{{ item.fecha }}</p>
        </div>
      </div>
    </div>
    <EmptyState
      v-if="!items.length"
      titulo="Sin actividades"
      descripcion="Aún no hay acciones registradas"
    />
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  color: { type: String, default: 'primary' },
})
function dotClasses(item) {
  if (item.estado === 'completado') return 'bg-primary border-primary'
  if (item.estado === 'en_progreso') return 'bg-base-100 border-primary'
  return 'bg-base-100 border-base-300'
}
</script>
