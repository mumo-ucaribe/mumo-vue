<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <!-- Columna izquierda: datos de la venta -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.id"
          label="ID"
          readonly
          density="compact"
        />
        <v-text-field
          v-model="form.fecha"
          label="Fecha de venta"
          type="date"
          required
          density="compact"
        />
        <v-text-field
          v-model.number="form.total"
          label="Total ($)"
          prefix="$"
          type="number"
          step="0.01"
          required
          density="compact"
        />
        <v-switch
          v-model="form.completada"
          label="Completada"
        />
      </v-col>

      <!-- Columna derecha: selección de recetas -->
      <v-col cols="12" md="6">
        <v-data-table
          :headers="recetaHeaders"
          :items="recipesList"
          show-select
          return-object
          item-value="id"
          v-model="selectedRecipes"
          hide-default-footer
          dense
          fixed-header
          height="300px"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-card-actions class="justify-end">
      <v-btn text @click="$emit('close')">Cancelar</v-btn>
      <v-btn color="primary" type="submit">
        {{ form.id ? 'Actualizar' : 'Guardar' }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import api from '@/plugins/axios.js'
import Alert from '@/plugins/alert.js'

const props = defineProps({
  venta:   { type: Object, default: null },
  recetas: { type: Array,  default: () => [] }
})
const emit = defineEmits(['saved','close'])

const alert = new Alert()

// Formulario reactivo
const form = reactive({
  id:          '',
  fecha:       '',
  total:       0,
  completada:  false,
  receta:      []   // array de IDs de recetas
})

// Datos y selección de recetas
const recipesList     = ref([])
const selectedRecipes = ref([])

// Cabeceras de la tabla de recetas
const recetaHeaders = [
  { text: 'Receta', value: 'nombre' }
]

// 1) Sincronizar props.recetas → recipesList
watch(
  () => props.recetas,
  v => { recipesList.value = v },
  { immediate: true }
)

// 2) Cargar datos de `ventas` en edición
watch(
  () => props.venta,
  v => {
    if (v) {
      form.id          = v.id
      form.fecha       = v.fecha_venta.slice(0,10)
      form.total       = parseFloat(v.total)
      form.completada  = !!v.completada
      form.receta      = Array.isArray(v.receta) ? [...v.receta] : []
    } else {
      form.id = form.fecha = ''
      form.total = 0
      form.completada = false
      form.receta = []
    }
  },
  { immediate: true }
)

// 3) Mantener selectedRecipes sincronizado con form.receta (IDs)
watch(
  [() => recipesList.value, () => form.receta],
  ([all, ids]) => {
    selectedRecipes.value = all.filter(r => ids.includes(r.id))
  },
  { immediate: true }
)

// 4) Al cambiar la selección, actualizamos form.receta
watch(
  selectedRecipes,
  rows => {
    form.receta = rows.map(r => r.id)
  }
)

// 5) Submit con confirmación usando Alert
async function onSubmit() {
  const payload = {
    fecha_venta: form.fecha,
    total:       form.total.toFixed(2),
    completada:  form.completada,
    receta:      form.receta
  }

  await alert.alertConfirm({
    action: form.id ? 'actualizar' : 'guardar',
    obj:    'venta',
    data:   { id: form.id, payload },
    onConfirm: async ({ id, payload }) => {
      if (id) {
        const res = await api.put(`ventas/${id}`, payload)
        return { ok: true, ...res.data && { data: res.data } }
      } else {
        const res = await api.post('ventas', payload)
        return { ok: true, ...res.data && { data: res.data } }
      }
    },
    onSuccess: result => {
      // result.data es la respuesta del servidor
      emit('saved', result.data)
      emit('close')
    }
  })
}
</script>
