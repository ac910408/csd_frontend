<template>
  <form class="space-y-4" @submit.prevent="guardar">
    <FormField label="Tipo de acta" required>
      <select
        v-model="form.tipo_acta"
        class="w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-contrast focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
      >
        <option value="ordinaria">Ordinaria</option>
        <option value="extraordinaria">Extraordinaria</option>
        <option value="consejo_unidad">Consejo de Unidad</option>
        <option value="consejo_grupo">Consejo de Grupo</option>
      </select>
    </FormField>
    <FormField label="Fecha" required>
      <BaseInput v-model="form.fecha" type="datetime-local" />
    </FormField>
    <FormField label="Orden del día" required>
      <textarea
        v-model="form.orden_del_dia"
        rows="4"
        class="w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-contrast resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
        placeholder="Puntos a tratar…"
      />
    </FormField>
    <FormField label="Acuerdos">
      <textarea
        v-model="form.acuerdos"
        rows="4"
        class="w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-contrast resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
        placeholder="Acuerdos tomados…"
      />
    </FormField>
    <div class="grid grid-cols-2 gap-4">
      <FormField label="Preside"
        ><CatalogoAutocomplete
          v-model="form.id_preside"
          catalogo="perfiles"
          :items="[]"
          placeholder="Buscar…"
      /></FormField>
      <FormField label="Elabora"
        ><CatalogoAutocomplete
          v-model="form.id_elabora"
          catalogo="perfiles"
          :items="[]"
          placeholder="Buscar…"
      /></FormField>
    </div>
    <FormField label="Asistencia">
      <div class="space-y-2 max-h-40 overflow-y-auto border border-base-200 rounded-lg p-3">
        <label v-for="m in miembros" :key="m.id_perfil" class="flex items-center gap-2 text-sm">
          <input v-model="asistencia[m.id_perfil]" type="checkbox" class="rounded" />
          {{ m.nombre || `Perfil #${m.id_perfil}` }}
        </label>
        <p v-if="!miembros.length" class="text-xs text-neutral">Cargando miembros…</p>
      </div>
    </FormField>
    <div class="flex justify-end gap-3 pt-2">
      <BaseButton variant="ghost" size="sm" @click="$emit('cancelar')">Cancelar</BaseButton>
      <BaseButton variant="primary" type="submit" size="sm" :loading="guardando"
        >Guardar acta</BaseButton
      >
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { operationService } from '@/services/operation.service'
const props = defineProps({ seccionId: { type: Number, required: true } })
const emit = defineEmits(['guardada', 'cancelar'])
const guardando = ref(false)
const miembros = ref([])
const asistencia = reactive({})
const form = reactive({
  tipo_acta: 'ordinaria',
  fecha: new Date().toISOString().slice(0, 16),
  orden_del_dia: '',
  acuerdos: '',
  id_preside: null,
  id_elabora: null,
})
async function guardar() {
  guardando.value = true
  try {
    const res = await operationService.createActa(props.seccionId, {
      ...form,
      fecha: form.fecha ? new Date(form.fecha).toISOString() : undefined,
    })
    for (const [id, p] of Object.entries(asistencia)) {
      if (p)
        await operationService.registrarAsistenciaActa(res.data.id, {
          id_perfil: Number(id),
          presente: true,
        })
    }
    emit('guardada')
  } finally {
    guardando.value = false
  }
}
onMounted(async () => {
  try {
    miembros.value = (await operationService.getMiembros(props.seccionId)).data || []
  } catch {
    miembros.value = []
  }
})
</script>
