<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-base-content">Sugerencias de Catálogo</h1>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" /> Nueva invitación
        </BaseButton>
      </div>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />
      <template v-else>
        <!-- Pestañas -->
        <div class="flex gap-2 mb-4">
          <BaseButton :variant="tab === 'sugerencias' ? 'primary' : 'ghost'" size="sm" @click="tab = 'sugerencias'">
            Sugerencias
          </BaseButton>
          <BaseButton :variant="tab === 'invitaciones' ? 'primary' : 'ghost'" size="sm" @click="tab = 'invitaciones'">
            Invitaciones
          </BaseButton>
        </div>

        <!-- Sugerencias -->
        <template v-if="tab === 'sugerencias'">
          <div v-if="sugerencias.length" class="space-y-3">
            <BaseCard v-for="s in sugerencias" :key="s.id">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-base-content">{{ s.nombre }}</p>
                  <p class="text-xs text-neutral">{{ s.tabla }} · {{ s.estado }}</p>
                </div>
                <div v-if="s.estado === 'pendiente'" class="flex gap-2">
                  <BaseButton variant="success" size="xs" @click="resolver(s.id, 'aprobar')">Aprobar</BaseButton>
                  <BaseButton variant="danger" size="xs" @click="rechazarId = s.id; motivo = ''">Rechazar</BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>
          <EmptyState v-else titulo="Sin sugerencias pendientes" />
        </template>

        <!-- Invitaciones -->
        <template v-if="tab === 'invitaciones'">
          <div v-if="invitaciones.length" class="space-y-3">
            <BaseCard v-for="inv in invitaciones" :key="inv.id">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-base-content">{{ inv.correo_electronico }}</p>
                  <p class="text-xs text-neutral">Código: {{ inv.codigo }} · {{ inv.estado }}</p>
                </div>
                <BaseBadge :color="inv.estado === 'pendiente' ? 'warning' : inv.estado === 'usada' ? 'success' : 'error'" outline>
                  {{ inv.estado }}
                </BaseBadge>
              </div>
            </BaseCard>
          </div>
          <EmptyState v-else titulo="Sin invitaciones" />
        </template>

        <!-- Modal rechazar -->
        <BaseModal :open="!!rechazarId" title="Rechazar sugerencia" @close="rechazarId = null">
          <form class="space-y-4" @submit.prevent="confirmarRechazo">
            <FormField label="Motivo del rechazo" required>
              <textarea v-model="motivo" rows="3" class="w-full px-3 py-2 border border-base-300 rounded-lg text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Explica por qué se rechaza…" />
            </FormField>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" size="sm" @click="rechazarId = null">Cancelar</BaseButton>
              <BaseButton type="submit" variant="danger" size="sm">Rechazar</BaseButton>
            </div>
          </form>
        </BaseModal>

        <!-- Modal crear invitación -->
        <BaseModal :open="showCreate" title="Nueva invitación" @close="showCreate = false">
          <form class="space-y-4" @submit.prevent="crearInvitacion">
            <FormField label="Correo electrónico" required>
              <BaseInput v-model="invForm.correo_electronico" type="email" placeholder="nuevo@scout.com" />
            </FormField>
            <FormField label="Grupo" required>
              <CatalogoAutocomplete v-model="invForm.id_grupo" catalogo="grupos" endpoint="/grupos" :items="[]" placeholder="Seleccionar grupo…" />
            </FormField>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" size="sm" @click="showCreate = false">Cancelar</BaseButton>
              <BaseButton type="submit" variant="primary" size="sm">Generar código</BaseButton>
            </div>
          </form>
        </BaseModal>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@lucide/vue'
import { adminService } from '@/services/catalog.service'


const cargando = ref(true)
const tab = ref('sugerencias')
const sugerencias = ref([])
const invitaciones = ref([])
const showCreate = ref(false)
const rechazarId = ref(null)
const motivo = ref('')
const invForm = reactive({ correo_electronico: '', id_grupo: null })

async function resolver(id, accion) {
  try {
    await adminService.resolverSugerencia(id, { accion })
    await cargarSugerencias()
  } catch { /* */ }
}

async function confirmarRechazo() {
  try {
    await adminService.resolverSugerencia(rechazarId.value, { accion: 'rechazar', motivo_rechazo: motivo.value })
    rechazarId.value = null; motivo.value = ''
    await cargarSugerencias()
  } catch { /* */ }
}

async function crearInvitacion() {
  try {
    await adminService.createInvitacion({ ...invForm })
    showCreate.value = false
    invForm.correo_electronico = ''; invForm.id_grupo = null
    await cargarInvitaciones()
  } catch { /* */ }
}

async function cargarSugerencias() {
  try {
    const res = await adminService.getSugerenciasPendientes()
    sugerencias.value = res.data || []
  } catch { sugerencias.value = [] }
}

async function cargarInvitaciones() {
  try {
    const res = await adminService.getInvitaciones()
    invitaciones.value = res.data || []
  } catch { invitaciones.value = [] }
}

onMounted(async () => {
  await Promise.allSettled([cargarSugerencias(), cargarInvitaciones()])
  cargando.value = false
})
</script>
