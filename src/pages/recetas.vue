<template>
  <v-app>
    <!-- HEADER -->
    <AppHeader page="recetas" />

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

          <!-- Volver a reportes/inventario -->
          <v-btn icon to="/reportes" color="light-green lighten-3">
            <v-icon color="green darken-2">mdi-arrow-left</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { reactive } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import DataTable from "@/components/DataTable.vue";

const recetas = [
  {
    nombre: "Nombre receta",
    categoria: "Categoría",
    costoProd: "$0.00",
    costoPub: "$0.00",
    ingredientes: "receta-1", // este valor se pasará al evento
  },
  // … más filas …
];

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

  buttons: [], // no hay botones sticky en esta vista
});

function onTableButton(action, payload) {
  switch (action) {
    case "verIngredientes":
      console.log("Mostrar ingredientes de", payload);
      break;
    case "addReceta":
      console.log("Agregar nueva receta");
      break;
    case "editReceta":
      console.log("Editar/Eliminar receta");
      break;
  }
}
</script>
