<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ edit ? 'Editar Insumo' : 'Agregar Insumo' }}</span>
    </v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- Nombre (string) -->
        <v-text-field
          v-model="local.nombre"
          label="Nombre"
          :rules="[v => !!v || 'Requerido']"
        />

        <!-- Cantidad (string, formato 10.00) -->
        <v-text-field
          v-model="local.cantidad"
          label="Cantidad"
          type="text"
          hint="Usa punto para decimales, p.ej. 10.00"
          persistent-hint
          :rules="[
            v => !!v || 'Requerido',
            v => (/^\d+(\.\d{1,2})?$/).test(v) || 'Formato inválido (hasta 2 decimales)'
          ]"
        />

        <!-- Unidad (string) -->
        <v-text-field
          v-model="local.unidad"
          label="Unidad"
          :rules="[v => !!v || 'Requerido']"
        />


        <!-- Precio unitario (string con '$') -->
        <v-text-field
          v-model="local.precio_unitario"
          label="Precio unitario"
          prefix="$"
          type="text"
          hint="Ejemplo: $12.75"
          persistent-hint
          :rules="[
            v => !!v || 'Requerido',
            v => (/^\$\d+(\.\d{1,2})?$/).test(v) || 'Formato inválido, p.ej. $12.75'
          ]"
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="!valid" color="primary" @click="onSubmit">
        {{ edit ? 'Guardar' : 'Crear' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import api from '@/plugins/axios'
import Swal from 'sweetalert2'     // Asegúrate de importar Swal correctamente

const props = defineProps({
  insumo: { type: Object, required: true },
  edit:   { type: Boolean, default: false }
})
const emit = defineEmits(['saved', 'cancel'])

// Clon local para no mutar props directamente
const local = reactive({ ...props.insumo })
console.log('local', local)
const valid = ref(false)

// Si props.insumo cambia, lo volcamos a local
watch(
  () => props.insumo,
  v => Object.assign(local, v),
  { deep: true }
)

async function onSubmit() {
  const action = props.edit ? 'actualizar' : 'crear'
  const { isConfirmed } = await Swal.fire({
    customClass: { container: 'swal2-container--above-vuetify' },
    title: `¿Deseas ${action} este insumo?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
    cancelButtonText: 'Cancelar',
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      // Convertimos strings a números
      const qty = parseFloat(local.cantidad)
      const price = parseFloat(local.precio_unitario.replace(/[^0-9.-]+/g, ''))

      if (isNaN(qty) || qty < 0) {
        throw new Error('Cantidad inválida')
      }
      if (isNaN(price) || price < 0) {
        throw new Error('Precio inválido')
      }

      const payload = {
        nombre:          local.nombre,
        cantidad:        qty,
        unidad:          local.unidad,
        precio_unitario: price
      }

      try {
        if (props.edit) {
          const res = await api.put(`insumos/${local.id}/`, payload)
          return { ok: true, data: res.data }
        } else {
          const res = await api.post('insumos/', payload)
          return { ok: true, data: res.data }
        }
      } catch (err) {
        return { ok: false, error: err.response?.data || err.message }
      }
    }
  })

  if (isConfirmed) {
    Swal.fire('¡Éxito!', `Insumo ${action}do correctamente.`, 'success')
    emit('saved')
  }
}
</script>
