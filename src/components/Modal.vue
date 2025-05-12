<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    :fullscreen="fullscreen"
    :max-width="maxWidth"
    :class="customClass"
    :persistent="persistent"
    :transition="fullscreen ? 'dialog-bottom-transition' : 'dialog-transition'"
  >
    <v-card>
      <!-- Toolbar con botón de cerrar -->
      <v-toolbar :color="toolbarColor" dark>
        <v-btn icon @click="updateModelValue(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>

      <!-- Contenido -->
      <v-card-text class="my-2 mx-6">
        <slot />
      </v-card-text>

      <v-divider />

      <!-- Footer con slot y botón de cerrar por defecto -->
      <v-card-actions v-if="showFooter">
        <slot name="footer">
          <v-btn color="primary" @click="updateModelValue(false)">
            Cerrar
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: [String, Number],
    default: 800
  },
  customClass: {
    type: String,
    default: ''
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  toolbarColor: {
    type: String,
    default: '#BFDD8F'
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

function updateModelValue(val) {
  emit('update:modelValue', val)
}
</script>
