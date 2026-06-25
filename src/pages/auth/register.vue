<template>
  <EmptyLayout>
    <div class="min-h-screen flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-base-content">CSD</h1>
          <p class="text-sm text-neutral mt-1">Crear cuenta</p>
        </div>

        <BaseCard>
          <h2 class="text-lg font-semibold text-base-content mb-6">Registro</h2>

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
            class="mb-4"
          />

          <form v-if="!exito" class="space-y-4" @submit.prevent="handleRegister">
            <FormField label="Nombre de usuario" :error="errors.nombre_usuario" required>
              <BaseInput
                v-model="form.nombre_usuario"
                placeholder="usuario123"
                :error="errors.nombre_usuario"
                @blur="tocar('nombre_usuario', form.nombre_usuario)"
              />
            </FormField>

            <FormField label="Correo electrónico" :error="errors.correo_electronico" required>
              <BaseInput
                v-model="form.correo_electronico"
                type="email"
                placeholder="tu@correo.com"
                :error="errors.correo_electronico"
                @blur="tocar('correo_electronico', form.correo_electronico)"
              />
            </FormField>

            <FormField label="Código de invitación" :error="errors.codigo_invitacion" required help="Código proporcionado por tu grupo o admin">
              <BaseInput
                v-model="form.codigo_invitacion"
                placeholder="ABCD1234"
                :error="errors.codigo_invitacion"
                @blur="tocar('codigo_invitacion', form.codigo_invitacion)"
              />
            </FormField>

            <FormField label="Contraseña" :error="errors.contrasena" required>
              <BaseInput
                v-model="form.contrasena"
                type="password"
                placeholder="Mínimo 6 caracteres"
                :error="errors.contrasena"
                @blur="tocar('contrasena', form.contrasena)"
              />
            </FormField>

            <FormField label="Confirmar contraseña" :error="errors.confirmar" required>
              <BaseInput
                v-model="form.confirmar"
                type="password"
                placeholder="Repite tu contraseña"
                :error="errors.confirmar"
                @blur="tocar('confirmar', form.confirmar)"
              />
            </FormField>

            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              class="w-full"
              :loading="cargando"
              :disabled="!!Object.values(errors).find(Boolean)"
            >
              Crear cuenta
            </BaseButton>
          </form>

          <div v-if="exito" class="text-center">
            <BaseButton
              variant="primary"
              size="lg"
              class="w-full mt-4"
              @click="router.push('/auth/login')"
            >
              Ir al inicio de sesión
            </BaseButton>
          </div>

          <p class="text-sm text-neutral text-center mt-4">
            ¿Ya tienes cuenta?
            <a href="/auth/login" class="text-primary hover:underline font-medium">
              Iniciar sesión
            </a>
          </p>
        </BaseCard>
      </div>
    </div>
  </EmptyLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useForm } from '@/utils/validators'


const router = useRouter()
const auth = useAuthStore()
const cargando = ref(false)
const error = ref('')
const exito = ref('')

const form = reactive({
  nombre_usuario: '',
  correo_electronico: '',
  codigo_invitacion: '',
  contrasena: '',
  confirmar: '',
})

const reglas = {
  nombre_usuario: { requerido: true, minLength: 3, maxLength: 50 },
  correo_electronico: { requerido: true, email: true },
  codigo_invitacion: { requerido: true },
  contrasena: { requerido: true, minLength: 6 },
  confirmar: { requerido: true },
}

const { errors, tocar, validarTodo } = useForm(reglas)

async function handleRegister() {
  if (!validarTodo(form)) return

  if (form.contrasena !== form.confirmar) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  cargando.value = true
  error.value = ''
  try {
    await auth.register({
      nombre_usuario: form.nombre_usuario,
      correo_electronico: form.correo_electronico,
      codigo_invitacion: form.codigo_invitacion,
      contrasena: form.contrasena,
    })
    exito.value = 'Cuenta creada con éxito. Ahora puedes iniciar sesión.'
  } catch (e) {
    error.value = e?.mensaje || 'Error al registrarse. Verifica tu código de invitación.'
  } finally {
    cargando.value = false
  }
}
</script>
