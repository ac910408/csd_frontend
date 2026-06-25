<template>
  <BaseCard class="mb-4">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">{{ title }}</h3>
        <BaseSpinner v-if="cargando" size="sm" />
      </div>
    </template>
    <slot />
  </BaseCard>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  cargando: { type: Boolean, default: false },
})
</script>
