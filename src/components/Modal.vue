<template>
    <v-dialog
      v-model="internalValue"
      :fullscreen="fullscreen"
      max-width="800"
      :class="customClass"
      persistent
    >
      <v-card>
        <v-toolbar :color="mainColor" dark>
          <v-btn icon @click="toggle">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ titulo }}</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
  
        <v-card-text class="my-2 mx-6">
          <slot />
        </v-card-text>
  
        <v-divider />
  
        <v-card-actions v-if="showFooter">
          <slot name="footer">
            <v-btn color="primary" @click="toggle">Cerrar</v-btn>
          </slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    title: String,
    showFooter: Boolean,
    disableScroll: Boolean,
    fullscreen: Boolean,
    customClass: String,
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const internalValue = ref(props.modelValue);
  const titulo = ref(props.title);
  
  watch(() => props.modelValue, (val) => {
    internalValue.value = val;
  });
  
  watch(internalValue, (val) => {
    emit('update:modelValue', val);
  });
  
  const toggle = () => {
    internalValue.value = false;
  };
  
  const mainColor = computed(() => '#1976D2'); 
  </script>
  