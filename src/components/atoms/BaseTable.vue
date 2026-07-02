<template>
  <table class="min-w-full divide-y-2 divide-base-200">
    <thead class="text-left">
      <tr class="*:font-medium *:text-base-contrast">
        <th v-for="col in columnas" :key="col.key" class="px-3 py-2 whitespace-nowrap">
          {{ col.label }}
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-base-200">
      <tr v-if="!data.length">
        <td :colspan="columnas.length" class="px-3 py-8 text-center text-sm text-neutral">
          {{ vacio || 'Sin datos' }}
        </td>
      </tr>
      <tr
        v-for="(row, i) in data"
        :key="i"
        class="*:text-base-contrast *:first:font-medium hover:bg-base-200"
      >
        <td v-for="col in columnas" :key="col.key" class="px-3 py-2 whitespace-nowrap text-sm">
          <slot :name="'cell-' + col.key" :row="row" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] },
  columnas: { type: Array, default: () => [] },
  vacio: { type: String, default: '' },
})
</script>
