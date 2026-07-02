<template>
  <ul class="space-y-0.5">
    <li v-for="item in items" :key="item.to">
      <a
        :href="item.to"
        class="block rounded-lg px-3 py-1.5 text-sm text-base-contrast hover:bg-base-200 transition-colors whitespace-nowrap"
        @click.prevent="$emit('navigate', item.to)"
      >
        {{ item.label }}
      </a>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})

defineEmits(['navigate'])
</script>
