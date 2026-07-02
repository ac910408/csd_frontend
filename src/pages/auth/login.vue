<template>
  <EmptyLayout>
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-base-content">CSD</h1>
          <p class="text-sm text-neutral mt-1">Carpeta Scouter Digital</p>
        </div>

        <BaseCard>
          <h2 class="text-lg font-semibold text-base-content mb-6">Iniciar sesión</h2>

          <AlertMessage
            v-if="error"
            type="error"
            :mensaje="error"
            cerrable
            class="mb-4"
            @cerrar="error = ''"
          />

          <form class="space-y-4" @submit.prevent="handleLogin" autocomplete="on">
            <FormField label="Correo electrónico" :error="errors.correo_electronico" required>
              <BaseInput
                v-model="form.correo_electronico"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                autocomplete="email"
                :error="errors.correo_electronico"
                @blur="tocar('correo_electronico', form.correo_electronico)"
              />
            </FormField>

            <FormField label="Contraseña" :error="errors.contrasena" required>
              <BaseInput
                v-model="form.contrasena"
                name="password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                :error="errors.contrasena"
                @blur="tocar('contrasena', form.contrasena)"
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
              Entrar
            </BaseButton>
          </form>

          <p class="text-sm text-neutral text-center mt-4">
            ¿No tienes cuenta?
            <a href="/auth/register" class="text-primary hover:underline font-medium">
              Registrarse
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

const form = reactive({
  correo_electronico: '',
  contrasena: '',
})

const reglas = {
  correo_electronico: { requerido: true, email: true },
  contrasena: { requerido: true, minLength: 6 },
}

const { errors, tocar, validarTodo } = useForm(reglas)

async function handleLogin() {
  if (!validarTodo(form)) return
  cargando.value = true
  error.value = ''
  try {
    await auth.login(form)
    router.push('/')
  } catch (e) {
    error.value = e?.mensaje || 'Error al iniciar sesión'
  } finally {
    cargando.value = false
  }
}
</script>
