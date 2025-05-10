<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6" elevation="3">
          <v-card-title class="text-center pb-0">
            <h1 class="mumo-header">MUMO</h1>
          </v-card-title>

          <v-card-text class="text-center">
            <v-avatar size="80" class="mx-auto mb-4" color="light-green-lighten-3">
              <v-icon size="60" color="success">mdi-account</v-icon>
            </v-avatar>

            <h2 class="text-success mb-5">Login</h2>

            <v-form @submit.prevent="iniciarSesion">
              <v-text-field
                v-model="username"
                label="Nombre de usuario"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                class="mb-3"
              />
              <v-text-field
                v-model="password"
                label="Contraseña"
                prepend-inner-icon="mdi-lock"
                type="password"
                variant="outlined"
              />

              <v-btn type="submit" color="light-green darken-1" block class="mt-4 text-white">
                Iniciar sesión
              </v-btn>
            </v-form>

            <div class="text-center mt-4">
              <RouterLink to="/recuperar" class="d-block text-caption text-purple mb-1">
                ¿Olvidó su contraseña?
              </RouterLink>
              <RouterLink to="/registro" class="text-caption text-purple">
                Crear cuenta
              </RouterLink>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const iniciarSesion = () => {
  if (username.value === 'usuario' && password.value === 'contraseña') {
    alert('¡Inicio de sesión exitoso!')
  } else {
    alert('Credenciales inválidas.')
  }
}
</script>

<style scoped>
.mumo-header {
  background-color: #c5e1a5;
  padding: 0.5rem 0;
  width: 100%;
  text-align: center;
  font-weight: bold;
}
</style>
