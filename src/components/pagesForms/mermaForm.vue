<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent="onSubmit"
    class="pa-4"
  >

    <!-- Selección de Insumo -->
    <v-select
      v-model="local.insumo"
      :items="insumos"
      item-text="nombre"
      item-value="id"
      label="Insumo"
      :rules="[v => !!v || 'Debes seleccionar un insumo']"
      required
      dense
      outlined
    />

    <!-- Cantidad de Merma -->
    <v-text-field
      v-model.number="local.cantidad"
      label="Cantidad"
      type="number"
      :rules="[
        v => v !== null && v !== '' || 'La cantidad es obligatoria',
        v => v > 0 || 'Debe ser mayor que cero'
      ]"
      required
      dense
      outlined
    />

    <v-card-actions class="pt-4">
      <v-spacer />
      <v-btn
        color="primary"
        :disabled="!valid"
        type="submit"
      >
        {{ edit ? 'Actualizar' : 'Crear' }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import api from '@/plugins/axios'
import Swal from 'sweetalert2'

// Props recibidos: la merma a editar (o vacía) y el modo edit
const props = defineProps({
  merma: { 
    type: Object, 
    required: true,
    // estructura: { id?, cantidad, insumo }
  },
  edit: { type: Boolean, default: false }
})
const emit = defineEmits(['saved', 'cancel'])

// Validación de Vuetify
const valid = ref(false)
const form = ref(null)

// Clon local de la merma para no mutar la prop directamente
const local = reactive({
  id:        props.merma.id ?? null,
  cantidad:  props.merma.cantidad ?? 0,
  insumo: props.merma.insumo ?? null,
})

// Sincronizar cuando cambie props.merma
watch(
  () => props.merma,
  m => Object.assign(local, {
    id:        m.id ?? null,
    cantidad:  m.cantidad ?? 0,
    insumo: m.insumo ?? null,
  }),
  { deep: true, immediate: true }
)

// Lista de insumos para el select
const insumos = ref([])
onMounted(async () => {
  try {
    const res = await api.get('insumos/')
    insumos.value = res.data.results.map(i => ({
      id:     i.id,
      nombre: i.nombre
    }))
  } catch (e) {
    console.error('Error cargando insumos', e)
    Swal.fire('Error', 'No se pudieron cargar los insumos', 'error')
  }
})

// Manejo del submit: confirmación, API call, respuesta
async function onSubmit() {
  const action = props.edit ? 'actualizar' : 'crear'
  const { isConfirmed } = await Swal.fire({
    customClass: { container: 'swal2-container--above-vuetify' },
    title: `¿Deseas ${action} esta merma?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
    cancelButtonText: 'Cancelar',
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      // validar formulario
      if (!form.value) return
      const ok = form.value.validate()
      if (!ok) throw new Error('Corrige los campos señalados')

      // preparar payload
      const payload = {
        cantidad:  Number(local.cantidad),
        insumo: Number(local.insumo)
      }

      try {
        let res
        if (props.edit) {
          res = await api.put(`mermas/${local.id}/`, payload)
        } else {
          res = await api.post('mermas/', payload)
        }
        return res.data
      } catch (err) {
        const msg = err.response?.data?.detail
                  || err.response?.data
                  || err.message
        throw new Error(
          Array.isArray(msg) ? msg.join('\n') : msg
        )
      }
    }
  })

  if (isConfirmed) {
    Swal.fire('¡Éxito!', `Merma ${action}da correctamente.`, 'success')
    // Emitimos la merma nueva/actualizada al padre
    emit('saved', { ...local })
  }
}
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
