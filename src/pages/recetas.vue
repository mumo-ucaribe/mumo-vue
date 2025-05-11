<template>
  <v-app>
    <!-- HEADER CON VALIDACIÓN -->
    <AppHeader
      page="recetas"
      :tieneCambios="hayCambios"
      :guardarCambios="guardarCambios"
    />

    <v-main>
      <v-container fluid class="pa-4">
        <!-- Tiempo conectado -->
        <div class="mb-4">
          <span class="font-weight-bold">Tiempo conectado:</span> 00:00
        </div>

        <!-- TABLA DE RECETAS -->
        <DataTable
          :data="recetas"
          :config="configRecetas"
          :page-rows="10"
          @buttonClick="onTableButton"
        />

        <!-- BOTONES INFERIORES -->
        <v-row class="mt-6" align="center" justify="space-between">
          <!-- Home -->
          <v-btn icon color="light-green lighten-3" @click="irAInicio">
            <v-icon color="green darken-2">mdi-home</v-icon>
          </v-btn>

          <!-- Acciones -->
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

          <!-- Volver a reportes -->
          <v-btn icon to="/reportes" color="light-green lighten-3">
            <v-icon color="green darken-2">mdi-arrow-left</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// Estado de cambios sin guardar
const hayCambios = ref(false)

const guardarCambios = async () => {
  // Simula un guardado (lógica real aquí)
  console.log('Guardando cambios...')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  hayCambios.value = false
  Swal.fire({
    icon: 'success',
    title: 'Cambios guardados',
    timer: 1500,
    showConfirmButton: false
  })
}

// Datos de recetas
const recetas = reactive([
  {
    nombre: "Nombre receta",
    categoria: "Categoría",
    costoProd: "$0.00",
    costoPub: "$0.00",
    ingredientes: "receta-1",
  },
])

// Configuración de la tabla
const configRecetas = reactive({
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
  selectConfig: { idRowData: "ingredientes" },
  selectableRow: false,
  disablePagination: false,
  buttons: [],
})

// Router para navegación
const router = useRouter()

function onTableButton(action, payload) {
  switch (action) {
    case "verIngredientes":
      console.log("Mostrar ingredientes de", payload)
      break
    case "addReceta":
      console.log("Agregar nueva receta");
      router.push('/anadir-receta'); // ✅ Redirige a la página correcta
      break;

    case "editReceta":
      console.log("Editar/Eliminar receta")
      hayCambios.value = true
      break
  }
}

function irAInicio() {
  if (hayCambios.value) {
    Swal.fire({
      title: 'Salir sin guardar cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50', // Verde
      cancelButtonColor: '#d33',     // Rojo
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
</script>
