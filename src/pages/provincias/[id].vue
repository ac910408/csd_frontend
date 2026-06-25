<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <BaseSpinner v-if="cargando" class="mx-auto py-12" size="lg" />

      <template v-else-if="provincia">
        <a href="/provincias" class="text-sm text-primary hover:underline mb-4 inline-block">
          ← Volver a provincias
        </a>

        <h1 class="text-2xl font-bold text-base-content mb-2">{{ provincia.nombre }}</h1>
        <p class="text-sm text-neutral mb-6">Clave: {{ provincia.clave }}</p>

        <BaseCard class="mb-6">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg">Grupos</h2>
              <BaseButton variant="primary" size="sm" @click="showCreate = true">
                <Plus class="w-4 h-4 mr-1" /> Nuevo grupo
              </BaseButton>
            </div>
          </template>

          <div v-if="grupos.length" class="divide-y divide-base-200">
            <div
              v-for="g in grupos"
              :key="g.id"
              class="flex items-center justify-between py-3 px-1"
            >
              <div>
                <a
                  :href="`/grupos/${g.id}`"
                  class="font-medium text-primary hover:underline"
                >
                  Grupo {{ g.numero }} — {{ g.nombre }}
                </a>
              </div>
              <BaseBadge color="info" outline>{{ g.numero }}</BaseBadge>
            </div>
          </div>
          <EmptyState v-else titulo="Sin grupos" descripcion="Esta provincia aún no tiene grupos" />
        </BaseCard>

        <!-- Modal crear grupo -->
        <BaseModal :open="showCreate" title="Nuevo grupo" @close="showCreate = false">
          <form class="space-y-4" @submit.prevent="crearGrupo">
            <FormField label="Número" required>
              <BaseInput v-model.number="formGrupo.numero" type="number" placeholder="1" />
            </FormField>
            <FormField label="Nombre" required>
              <BaseInput v-model="formGrupo.nombre" placeholder="Nombre del grupo" />
            </FormField>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" size="sm" @click="showCreate = false">Cancelar</BaseButton>
              <BaseButton type="submit" variant="primary" size="sm" :loading="guardando">Crear</BaseButton>
            </div>
          </form>
        </BaseModal>
      </template>

      <EmptyState v-else titulo="Provincia no encontrada" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Plus } from '@lucide/vue'
import { useOrganizationStore } from '@/stores/organization.store'


const route = useRoute()
const store = useOrganizationStore()
const cargando = ref(true)
const provincia = ref(null)
const grupos = ref([])
const showCreate = ref(false)
const guardando = ref(false)

const formGrupo = reactive({ numero: null, nombre: '' })

async function crearGrupo() {
  guardando.value = true
  try {
    await store.crearGrupo({
      id_provincia: provincia.value.id,
      ...formGrupo,
    })
    showCreate.value = false
    formGrupo.numero = null
    formGrupo.nombre = ''
    await cargar()
  } finally {
    guardando.value = false
  }
}

async function cargar() {
  cargando.value = true
  try {
    provincia.value = await store.getProvincia(route.params.id)
    await store.cargarGrupos({ provincia_id: route.params.id })
    grupos.value = store.grupos
  } finally {
    cargando.value = false
  }
}

onMounted(cargar)
</script>
