/**
 * Store de UI: sidebar, modales, toasts.
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'

let toastId = 0

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(false)
  const toasts = ref([])

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  /**
   * Muestra un toast.
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {string} mensaje
   * @param {number} [duration=4000]
   */
  function addToast(type, mensaje, duration = 4000) {
    const id = ++toastId
    toasts.value.push({ id, type, mensaje })
    setTimeout(() => removeToast(id), duration)
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(msg) { addToast('success', msg) }
  function error(msg) { addToast('error', msg) }
  function warning(msg) { addToast('warning', msg) }
  function info(msg) { addToast('info', msg) }

  return {
    sidebarOpen,
    toasts,
    toggleSidebar,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
})
