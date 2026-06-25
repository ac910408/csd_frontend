<template>
  <DashboardLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-base-content mb-6">Ficha Médica</h1>

      <AlertMessage
        v-if="error"
        type="error"
        :mensaje="error"
        cerrable
        class="mb-4"
        @cerrar="error = ''"
      />

      <AlertMessage
        v-if="exito"
        type="success"
        :mensaje="exito"
        cerrable
        class="mb-4"
        @cerrar="exito = ''"
      />

      <!-- Datos básicos -->
      <HealthSection title="Datos básicos" :cargando="cargando">
        <form class="space-y-4" @submit.prevent="guardarBasico">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Tipo de sangre">
              <CatalogoAutocomplete
                v-model="basico.id_tipo_sangre"
                catalogo="cat_tipo_sangre"
                :items="[]"
                placeholder="Seleccionar…"
              />
            </FormField>

            <FormField label="Alimentación">
              <CatalogoAutocomplete
                v-model="basico.id_alimentacion"
                catalogo="cat_alimentacion"
                :items="[]"
                placeholder="Seleccionar…"
                :expandible="true"
                tabla-destino="cat_alimentacion"
              />
            </FormField>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Peso (kg)">
              <BaseInput v-model.number="basico.peso_kg" type="number" placeholder="70" />
            </FormField>
            <FormField label="Talla (cm)">
              <BaseInput v-model.number="basico.talla_cm" type="number" placeholder="170" />
            </FormField>
          </div>

          <FormField label="Alerta médica">
            <BaseInput v-model="basico.alerta_medica" placeholder="Ej: alérgico a penicilina" />
          </FormField>

          <FormField label="Tratamientos actuales">
            <BaseInput v-model="basico.tratamientos" placeholder="Medicamentos o terapias" />
          </FormField>

          <FormField label="Observaciones">
            <BaseInput v-model="basico.observaciones" placeholder="Notas adicionales" />
          </FormField>

          <div class="flex justify-end">
            <BaseButton type="submit" variant="primary" :loading="guardandoBasico">
              Guardar
            </BaseButton>
          </div>
        </form>
      </HealthSection>

      <!-- Alergias -->
      <HealthSection title="Alergias" :cargando="cargando">
        <div v-if="store.alergias.length" class="space-y-2 mb-4">
          <div
            v-for="a in store.alergias"
            :key="a.id_alergeno"
            class="flex items-center justify-between px-3 py-2 bg-base-200 rounded-lg text-sm"
          >
            <span class="text-base-content">{{ a.alergeno_nombre }}</span>
            <BaseBadge :color="severidadColor(a.severidad)" outline>
              {{ a.severidad }}
            </BaseBadge>
          </div>
        </div>
        <EmptyState v-else titulo="Sin alergias" descripcion="Agrega alergias del perfil" />

        <form class="flex gap-2 mt-4" @submit.prevent="agregarAlergia">
          <CatalogoAutocomplete
            v-model="nuevaAlergia.id_alergeno"
            catalogo="cat_alergeno"
            :items="[]"
            placeholder="Alérgeno…"
            :expandible="true"
            tabla-destino="cat_alergeno"
            class="flex-1"
          />
          <select
            v-model="nuevaAlergia.severidad"
            class="px-3 py-2 text-sm bg-base-100 border border-base-300 rounded-lg"
          >
            <option value="leve">Leve</option>
            <option value="moderada">Moderada</option>
            <option value="severa">Severa</option>
          </select>
          <BaseButton type="submit" variant="primary" size="sm" :disabled="!nuevaAlergia.id_alergeno">
            <Plus class="w-4 h-4" />
          </BaseButton>
        </form>
      </HealthSection>

      <!-- Antecedentes -->
      <HealthSection title="Antecedentes médicos" :cargando="cargando">
        <div v-if="store.antecedentes.length" class="space-y-2 mb-4">
          <div
            v-for="a in store.antecedentes"
            :key="a.id_antecedente"
            class="flex items-center justify-between px-3 py-2 bg-base-200 rounded-lg text-sm"
          >
            <span class="text-base-content">{{ a.antecedente_nombre }}</span>
            <BaseBadge :color="a.presenta ? 'error' : 'success'" outline>
              {{ a.presenta ? 'Presenta' : 'No presenta' }}
            </BaseBadge>
          </div>
        </div>
        <EmptyState v-else titulo="Sin antecedentes" descripcion="Registra antecedentes médicos" />

        <form class="flex gap-2 mt-4" @submit.prevent="agregarAntecedente">
          <CatalogoAutocomplete
            v-model="nuevoAntecedente.id_antecedente"
            catalogo="cat_antecedente"
            :items="[]"
            placeholder="Antecedente…"
            :expandible="true"
            tabla-destino="cat_antecedente"
            class="flex-1"
          />
          <label class="flex items-center gap-1 text-sm">
            <input v-model="nuevoAntecedente.presenta" type="checkbox" class="rounded" />
            Presenta
          </label>
          <BaseButton type="submit" variant="primary" size="sm" :disabled="!nuevoAntecedente.id_antecedente">
            <Plus class="w-4 h-4" />
          </BaseButton>
        </form>
      </HealthSection>

      <!-- Vacunas -->
      <HealthSection title="Vacunas" :cargando="cargando">
        <div v-if="store.vacunas.length" class="space-y-2 mb-4">
          <div
            v-for="v in store.vacunas"
            :key="v.id_vacuna"
            class="flex items-center justify-between px-3 py-2 bg-base-200 rounded-lg text-sm"
          >
            <span class="text-base-content">{{ v.vacuna_nombre }}</span>
            <BaseBadge :color="v.aplico ? 'success' : 'warning'" outline>
              {{ v.aplico ? 'Aplicada' : v.padecio ? 'Padeció' : 'Pendiente' }}
            </BaseBadge>
          </div>
        </div>
        <EmptyState v-else titulo="Sin vacunas" descripcion="Registra vacunas aplicadas o padecidas" />

        <form class="flex gap-2 mt-4" @submit.prevent="agregarVacuna">
          <CatalogoAutocomplete
            v-model="nuevaVacuna.id_vacuna"
            catalogo="cat_vacuna"
            :items="[]"
            placeholder="Vacuna…"
            :expandible="true"
            tabla-destino="cat_vacuna"
            class="flex-1"
          />
          <label class="flex items-center gap-1 text-sm">
            <input v-model="nuevaVacuna.aplico" type="checkbox" class="rounded" />
            Aplicó
          </label>
          <BaseButton type="submit" variant="primary" size="sm" :disabled="!nuevaVacuna.id_vacuna">
            <Plus class="w-4 h-4" />
          </BaseButton>
        </form>
      </HealthSection>

      <!-- Contactos de emergencia -->
      <HealthSection title="Contactos de emergencia" :cargando="cargando">
        <div v-if="store.contactos.length" class="space-y-2 mb-4">
          <div
            v-for="c in store.contactos"
            :key="c.id_contacto"
            class="px-3 py-2 bg-base-200 rounded-lg text-sm"
          >
            <p class="font-medium text-base-content">{{ c.nombre }}</p>
            <p class="text-neutral">{{ c.telefono }} · {{ c.parentesco }}</p>
          </div>
        </div>
        <EmptyState v-else titulo="Sin contactos" descripcion="Agrega contactos de emergencia" />
      </HealthSection>

      <!-- Afiliaciones -->
      <HealthSection title="Afiliaciones médicas" :cargando="cargando">
        <div v-if="store.afiliaciones.length" class="space-y-2 mb-4">
          <div
            v-for="a in store.afiliaciones"
            :key="a.id"
            class="px-3 py-2 bg-base-200 rounded-lg text-sm"
          >
            <p class="font-medium text-base-content">{{ a.proveedor_nombre }}</p>
            <p class="text-neutral">Póliza: {{ a.numero_poliza }} · {{ a.tipo_beneficiario }}</p>
          </div>
        </div>
        <EmptyState v-else titulo="Sin afiliaciones" descripcion="Registra tu seguro médico" />
      </HealthSection>

      <!-- Derecho al olvido -->
      <div class="mt-8 pt-4 border-t border-base-200">
        <BaseButton variant="ghost" color="error" size="sm" @click="showDelete = true">
          <Trash2 class="w-4 h-4 mr-1" />
          Derecho al olvido (borrar ficha médica)
        </BaseButton>
      </div>

      <ConfirmDialog
        :open="showDelete"
        titulo="Derecho al olvido"
        mensaje="¿Estás seguro de eliminar toda tu ficha médica? Esta acción no se puede deshacer."
        confirmar-label="Eliminar ficha médica"
        color="error"
        @confirmar="eliminarSalud"
        @cancelar="showDelete = false"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Trash2 } from '@lucide/vue'
