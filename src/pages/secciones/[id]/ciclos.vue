<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <a href="/secciones" class="text-sm text-primary hover:underline mb-1 inline-block">← Secciones</a>
          <h1 class="text-2xl font-bold text-base-content">Ciclos de programa</h1>
        </div>
        <BaseButton variant="primary" size="sm" @click="showCreate = true">
          <Plus class="w-4 h-4 mr-1" /> Nuevo ciclo
        </BaseButton>
      </div>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />

      <template v-else>
        <div v-if="ciclos.length" class="space-y-4">
          <BaseCard v-for="c in ciclos" :key="c.id">
            <div class="flex items-center justify-between">
              <div>
                <a :href="`/ciclos/${c.id}/programas`" class="font-medium text-primary hover:underline text-lg">
                  {{ c.nombre }}
                </a>
                <p class="text-xs text-neutral mt-1">
                  {{ c.fecha_inicio ? new Date(c.fecha_inicio).toLocaleDateString('es-MX') : '—' }}
                  →
                  {{ c.fecha_fin ? new Date(c.fecha_fin).toLocaleDateString('es-MX') : '—' }}
                </p>
              </div>
              <BaseBadge :color="c.activo ? 'success' : 'neutral'" outline>
                {{ c.activo ? 'Activo' : 'Inactivo' }}
              </BaseBadge>
            </div>
          </BaseCard>
        </div>
        <EmptyState v-else titulo="Sin ciclos" descripcion="Crea el primer ciclo de programa" />
      </template>

      <BaseModal :open="showCreate" title="Nuevo ciclo" @close="showCreate = false">
        <form class="space-y-4" @submit.prevent="crearCiclo">
          <FormField label="Nombre" required>
            <BaseInput v-model="form.nombre" placeholder="Ej: Ciclo 2025-1" />
          </FormField>
          <FormField label="Responsable">
            <CatalogoAutocomplete v-model="form.id_responsable" catalogo="perfiles" :items="[]" placeholder="Buscar responsable…" />
          </FormField>
          <FormField label="Categoría de desarrollo">
            <CatalogoAutocomplete v-model="form.id_categoria_desarrollo" catalogo="categorias-desarrollo" :items="[]" placeholder="Seleccionar…" />
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Plus } from '@lucide/vue'
import { operationService } from '@/services/operation.service'


const route = useRoute()
const cargando = ref(true)
const ciclos = ref([])
const showCreate = ref(false)
const guardando = ref(false)
const form = reactive({ nombre: '', id_responsable: null, id_categoria_desarrollo: null })

async function cargar() {
  cargando.value = true
  try {
    const res = await operationService.getCiclos(route.params.id)
    ciclos.value = res.data || []
  } finally {
    cargando.value = false
  }
}

async function crearCiclo() {
  guardando.value = true
  try {
    await operationService.createCiclo(route.params.id, { ...form })
    showCreate.value = false
    form.nombre = ''
    form.id_responsable = null
    form.id_categoria_desarrollo = null
    await cargar()
  } finally {
    guardando.value = false
  }
}

onMounted(cargar)
</script>
