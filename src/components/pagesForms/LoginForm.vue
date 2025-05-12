<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6" elevation="3">
          <v-card-title class="text-center pb-0">
            <h1 class="mumo-header">MUMO</h1>
          </v-card-title>

          <v-card-text class="text-center">
            <v-avatar
              size="80"
              class="mx-auto mb-4"
              color="light-green-lighten-3"
            >
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
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
              />

              <v-btn
                type="submit"
                color="light-green darken-1"
                block
                class="mt-4 text-white"
              >
                INICIAR SESIÓN
              </v-btn>
            </v-form>

            <!-- Se comenta debido a que como tal no tenemos pensado más cantidad de usuarios (testing) -->

            <!-- <div class="text-center mt-4">
              <RouterLink to="/recuperar" class="d-block text-caption text-purple mb-1">
                ¿Olvidó su contraseña?
              </RouterLink>
              <RouterLink to="/registro" class="text-caption text-purple">
                Crear cuenta
              </RouterLink>
            </div> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import axios, { setAuthToken } from "@/plugins/axios";
import Alert from "@/plugins/alert";
import { useRouter } from "vue-router";

const username     = ref("");
const password     = ref("");
const showPassword = ref(false);

const alert  = new Alert();
const router = useRouter();

const iniciarSesion = async () => {
  // 1. Validación básica de campos
  if (!username.value.trim() || !password.value.trim()) {
    return alert.alert({
      title:    "Campos vacíos",
      subtitle: "Debes completar ambos campos.",
      icon:     "warning",
    });
  }

  // 2. Confirmación y login con token
  await alert.alertConfirm({
    action: "iniciar sesión",
    obj:    "en MUMO",
    data: {
      username: username.value,
      password: password.value,
    },
    onConfirm: async creds => {
      try {
        // a) Hacer POST a /login/ para obtener token
        const { data } = await axios.post("/login/", {
          username: creds.username,
          password: creds.password,
        });
        // b) Guardar el token para futuras peticiones
        setAuthToken(data.token);
        return { ok: true };
      } catch (err) {
        // Credenciales inválidas suelen devolver 401 o 400
        if (err.response?.status === 401 || err.response?.status === 400) {
          return { ok: false, error: "Usuario o contraseña incorrectos" };
        }
        // Otros errores los propaga para mostrar validación
        throw err;
      }
    },
    onSuccess: () => {
      // 3. Redirigir tras éxito
      router.push({ name: "inicio" });
    },
  });
};
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
