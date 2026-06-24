import { ref, onMounted } from 'vue'

export function useTheme() {
  // Estado reactivo para saber si estamos en modo oscuro
  const isDark = ref(false)

  const toggleTheme = () => {
    // Alternamos el estado interno
    isDark.value = !isDark.value

    // Accedemos al elemento raíz (<html>)
    const root = document.documentElement

    if (isDark.value) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  onMounted(() => {
    // Al montar, verificamos si hay una preferencia guardada o del sistema
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
  })

  return {
    isDark,
    toggleTheme,
  }
}