import { useUserStore } from '@/stores/user.store'


const store = useUserStore()
const cargando = ref(true)
const error = ref('')
const exito = ref('')
const showDelete = ref(false)
const guardandoBasico = ref(false)

const basico = reactive({
  id_tipo_sangre: null,
  id_alimentacion: null,
  peso_kg: null,
  talla_cm: null,
  alerta_medica: '',
  tratamientos: '',
  observaciones: '',
})

const nuevaAlergia = reactive({ id_alergeno: null, severidad: 'leve' })
const nuevoAntecedente = reactive({ id_antecedente: null, presenta: false })
const nuevaVacuna = reactive({ id_vacuna: null, aplico: false })

function severidadColor(sev) {
  return sev === 'severa' ? 'error' : sev === 'moderada' ? 'warning' : 'info'
}

async function cargar() {
  cargando.value = true
  try {
    await store.cargarTodo()
    if (store.salud) {
      Object.assign(basico, {
        id_tipo_sangre: store.salud.id_tipo_sangre || null,
        id_alimentacion: store.salud.id_alimentacion || null,
        peso_kg: store.salud.peso_kg || null,
        talla_cm: store.salud.talla_cm || null,
        alerta_medica: store.salud.alerta_medica || '',
        tratamientos: store.salud.tratamientos || '',
        observaciones: store.salud.observaciones || '',
      })
    }
  } catch (e) {
    error.value = e?.mensaje || 'Error al cargar datos'
  } finally {
    cargando.value = false
  }
}

