<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-base-content">Provincias</h1>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" />
          Nueva provincia
        </BaseButton>
      </div>

      <SearchBar v-model="busqueda" placeholder="Buscar provincia…" class="mb-4" />

      <BaseCard>
        <BaseTable
          v-if="!cargando"
          :data="filtered"
          :columnas="columnas"
          vacio="No se encontraron provincias"
          color="primary"
        >
          <template #cell-nombre="{ row, value }">
            <a :href="`/provincias/${row.id}`" class="text-primary hover:underline font-medium">
              {{ value }}
            </a>
          </template>
        </BaseTable>
        <BaseSpinner v-else class="mx-auto py-8" />
      </BaseCard>

      <!-- Modal crear -->
      <BaseModal :open="showCreate" title="Nueva provincia" @close="showCreate = false">
        <form class="space-y-4" @submit.prevent="crear">
          <FormField label="Nombre" required>
            <BaseInput v-model="form.nombre" placeholder="Nombre de la provincia" />
          </FormField>
          <FormField label="Clave" required>
            <BaseInput v-model="form.clave" placeholder="Clave corta" />
          </FormField>
          <FormField label="Estado">
            <CatalogoAutocomplete
              v-model="form.id_estado"
              catalogo="estados"
              :items="[]"
              placeholder="Buscar estado…"
            />
          </FormField>
          <div class="flex justify-end gap-3">
            <BaseButton variant="ghost" size="sm" @click="showCreate = false">Cancelar</BaseButton>
            <BaseButton type="submit" variant="primary" size="sm" :loading="guardando">Crear</BaseButton>
          </div>
        </form>
      </BaseModal>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@lucide/vue'
import { useOrganizationStore } from '@/stores/organization.store'


const store = useOrganizationStore()
const cargando = ref(true)
const busqueda = ref('')
const showCreate = ref(false)
const guardando = ref(false)

const form = reactive({ nombre: '', clave: '', id_estado: null })

const columnas = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'clave', label: 'Clave' },
]

const filtered = computed(() => {
  if (!busqueda.value) return store.provincias
  const q = busqueda.value.toLowerCase()
  return store.provincias.filter((p) => p.nombre?.toLowerCase().includes(q))
})

async function crear() {
  guardando.value = true
  try {
    await store.crearProvincia({ ...form })
    showCreate.value = false
    form.nombre = ''
    form.clave = ''
    form.id_estado = null
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  await store.cargarProvincias()
  cargando.value = false
})
</script>
