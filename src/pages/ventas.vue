<template>
  <AppHeader page="ventas" />

  <v-container fluid class="pa-4">
    <v-progress-circular v-if="loading" indeterminate class="my-8" />
    <div v-else-if="error" class="text-error">{{ error }}</div>
    <DataTable
      v-else
      :data="ventas"
      :config="configVentas"
      :page-rows="10"
      @buttonClick="onTableButton"
    />
  </v-container>

  <v-row class="mt-6 ml-5">
    <v-btn
      to="/inicio"
      icon
      rounded="lg"
      elevation="2"
      class="ma-2"
      color="light-green lighten-3"
    >
      <v-icon color="green darken-2">mdi-home</v-icon>
    </v-btn>
  </v-row>

  <Modal v-model="ventasModal" :title="modalTitle" fullscreen>
    <VentasForm
      :venta="isEdit"
      :recetas="recetas"
      @saved="handleSave"
      @close="ventasModal = false"
    />
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "@/plugins/axios";

const ventasModal = ref(false);
const isEdit = ref(null);

const ventas = ref([]);
const ventasCount = ref(0);

const recetas = ref([]);
const recetasCount = ref(0);

const loading = ref(false);
const error = ref(null);

const configVentas = reactive({
  rawText: "Ventas",
  mainColor: "light-green darken-1",
  fields: [
    { title: "Recetas", key: "receta" },
    { title: "Total ($)", key: "total" },
    { title: "Completada", key: "completada" },
    { title: "Fecha de venta", key: "fecha_venta" },
  ],
  orderByCol: { Field: ["fecha_venta"] },
  selectConfig: { idRowData: "id" },
  multipleSelect: false,
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
      text: "Editar venta",
      icon: "mdi-pencil",
      require: true,
      limitRequire: 1,
    },
    {
      buttonId: "deleteSale",
      text: "Eliminar venta",
      icon: "mdi-delete",
      require: true,
      limitRequire: 1,
      confirm: true,
    },
  ],
});

const modalTitle = computed(() =>
  isEdit.value ? "Editar venta" : "Añadir venta",
);

async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    const [vRes, rRes] = await Promise.all([
      axios.get("ventas/"),
      axios.get("recetas/"),
    ]);

    // Ventas
    ventasCount.value = vRes.data.count;
    ventas.value = vRes.data.results.map((v) => ({
      ...v,
      completada: v.completada ? "Sí" : "No",
      fecha_venta: new Date(v.fecha_venta).toLocaleDateString(),
      receta: v.recetas.map((r) => r.nombre).join(", "),
    }));

    // Recetas
    recetasCount.value = rRes.data.count;
    recetas.value = rRes.data.results;
  } catch (e) {
    console.error(e);
    error.value = "Error cargando datos";
  } finally {
    loading.value = false;
  }
}

async function onTableButton(buttonId, payload) {
  const id = Array.isArray(payload) ? payload[0] : payload;

  // NUEVA VENTA
  if (buttonId === "newSale") {
    isEdit.value = null;
    ventasModal.value = true;
    return;
  }

  // SI NO HAY ID válido, salimos
  if (!id) return;

  // BUSCAMOS EL OBJETO UNA VEZ
  const sel = ventas.value.find((v) => v.id === id);
  if (!sel) return;

  // EDITAR
  if (buttonId === "editSale") {
    isEdit.value = {
      ...sel,
      fecha_venta: new Date(sel.fecha_venta).toISOString().slice(0, 10),
      receta: sel.receta ?? [],
    };
    ventasModal.value = true;
    return;
  }

  // ELIMINAR
 if (buttonId === "deleteSale") {
    await alert.alertConfirm({
      action: "eliminar",
      obj:    `venta #${sel.id}`,
      data:   { id },
      onConfirm: async ({ id }) => {
        // petición DELETE al backend
        await axios.delete(`ventas/${id}/`);
        return { ok: true };
      },
      onSuccess: () => {
        // quitamos localmente la venta eliminada
        ventas.value = ventas.value.filter(v => v.id !== id);
      }
    });
  }
}

function handleSave(nuevaOeditada) {
  fetchData();
  // const { id, fecha_venta, total, completada } = nuevaOeditada;
  // const fila = {
  //   ...nuevaOeditada,
  //   fecha_venta: new Date(fecha_venta).toLocaleDateString(),
  //   completada:  completada ? "Sí" : "No"
  // };

  // if (isEdit.value) {
  //   const idx = ventas.value.findIndex(v => v.id === id);
  //   if (idx !== -1) ventas.value.splice(idx, 1, fila);
  // } else {
  //   ventas.value.unshift(fila);
  // }
  // ventasModal.value = false;
}

onMounted(fetchData);
</script>
