<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" width="400">
      <v-card-title class="text-center text-h5 font-weight-bold">Recuperar contraseña</v-card-title>

      <v-form @submit.prevent="enviarEnlace" ref="formRef" v-model="formValido">
        <v-text-field
          v-model="correo"
          label="Correo electrónico"
          prepend-inner-icon="mdi-email"
          :rules="[
            v => !!v || 'Campo requerido',
            v => /.+@.+\..+/.test(v) || 'Correo inválido'
          ]"
        />

        <v-btn type="submit" block class="mt-4" color="light-green darken-1" text-color="white">
          ENVIAR ENLACE
        </v-btn>
      </v-form>

      <div class="text-center mt-4">
        <RouterLink to="/login" class="text-caption text-purple">
          Volver al login
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
const correo = ref('')
const formRef = ref(null)
const formValido = ref(false)

const enviarEnlace = async () => {
  const esValido = await formRef.value?.validate()

  if (!esValido || !correo.value.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos correctamente.',
      confirmButtonColor: '#8e44ad',
    })
    return
  }

  Swal.fire({
    icon: 'success',
    title: 'Enlace enviado',
    text: `Se envió un enlace a ${correo.value}`,
    confirmButtonColor: '#8fbf3f',
  }).then(() => {
    router.push('/login')
  })
}
</script>
