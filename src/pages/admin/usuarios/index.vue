<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-base-content mb-6">Gestión de Usuarios</h1>

      <div class="mb-4">
        <SearchBar v-model="busqueda" placeholder="Buscar usuario…" />
      </div>

      <BaseSpinner v-if="cargando" class="mx-auto py-8" size="lg" />
      <template v-else>
        <BaseCard>
          <div v-if="usuarios.length" class="divide-y divide-base-200">
            <div v-for="u in filtered" :key="u.id" class="flex items-center justify-between py-3 px-1">
              <div>
                <p class="font-medium text-base-content">{{ u.nombre_usuario }}</p>
                <p class="text-xs text-neutral">{{ u.correo_electronico }}</p>
                <div class="flex gap-1 mt-1">
                  <BaseBadge v-for="r in u.roles" :key="r.rol_nombre" size="sm" outline>{{ r.rol_nombre }}</BaseBadge>
                </div>
              </div>
              <BaseButton variant="ghost" size="sm" @click="abrirRoles(u)">Roles</BaseButton>
            </div>
          </div>
          <EmptyState v-else titulo="Sin usuarios" />
        </BaseCard>

        <BaseModal :open="showRoles" title="Asignar rol" @close="showRoles = false">
          <form class="space-y-4" @submit.prevent="asignarRol">
            <FormField label="Rol" required>
              <CatalogoAutocomplete v-model="nuevoRol.id_rol" catalogo="roles" :items="[]" placeholder="Seleccionar rol…" />
            </FormField>
            <FormField label="Grupo (opcional)">
              <CatalogoAutocomplete v-model="nuevoRol.id_grupo" catalogo="grupos" :items="[]" placeholder="Seleccionar grupo…" />
            </FormField>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" size="sm" @click="showRoles = false">Cancelar</BaseButton>
              <BaseButton type="submit" variant="primary" size="sm">Asignar</BaseButton>
            </div>
          </form>
        </BaseModal>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { adminService } from '@/services/catalog.service'


const cargando = ref(true)
const busqueda = ref('')
const usuarios = ref([])
const showRoles = ref(false)
const usuarioSeleccionado = ref(null)
const nuevoRol = reactive({ id_rol: null, id_grupo: null })

const filtered = computed(() => {
  if (!busqueda.value) return usuarios.value
  const q = busqueda.value.toLowerCase()
  return usuarios.value.filter((u) =>
    u.nombre_usuario?.toLowerCase().includes(q) || u.correo_electronico?.toLowerCase().includes(q),
  )
})

function abrirRoles(u) {
  usuarioSeleccionado.value = u
  showRoles.value = true
}

async function asignarRol() {
  try {
    await adminService.asignarRol(usuarioSeleccionado.value.id, { ...nuevoRol })
    showRoles.value = false
    nuevoRol.id_rol = null; nuevoRol.id_grupo = null
  } catch { /* ignorar */ }
}

onMounted(async () => {
  // Lista de usuarios vendría de admin endpoint; simplificado
  cargando.value = false
})
</script>
