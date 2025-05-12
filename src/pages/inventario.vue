<template>
  <div>
    <!-- Header -->
    <AppHeader page="inventario"></AppHeader>

    <!-- Tarjeta principal -->
    <v-card class="">
      <!--  Definición de pestañas -->
      <v-tabs v-model="tab" bg-color="light-green lighten-5" grow>
        <v-tab value="inventario">Inventario</v-tab>
        <v-tab value="merma">Merma</v-tab>
      </v-tabs>

      <!-- Contenido de cada pestaña -->
      <v-tabs-window v-model="tab" class="mt-4 pa-4">
        <!-- Inventario -->
        <v-tabs-window-item value="inventario">
          <!-- Tiempo conectado -->
          <div class="mb-4">
            <span class="font-weight-bold">Tiempo conectado:</span>
            {{ tiempoConectado }}
          </div>
          <DataTable
            :data="insumos"
            :config="insumosConfig"
            :page-rows="10"
            @buttonClick="onInventarioAction"
          />
        </v-tabs-window-item>

        <!-- Merma -->
        <v-tabs-window-item value="merma">
          <!-- Tiempo conectado -->
          <div class="mb-4">
            <span class="font-weight-bold">Tiempo conectado:</span>
            {{ tiempoConectado }}
          </div>
          <DataTable
            :data="mermas"
            :config="mermaConfig"
            :page-rows="10"
            @buttonClick="onMermaAction"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>

    <Modal v-model="dialogInsumo">
      <InsumoForm
        :insumo="nuevoInsumo"
        :edit="editando"
        @cancel="dialogInsumo = false"
      />
    </Modal>

    <Modal v-model="dialogMerma">
      <MermaForm
        :merma="nuevoMerma"
        :edit="editandoMerma"
        @cancel="dialogMerma = false"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, reactive } from "vue";
import api from "@/plugins/axios";
import Alert from "@/plugins/alert";

// inyección con fallback
const tiempoConectado = inject("tiempoConectado", ref("00:00"));

const tab = ref(null); // pestaña inicial

const editando = ref(false);
const alert = new Alert();

// --- Inventario ---
const insumos = ref([]);
const dialogInsumo = ref(false);
const nuevoInsumo = reactive({
  id: null,
  nombre: "",
  cantidad: 0,
  unidad: "",
  precio_unitario: 0,
});
const insumosConfig = {
  fields: [
    { key: "id", title: "ID", canBeFiltered: false },
    { key: "nombre", title: "Nombre", canBeFiltered: true },
    { key: "cantidad", title: "Cantidad", canBeFiltered: false },
    { key: "unidad", title: "Unidad", canBeFiltered: true },
    { key: "precio_unitario", title: "Precio Unitario", canBeFiltered: false },
    { key: "fechaCreacion", title: "Fecha de Creacion", canBeFiltered: false },
  ],
  buttons: [
    {
      buttonId: "agregar",
      text: "Agregar",
      icon: "mdi-plus",
      color: "green",
      require: false,
    },
    {
      buttonId: "editar",
      text: "Editar",
      icon: "mdi-pencil",
      color: "blue",
      require: true,
    },
    {
      buttonId: "eliminar",
      text: "Eliminar",
      icon: "mdi-delete",
      color: "red",
      require: true,
    },
  ],
  selectConfig: { idRowData: "id" },
  mainColor: "blue",
  multipleSelect: false,
  disablePagination: false,
};

async function onInventarioAction(buttonId, payload) {
  const id = Array.isArray(payload) ? payload[0] : payload;

  // NUEVA VENTA
  if (buttonId === "agregar") {
    editando.value = false;
    Object.assign(nuevoInsumo, {
      id: null,
      nombre: "",
      cantidad: 0,
      unidad: "",
      precio_unitario: 0,
    });
    dialogInsumo.value = true;
    return;
  }

  // SI NO HAY ID válido, salimos
  if (!id) return;

  // BUSCAMOS EL OBJETO UNA VEZ
  const sel = insumos.value.find((v) => v.id === id);
  console.log("sel", sel);
  if (!sel) return;

  // EDITAR
  if (buttonId === "editar") {
    editando.value = true;
    console.log;
    Object.assign(nuevoInsumo, {
      id: sel.id,
      nombre: sel.nombre,
      cantidad: +sel.cantidad,
      unidad: sel.unidad,
      precio_unitario: sel.precio_unitario,
    });
    dialogInsumo.value = true;
    return;
  }

  // ELIMINAR
  if (buttonId === "eliminar") {
    await alert.alertConfirm({
      action: "eliminar",
      obj: `venta #${sel.id}`,
      data: { id },
      onConfirm: async ({ id }) => {
        // petición DELETE al backend
        await axios.delete(`insumos/${id}/`);
        return { ok: true };
      },
      onSuccess: () => {
        // quitamos localmente la venta eliminada
        insumos.value = insumos.value.filter((v) => v.id !== id);
      },
    });
  }
}

