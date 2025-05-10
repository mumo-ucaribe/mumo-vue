<template>
    <v-form @submit.prevent="guardarInsumo" ref="form" v-model="valid">
      <v-text-field
        v-model="nombre"
        label="Nombre del insumo"
        :rules="[v => !!v || 'Campo requerido']"
        prepend-inner-icon="mdi-food"
        variant="outlined"
        class="mb-3"
      />
  
      <v-text-field
        v-model="cantidad"
        label="Cantidad"
        type="number"
        :rules="[v => !!v || 'Campo requerido']"
        prepend-inner-icon="mdi-scale-balance"
        variant="outlined"
        class="mb-3"
      />
  
      <v-select
        v-model="unidad"
        label="Unidad de medida"
        :items="['kg', 'litros', 'unidades']"
        :rules="[v => !!v || 'Selecciona una unidad']"
        prepend-inner-icon="mdi-ruler"
        variant="outlined"
        class="mb-3"
      />
  
      <v-btn type="submit" color="success" block>
        Guardar insumo
      </v-btn>
    </v-form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const nombre = ref('')
  const cantidad = ref('')
  const unidad = ref('')
  const valid = ref(false)
  const form = ref(null)
  
  const guardarInsumo = () => {
    if (form.value.validate()) {
      alert(`✅ Insumo guardado:\n• ${nombre.value} - ${cantidad.value} ${unidad.value}`)
  
      // limpiar formulario
      nombre.value = ''
      cantidad.value = ''
      unidad.value = ''
      form.value.resetValidation()
    }
  }
  </script>
  
  <style scoped>
  /* si quieres añadir bordes o paddings extra, aquí */
  </style>
  