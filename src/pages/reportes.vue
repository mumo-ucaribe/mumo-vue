<template>
  <v-app>
    <!-- HEADER -->
    <AppHeader page="reportes" />

    <v-main>
      <v-container fluid class="pa-4">
        <!-- TABLA DE REPORTES (recetas) -->
        <DataTable
          :data="recetas"
          :config="configRecetas"
          :page-rows="10"
          @buttonClick="onTableButton"
        />

        <!-- BOTONES INFERIORES -->
        <v-row class="mt-6" align="center" justify="space-between">
          <!-- Home -->
          <v-btn icon to="/inicio" color="light-green lighten-3">
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

          <!-- Volver a inventario -->
          <v-btn icon to="/inventario" color="light-green lighten-3">
            <v-icon color="green darken-2">mdi-arrow-left</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { reactive } from "vue";

const recetas = [
  {
    nombre: "Nombre receta",
    categoria: "Categoría",
    costoProd: "$0.00",
    costoPub: "$0.00",
    ingredientes: null, // valor que se pasará al evento
  },
];

const configRecetas = reactive({
  rawText: "Recetas",
  mainColor: "light-green darken-1",

  // Definición de columnas
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
          text: "", // se usa solo el icono
          value: "ingredientes",
        },
      ],
    },
  ],

  // Orden inicial (array obligatorio)
  orderByCol: { Field: ["nombre"] },

  // Configuración de selección (no necesaria aquí)
  selectConfig: { idRowData: "nombre" },
  selectableRow: false,
  disablePagination: false,

  // Ningún botón adhesivo en la cabecera
  buttons: [],
});

// Maneja todos los clicks de DataTable
function onTableButton(action, payload) {
  if (action === "verIngredientes") {
    // payload será el valor del campo 'ingredientes' de la fila
    console.log("Ver ingredientes de:", payload);
  }
  if (action === "addReceta") {
    console.log("Agregar receta");
  }
  if (action === "editReceta") {
    console.log("Editar o eliminar receta");
  }
}
</script>
