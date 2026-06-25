<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto">
      <a :href="`/ciclos/${programa?.id_ciclo}/programas`" class="text-sm text-primary hover:underline mb-4 inline-block">← Volver a programas</a>
      <h1 class="text-2xl font-bold text-base-content mb-6">Protocolo de Traslado</h1>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />

      <template v-else>
        <AlertMessage v-if="exito" type="success" :mensaje="exito" class="mb-4" />

        <BaseCard class="mb-6">
          <template #header><h2 class="text-lg">{{ programa?.nombre || 'Programa' }}</h2></template>
          <form class="space-y-4" @submit.prevent="guardar">
            <FormField label="Origen">
              <BaseInput v-model="form.origen" placeholder="Punto de partida" />
            </FormField>
            <FormField label="Destino">
              <BaseInput v-model="form.destino" placeholder="Punto de llegada" />
            </FormField>
            <FormField label="Tipo de transporte">
              <select v-model="form.tipo_transporte" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm">
                <option value="">Seleccionar…</option>
                <option value="contratado">Contratado</option>
                <option value="particular">Particular</option>
                <option value="publico">Público</option>
                <option value="aereo">Aéreo</option>
              </select>
            </FormField>
            <FormField label="Ruta">
              <textarea v-model="form.ruta" rows="2" class="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Descripción de la ruta…" />
            </FormField>
            <BaseButton type="submit" variant="primary" :loading="guardando">Guardar</BaseButton>
          </form>
        </BaseCard>

        <!-- Pasajeros -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg">Pasajeros</h2>
              <BaseButton variant="primary" size="sm" @click="showAdd = true">
                <Plus class="w-4 h-4 mr-1" /> Agregar
              </BaseButton>
            </div>
          </template>
          <div v-if="pasajeros.length" class="space-y-2">
            <div v-for="p in pasajeros" :key="p.id_perfil" class="flex items-center justify-between px-3 py-2 bg-base-200 rounded-lg text-sm">
              <span class="text-base-content">{{ p.nombre || p.cum }}</span>
              <span class="text-neutral text-xs">{{ p.seccion }}</span>
            </div>
          </div>
          <EmptyState v-else titulo="Sin pasajeros" />
        </BaseCard>

        <BaseModal :open="showAdd" title="Agregar pasajero" @close="showAdd = false">
          <form class="space-y-4" @submit.prevent="agregar">
            <FormField label="Perfil" required>
              <CatalogoAutocomplete v-model="nuevo.id_perfil" catalogo="perfiles" :items="[]" placeholder="Buscar…" />
            </FormField>
            <FormField label="Sección">
              <BaseInput v-model="nuevo.seccion" placeholder="Nombre de sección" />
            </FormField>
            <FormField label="CUM">
              <BaseInput v-model="nuevo.cum" placeholder="ASO1234567" />
            </FormField>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" size="sm" @click="showAdd = false">Cancelar</BaseButton>
              <BaseButton type="submit" variant="primary" size="sm">Agregar</BaseButton>
            </div>
          </form>
        </BaseModal>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Plus } from '@lucide/vue'
import { operationService } from '@/services/operation.service'


const route = useRoute()
const cargando = ref(true)
const guardando = ref(false)
const programa = ref(null)
const pasajeros = ref([])
const exito = ref('')
const showAdd = ref(false)

const form = reactive({ origen: '', destino: '', tipo_transporte: '', ruta: '' })
const nuevo = reactive({ id_perfil: null, seccion: '', cum: '' })

async function guardar() {
  guardando.value = true
  try {
    await operationService.saveTraslado(route.params.id, { ...form })
    exito.value = 'Protocolo de traslado guardado'
  } finally {
    guardando.value = false
  }
}

async function agregar() {
  try {
    await operationService.addPasajero(route.params.id, { ...nuevo })
    showAdd.value = false
    nuevo.id_perfil = null
    nuevo.seccion = ''
    nuevo.cum = ''
    await cargarPasajeros()
  } catch { /* ignorar */ }
}

async function cargarPasajeros() {
  try {
    const res = await operationService.getPasajeros(route.params.id)
    pasajeros.value = res.data || []
  } catch { pasajeros.value = [] }
}

onMounted(async () => {
  try {
    const res = await operationService.getTraslado(route.params.id)
    programa.value = res.data
    if (res.data) Object.assign(form, res.data)
    await cargarPasajeros()
  } finally {
    cargando.value = false
  }
})
</script>
