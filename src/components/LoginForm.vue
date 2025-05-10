<template>
    <form @submit.prevent="iniciarSesion" class="contenedor-login">
      <div class="header-login">
        <h1>MUMO</h1>
      </div>
      <div class="login-form">
        <img src="https://via.placeholder.com/100" class="avatar" alt="Avatar" />
  
        <label for="username">Usuario:</label>
        <input type="text" v-model="username" id="username" placeholder="Usuario" />
  
        <label for="password">Contraseña:</label>
        <input type="password" v-model="password" id="password" placeholder="**********" />
  
        <span class="visualizar">Visualizar contraseña</span>
        <RouterLink to="/recuperar" class="olvido">¿Olvidaste tu contraseña?</RouterLink>
        <RouterLink to="/registro" class="crear-cuenta">Crear una cuenta</RouterLink>
  
        <button type="submit">Iniciar sesión</button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter, RouterLink } from 'vue-router'
  
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  
  const iniciarSesion = () => {
    if (username.value === 'usuario' && password.value === 'contraseña') {
      router.push('/inicio')
    } else {
      alert('Usuario o contraseña incorrectos.')
    }
  }
  </script>
  
  <style scoped>
  .contenedor-login {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 300px;
  }
  .avatar {
    width: 100px;
    margin: auto;
  }
  button {
    margin-top: 1rem;
  }
  </style>
  