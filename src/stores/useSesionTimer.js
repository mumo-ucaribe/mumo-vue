// src/stores/useSesionTimer.js
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { removeAuthToken } from '@/plugins/axios'

const TIEMPO_INACTIVIDAD = 30 * 60 * 1000  // 30 minutos

export function useSesionTimer() {
  const router = useRouter()
  let timer = null

  function resetearTimer() {
    clearTimeout(timer)
    timer = setTimeout(() => {
      removeAuthToken()
      alert('Sesión cerrada por inactividad.')
      router.push({ name: 'Login' })
    }, TIEMPO_INACTIVIDAD)
  }

  function iniciarSesionTimer() {
    resetearTimer()
    document.addEventListener('mousemove', resetearTimer)
    document.addEventListener('keydown',   resetearTimer)
    document.addEventListener('click',     resetearTimer)
  }

  function detenerTimer() {
    clearTimeout(timer)
    document.removeEventListener('mousemove', resetearTimer)
    document.removeEventListener('keydown',   resetearTimer)
    document.removeEventListener('click',     resetearTimer)
  }

  onUnmounted(detenerTimer)

  return {
    iniciarSesionTimer,
    resetearTimer,
    detenerTimer
  }
}