async function guardarBasico() {
  guardandoBasico.value = true
  try {
    await store.guardarSalud({ ...basico })
    exito.value = 'Datos básicos guardados'
  } catch (e) {
    error.value = e?.mensaje || 'Error al guardar'
  } finally {
    guardandoBasico.value = false
  }
}

async function agregarAlergia() {
  try {
    await store.addAlergia({ ...nuevaAlergia })
    nuevaAlergia.id_alergeno = null
    exito.value = 'Alergia agregada'
  } catch (e) {
    error.value = e?.mensaje || 'Error al agregar'
  }
}

async function agregarAntecedente() {
  try {
    await store.addAntecedente({ ...nuevoAntecedente })
    nuevoAntecedente.id_antecedente = null
    exito.value = 'Antecedente registrado'
  } catch (e) {
    error.value = e?.mensaje || 'Error al agregar'
  }
}

async function agregarVacuna() {
  try {
    await store.addVacuna({ ...nuevaVacuna })
    nuevaVacuna.id_vacuna = null
    exito.value = 'Vacuna registrada'
  } catch (e) {
    error.value = e?.mensaje || 'Error al agregar'
  }
}

async function eliminarSalud() {
  showDelete.value = false
  try {
    await store.eliminarSalud()
    exito.value = 'Ficha médica eliminada'
  } catch (e) {
    error.value = e?.mensaje || 'Error al eliminar'
  }
}

onMounted(cargar)
</script>
