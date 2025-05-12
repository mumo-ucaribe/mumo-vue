<template>
  <v-container>
    <h2>Añadir Receta</h2>

    <v-text-field v-model="nuevaReceta.nombre" label="Nombre del platillo" />
    <v-text-field v-model="nuevaReceta.categoria" label="Categoría" />
    <v-text-field v-model="nuevaReceta.costoProd" label="Costo de producción" type="number" />
    <v-text-field v-model="nuevaReceta.costoPub" label="Costo al público" type="number" />

    <h3>Ingredientes</h3>
    <div v-for="(ing, index) in nuevaReceta.ingredientes" :key="index">
      <v-text-field v-model="ing.nombre" label="Ingrediente" />
      <v-text-field v-model.number="ing.cantidad" label="Cantidad" type="number" />
      <v-select
        v-model="ing.unidad"
        :items="['kg', 'g', 'l', 'ml']"
        label="Unidad"
      />
    </div>

    <v-btn color="green" @click="agregarIngrediente">+ Añadir Ingrediente</v-btn>

    <v-divider class="my-4"></v-divider>

    <v-btn color="blue" @click="guardarReceta">Guardar Receta</v-btn>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const nuevaReceta = ref({
  nombre: '',
  categoria: '',
  costoProd: 0,
  costoPub: 0,
  ingredientes: [],
})

const agregarIngrediente = () => {
  nuevaReceta.value.ingredientes.push({ nombre: '', cantidad: 1, unidad: 'kg' })
}

const guardarReceta = () => {
  if (!nuevaReceta.value.nombre || !nuevaReceta.value.categoria) {
    Swal.fire({
      icon: 'error',
      title: 'Faltan datos',
      text: 'Por favor llena el nombre y la categoría',
    })
    return
  }

  const recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) || []
  recetasGuardadas.push({ ...nuevaReceta.value })
  localStorage.setItem('recetas', JSON.stringify(recetasGuardadas))

  Swal.fire({
    icon: 'success',
    title: 'Receta guardada',
    timer: 1500,
    showConfirmButton: false,
  }).then(() => {
    router.push('/recetas')
  })
}
</script>
