import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify' // 👈 Importa tu plugin

const app = createApp(App)
app.use(router)
app.use(vuetify) // 👈 No olvides este
app.mount('#app')
