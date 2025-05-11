<template>
  <v-sheet color="#BFDD8F" class="pa-4 w-100">
    <div v-if="isLogin" class="d-flex justify-center">
      <span class="text-h5 font-weight-bold">MUMO</span>
    </div>
    <div v-else class="d-flex justify-space-between align-center w-100">
      <!-- título -->
      <span class="text-h5 font-weight-bold cursor-pointer" @click="irAInicio">MUMO</span>
      <!-- botones -->
      <div class="d-flex">
        <v-btn
          v-for="item in navItems"
          :key="item.to"
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const props = defineProps({
  page: String,
  tieneCambios: Boolean,
  guardarCambios: Function
})

const isLogin = computed(() => props.page === 'login')

const navItems = [
  { nombre: 'ventas', to: '/ventas' },
  { nombre: 'inventario', to: '/inventario' },
  { nombre: 'reportes', to: '/reportes' },
  { nombre: 'recetas', to: '/recetas' }
]

async function irAInicio() {
  if (props.tieneCambios) {
    const result = await Swal.fire({
      title: '¿Salir sin guardar cambios?',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Salir sin guardar',
      confirmButtonColor: '#e74c3c',
      denyButtonText: 'Guardar cambios',
      denyButtonColor: '#27ae60',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      router.push('/inicio')
    } else if (result.isDenied) {
      await props.guardarCambios()
      router.push('/inicio')
    }
  } else {
    router.push('/inicio')
  }
}
</script>
