<template>
  <!-- Header a todo ancho -->
  <AppHeader page="ventas" />

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
  <v-row class="mt-6 ml-5">
    <v-btn icon rounded="lg" elevation="2" class="ma-2" color="light-green lighten-3" to="/inicio">
      <v-icon color="green darken-2">mdi-home</v-icon>
    </v-btn>
  </v-row>

  <!-- MODAL PARA FORMULARIO -->
  <Modal
    v-model="ventasModal"
    title="Editar ventas"
    :isEdit="isEdit"
    :fullscreen="true"
    :showFooter="true"
  >
    <VentasForm />
  </Modal>
</template>

<script setup>
import { ref, reactive } from "vue";

const ventasModal = ref(false);
const isEdit = ref(null);

const ventas = ref([
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
]);

const configVentas = reactive({
  rawText: "Ventas",
  mainColor: "light-green darken-1",

  fields: [
    { text: "Cliente", value: "cliente", canBeFiltered: true },
    { text: "Contacto", value: "contacto", canBeFiltered: true },
    { text: "Pedido", value: "pedido" },
    { text: "ID", value: "id" },
    { text: "Fecha", value: "fecha" },
    { text: "Estado", value: "estado" },
    { text: "Precio", value: "precio" },
  ],

  orderByCol: { Field: ["fecha"] },
  selectConfig: { idRowData: "id" },
  selectableRow: false,
  disablePagination: false,

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

function onTableButton(buttonId, payload) {
  if (buttonId === "newSale") {
    isEdit.value = null;
    ventasModal.value = true;
    console.log("Crear venta");
  }
  if (buttonId === "editSale") {
    const selected = ventas.value.find((vnt) => vnt.id === payload);
    if (selected) {
      isEdit.value = selected;
      ventasModal.value = true;
      console.log("Editar/Eliminar venta", payload);
    } else {
      console.warn("Venta no encontrada con ID:", payload);
    }
  }
}
</script>
