<template>
  <div class="contenedor-login">
    <div class="header-login">
      <h1>MUMO</h1>
    </div>
    <div class="login-form">
      <h2>Crear cuenta</h2>
      <form @submit.prevent="registrarse">
        <label>Nombre:</label>
        <input type="text" v-model="nombre" placeholder="Tu nombre" />
        <label>Correo:</label>
        <input type="email" v-model="correo" placeholder="tu@email.com" />
        <label>Contraseña:</label>
        <input type="password" v-model="clave" placeholder="********" />
        <button type="submit">Registrarse</button>
      </form>
      <RouterLink to="/" class="crear-cuenta">Volver al login</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const nombre = ref('')
const correo = ref('')
const clave = ref('')

const registrarse = () => {
  alert(`Registrado como ${nombre.value}`)
}
</script>

<style scoped>
@import '../components/LoginForm.vue'; /* Si quieres mantener el mismo estilo */
</style>
