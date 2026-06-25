import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/style.css'
import App from './App.vue'
import { router } from './router'
import { useAuthStore } from '@/stores/auth.store'

const app = createApp(App)

app.use(createPinia())

// Verificar sesión antes de montar el router
const auth = useAuthStore()
auth.checkSession().finally(() => {
  app.use(router)
  app.mount('#app')
})
