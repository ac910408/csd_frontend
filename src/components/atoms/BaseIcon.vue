<template>
  <component :is="iconComponent" :class="iconClasses" :style="{ width: size, height: size }" />
</template>

<script setup>
import { computed, shallowRef, watch } from 'vue'
import * as Lucide from '@lucide/vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 20 },
  color: { type: String, default: '' },
})

const iconComponent = shallowRef(null)

function loadIcon(name) {
  const pascalName = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
  iconComponent.value = Lucide[pascalName] || null
}

loadIcon(props.name)
watch(() => props.name, loadIcon)

const iconClasses = computed(() => [
  'inline-block',
  iconComponent.value ? '' : 'hidden',
  props.color ? `text-${props.color}` : '',
])
</script>
