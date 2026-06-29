<template>
  <div class="relative" ref="wrapperRef">
    <input
      :value="searchText"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      type="text"
      autocomplete="off"
      @input="onSearch"
      @focus="open = true"
      @blur="onBlur"
      @keydown.down.prevent="moveDown"
      @keydown.up.prevent="moveUp"
      @keydown.enter.prevent="selectHighlighted"
      @keydown.escape="open = false"
    />

    <!-- Dropdown -->
    <div
      v-if="open && filteredItems.length"
      class="absolute z-50 w-full mt-1 bg-base-100 border border-base-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <button
        v-for="(item, i) in filteredItems"
        :key="item.id"
        :class="dropdownItemClasses(i)"
        @mousedown.prevent="selectItem(item)"
        @mouseenter="highlightIndex = i"
      >
        <span class="truncate">{{ item.nombre }}</span>
        <CircleCheck v-if="modelValue === item.id" class="w-4 h-4 text-success flex-shrink-0" />
      </button>

      <!-- Opción sugerir -->
      <button
        v-if="expandible && searchText && !exactMatch"
        class="w-full text-left px-3 py-2 text-sm text-primary hover:bg-base-200 border-t border-base-200 flex items-center gap-2"
        @mousedown.prevent="showSuggestDialog"
      >
        <Plus class="w-4 h-4" />
        Sugerir «{{ searchText }}»
      </button>

      <div v-if="loadingItems" class="px-3 py-4 flex justify-center">
        <BaseSpinner size="sm" :color="color" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Plus, CircleCheck } from '@lucide/vue'
import { injectColor, COLOR_VARIANTS } from '@/composables/useColor'
import { catalogService } from '@/services/catalog.service'
import { api } from '@/services/api'

const props = defineProps({
  catalogo: { type: String, required: true },
  modelValue: { type: [Number, null], default: null },
  items: { type: Array, default: () => [] },
  expandible: { type: Boolean, default: false },
  tablaDestino: { type: String, default: '' },
  endpoint: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar…' },
  disabled: { type: Boolean, default: false },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => COLOR_VARIANTS.includes(v),
  },
})

const emit = defineEmits(['update:modelValue', 'sugerir'])

const inheritedColor = injectColor(props.color)

const searchText = ref('')
const open = ref(false)
const highlightIndex = ref(0)
const loadingItems = ref(false)
const fetchedItems = ref([])

const allItems = computed(() => (props.items.length ? props.items : fetchedItems.value))

const filteredItems = computed(() => {
  if (!searchText.value) return allItems.value.slice(0, 20)
  const q = searchText.value.toLowerCase()
  return allItems.value.filter((it) => it.nombre.toLowerCase().includes(q)).slice(0, 20)
})

const exactMatch = computed(() =>
  filteredItems.value.some((it) => it.nombre.toLowerCase() === searchText.value.toLowerCase()),
)

const selectedLabel = computed(() => {
  if (props.modelValue == null) return ''
  const found = allItems.value.find((it) => it.id === props.modelValue)
  return found?.nombre || ''
})

const inputClasses = computed(() => [
  'w-full px-3 py-2 text-sm bg-base-100 rounded-lg border transition-colors',
  'placeholder:text-neutral-400',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
  props.disabled ? 'opacity-50 cursor-not-allowed bg-base-200' : '',
  `border-base-300 focus:border-${inheritedColor.value} focus-visible:ring-${inheritedColor.value}`,
])

// ── Búsqueda ──────────────────────────────────────────────
function onSearch(e) {
  searchText.value = e.target.value
  highlightIndex.value = 0
  open.value = true
}

function onBlur() {
  setTimeout(() => {
    open.value = false
    // Restaurar label si no se seleccionó nada
    if (props.modelValue != null && !searchText.value) {
      searchText.value = selectedLabel.value
    }
  }, 150)
}

// ── Navegación teclado ────────────────────────────────────
function moveDown() {
  highlightIndex.value = Math.min(highlightIndex.value + 1, filteredItems.value.length - 1)
}

function moveUp() {
  highlightIndex.value = Math.max(highlightIndex.value - 1, 0)
}

function selectHighlighted() {
  const item = filteredItems.value[highlightIndex.value]
  if (item) selectItem(item)
}

function dropdownItemClasses(i) {
  return [
    'w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors',
    i === highlightIndex.value ? 'bg-base-200' : 'hover:bg-base-100',
  ]
}

// ── Selección ─────────────────────────────────────────────
function selectItem(item) {
  searchText.value = item.nombre
  emit('update:modelValue', item.id)
  open.value = false
}

function showSuggestDialog() {
  open.value = false
  emit('sugerir', {
    tabla: props.tablaDestino || props.catalogo,
    nombre: searchText.value,
  })
}

// ── Carga del catálogo ────────────────────────────────────
async function loadCatalog() {
  if (props.items.length) return
  loadingItems.value = true
  try {
    let res
    if (props.endpoint) {
      res = await api.get(props.endpoint)
    } else {
      res = await catalogService.getCatalogo(props.catalogo)
    }
    fetchedItems.value = res.data || []
  } catch {
    fetchedItems.value = []
  } finally {
    loadingItems.value = false
  }
}

onMounted(loadCatalog)
watch(() => props.catalogo, loadCatalog)

// Sincronizar searchText con modelValue externo
watch(
  () => props.modelValue,
  (val) => {
    if (val == null) {
      searchText.value = ''
    } else {
      const found = allItems.value.find((it) => it.id === val)
      if (found) searchText.value = found.nombre
    }
  },
)
</script>
