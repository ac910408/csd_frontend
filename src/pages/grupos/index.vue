<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-base-content">Grupos</h1>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" /> Nuevo grupo
        </BaseButton>
      </div>

      <div class="mb-4">
        <FormField label="Filtrar por provincia">
          <CatalogoAutocomplete
            v-model="filtroProvincia"
            catalogo="provincias" endpoint="/provincias"
            :items="[]"
            placeholder="Todas las provincias"
          />
        </FormField>
      </div>

      <BaseCard>
        <BaseTable
          v-if="!cargando"
          :data="filtered"
          :columnas="columnas"
          vacio="No se encontraron grupos"
          color="primary"
        >
          <template #cell-nombre="{ row, value }">
            <a :href="`/grupos/${row.id}`" class="text-primary hover:underline font-medium">
              {{ value }}
            </a>
          </template>
        </BaseTable>
        <BaseSpinner v-else class="mx-auto py-8" />
      </BaseCard>

      <BaseModal :open="showCreate" title="Nuevo grupo" @close="showCreate = false">
        <form class="space-y-4" @submit.prevent="crear">
          <FormField label="Provincia" required>
            <CatalogoAutocomplete
              v-model="form.id_provincia"
              catalogo="provincias" endpoint="/provincias"
              :items="[]"
              placeholder="Seleccionar provincia…"
            />
          </FormField>
          <FormField label="Número" required>
            <BaseInput v-model.number="form.numero" type="number" placeholder="1" />
          </FormField>
          <FormField label="Nombre" required>
            <BaseInput v-model="form.nombre" placeholder="Nombre del grupo" />
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
const filtroProvincia = ref(null)
const showCreate = ref(false)
const guardando = ref(false)

const form = reactive({ id_provincia: null, numero: null, nombre: '' })

const columnas = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'numero', label: 'Número' },
]

const filtered = computed(() => {
  let list = store.grupos
  if (filtroProvincia.value) {
    list = list.filter((g) => g.id_provincia === filtroProvincia.value)
  }
  return list
})

async function crear() {
  guardando.value = true
  try {
    await store.crearGrupo({ ...form })
    showCreate.value = false
    form.id_provincia = null
    form.numero = null
    form.nombre = ''
    await store.cargarGrupos()
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  await store.cargarGrupos()
  cargando.value = false
})
</script>
