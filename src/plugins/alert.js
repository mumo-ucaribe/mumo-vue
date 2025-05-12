import Swal from 'sweetalert2'

export default class Alert {
  constructor() {}

  async alertConfirm(config) {
    const result = await Swal.fire({
      customClass: {
        container: 'swal2-container--above-vuetify'
      },
      title: `¿Deseas ${config.action} ${config.obj}?`,
      text: '',
      icon: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#a9a5a5',
      confirmButtonText: config.action.charAt(0).toUpperCase() + config.action.slice(1),
      cancelButtonText: 'Regresar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await config.onConfirm(config.data) // Llamada manual que tú defines
          return response
        } catch (error) {
          Swal.showValidationMessage(`Error: ${error.message || error}`)
          return false
        }
      },
    })

    if (result.isConfirmed && result.value) {
      if (result.value.ok) {
        await Swal.fire({
          title: 'Éxito',
          text: 'La operación se realizó correctamente',
          icon: 'success',
        })
        config.onSuccess(result.value)
      } else {
        await Swal.fire(
          `Error ${config.obj}`,
          result.value.error || 'Ocurrió un error desconocido',
          'error'
        )
      }
    }
  }

  alert(config) {
    Swal.fire({
      title: config.title,
      text: config.subtitle,
      icon: config.icon,
    })
  }


  
}
