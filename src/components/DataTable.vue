<template>
  <div>
    <!-- Botones adhesivos -->
    <div
      class="buttons"
      style="
        position: sticky;
        top: 70px;
        z-index: 5;
        background: white;
        padding: 8px 0;
      "
    >
      <v-btn
        v-for="btn in config.buttons"
        :key="btn.buttonId"
        class="ma-1"
        outlined
        :color="buttonColor"
        @click="handleClick(btn)"
      >
        <i :class="btn.icon" /> {{ btn.text }}
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
      :headers="config.fields"
      :items="filteredData"
      v-model="selectedRow"
      :sort-by.sync="config.orderByCol.Field"
      :items-per-page="pageRows || 15"
      :hide-default-footer="config.disablePagination"
      show-select
      dense
      class="elevation-1"
      loading-text="Cargando información"
      no-data-text="Datos no encontrados"
      @click:row="rowClick"
      style="overflow-x: auto"
    >
      <!-- Slot para filtros por columna -->
      <template v-for="(h, i) in config.fields" #[`header.${h.value}`]="{}">
        <div class="d-flex align-center">
          {{ h.text }}
          <v-menu
            v-if="h.canBeFiltered && !h.buttons"
            v-model="tooltips[i]"
            offset-y
            open-on-hover
          >
            <!-- ↓ Vuetify 3 style: use a single props object ↓ -->
            <template #activator="{ props }">
              <v-btn icon v-bind="props">
                <v-icon small>mdi-filter</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-combobox
                  v-model="multiSearch[h.value]"
                  :items="getUnique(h.value)"
                  :label="`Filtrar por ${h.text}`"
                  multiple
                  clearable
                  dense
                />
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
      </template>

      <!-- Slot para formato de celdas y botones -->
      <template v-for="f in formatFields" #[`item.${f.value}`]="{ item }">
        <div v-if="!f.buttons" v-html="f.format(item)" :key="f" />
        <div :key="f.value" v-else>
          <v-btn
            v-for="b in f.buttons"
            :key="b.buttonId"
            small
            outlined
            :color="b.color"
            v-show="b.showBy ? item[b.showBy] : true"
            @click="handleClick(b, item)"
          >
            {{ b.text }}
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  data: Array,
  config: Object,
  pageRows: Number,
});
const emit = defineEmits(["buttonClick"]);

const filter = ref("");
const selectedRow = ref([]);
const multiSearch = ref({});
const tooltips = ref([]);

// Color fijo o desde config
const buttonColor = props.config.mainColor || "light-green darken-1";

// Campos con formato o botones
const formatFields = computed(() =>
  props.config.fields.filter((f) => f.format || f.buttons),
);

// Datos filtrados: primero filtros por columna, luego búsqueda global
const filteredData = computed(() =>
  props.data
    .filter((item) =>
      Object.entries(multiSearch.value).every(([key, vals]) => {
        if (!vals?.length) return true;
        const raw = getValue(item, key);
        const values = raw
          .toUpperCase()
          .split(",")
          .map((v) => v.trim());
        return vals.some((v) => values.includes(v.toUpperCase()));
      }),
    )
    .filter((item) =>
      JSON.stringify(item).toLowerCase().includes(filter.value.toLowerCase()),
    ),
);

// Obtiene valores únicos para los filtros
function getUnique(key) {
  const field = props.config.fields.find((f) => f.value === key);
  return [
    ...new Set(
      props.data.flatMap((item) => {
        const val = field?.format
          ? stripHtml(field.format(item))
          : item[key] || "";
        return val
          .toString()
          .split(",")
          .map((v) => v.trim().toUpperCase());
      }),
    ),
  ];
}

// Valor limpio para buscar
function getValue(item, key) {
  const field = props.config.fields.find((f) => f.value === key);
  return field?.format
    ? stripHtml(field.format(item))
    : (item[key] ?? "").toString();
}

// Elimina etiquetas HTML
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "");
}

// Maneja click de botones (genérico)
function handleClick(btn, item = null) {
  const require = btn.require || false;
  const limit = btn.limitRequire || 0;

  const payload = item
    ? [item[props.config.selectConfig.idRowData]]
    : selectedRow.value.map((r) => r[props.config.selectConfig.idRowData]);

  if (require && payload.length === 0) {
    return $swal("Seleccione al menos un registro", "", "error");
  }
  if (limit && payload.length > limit) {
    return $swal(`Máximo ${limit} registro(s)`, "", "error");
  }

  emit("buttonClick", btn.buttonId, item ? payload[0] : payload);
  selectedRow.value = [];
}

// Selecciona fila al hacer click
function rowClick(item, row) {
  row.select(true);
}
</script>

<style scoped></style>
