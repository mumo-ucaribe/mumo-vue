<template>
  <AppHeader page="ventas" />

  <v-container fluid class="pa-4">
    <DataTable
      :data="ventas"
      :config="configVentas"
      :page-rows="10"
      @buttonClick="onTableButton"
    />
  </v-container>

  <v-row class="mt-6 ml-5">
    <v-btn icon rounded="lg" elevation="2" class="ma-2" color="light-green lighten-3" to="/inicio">
      <v-icon color="green darken-2">mdi-home</v-icon>
    </v-btn>
  </v-row>

  <Modal
    v-model="ventasModal"
<Modal
  v-model="ventasModal"
  :title="isEdit ? 'Editar venta' : 'Añadir venta'"
  :isEdit="isEdit"
  :fullscreen="true"
  :showFooter="false"
>
  <VentasForm :venta="isEdit" @close="ventasModal = false" />
</Modal>

    :fullscreen="true"
    :showFooter="false"
  >
    <VentasForm :venta="isEdit" @close="ventasModal = false" @guardar="guardarVenta" />
  </Modal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import Modal from '@/components/Modal.vue'
import VentasForm from '@/components/pagesForms/VentasForm.vue'
import DataTable from '@/components/dataTable/DataTable.vue'

const ventasModal = ref(false)
const isEdit = ref(null)

const ventas = ref([
  { cliente: 'Juan Pérez', contacto: 'juan@mail.com', pedido: 'Tarta', fecha: '2024-05-10', id: 1 },
  { cliente: 'Ana López', contacto: 'ana@mail.com', pedido: 'Pan', fecha: '2024-05-09', id: 2 },
])

const configVentas = reactive({
  rawText: 'Ventas',
  mainColor: 'light-green darken-1',
  fields: [
    { text: 'Cliente', value: 'cliente' },
    { text: 'Contacto', value: 'contacto' },
    { text: 'Pedido', value: 'pedido' },
    { text: 'Fecha', value: 'fecha' },
    { text: 'ID', value: 'id' },
  ],
  orderByCol: { Field: ['fecha'] },
  selectConfig: { idRowData: 'id' },
  selectableRow: false,
  disablePagination: false,
  buttons: [
    { buttonId: 'newSale', text: 'Nueva venta', icon: 'mdi-plus', require: false },
    { buttonId: 'editSale', text: 'Editar o Eliminar venta', icon: 'mdi-pencil', require: true, limitRequire: 1 },
  ],
})

function onTableButton(buttonId, payload) {
  if (buttonId === 'newSale') {
    isEdit.value = null
    ventasModal.value = true
  }
  if (buttonId === 'editSale') {
    const selected = ventas.value.find((vnt) => vnt.id === payload)
    if (selected) {
      isEdit.value = { ...selected }
      ventasModal.value = true
    }
  }
}

function guardarVenta(nuevaVenta) {
  if (isEdit.value) {
    const index = ventas.value.findIndex((v) => v.id === isEdit.value.id)
    if (index !== -1) ventas.value[index] = nuevaVenta
  } else {
    nuevaVenta.id = Date.now()
    ventas.value.push(nuevaVenta)
  }
}
</script>
