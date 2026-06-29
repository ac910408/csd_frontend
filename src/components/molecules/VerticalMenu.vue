<template>
  <ul class="space-y-1 py-1 min-w-44">
    <li
      v-for="child in items"
      :key="child.to"
    >
      <a
        :href="child.to"
        :class="[
          'block rounded-lg mx-1 px-3 py-1.5 text-sm font-medium transition-colors',
          isActive(child.to)
            ? 'bg-primary/10 text-primary'
            : 'text-base-content/70 hover:bg-base-200 hover:text-base-content',
        ]"
        @click.prevent="$emit('navigate', child.to)"
      >
        {{ child.label }}
      </a>
    </li>
  </ul>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineProps({
  items: { type: Array, default: () => [] },
})

defineEmits(['navigate'])

const route = useRoute()

function isActive(to) {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>
