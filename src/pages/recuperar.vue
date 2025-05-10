<template>
  <div class="contenedor-login">
    <div class="header-login">
      <h1>MUMO</h1>
    </div>
    <div class="login-form">
      <h2>Recuperar contraseña</h2>
      <form @submit.prevent="enviarEnlace">
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" v-model="email" placeholder="correo@ejemplo.com" />
        <button type="submit">Enviar enlace</button>
      </form>
      <RouterLink to="/" class="crear-cuenta">Volver al login</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')

const enviarEnlace = () => {
  alert(`Enlace de recuperación enviado a ${email.value}`)
}
</script>

<style scoped src="../styles/formularios.css"></style>

