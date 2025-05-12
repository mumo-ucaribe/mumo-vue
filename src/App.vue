<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSesionTimer } from '@/stores/useSesionTimer'; // Asegúrate de tener el archivo stores/useSesionTimer.js

const { iniciarSesionTimer, resetearTimer } = useSesionTimer();
const route = useRoute();

onMounted(() => {
  iniciarSesionTimer();

  // También resetea el timer con interacción del usuario
  window.addEventListener('click', resetearTimer);
  window.addEventListener('keydown', resetearTimer);
  window.addEventListener('mousemove', resetearTimer);
});

watch(
  () => route.fullPath,
  () => {
    resetearTimer(); // Reinicia también al navegar entre páginas
  }
);
</script>
