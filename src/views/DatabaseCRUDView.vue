<template>

  <database-list v-if="store.dbUrl !== ''"/>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import DatabaseList from '@/components/DatabaseList.vue';
import store from '@/store';
import router from '@/router';
const route = useRoute();
const routeId = route.params.id;
if(routeId === 'local'){
   store.getLocalDbUrl();
}
if(store.dbUrl === ''){
  router.push({name: 'home'});
}
</script>

<style scoped>

</style>
