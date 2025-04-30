<template>
  <v-sheet color="#BFDD8F" class="pa-4 w-100">
    <div v-if="isLogin" class="d-flex justify-center">
      <span class="text-h5 font-weight-bold">MUMO</span>
    </div>
    <div v-else class="d-flex justify-space-between align-center w-100">
      <!-- título -->
      <span class="text-h5 font-weight-bold">MUMO</span>
      <!-- botones -->
      <div class="d-flex">
        <v-btn
          v-for="item in navItems"
          :key="item"
          depressed
          rounded
          class="mx-2"
          style="text-transform: none"
          color="light-green darken-1"
          :to="item.to"
        >
          {{ item.nombre }}
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  page: {
    type: String,
    required: true,
  },
});

const isLogin = computed(() => props.page === "login");

const navItems = [
  {
    nombre: "ventas",
    to: "/ventas",
  },
  {
    nombre: "inventario",
    to: "/inventario",
  },
  {
    nombre: "reportes",
    to: "/reportes",
  },
  {
    nombre: "recetas",
    to: "/recetas",
  },
];
</script>
