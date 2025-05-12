<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { differenceInSeconds }   from 'date-fns'

// crear el ref y proveer para toda la app
const tiempoConectado = ref('00:00')
provide('tiempoConectado', tiempoConectado)

let startTime
let intervalId

// función que formatea segundos a MM:SS
function formatMMSS(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

onMounted(() => {
  // guardamos el inicio
  startTime = new Date()
  // cada segundo calculamos segundos transcurridos
  intervalId = setInterval(() => {
    const secs = differenceInSeconds(new Date(), startTime)
    tiempoConectado.value = formatMMSS(secs)
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style>
.swal2-container {
  z-index: 3000 !important;
}
</style>