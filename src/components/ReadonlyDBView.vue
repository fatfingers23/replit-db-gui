<template>
  <v-card>
    <v-card-title>
      This is a read only snap shot of your database {{props.database?.slug}} at {{new Date(props.backup?.created_at).toLocaleString()}}
    </v-card-title>
    <v-card-text>
      <json-editor-vue
        v-model="dbData"
        class="jse-theme-dark"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {defineProps, ref} from 'vue';
import JsonEditorVue from 'json-editor-vue';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';

const props = defineProps({
  database: {
    type: Object
  },
  backup: {
    type: Object
  }
});

const dbData = ref(props.backup?.data);

</script>

<style scoped>

</style>
