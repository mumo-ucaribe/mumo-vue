<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions v-if="showFooter" class="justify-end">
        <v-btn color="red" @click="updateModelValue(false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function updateModelValue(value) {
  emit('update:modelValue', value)
}
</script>
