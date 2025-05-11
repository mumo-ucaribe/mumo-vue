import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const tiempoMaximoInactividad = 30 * 60 * 1000; // 30 minutos en ms

export function useSesionTimer() {
  const router = useRouter();
  const tiempoUltimaActividad = ref(Date.now());
  let timer = null;

  const iniciarSesionTimer = () => {
    tiempoUltimaActividad.value = Date.now();
    resetearTimer();

    document.addEventListener('mousemove', resetearTimer);
    document.addEventListener('keydown', resetearTimer);
  };

  const resetearTimer = () => {
    tiempoUltimaActividad.value = Date.now();

    clearTimeout(timer);
    timer = setTimeout(() => {
      alert('Sesión cerrada por inactividad.');
      router.push('/'); // Redirige al inicio o login
    }, tiempoMaximoInactividad);
  };

  const detenerTimer = () => {
    clearTimeout(timer);
    document.removeEventListener('mousemove', resetearTimer);
    document.removeEventListener('keydown', resetearTimer);
  };

  onUnmounted(() => {
    detenerTimer();
  });

  return {
    iniciarSesionTimer,
    resetearTimer,
  };
}
