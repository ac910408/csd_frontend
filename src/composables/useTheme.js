import { ref, onMounted } from 'vue'

export function useTheme() {
  const theme = ref('system') // 'light', 'dark', o 'system'

  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }

  const applyTheme = () => {
    const root = document.documentElement
    const isDark =
      theme.value === 'dark' ||
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }

  onMounted(() => {
    theme.value = localStorage.getItem('theme') || 'system'
    applyTheme()
    // Escuchar cambios del sistema si está en modo system
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
  })

  return { theme, setTheme }
}
