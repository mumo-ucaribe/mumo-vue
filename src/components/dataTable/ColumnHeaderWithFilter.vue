<template>
    <div class="d-flex align-center" @click.stop>
      {{ field.text }}
      <v-menu
        v-if="field.canBeFiltered"
        v-model="tooltip"
        offset-y
        open-on-click
        :close-on-content-click="false"
      >
        <template #activator="{ props }">
          <v-btn flat icon v-bind="props" @click.stop>
            <v-icon x-small>mdi-filter</v-icon>
          </v-btn>
        </template>
  
        <v-card @click.stop>
          <v-card-text>
            <v-combobox
              v-model="multiSearch[column]"
              :items="uniqueValues"
              :label="`Filtrar por ${field.text}`"
              multiple
              clearable
              dense
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    field: Object,
    column: String,
    items: Array,
    multiSearch: Object,
  });
  
  const tooltip = ref(false);
  
  const uniqueValues = computed(() => {
    const valores = props.items.map(item => (item[props.column] || '').toString());
    return [...new Set(valores.flatMap(v => v.split(',').map(s => s.trim().toUpperCase())))];
  });
  </script>
  