<template>
  <v-app>
    <!-- Header a todo ancho -->
    <AppHeader page="ventas" />

    <v-main>
      <v-container fluid class="pa-4">
        <!-- DataTable reutilizable -->
        <DataTable
          :data="ventas"
          :config="configVentas"
          :page-rows="10"
          @buttonClick="onTableButton"
        />
      </v-container>
      <!-- BOTONES DE ACCIÓN -->
      <v-row class="mt-6" align="center" justify="space-between">
        <!-- Home -->
        <v-btn
          icon
          large
          class="ma-2"
          color="light-green lighten-3"
          to="/inicio"
        >
          <v-icon color="green darken-2">mdi-home</v-icon>
        </v-btn>
      </v-row>
    </v-main>
  </v-app>
</template>

<script setup>
import { reactive } from "vue";

const ventas = [
  {
    cliente: "Nombre Apellido",
    contacto: "nombre@gmail.com",
    pedido: "Nombre pedido",
    id: "12345",
    fecha: "00-00-00",
    estado: "Estado",
    precio: "$00000",
  },
  {
    cliente: "Nombre Apellido",
    contacto: "nombre@gmail.com",
    pedido: "Nombre pedido",
    id: "12346",
    fecha: "00-00-01",
    estado: "Estado",
    precio: "$01000",
  },
  // …más filas…
];

const configVentas = reactive({
  rawText: "Ventas",
  mainColor: "light-green darken-1",

  // Columnas de la tabla
  fields: [
    { text: "Cliente", value: "cliente", canBeFiltered: true },
    { text: "Contacto", value: "contacto", canBeFiltered: true },
    { text: "Pedido", value: "pedido" },
    { text: "ID", value: "id" },
    { text: "Fecha", value: "fecha" },
    { text: "Estado", value: "estado" },
    { text: "Precio", value: "precio" },
  ],

  // Cómo ordenar por defecto
  orderByCol: { Field: ["fecha"] },

  // Selección de filas
  selectConfig: { idRowData: "id" },
  selectableRow: false, // no selección múltiple
  disablePagination: false, // paginar

  // Botones "pegajosos" arriba de la tabla
  buttons: [
    {
      buttonId: "newSale",
      text: "Nueva venta",
      icon: "mdi-plus",
      require: false,
    },
    {
      buttonId: "editSale",
      text: "Editar o Eliminar venta",
      icon: "mdi-pencil",
      require: true,
      limitRequire: 1,
    },
  ],
});

// Captura de eventos desde los botones
function onTableButton(buttonId, payload) {
  if (buttonId === "newSale") {
    // lógica para nueva venta
    console.log("Crear venta");
  }
  if (buttonId === "editSale") {
    // payload será el ID de la venta seleccionada
    console.log("Editar/Eliminar venta", payload);
  }
}
</script>
