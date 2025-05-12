<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import axios from 'axios'

const router = useRouter()
const recetaForm = ref(null)

const opcionesIngredientes = ref([
  { id: 1, nombre: 'Harina' },
  { id: 2, nombre: 'Azúcar' },
  { id: 3, nombre: 'Huevo' },
])

const nuevaReceta = ref({
  nombre: '',
  categoria: '',
  costoPub: null,
  ingredientes: [],
})

const agregarIngrediente = () => {
  nuevaReceta.value.ingredientes.push({
    idIngrediente: null,
    cantidad: 1,
    costo: 0,
    unidad: 'kg'
  })
}

const eliminarIngrediente = (index) => {
  nuevaReceta.value.ingredientes.splice(index, 1)
}

const obtenerPrecioIngrediente = async (index, idIngrediente) => {
  try {
    const { data } = await axios.get(`/api/ingredientes/${idIngrediente}`)
    nuevaReceta.value.ingredientes[index].costo = data.precio
  } catch (error) {
    console.error('Error al obtener precio', error)
    Swal.fire('Error', 'No se pudo obtener el precio del ingrediente', 'error')
  }
}

const costoProduccion = computed(() => {
  return nuevaReceta.value.ingredientes.reduce((total, ing) => {
    const cantidad = parseFloat(ing.cantidad) || 0
    const costo = parseFloat(ing.costo) || 0
    return total + (cantidad * costo)
  }, 0)
})

const guardarReceta = async () => {
  const { valid } = await recetaForm.value.validate()

  const camposIncompletos = nuevaReceta.value.ingredientes.some(ing =>
    !ing.idIngrediente || !ing.cantidad || ing.cantidad <= 0 || !ing.unidad
  )

  if (!valid || camposIncompletos) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      text: 'Asegúrate de llenar correctamente todos los campos.',
      confirmButtonText: 'Entendido',
    })
    return
  }

  const recetaFinal = {
    ...nuevaReceta.value,
    costoProd: costoProduccion.value
  }

  const recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) || []
  recetasGuardadas.push(recetaFinal)
  localStorage.setItem('recetas', JSON.stringify(recetasGuardadas))

  Swal.fire({
    icon: 'success',
    title: 'Guardado!',
    text: 'Receta guardada exitosamente.',
    timer: 1500,
    showConfirmButton: false,
  }).then(() => {
    router.push('/recetas')
  })
}

</script>

<template>
  <v-container>
    <v-card class="pa-4 elevation-2">
      <h2 class="mb-4">Añadir Nueva Receta</h2>

      <v-form ref="recetaForm">
        <v-text-field
          v-model="nuevaReceta.nombre"
          label="Platillo"
          :rules="[v => !!v || 'Campo requerido']"
          required
        />
        <v-text-field
          v-model="nuevaReceta.categoria"
          label="Categoría"
          :rules="[v => !!v || 'Campo requerido']"
          required
        />
        <v-text-field
          :model-value="costoProduccion"
          label="Costo producción (automático)"
          readonly
        />
        <v-text-field
          v-model.number="nuevaReceta.costoPub"
          label="Costo al público"
          type="number"
          :rules="[v => v > 0 || 'Debe ser positivo']"
          required
        />

        <v-divider class="my-4" />

        <h3 class="mb-3">Ingredientes</h3>

        <div v-for="(ing, index) in nuevaReceta.ingredientes" :key="index" class="d-flex align-center mb-2">
          <v-select
            v-model="ing.idIngrediente"
            :items="opcionesIngredientes"
            item-title="nombre"
            item-value="id"
            label="Ingrediente"
            @update:model-value="(value) => obtenerPrecioIngrediente(index, value)"
            class="mr-2"
            required
          />
          <v-text-field
            v-model.number="ing.cantidad"
            label="Cantidad"
            type="number"
            :rules="[v => v > 0 || 'Cantidad inválida']"
            class="mr-2"
            required
          />
          <v-text-field
            :model-value="ing.costo"
            label="Costo Unitario"
            readonly
            class="mr-2"
          />
          <v-select
            v-model="ing.unidad"
            :items="['kg', 'g', 'l', 'ml']"
            label="Unidad"
            required
            class="mr-2"
          />
          <v-btn icon color="red" @click="eliminarIngrediente(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>

        <v-btn color="green" outlined class="my-4" @click="agregarIngrediente">
          <v-icon left>mdi-plus</v-icon> Añadir Ingrediente
        </v-btn>

        <v-divider class="my-4" />

        <v-row justify="center">
          <v-btn color="primary" large @click="guardarReceta">
            <v-icon left>mdi-content-save</v-icon> Guardar Receta
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>
