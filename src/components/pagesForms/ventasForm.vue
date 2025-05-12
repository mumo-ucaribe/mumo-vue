<template>
    <v-container fluid>
      <v-row>
        <!-- Formulario del cliente -->
        <v-col cols="12" md="5">
          <v-card class="pa-4" color="#f4ffe8">
            <!-- Cliente -->
            <v-row class="mb-2">
              <v-col cols="4" class="text-white text-center py-3" style="background-color: #b1d187;">
                <strong>Cliente</strong>
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="form.cliente" density="compact" hide-details />
              </v-col>
            </v-row>
  
            <!-- Contacto -->
            <v-row class="mb-2">
              <v-col cols="4" class="text-white text-center py-3" style="background-color: #b1d187;">
                <strong>Contacto</strong>
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="form.email" label="Correo" type="email" density="compact" hide-details />
                <v-text-field v-model="form.telefono" label="Teléfono" type="tel" density="compact" hide-details />
              </v-col>
            </v-row>
  
            <!-- Pedido -->
            <v-row class="mb-2">
              <v-col cols="4" class="text-white text-center py-3" style="background-color: #b1d187;">
                <strong>Pedido</strong>
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="form.pedido" density="compact" hide-details />
              </v-col>
            </v-row>
  
            <!-- Fecha -->
            <v-row class="mb-2">
              <v-col cols="4" class="text-white text-center py-3" style="background-color: #b1d187;">
                <strong>Fecha</strong>
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="form.fecha" type="date" density="compact" hide-details />
              </v-col>
            </v-row>
  
            <!-- ID -->
            <v-row>
              <v-col cols="4" class="text-white text-center py-3" style="background-color: #b1d187;">
                <strong>ID</strong>
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="form.id" density="compact" hide-details readonly />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
  
        <!-- Tabla de productos -->
        <v-col cols="12" md="7">
          <v-card class="pa-2">
            <v-table density="comfortable" class="elevation-1" fixed-header height="400px">
              <thead style="background-color: #b1d187;">
                <tr>
                  <th>Platillo</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Precio total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody style="background-color: #f4ffe8;">
                <tr v-for="(item, index) in platillos" :key="index">
                  <td>
                    <v-text-field v-model="item.nombre" density="compact" hide-details />
                  </td>
                  <td>
                    <v-text-field v-model.number="item.cantidad" type="number" min="0" density="compact" hide-details />
                  </td>
                  <td>
                    <v-text-field v-model.number="item.precio" type="number" step="0.01" prefix="$" density="compact" hide-details />
                  </td>
                  <td>
                    {{ (item.cantidad * item.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }}
                  </td>
                  <td>
                    <v-btn icon color="red" @click="eliminarFila(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <tr>
                  <td class="text-success font-weight-bold" @click="agregarFila" style="cursor: pointer;">+</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  
  <script setup>
  import { useFormStore } from '@/stores/useFormStore'

  import { ref, reactive, watch } from 'vue'
  
  const props = defineProps({
    isEdit: {
      type: [Object, null],
      default: null
    }
  })
  
  const form = reactive({
    cliente: '',
    email: '',
    telefono: '',
    pedido: '',
    fecha: '',
    id: '',
  })
  
  const platillos = ref([])
  
  // Escuchar cambios en isEdit
  watch(
    () => props.isEdit,
    (newVal) => {
      if (newVal && newVal.length) {
        const data = newVal[0]
        form.cliente = data.cliente || ''
        const [email, telefono] = data.contacto?.split(' | ') || ['', '']
        form.email = email.trim()
        form.telefono = telefono.trim()
        form.pedido = data.pedido || ''
        form.fecha = data.fecha || ''
        form.id = data.id || ''
      } else {
        // Limpiar formulario
        Object.keys(form).forEach((key) => (form[key] = ''))
        platillos.value = [] // limpia tabla también
      }
    },
    { immediate: true }
  )
  
  
  const agregarFila = () => {
    platillos.value.push({ nombre: '', cantidad: 0, precio: 0.0 })
  }
  
  const eliminarFila = (index) => {
    platillos.value.splice(index, 1)
  }

  
  </script>
  