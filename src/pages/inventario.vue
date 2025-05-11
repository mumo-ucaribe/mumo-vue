<template>
  <v-app>
    <AppHeader page="inventario" />
    <v-main>
      <v-container fluid class="pa-4">
        <div class="mb-4">
          <span class="font-weight-bold">Tiempo conectado:</span> 00:00
        </div>

        <v-row dense>
          <!-- FORMULARIO MERMA -->
          <v-col cols="12" md="6">
            <v-sheet elevation="1" color="light-green lighten-5" class="rounded-lg pa-4 mb-6">
              <!-- Insumo -->
              <v-row align="center" class="mb-4">
                <v-col cols="4">
                  <v-sheet color="light-green lighten-3" class="pa-3 text-center font-weight-bold">
                    Insumo
                  </v-sheet>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="form.insumo"
                    filled
                    rounded
                    color="light-green lighten-5"
                    dense
                    hide-details
                    placeholder="Nombre Insumo"
                  />
                </v-col>
              </v-row>

              <!-- Cantidad + Unidad -->
              <v-row align="center" class="mb-4">
                <v-col cols="4">
                  <v-sheet color="light-green lighten-3" class="pa-3 text-center font-weight-bold">
                    Cantidad
                  </v-sheet>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model.number="form.cantidad"
                    type="number"
                    filled
                    rounded
                    color="light-green lighten-5"
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="4">
                  <v-sheet color="light-green lighten-3" class="pa-3 text-center font-weight-bold">
                    Unidad de medida
                  </v-sheet>
                </v-col>
                <v-col cols="2">
                  <v-select
                    v-model="form.unidad"
                    :items="unidades"
                    filled
                    rounded
                    color="light-green lighten-5"
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>

              <!-- Costo por unidad -->
              <v-row align="center" class="mb-4">
                <v-col cols="4">
                  <v-sheet color="light-green lighten-3" class="pa-3 text-center font-weight-bold">
                    Costo por unidad
                  </v-sheet>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="form.costo"
                    prefix="$"
                    type="number"
                    filled
                    rounded
                    color="light-green lighten-5"
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>

              <!-- Fecha -->
              <v-row align="center" class="mb-4">
                <v-col cols="4">
                  <v-sheet color="light-green lighten-3" class="pa-3 text-center font-weight-bold">
                    Fecha
                  </v-sheet>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="form.fecha"
                    type="date"
                    filled
                    rounded
                    color="light-green lighten-5"
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>

              <!-- Botón agregar -->
              <div class="text-center">
                <v-btn
                  depressed
                  rounded
                  class="mt-4"
                  style="background-color: #bfdd8f; text-decoration: underline"
                  large
                  @click="agregarMerma"
                >
                  Agregar merma
                </v-btn>
              </div>
            </v-sheet>
          </v-col>

          <!-- VISUALIZACIÓN DE MERMA -->
          <v-col cols="12" md="6">
            <v-sheet elevation="1" color="light-green lighten-5" class="rounded-lg">
              <v-sheet color="light-green lighten-3" class="pa-2 rounded-t-lg">
                <span class="subtitle-1 font-weight-bold">Visualización de merma</span>
              </v-sheet>

              <v-data-table
                :headers="mermaHeaders"
                :items="mermas"
                hide-default-footer
                dense
                class="rounded-b-lg"
                style="max-height: 400px; overflow-y: auto"
              >
                <template #item.acciones="{ item, index }">
                  <v-btn icon color="red" @click="eliminarMerma(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-sheet>
          </v-col>
        </v-row>

        <!-- BOTONES DE PÁGINA -->
        <v-row class="mt-6" align="center" justify="space-between">
          <v-btn icon color="light-green lighten-3" to="/inicio">
            <v-icon color="green darken-2">mdi-home</v-icon>
          </v-btn>

          <div>
            <v-btn
              depressed
              rounded
              class="mx-2"
              style="background-color: #bfdd8f; text-decoration: underline"
              large
              @click="guardarCambios"
            >
              Guardar cambios
            </v-btn>
            <v-btn
              depressed
              rounded
              class="mx-2"
              style="background-color: #bfdd8f; text-decoration: underline"
              large
              @click="cancelar"
            >
              Cancelar
            </v-btn>
          </div>

          <v-btn icon color="light-green lighten-3" to="/ventas">
            <v-icon color="green darken-2">mdi-arrow-left</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Swal from 'sweetalert2'

const form = reactive({
  insumo: '',
  cantidad: 1,
  unidad: 'kg',
  costo: 0.0,
  fecha: ''
})

const unidades = ['kg', 'g', 'l']

const mermaHeaders = [
  { text: 'Insumo', value: 'insumo' },
  { text: 'Cantidad', value: 'cantidad' },
  { text: 'Costo por unidad', value: 'costo' },
  { text: 'Fecha', value: 'fecha' },
  { text: 'Acciones', value: 'acciones', sortable: false }
]

const mermas = ref([])

function agregarMerma() {
  if (
    !form.insumo.trim() ||
    form.cantidad <= 0 ||
    !form.unidad ||
    form.costo === null ||
    form.costo < 0 ||
    !form.fecha
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos o inválidos',
      text: 'Por favor llena correctamente todos los campos.',
      confirmButtonColor: '#d33'
    })
    return
  }

  mermas.value.push({
    insumo: form.insumo,
    cantidad: form.cantidad,
    costo: `$${parseFloat(form.costo).toFixed(2)}`,
    fecha: form.fecha
  })

  form.insumo = ''
  form.cantidad = 1
  form.unidad = 'kg'
  form.costo = 0
  form.fecha = ''
}

function eliminarMerma(index) {
  mermas.value.splice(index, 1)
}

function guardarCambios() {
  console.log('Guardando mermas…', mermas.value)
}

function cancelar() {
  console.log('Operación cancelada')
}
</script>


<style scoped></style>
