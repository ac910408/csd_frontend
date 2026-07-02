<template>
  <DashboardLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-highlighted mb-6">Mi Perfil</h1>

      <UCard>
        <h2 class="text-lg font-medium mb-4">Datos personales</h2>

        <UAlert
          v-if="error"
          color="error"
          icon="i-lucide-circle-alert"
          :title="error"
          :close="{ onClick: () => (error = '') }"
          class="mb-4"
        />

        <UAlert
          v-if="exito"
          color="success"
          icon="i-lucide-circle-check"
          :title="exito"
          :close="{ onClick: () => (exito = '') }"
          class="mb-4"
        />

        <form v-if="!cargandoInicial" class="space-y-4" @submit.prevent="guardar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Nombre" :error="errors.nombre" required>
              <UInput
                v-model="form.nombre"
                placeholder="Tu nombre"
                color="neutral"
                :class="{ 'border-error': errors.nombre }"
                @blur="tocar('nombre', form.nombre)"
              />
            </UFormField>

            <UFormField label="Apellido paterno" :error="errors.apellido_paterno" required>
              <UInput
                v-model="form.apellido_paterno"
                placeholder="Apellido paterno"
                color="neutral"
                :class="{ 'border-error': errors.apellido_paterno }"
                @blur="tocar('apellido_paterno', form.apellido_paterno)"
              />
            </UFormField>
          </div>

          <UFormField label="Apellido materno" :error="errors.apellido_materno">
            <UInput
              v-model="form.apellido_materno"
              placeholder="Apellido materno"
              color="neutral"
              @blur="tocar('apellido_materno', form.apellido_materno)"
            />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="CUM">
              <UInput
                v-model="form.cum"
                placeholder="ASO1234567"
                color="neutral"
                :class="{ 'border-error': errors.cum }"
                @blur="tocar('cum', form.cum)"
              />
            </UFormField>

            <UFormField label="Género">
              <select
                v-model="form.genero"
                class="w-full px-3 py-2 text-sm bg-default border border-default rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary"
              >
                <option value="">Sin especificar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </UFormField>
          </div>

          <UFormField label="Fecha de nacimiento">
            <UInput v-model="form.fecha_nacimiento" type="date" color="neutral" />
          </UFormField>

          <UFormField label="Lugar de nacimiento">
            <UInput v-model="form.lugar_nacimiento" placeholder="Ciudad, Estado" color="neutral" />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Grupo">
              <CatalogoAutocomplete
                v-model="form.id_grupo"
                catalogo="grupos"
                endpoint="/grupos"
                :items="[]"
                placeholder="Buscar grupo…"
              />
            </UFormField>

            <UFormField label="Religión">
              <CatalogoAutocomplete
                v-model="form.id_religion"
                catalogo="cat_religion"
                :items="[]"
                placeholder="Buscar religión…"
                :expandible="true"
                tabla-destino="cat_religion"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UFormField label="Calle">
              <UInput v-model="form.calle" placeholder="Calle" color="neutral" />
            </UFormField>
            <UFormField label="Número exterior">
              <UInput v-model="form.num_exterior" placeholder="#" color="neutral" />
            </UFormField>
            <UFormField label="Colonia">
              <CatalogoAutocomplete
                v-model="form.id_colonia"
                catalogo="colonias"
                :items="[]"
                placeholder="Buscar colonia…"
              />
            </UFormField>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <UButton
              type="submit"
              color="primary"
              :loading="guardando"
              :disabled="!!Object.values(errors).find(Boolean)"
            >
              Guardar
            </UButton>
          </div>
        </form>

        <div v-else class="flex justify-center py-8">
          <USkeleton class="h-8 w-32" />
        </div>
      </UCard>

      <!-- Enlace a salud -->
      <div class="mt-4 text-center">
        <a href="/perfil/salud" class="text-sm text-primary hover:underline font-medium">
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
