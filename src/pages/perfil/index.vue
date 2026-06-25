<template>
  <DashboardLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-base-content mb-6">Mi Perfil</h1>

      <BaseCard>
        <template #header>
          <h2 class="text-lg">Datos personales</h2>
        </template>

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

        <form v-if="!cargandoInicial" class="space-y-4" @submit.prevent="guardar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nombre" :error="errors.nombre" required>
              <BaseInput
                v-model="form.nombre"
                placeholder="Tu nombre"
                :error="errors.nombre"
                @blur="tocar('nombre', form.nombre)"
              />
            </FormField>

            <FormField label="Apellido paterno" :error="errors.apellido_paterno" required>
              <BaseInput
                v-model="form.apellido_paterno"
                placeholder="Apellido paterno"
                :error="errors.apellido_paterno"
                @blur="tocar('apellido_paterno', form.apellido_paterno)"
              />
            </FormField>
          </div>

          <FormField label="Apellido materno" :error="errors.apellido_materno">
            <BaseInput
              v-model="form.apellido_materno"
              placeholder="Apellido materno"
              @blur="tocar('apellido_materno', form.apellido_materno)"
            />
          </FormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="CUM">
              <BaseInput
                v-model="form.cum"
                placeholder="ASO1234567"
                :error="errors.cum"
                @blur="tocar('cum', form.cum)"
              />
            </FormField>

            <FormField label="Género">
              <select
                v-model="form.genero"
                class="w-full px-3 py-2 text-sm bg-base-100 border border-base-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary"
              >
                <option value="">Sin especificar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </FormField>
          </div>

          <FormField label="Fecha de nacimiento">
            <BaseInput v-model="form.fecha_nacimiento" type="date" />
          </FormField>

          <FormField label="Lugar de nacimiento">
            <BaseInput
              v-model="form.lugar_nacimiento"
              placeholder="Ciudad, Estado"
            />
          </FormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Grupo">
              <CatalogoAutocomplete
                v-model="form.id_grupo"
                catalogo="grupos"
                :items="[]"
                placeholder="Buscar grupo…"
              />
            </FormField>

            <FormField label="Religión">
              <CatalogoAutocomplete
                v-model="form.id_religion"
                catalogo="cat_religion"
                :items="[]"
                placeholder="Buscar religión…"
                :expandible="true"
                tabla-destino="cat_religion"
              />
            </FormField>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Calle">
              <BaseInput v-model="form.calle" placeholder="Calle" />
            </FormField>
            <FormField label="Número exterior">
              <BaseInput v-model="form.num_exterior" placeholder="#" />
            </FormField>
            <FormField label="Colonia">
              <CatalogoAutocomplete
                v-model="form.id_colonia"
                catalogo="colonias"
                :items="[]"
                placeholder="Buscar colonia…"
              />
            </FormField>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="guardando"
              :disabled="!!Object.values(errors).find(Boolean)"
            >
              Guardar
            </BaseButton>
          </div>
        </form>

        <BaseSpinner v-else class="mx-auto py-8" size="lg" />
      </BaseCard>

      <!-- Enlace a salud -->
      <div class="mt-4 text-center">
        <a
          href="/perfil/salud"
          class="text-sm text-primary hover:underline font-medium"
        >
          Ficha médica →
        </a>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useForm } from '@/utils/validators'


const store = useUserStore()
const cargandoInicial = ref(true)
const guardando = ref(false)
const error = ref('')
const exito = ref('')

const form = reactive({
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  cum: '',
  genero: '',
  fecha_nacimiento: '',
  lugar_nacimiento: '',
  id_grupo: null,
  id_religion: null,
  calle: '',
  num_exterior: '',
  id_colonia: null,
})

const reglas = {
  nombre: { requerido: true, maxLength: 100 },
  apellido_paterno: { requerido: true, maxLength: 100 },
  apellido_materno: { maxLength: 100 },
  cum: { cum: true },
}

const { errors, tocar, validarTodo } = useForm(reglas)

async function cargar() {
  cargandoInicial.value = true
  try {
    await store.cargarPerfil()
    if (store.perfil) {
      Object.assign(form, {
        nombre: store.perfil.nombre || '',
        apellido_paterno: store.perfil.apellido_paterno || '',
        apellido_materno: store.perfil.apellido_materno || '',
        cum: store.perfil.cum || '',
        genero: store.perfil.genero || '',
        fecha_nacimiento: store.perfil.fecha_nacimiento
          ? new Date(store.perfil.fecha_nacimiento).toISOString().split('T')[0]
          : '',
        lugar_nacimiento: store.perfil.lugar_nacimiento || '',
        id_grupo: store.perfil.id_grupo || null,
        id_religion: store.perfil.id_religion || null,
        calle: store.perfil.calle || '',
        num_exterior: store.perfil.num_exterior || '',
        id_colonia: store.perfil.id_colonia || null,
      })
    }
  } catch (e) {
    error.value = e?.mensaje || 'Error al cargar perfil'
  } finally {
    cargandoInicial.value = false
  }
}

async function guardar() {
  if (!validarTodo(form)) return
  guardando.value = true
  error.value = ''
  exito.value = ''
  try {
    await store.guardarPerfil({
      ...form,
      fecha_nacimiento: form.fecha_nacimiento
        ? new Date(form.fecha_nacimiento).getTime()
        : undefined,
    })
    exito.value = 'Perfil guardado correctamente'
  } catch (e) {
    error.value = e?.mensaje || 'Error al guardar'
  } finally {
    guardando.value = false
  }
}

onMounted(cargar)
</script>
