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
        <v-text-field v-model="form.fecha" label="Fecha" type="date" :error="errors.fecha" />
      </v-col>
    </v-row>

    <v-row justify="end" class="mt-4">
      <v-btn color="green" @click="guardarVenta">Añadir</v-btn>
      <v-btn color="red" class="ml-2" @click="$emit('close')">Cancelar</v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, watch } from 'vue'
import Swal from 'sweetalert2'

const props = defineProps({
  venta: Object,
})

const emit = defineEmits(['close', 'guardar'])

const form = reactive({
  cliente: '',
  contacto: '',
  pedido: '',
  fecha: '',
})

const errors = reactive({
  cliente: false,
  contacto: false,
  pedido: false,
  fecha: false,
})

watch(() => props.venta, (val) => {
  if (val) Object.assign(form, val)
  else Object.assign(form, { cliente: '', contacto: '', pedido: '', fecha: '' })
}, { immediate: true })

function guardarVenta() {
  let valido = true

  for (const key in errors) {
    errors[key] = !form[key]?.trim()
    if (errors[key]) valido = false
  }

  if (!valido) {
    Swal.fire({
      icon: 'error',
      title: 'Faltan campos',
      text: 'Por favor completa todos los campos obligatorios'
    })
    return
  }

  Swal.fire({
    icon: 'success',
    title: 'Venta guardada correctamente',
    timer: 1500,
    showConfirmButton: false
  })

  emit('guardar', { ...form, id: props.venta?.id ?? Date.now() })
  emit('close')
}
</script>
