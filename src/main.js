import { createApp } from 'vue'
import App from './App.vue'

// 🧠 Importa el router automático
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'

// 🧩 Crea el router con las rutas y layouts autogenerados
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// 🚀 Monta la app con router
const app = createApp(App)

app.use(router)
app.mount('#app')
