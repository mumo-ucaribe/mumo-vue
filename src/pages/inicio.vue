<template>
    <v-app>
      <!-- HEADER OCUPANDO TODO EL ANCHO -->
      <AppHeader page="ventas" />
  
      <v-main>
        <v-container fluid class="pa-4">
          <!-- Tiempo conectado -->
          <div class="mb-4">
            <span class="font-weight-bold">Tiempo conectado:</span> 00:00
          </div>
  
          <v-row dense>
            <!-- COLUMNA IZQUIERDA: Pedidos + Inventario -->
            <v-col cols="12" md="8">
              <!-- Pedidos más cercanos -->
              <v-sheet elevation="1" color="light-green lighten-5" class="rounded-lg mb-6">
                <v-sheet color="light-green lighten-3" class="pa-2 rounded-t-lg">
                  <span class="subtitle-1 font-weight-bold">Pedidos más cercanos</span>
                </v-sheet>
                <v-data-table
                  :headers="pedidosHeaders"
                  :items="pedidos"
                  hide-default-footer
                  class="rounded-b-lg"
                  style="max-height: 200px; overflow-y: auto;"
                />
              </v-sheet>
  
              <!-- Inventario -->
              <v-sheet elevation="1" color="light-green lighten-5" class="rounded-lg">
                <v-sheet color="light-green lighten-3" class="pa-2 rounded-t-lg">
                  <span class="subtitle-1 font-weight-bold">Inventario</span>
                </v-sheet>
                <v-data-table
                  :headers="inventarioHeaders"
                  :items="inventario"
                  hide-default-footer
                  class="rounded-b-lg"
                  style="max-height: 200px; overflow-y: auto;"
                />
              </v-sheet>
            </v-col>
  
            <!-- COLUMNA DERECHA: Predicciones -->
            <v-col cols="12" md="4">
              <v-sheet elevation="1" color="light-green lighten-5" class="rounded-lg">
                <v-sheet color="light-green lighten-3" class="pa-2 rounded-t-lg">
                  <span class="subtitle-1 font-weight-bold">Predicciones</span>
                </v-sheet>
                <v-list style="max-height: 420px; overflow-y: auto;">
                  <v-list-item
                    v-for="(p, i) in predicciones"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title class="body-1">- {{ p }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import AppHeader from '@/components/AppHeader.vue';
  
  const pedidosHeaders = [
    { text: 'Nombre pedido',       value: 'nombre' },
    { text: 'A nombre de quien',   value: 'cliente' },
    { text: 'Fecha de entrega',    value: 'fecha' },
    { text: 'Días restantes',      value: 'dias' },
  ];
  
  const pedidos = [
    { nombre: 'Pedido 1', cliente: 'Juan Pérez',   fecha: '2025-05-01', dias: 2 },
    { nombre: 'Pedido 2', cliente: 'María López',  fecha: '2025-05-03', dias: 4 },
    { nombre: 'Pedido 3', cliente: 'Luis Gómez',   fecha: '2025-05-05', dias: 6 },
    { nombre: 'Pedido 4', cliente: 'Ana Martínez', fecha: '2025-05-07', dias: 8 },
  ];
  
  const inventarioHeaders = [
    { text: 'Producto',           value: 'producto' },
    { text: 'Cantidad existente', value: 'cantidad' },
  ];
  
  const inventario = [
    { producto: 'Harinas', cantidad: 0 },
    { producto: 'Leche',   cantidad: 5 },
    { producto: 'Huevos',  cantidad: 12 },
  ];
  
  const predicciones = [
    'Platillos con alta probabilidad de pedido',
    'Platillos con alta probabilidad de pedido',
    'Platillos con alta probabilidad de pedido',
    'Platillos con alta probabilidad de pedido',
  ];
  </script>
  
  <style scoped>
  /* Si quieres ajustar más bordes, paddings o radios aquí */
  </style>
  