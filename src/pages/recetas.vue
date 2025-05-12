<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const hayCambios = ref(false)
const recetas = ref([])

const guardarCambios = async () => {
  console.log('Guardando cambios...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  hayCambios.value = false
  Swal.fire({
    icon: 'success',
    title: 'Cambios guardados',
    timer: 1500,
    showConfirmButton: false
  })
}

const router = useRouter()

const configRecetas = {
  rawText: "Recetas",
  mainColor: "light-green darken-1",
  fields: [
    { text: "Nombre", value: "nombre" },
    { text: "Categoría", value: "categoria" },
    { text: "Costo producción", value: "costoProd" },
    { text: "Costo al público", value: "costoPub" },
    {
      text: "Ingredientes",
      value: "ingredientes",
      buttons: [
        {
          buttonId: "verIngredientes",
          icon: "mdi-play",
          text: "",
          value: "ingredientes",
        },
      ],
    },
  ],
  orderByCol: { Field: ["nombre"] },
  selectConfig: { idRowData: "nombre" },
  selectableRow: false,
  disablePagination: false,
  buttons: [],
}

const onTableButton = (action, payload) => {
  switch (action) {
    case "verIngredientes":
      console.log("Mostrar ingredientes de", payload)
      break
    case "addReceta":
      router.push('/anadir-receta')
      break
    case "editReceta":
      hayCambios.value = true
      break
  }
}

const irAInicio = () => {
  if (hayCambios.value) {
    Swal.fire({
      title: 'Salir sin guardar cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Salir sin guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        guardarCambios().then(() => router.push('/inicio'))
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        router.push('/inicio')
      }
    })
  } else {
    router.push('/inicio')
  }
}

onMounted(() => {
  const data = JSON.parse(localStorage.getItem('recetas')) || []
  recetas.value = data
})
</script>

<template>
  <v-app>
    <AppHeader
      page="recetas"
      :tieneCambios="hayCambios"
      :guardarCambios="guardarCambios"
    />

    <v-main>
      <v-container fluid class="pa-4">
        <div class="mb-4">
          <span class="font-weight-bold">Tiempo conectado:</span> 00:00
        </div>

        <DataTable
          :data="recetas"
          :config="configRecetas"
          :page-rows="10"
          @buttonClick="onTableButton"
        />

        <v-row class="mt-6" align="center" justify="space-between">
          <v-btn icon color="light-green lighten-3" @click="irAInicio">
            <v-icon color="green darken-2">mdi-home</v-icon>
          </v-btn>

          <div>
            <v-btn
              depressed
              rounded
              class="mx-2"
              style="background-color: #bfdd8f; text-decoration: underline"
              large
              @click="onTableButton('addReceta')"
            >
              Agregar receta
            </v-btn>
            <v-btn
              depressed
              rounded
              class="mx-2"
              style="background-color: #bfdd8f; text-decoration: underline"
              large
              @click="onTableButton('editReceta')"
            >
              Editar o Eliminar receta
            </v-btn>
          </div>

          <v-btn icon to="/reportes" color="light-green lighten-3">
            <v-icon color="green darken-2">mdi-arrow-left</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
