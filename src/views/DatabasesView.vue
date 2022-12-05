<template>
  <v-container
    class="fill-height"
  >
    <v-responsive class="d-flex align-center text-center">
      <database-enter :local="false"/>
    </v-responsive>
    <v-container v-if="store.userDatabases.length === 0" class=" mt-5 text-center">
      <h4 class="text-h4"> There is not any saved databases. Why not try adding one.</h4>
    </v-container>

    <v-container v-else class=" mt-5">
      <v-row >
        <v-col :cols="cols" v-for="(database, index) in store.userDatabases" v-bind:key="index" cl>
          <AsyncDatabaseSummaryCard :database="database"/>
        </v-col>
      </v-row>
    </v-container>
  </v-container>


</template>

<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';
import DatabaseEnter from '@/components/DatabaseEnter.vue';
import store from '@/store.js';
import webclient from '@/services/webclient';
import DatabaseSummaryCard from '@/components/DatabaseSummaryCard.vue';
import { useDisplay } from 'vuetify';

const clientWithoutDbHeader = new webclient('');
let AsyncDatabaseSummaryCard;
clientWithoutDbHeader.listDatabases().then(x =>{
   store.userDatabases = x;
  AsyncDatabaseSummaryCard = defineAsyncComponent(() =>
    import('@/components/DatabaseSummaryCard.vue')
  );
});

const cols = computed(() => {
  const { name } = useDisplay();
  let columns = 6;
  console.log(name.value);
  switch (name.value) {
    case 'xs': columns = 12; break ;
    case 'sm': columns = 12; break ;
    case 'md': columns = 6; break ;
    case 'lg': columns = 6; break ;

  }
  console.log(columns);
  return columns;
});

</script>

<style scoped>

</style>
