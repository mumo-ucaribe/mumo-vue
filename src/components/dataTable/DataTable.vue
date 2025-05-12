<template>
  <div>
    <!-- Botones superiores -->
    <div class="buttons sticky-buttons">
      <v-btn
        v-for="btn in config.buttons"
        :key="btn.buttonId"
        class="ma-1"
        :icon="btn.iconOnly"
        :color="btn.color || buttonColor"
        :variant="btn.iconOnly ? 'elevated' : 'outlined'"
        @click="handleClick(btn)"
      >
        <v-icon v-if="btn.icon">{{ btn.icon }}</v-icon>
        <template v-if="!btn.iconOnly">{{ btn.text }}</template>
      </v-btn>
    </div>

    <!-- Filtro global -->
    <v-row class="my-4">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="filter"
          label="Buscar..."
          append-icon="mdi-magnify"
          hide-details
          dense
        />
      </v-col>
    </v-row>

    <!-- Tabla -->
    <v-data-table
      :headers="vHeaders"
      :items="filteredData"
      v-model="selectedRow"
      v-model:sort-by="sortBy"
      show-select
      return-object
      item-value="config.selectConfig.idRowData"
      :hide-default-footer="config.disablePagination"
      disable-pagination
      :select-strategy="multipleSelect ? 'all' : 'single'"
      dense
      class="elevation-1"
      loading-text="Cargando información"
      no-data-text="Datos no encontrados"
      >
      <!-- @click:row="onRowClick" -->
      <!-- Encabezado con filtros -->
      <template v-for="col in vHeaders" #[`header.${col.value}`]>
        <ColumnHeaderWithFilter
          v-if="col.canBeFiltered"
          :key="col.value"
          :field="col"
          :column="col.value"
          :items="data"
          :multiSearch="multiSearch"
        />
        <template v-else>{{ col.text }}</template>
      </template>

      <!-- Celdas con botones o formatos -->
      <template
        v-for="f in formatFields"
        :key="f.key"
        #[`item.${f.key}`]="{ item }"
      >
        <div v-if="!f.buttons" v-html="f.format(item)" />
        <div v-else>
          <v-btn
            v-for="b in f.buttons"
            :key="b.buttonId"
            :icon="b.iconOnly"
            :color="b.color"
            :variant="b.iconOnly ? 'elevated' : 'outlined'"
            v-show="b.showBy ? item[b.showBy] : true"
            @click.stop="handleClick(b, item)"
          >
            <v-icon v-if="b.icon">{{ b.icon }}</v-icon>
            <template v-if="!b.iconOnly">{{ b.text }}</template>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";

const props = defineProps({
  data: Array,
  config: Object,
  pageRows: Number,
});
const emit = defineEmits(["buttonClick"]);

const filter = ref("");
const selectedRow = ref([]); // sigue siendo un array de objetos
const multiSearch = ref({});

const multipleSelect = props.config.multipleSelect ?? true;
const buttonColor = props.config.mainColor || "light-green darken-1";

// Map config.fields → Vuetify headers
const vHeaders = computed(() =>
  props.config.fields.map((f) => ({
    text: f.title,
    value: f.key,
    canBeFiltered: f.canBeFiltered,
  })),
);

// Orden
const sortBy = ref(
  Array.isArray(props.config.orderByCol?.Field)
    ? props.config.orderByCol.Field
    : [],
);

// Campos con formatos o botones
const formatFields = computed(() =>
  props.config.fields.filter((f) => f.format || f.buttons),
);

// Filtro global + columnas
const filteredData = computed(() =>
  props.data
    .filter((item) =>
      Object.entries(multiSearch.value).every(([key, vals]) => {
        if (!vals?.length) return true;
        const raw = String(item[key] || "").toUpperCase();
        const values = raw.split(",").map((v) => v.trim());
        return vals.some((v) => values.includes(v.toUpperCase()));
      }),
    )
    .filter((item) =>
      JSON.stringify(item).toLowerCase().includes(filter.value.toLowerCase()),
    ),
);

// === Función de manejo de botones (sin cambios) ===
async function handleClick(btn, item = null) {
  const idField = props.config.selectConfig.idRowData;
  let payloadValue;

  if (item) {
    payloadValue = item[idField];
  } else if (multipleSelect) {
    payloadValue = selectedRow.value.map((r) => r[idField]);
  } else {
    payloadValue = selectedRow.value[0]?.[idField];
  }

  if (btn.require) {
    const count = Array.isArray(payloadValue)
      ? payloadValue.length
      : payloadValue != null
        ? 1
        : 0;
    if (count === 0) {
      await Swal.fire("Seleccione al menos un registro", "", "error");
      return;
    }
  }
  if (
    btn.limitRequire &&
    Array.isArray(payloadValue) &&
    payloadValue.length > btn.limitRequire
  ) {
    await Swal.fire(`Máximo ${btn.limitRequire} registro(s)`, "", "error");
    return;
  }
  if (btn.confirm) {
    const result = await Swal.fire({
      title: `¿Deseas ${btn.text.toLowerCase()}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
  }

  emit("buttonClick", btn.buttonId, payloadValue);
  selectedRow.value = [];
}

// === Nueva función para toggle de selección al clickar la fila ===
function onRowClick(_event, row) {
  const idField = props.config.selectConfig.idRowData;
  const idx = selectedRow.value.findIndex((r) => r[idField] === row[idField]);
  if (idx > -1) {
    // Si ya estaba seleccionada, la quitamos
    selectedRow.value.splice(idx, 1);
  } else {
    // Si no, añadimos (single o multiple según config)
    if (multipleSelect) {
      selectedRow.value.push(row);
    } else {
      selectedRow.value = [row];
    }
  }
}
</script>

<style scoped>
.sticky-buttons {
  position: sticky;
  top: 70px;
  z-index: 5;
  background: white;
  padding: 8px 0;
}
</style>
