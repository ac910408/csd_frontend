<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-base-content">Secciones</h1>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" /> Nueva sección
        </BaseButton>
      </div>

      <div class="mb-4">
        <FormField label="Filtrar por grupo">
          <CatalogoAutocomplete
            v-model="filtroGrupo"
            catalogo="grupos"
            :items="[]"
            placeholder="Todos los grupos"
          />
        </FormField>
      </div>

      <BaseCard>
        <BaseTable
          v-if="!cargando"
          :data="filtered"
          :columnas="columnas"
          vacio="No se encontraron secciones"
          color="primary"
        >
          <template #cell-nombre_propio="{ row, value }">
            <a :href="`/secciones/${row.id}`" class="text-primary hover:underline font-medium">
              {{ value || row.tipo_seccion }}
            </a>
          </template>
          <template #cell-tipo_seccion="{ value }">
            <BaseBadge :color="seccionColor(value)" outline>{{ value }}</BaseBadge>
          </template>
        </BaseTable>
        <BaseSpinner v-else class="mx-auto py-8" />
      </BaseCard>

      <BaseModal :open="showCreate" title="Nueva sección" @close="showCreate = false">
        <form class="space-y-4" @submit.prevent="crear">
          <FormField label="Grupo" required>
            <CatalogoAutocomplete
              v-model="form.id_grupo"
              catalogo="grupos"
              :items="[]"
              placeholder="Seleccionar grupo…"
            />
          </FormField>
          <FormField label="Tipo de sección" required>
            <CatalogoAutocomplete
              v-model="form.id_tipo_seccion"
              catalogo="tipos-seccion"
              :items="[]"
              placeholder="Seleccionar tipo…"
            />
          </FormField>
          <FormField label="Nombre propio">
            <BaseInput v-model="form.nombre_propio" placeholder="Ej: Manada Seeonee" />
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
import { TIPOS_SECCION_INFO } from '@/utils/constants'


const store = useOrganizationStore()
const cargando = ref(true)
const filtroGrupo = ref(null)
const showCreate = ref(false)
const guardando = ref(false)

const form = reactive({ id_grupo: null, id_tipo_seccion: null, nombre_propio: '' })

const columnas = [
  { key: 'nombre_propio', label: 'Nombre' },
  { key: 'tipo_seccion', label: 'Tipo' },
]

function seccionColor(tipo) {
  return TIPOS_SECCION_INFO[tipo]?.color || 'primary'
}

const filtered = computed(() => {
  let list = store.secciones
  if (filtroGrupo.value) {
    list = list.filter((s) => s.id_grupo === filtroGrupo.value)
  }
  return list
})

async function crear() {
  guardando.value = true
  try {
    await store.crearSeccion({ ...form })
    showCreate.value = false
    form.id_grupo = null
    form.id_tipo_seccion = null
    form.nombre_propio = ''
    await store.cargarSecciones()
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  await store.cargarSecciones()
  cargando.value = false
})
</script>
