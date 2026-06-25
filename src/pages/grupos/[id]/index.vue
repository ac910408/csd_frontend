<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <BaseSpinner v-if="cargando" class="mx-auto py-12" size="lg" />

      <template v-else-if="grupo">
        <a href="/grupos" class="text-sm text-primary hover:underline mb-4 inline-block">
          ← Volver a grupos
        </a>

        <h1 class="text-2xl font-bold text-base-content mb-2">
          Grupo {{ grupo.numero }} — {{ grupo.nombre }}
        </h1>

        <BaseCard class="mb-6">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg">Secciones</h2>
              <BaseButton variant="primary" size="sm" @click="showCreate = true">
                <Plus class="w-4 h-4 mr-1" /> Nueva sección
              </BaseButton>
            </div>
          </template>

          <div v-if="secciones.length" class="divide-y divide-base-200">
            <div
              v-for="s in secciones"
              :key="s.id"
              class="flex items-center justify-between py-3 px-1"
            >
              <div>
                <a :href="`/secciones/${s.id}`" class="font-medium text-primary hover:underline">
                  {{ s.nombre_propio || s.tipo_seccion }}
                </a>
                <p class="text-xs text-neutral">{{ s.tipo_seccion }}</p>
              </div>
              <BaseBadge :color="seccionColor(s.tipo_seccion)" outline>
                {{ s.tipo_seccion }}
              </BaseBadge>
            </div>
          </div>
          <EmptyState v-else titulo="Sin secciones" />
        </BaseCard>

        <BaseModal :open="showCreate" title="Nueva sección" @close="showCreate = false">
          <form class="space-y-4" @submit.prevent="crearSeccion">
            <FormField label="Tipo de sección" required>
              <CatalogoAutocomplete
                v-model="formSeccion.id_tipo_seccion"
                catalogo="tipos-seccion"
                :items="[]"
                placeholder="Seleccionar tipo…"
              />
            </FormField>
            <FormField label="Nombre propio">
              <BaseInput v-model="formSeccion.nombre_propio" placeholder="Ej: Manada Seeonee" />
            </FormField>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" size="sm" @click="showCreate = false">Cancelar</BaseButton>
              <BaseButton type="submit" variant="primary" size="sm" :loading="guardando">Crear</BaseButton>
            </div>
          </form>
        </BaseModal>
      </template>

      <EmptyState v-else titulo="Grupo no encontrado" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Plus } from '@lucide/vue'
import { useOrganizationStore } from '@/stores/organization.store'
import { TIPOS_SECCION_INFO } from '@/utils/constants'


const route = useRoute()
const store = useOrganizationStore()
const cargando = ref(true)
const grupo = ref(null)
const secciones = ref([])
const showCreate = ref(false)
const guardando = ref(false)

const formSeccion = reactive({ id_tipo_seccion: null, nombre_propio: '' })

function seccionColor(tipo) {
  return TIPOS_SECCION_INFO[tipo]?.color || 'primary'
}

async function crearSeccion() {
  guardando.value = true
  try {
    await store.crearSeccion({
      id_grupo: grupo.value.id,
      ...formSeccion,
    })
    showCreate.value = false
    formSeccion.id_tipo_seccion = null
    formSeccion.nombre_propio = ''
    await cargar()
  } finally {
    guardando.value = false
  }
}

async function cargar() {
  cargando.value = true
  try {
    grupo.value = await store.getGrupo(route.params.id)
    await store.cargarSecciones({ grupo_id: route.params.id })
    secciones.value = store.secciones
  } finally {
    cargando.value = false
  }
}

onMounted(cargar)
</script>