// --- Merma ---
const mermas = ref([]);
const dialogMerma = ref(false);
const editandoMerma = ref(false);
const nuevoMerma = reactive({ id: null, cantidad: 0, insumo_id: null });
const mermaConfig = reactive({
  fields: [
    { key: "id", title: "ID", canBeFiltered: false },
    { key: "cantidad", title: "Cantidad", canBeFiltered: false },
    { key: "insumo", title: "Insumo", canBeFiltered: false },
    { key: "fecha_merma", title: "Fecha", canBeFiltered: false },
  ],
  buttons: [
    {
      buttonId: "agregar",
      text: "Agregar",
      icon: "mdi-plus",
      color: "green",
      require: false,
    },
    {
      buttonId: "editar",
      text: "Editar",
      icon: "mdi-pencil",
      color: "blue",
      require: true,
    },
    {
      buttonId: "eliminar",
      text: "Eliminar",
      icon: "mdi-delete",
      color: "red",
      require: true,
    },
  ],
  selectConfig: { idRowData: "id" },
  mainColor: "light-green",
  multipleSelect: true,
  disablePagination: false,
});

async function onMermaAction(buttonId, payload) {
  // extraer id (payload puede venir como array si tienes multipleSelect)
  const id = Array.isArray(payload) ? payload[0] : payload;

  // 1. AGREGAR
  if (buttonId === "agregar") {
    editandoMerma.value = false;
    Object.assign(nuevoMerma, { id: null, cantidad: 0, insumo_id: null });
    dialogMerma.value = true;
    return;
  }

  // 2. si no hay id válido, salimos
  if (!id) return;

  // 3. buscamos la merma seleccionada
  const sel = mermas.value.find((m) => m.id === id);
  if (!sel) return;

  // 4. EDITAR
  if (buttonId === "editar") {
    editandoMerma.value = true;
    Object.assign(nuevoMerma, {
      id: sel.id,
      cantidad: +sel.cantidad,
      insumo: sel.insumo,
    });
    dialogMerma.value = true;
    return;
  }

  // 5. ELIMINAR
  if (buttonId === "eliminar") {
    await alert.alertConfirm({
      action: "eliminar",
      obj: `merma #${sel.id}`,
      data: { id },
      onConfirm: async ({ id }) => {
        // petición DELETE al backend
        await api.delete(`mermas/${id}/`);
        return { ok: true };
      },
      onSuccess: () => {
        // actualizamos la lista local
        mermas.value = mermas.value.filter((m) => m.id !== id);
      },
    });
  }
}

// Carga los datos al montar el componente
onMounted(async () => {
  try {
    const [resInsumos, resMermas] = await Promise.all([
      api.get("insumos/"),
      api.get("mermas/"),
    ]);
    insumos.value = resInsumos.data.results.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      cantidad: i.cantidad,
      unidad: i.unidad,
      precio_unitario: `$${parseFloat(i.precio_unitario).toFixed(2)}`,
      fechaCreacion: new Date(i.fecha_creacion).toLocaleDateString(),
    }));

    mermas.value = resMermas.data.results.map((m) => ({
      id: m.id,
      cantidad: m.cantidad,
      insumo: m.insumo_nombre,
      fecha_merma: new Date(m.fecha_merma).toLocaleDateString(),
    }));
    console.log("Datos cargados:", resMermas.data.results);
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
/* Si quieres mantener sticky headers o estilos adicionales */
</style>
