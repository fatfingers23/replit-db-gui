<template>
  <v-container
    class="fill-height"
  >
    <v-responsive class="d-flex align-center text-center">
      <database-enter local="false"/>
    </v-responsive>
    <v-container v-if="databases.length === 0" class=" mt-5 text-center">
      <h4 class="text-h4"> There is not any saved databases. Why not try adding one.</h4>
    </v-container>

    <v-container v-else class=" mt-5">
      <v-row no-gutters>
        <v-col>
          <v-sheet class="pa-2 ma-2">
            .v-col-auto
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="pa-2 ma-2">
            .v-col-auto
          </v-sheet>
        </v-col>

        <v-responsive width="100%"></v-responsive>

        <v-col>
          <v-sheet class="pa-2 ma-2">
            .v-col-auto
          </v-sheet>
        </v-col>

        <v-col>
          <v-sheet class="pa-2 ma-2">
            .v-col-auto
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-container>


</template>

<script setup lang="ts">
import {ref} from 'vue';
import DatabaseEnter from '@/components/DatabaseEnter.vue';

let databases = ref([]);

</script>

<style scoped>

</style>
