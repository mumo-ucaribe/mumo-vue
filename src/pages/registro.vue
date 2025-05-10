<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" width="400">
      <v-card-title class="text-center text-h5 font-weight-bold">Crear cuenta</v-card-title>

      <v-form @submit.prevent="registrar" ref="formRef" v-model="formValido">
        <v-text-field
          v-model="nombre"
          label="Nombre completo"
          prepend-inner-icon="mdi-account"
          :rules="[v => !!v || 'Campo requerido']"
        />
        <v-text-field
          v-model="correo"
          label="Correo electrónico"
          prepend-inner-icon="mdi-email"
          :rules="[v => !!v || 'Campo requerido', v => /.+@.+\..+/.test(v) || 'Correo inválido']"
        />
        <v-text-field
          v-model="password"
          label="Contraseña"
          prepend-inner-icon="mdi-lock"
          type="password"
          :rules="[v => !!v || 'Campo requerido', v => v.length >= 6 || 'Mínimo 6 caracteres']"
        />

        <v-btn type="submit" block class="mt-4" color="light-green darken-1" text-color="white">
          REGISTRARSE
        </v-btn>
      </v-form>

      <div class="text-center mt-4">
        <RouterLink to="/login" class="text-caption text-purple">
          ¿Ya tienes cuenta? Inicia sesión
        </RouterLink>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const nombre = ref('')
const correo = ref('')
const password = ref('')
const formRef = ref(null)
const formValido = ref(false)

const registrar = async () => {
  const esValido = await formRef.value?.validate()

  // Verificación adicional
  if (!esValido || !nombre.value.trim() || !correo.value.trim() || !password.value.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos correctamente.',
    })
    return
  }

  // Aquí podrías verificar que el correo no esté ya registrado (mock o base de datos)

  Swal.fire({
    icon: 'success',
    title: 'Usuario registrado correctamente',
    text: `Bienvenido, ${nombre.value}`,
    confirmButtonColor: '#8fbf3f',
  }).then(() => {
    router.push('/login') // Redirige al login correctamente
  })
}
</script>
