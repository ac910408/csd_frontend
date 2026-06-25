<template>
  <div class="w-full overflow-x-auto rounded-lg border border-base-200">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-base-200 bg-base-200/50">
          <th
            v-for="col in columnas"
            :key="col.key"
            class="px-4 py-3 text-left font-semibold text-base-content cursor-pointer select-none hover:bg-base-200 transition-colors"
            @click="toggleSort(col.key)"
          >
            <div class="flex items-center gap-1">
              {{ col.label }}
              <span v-if="sortKey === col.key" class="text-xs">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="cargando">
          <td :colspan="columnas.length" class="px-4 py-12 text-center">
            <BaseSpinner class="mx-auto" />
          </td>
        </tr>
        <tr v-else-if="!data.length">
          <td :colspan="columnas.length" class="px-4 py-12 text-center text-neutral">
            {{ vacio || 'Sin resultados' }}
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="(row, i) in sortedData"
            :key="row.id ?? i"
            class="border-b border-base-200 last:border-0 hover:bg-base-100 transition-colors"
          >
            <td
              v-for="col in columnas"
              :key="col.key"
              class="px-4 py-3 text-base-content"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columnas: {
    type: Array,
    default: () => [],
    // cada item: { key: string, label: string }
  },
  cargando: { type: Boolean, default: false },
  vacio: { type: String, default: '' },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

// eslint-disable-next-line no-unused-vars
const inheritedColor = injectColor(props.color)

const sortKey = ref('')
const sortDir = ref('asc')

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

const sortedData = computed(() => {
  if (!sortKey.value) return props.data
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...props.data].sort((a, b) => {
    const va = a[sortKey.value]
    const vb = b[sortKey.value]
    if (va == null) return 1
    if (vb == null) return -1
    if (typeof va === 'string') return va.localeCompare(vb) * dir
    return (va - vb) * dir
  })
})
</script>
