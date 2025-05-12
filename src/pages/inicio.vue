<template>
  <!-- Header -->
  <AppHeader page="ventas" />

  <!-- Contenedor principal como v-card flat -->
  <v-card flat class="card-full-height pa-4 container-full-height">
    <!-- Tiempo conectado -->
    <div class="mb-4">
      <span class="font-weight-bold">Tiempo conectado:</span>
      {{ tiempoConectado }}
    </div>

    <v-row dense class="row-full-height">
      <!-- Columna izquierda -->
      <v-col cols="12" md="8" class="col-left">
        <!-- Pedidos al 50% -->
        <v-card flat elevation="1" class="section half-height mb-4">
          <v-card-title class="pa-2 light-green lighten-3 subtitle-1 font-weight-bold">
            Pedidos más cercanos
          </v-card-title>
          <div class="scroll-area pa-2" >
            <v-data-table
              :headers="pedidosHeaders"
              :items="pedidos"
              hide-default-footer
              class="elevation-0"
            />
          </div>
        </v-card>

        <!-- Inventario al 50% -->
        <v-card flat elevation="1" class="section half-height">
          <v-card-title class="pa-2 light-green lighten-3 subtitle-1 font-weight-bold">
            Inventario
          </v-card-title>
          <div class="scroll-area pa-2">
            <v-data-table
              :headers="inventarioHeaders"
              :items="inventario"
              hide-default-footer
              class="elevation-0"
            />
          </div>
        </v-card>
      </v-col>

      <!-- Columna derecha -->
      <v-col cols="12" md="4" class="col-right">
        <v-card flat elevation="1" class="section full-height">
          <v-card-title class="pa-2 light-green lighten-3 subtitle-1 font-weight-bold">
            ResumenVenta
          </v-card-title>
          <div class="scroll-area pa-2">
            <v-list dense>
              <v-list-item v-for="(p, i) in resumenVenta" :key="i">
                <v-list-item-content>
                  <v-list-item-title class="body-1">- {{ p }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { inject, ref, onMounted } from "vue";
import axios from "@/plugins/axios";

// inyección con fallback
const tiempoConectado = inject("tiempoConectado", ref("00:00"));

//estados reactivos
const pedidos = ref([]);
const pedidosCount = ref(0);
const inventario = ref([]);
const inventarioCount = ref(0);
const resumenVenta = ref([]);
const loading = ref(false);
const error = ref(null);

// headers para las tablas
const pedidosHeaders = [
  { title: "Recetas", key: "receta" },
  { title: "Total ($)", key: "total" },
  { title: "Completada", key: "completada" },
  { title: "Fecha de venta", key: "fecha_venta" },
];
const inventarioHeaders = [
  { title: "Nombre", key: "nombre" },
  { title: "Cantidad", key: "cantidad" },
  { title: "Unidad", key: "unidad" },
  { title: "Precio unitario", key: "precio_unitario" },
  { title: "Fecha de creación", key: "fecha_creacion" },
];

// fetch de datos
const fetchData = async () => {
  loading.value = true;
  try {
    const [vRes, iRes, rRes] = await Promise.all([
      axios.get("ventas/"),
      axios.get("insumos/"),
      axios.get("ventas/resumen_ventas/"),
    ]);

    // Guardamos el count y el array de resultados
    pedidosCount.value = vRes.data.count;
    pedidos.value = vRes.data.results.map((v) => ({
      ...v,
      completada: v.completada ? "Sí" : "No",
      fecha_venta: new Date(v.fecha_venta).toLocaleDateString(),
      // recetas: iRes.data
      //   .filter((i) => v.insumos.includes(i.id))
      //   .map((i) => i.nombre)
      //   .join(", "),
    }));

    inventarioCount.value = iRes.data.count;
    inventario.value = iRes.data.results.map((i) => ({
      ...i,
      fecha_creacion: new Date(i.fecha_creacion).toLocaleDateString(),
    }));

    // Formateamos el resumen
    const { total_ventas, ventas_pendientes, monto_total } = rRes.data;
    resumenVenta.value = [
      `Total de ventas: ${total_ventas}`,
      `Ventas pendientes: ${ventas_pendientes}`,
      `Monto total: $${monto_total}`,
    ];

    error.value = null;
  } catch (e) {
    console.error(e);
    error.value = "Error cargando datos";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* Altura total en el v-card principal */
.card-full-height {
  height: 87vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Contenedor interior sin scroll externo */
.container-full-height {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Fila que reparte columnas y oculta overflow */
.row-full-height {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Columnas estilo flex-col */
.col-left,
.col-right {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Secciones dentro de columnas */
.section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
}

/* Mitad de altura (= 50%) */
.half-height {
  flex: 1;
  min-height: 0;
}

/* Altura completa */
.full-height {
  flex: 1;
  min-height: 0;
}

/* Área scrollable interna */
.scroll-area {
  flex: 1;
  overflow-y: auto;
}
</style>