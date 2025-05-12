<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="form.cliente" label="Cliente" :error="errors.cliente" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="form.contacto" label="Contacto" :error="errors.contacto" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="form.pedido" label="Pedido" :error="errors.pedido" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="form.fecha" label="Fecha" :error="errors.fecha" type="date" />
      </v-col>
    </v-row>

    <v-row justify="end" class="mt-6">
      <v-btn color="success" class="mr-2" @click="añadirVenta">Añadir</v-btn>
      <v-btn color="error" @click="cancelar">Cancelar</v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// Router para navegación
const router = useRouter()

// Estado reactivo del formulario
const form = reactive({
  cliente: '',
  contacto: '',
  pedido: '',
  fecha: ''
})

// Errores para validación visual
const errors = reactive({
  cliente: false,
  contacto: false,
  pedido: false,
  fecha: false
})

function anadirVenta() {
  let valido = true

  // Validación de campos
  for (const key in errors) {
    errors[key] = false
    if (!form[key].trim()) {
      errors[key] = true
      valido = false
    }
  }

  if (!valido) {
    Swal.fire({
      icon: 'error',
      title: 'Faltan campos',
      text: 'Por favor completa todos los campos obligatorios'
    })
    return
  }

  // Simulación de añadir la venta (aquí iría la lógica real)
  console.log('Venta añadida:', { ...form, id: generarId() })

  Swal.fire({
    icon: 'success',
    title: 'Venta añadida correctamente',
    timer: 1500,
    showConfirmButton: false
  })

  // Redirigir a /ventas después de añadir
  setTimeout(() => {
    router.push('/ventas')
  }, 1500)
}

function cancelar() {
  router.push('/ventas')
}

function generarId() {
  // ID aleatorio simple para demo (puedes mejorarlo)
  return Math.floor(10000 + Math.random() * 90000)
}
</script>
