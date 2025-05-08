<template>
  <v-container
    fluid
    class="pa-0 fill-height d-flex flex-column"
  >
    <!-- HEADER -->
    <AppHeader page="login" />

    <!-- CONTENIDO CENTRADO -->
    <v-container
      fluid
      class="pa-0 flex-grow-1 d-flex align-center justify-center"
    >
      <v-card class="mx-auto">
        <v-card-text class="text-center pt-8" style="width: 60vh;">
          <v-avatar size="100" class="mx-auto mb-4" color="light-green lighten-3">
            <v-icon large color="green darken-2">mdi-account</v-icon>
          </v-avatar>
          <h2 class="text-h4 font-weight-bold mb-8" style="color: #8FBF3F;">
            Login
          </h2>

          <v-form>
            <v-text-field
              label="Name"
              value="Jiara Martins"
              filled
              rounded
              color="light-green lighten-4"
              class="mb-4"
            />

            <v-text-field
              label="Password"
              :type="visible ? 'text' : 'password'"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="visible = !visible"
              filled
              rounded
              color="light-green lighten-4"
              class="mb-6"
            />

            <v-btn
              block
              large
              style="background-color:#BFDD8F; color:#000;"
              class="mb-6"
              to="/inicio"
            >
              Iniciar sesión
            </v-btn>
          </v-form>

          <div>
            <a href="#" class="subtitle-2 d-block mb-2">
              ¿Olvidó su contraseña?
            </a>
            <a href="#" class="subtitle-2">Crear cuenta</a>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
// import AppHeader from './AppHeader.vue'

const visible = ref(false)
</script>

<style>
</style>
