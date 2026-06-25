<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-base-content">Hoja de Caminata</h1>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" />
          Nueva acción
        </BaseButton>
      </div>

      <AlertMessage
        v-if="error"
        type="error"
        :mensaje="error"
        cerrable
        class="mb-4"
        @cerrar="error = ''"
      />

      <BaseSpinner v-if="cargando" class="mx-auto py-12" size="lg" />

      <template v-else>
        <!-- Timeline -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg">Acciones personales</h2>
              <FilterChips
                :opciones="filtros"
                :seleccionados="filtrosActivos"
                color="primary"
                @update:seleccionados="filtrosActivos = $event"
              />
            </div>
          </template>
          <ActivityTimeline :items="accionesFiltradas" color="primary" />
        </BaseCard>
      </template>

      <!-- Modal crear acción -->
      <BaseModal
        :open="showCreate"
        title="Nueva acción personal"
        size="lg"
        @close="showCreate = false"
      >
        <form class="space-y-4" @submit.prevent="crearAccion">
          <FormField label="Saber o competencia" required>
            <CatalogoAutocomplete
              v-model="nueva.id_saber"
              catalogo="saberes"
              :items="[]"
              placeholder="Buscar saber…"
            />
          </FormField>

          <FormField label="Ciclo de programa (opcional)">
            <CatalogoAutocomplete
              v-model="nueva.id_ciclo"
              catalogo="ciclos"
              :items="[]"
              placeholder="Buscar ciclo…"
            />
          </FormField>

          <FormField label="Descripción de la acción" required>
            <textarea
              v-model="nueva.descripcion"
              rows="3"
              class="w-full px-3 py-2 text-sm bg-base-100 border border-base-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary resize-none"
              placeholder="¿Qué vas a hacer?"
            />
          </FormField>

          <div class="flex justify-end gap-3 pt-2">
            <BaseButton variant="ghost" size="sm" @click="showCreate = false">
              Cancelar
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              size="sm"
              :loading="creando"
              :disabled="!nueva.id_saber || !nueva.descripcion"
            >
              Crear acción
            </BaseButton>
          </div>
        </form>
      </BaseModal>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@lucide/vue'
import { useProgresionStore } from '@/stores/progresion.store'


const store = useProgresionStore()
const cargando = ref(true)
const error = ref('')
const showCreate = ref(false)
const creando = ref(false)

const filtrosActivos = ref([])
const filtros = [
  { value: 'completado', label: 'Completadas' },
  { value: 'pendiente', label: 'Pendientes' },
]

const nueva = reactive({
  id_saber: null,
  id_ciclo: null,
  descripcion: '',
})

const accionesFiltradas = computed(() => {
  let lista = store.acciones.map((a) => ({
    titulo: a.descripcion,
    descripcion: a.inspiracion || a.sensacion || '',
    fecha: a.creado_el ? new Date(a.creado_el).toLocaleDateString('es-MX') : '',
    estado: a.completado ? 'completado' : 'en_progreso',
  }))

  if (filtrosActivos.value.length) {
    if (
      filtrosActivos.value.includes('completado') &&
      !filtrosActivos.value.includes('pendiente')
    ) {
      lista = lista.filter((a) => a.estado === 'completado')
    } else if (
      filtrosActivos.value.includes('pendiente') &&
      !filtrosActivos.value.includes('completado')
    ) {
      lista = lista.filter((a) => a.estado !== 'completado')
    }
  }

  return lista
})

async function cargar() {
  cargando.value = true
  try {
    await store.cargarAcciones()
  } catch (e) {
    error.value = e?.mensaje || 'Error al cargar acciones'
  } finally {
    cargando.value = false
  }
}

async function crearAccion() {
  creando.value = true
  try {
    await store.crearAccion({ ...nueva })
    showCreate.value = false
    nueva.id_saber = null
    nueva.id_ciclo = null
    nueva.descripcion = ''
  } catch (e) {
    error.value = e?.mensaje || 'Error al crear acción'
  } finally {
    creando.value = false
  }
}

onMounted(cargar)
</script>
