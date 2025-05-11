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
      :headers="headers"
      :items="filteredData"
      v-model="selectedRow"
      v-model:sort-by="config.orderByCol.Field"
      :items-per-page="pageRows || 15"
      :hide-default-footer="config.disablePagination"
      show-select
      dense
      class="elevation-1"
      loading-text="Cargando información"
      no-data-text="Datos no encontrados"
      @click:row="rowClick"
    >
      <!-- Encabezado con filtros -->
      <template v-for="col in headers" #[`header.${col.value}`]>
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
        :key="f.value"
        #[`item.${f.value}`]="{ item }"
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
            @click="handleClick(b, item)"
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
const selectedRow = ref([]);
const multiSearch = ref({});

const buttonColor = props.config.mainColor || "light-green darken-1";
const headers = props.config.fields;

const formatFields = computed(() =>
  headers.filter((f) => f.format || f.buttons),
);

// Filtrado completo
const filteredData = computed(() => {
  return props.data
    .filter((item) =>
      Object.entries(multiSearch.value).every(([key, vals]) => {
        if (!vals?.length) return true;
        const raw = (item[key] || "").toString().toUpperCase();
        const values = raw.split(",").map((v) => v.trim());
        return vals.some((v) => values.includes(v.toUpperCase()));
      }),
    )
    .filter((item) =>
      JSON.stringify(item).toLowerCase().includes(filter.value.toLowerCase()),
    );
});

// Manejador general de clics en botones
async function handleClick(btn, item = null) {
  const require = btn.require || false;
  const limit = btn.limitRequire || 0;

  const payload = item
    ? [item[props.config.selectConfig.idRowData]]
    : selectedRow.value.map((r) => r[props.config.selectConfig.idRowData]);

  if (require && payload.length === 0) {
    return Swal.fire("Seleccione al menos un registro", "", "error");
  }

  if (limit && payload.length > limit) {
    return Swal.fire(`Máximo ${limit} registro(s)`, "", "error");
  }

  if (btn.confirm) {
    const result = await Swal.fire({
      title: `¿Deseas ${btn.text.toLowerCase()} el/los registro(s)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;
  }

  emit("buttonClick", btn.buttonId, item ? payload[0] : payload);
  selectedRow.value = [];
}

function rowClick(item, row) {
  row.select(true);
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
