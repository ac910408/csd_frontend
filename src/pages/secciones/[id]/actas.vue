<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <a :href="`/secciones/${seccionId}`" class="text-sm text-primary hover:underline mb-1 inline-block">← Sección</a>
          <h1 class="text-2xl font-bold text-base-content">Actas de Consejo</h1>
        </div>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" /> Nueva acta
        </BaseButton>
      </div>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />

      <template v-else>
        <div v-if="actas.length" class="space-y-3">
          <BaseCard v-for="a in actas" :key="a.id">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-base-content">{{ a.tipo_acta }}</p>
                <p class="text-xs text-neutral">
                  {{ a.fecha ? new Date(a.fecha).toLocaleDateString('es-MX', { dateStyle: 'long' }) : '—' }}
                </p>
              </div>
              <BaseBadge color="info" outline>{{ a.tipo_acta }}</BaseBadge>
            </div>
            <div v-if="a.acuerdos" class="mt-2 text-sm text-base-content">
              <p class="text-neutral text-xs mb-1">Acuerdos:</p>
              <p class="whitespace-pre-wrap">{{ a.acuerdos }}</p>
            </div>
          </BaseCard>
        </div>
        <EmptyState v-else titulo="Sin actas" descripcion="Crea la primera acta de consejo" />
      </template>

      <BaseModal :open="showCreate" title="Nueva acta" size="lg" @close="showCreate = false">
        <CouncilMinuteForm
          :seccion-id="Number(seccionId)"
          @guardada="onGuardada"
          @cancelar="showCreate = false"
        />
      </BaseModal>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Plus } from '@lucide/vue'
import { operationService } from '@/services/operation.service'


const route = useRoute()
const cargando = ref(true)
const actas = ref([])
const showCreate = ref(false)
const seccionId = route.params.id

async function cargar() {
  cargando.value = true
  try {
    const res = await operationService.getActas(seccionId)
    actas.value = res.data || []
  } finally {
    cargando.value = false
  }
}

function onGuardada() {
  showCreate.value = false
  cargar()
}

onMounted(cargar)
</script>
