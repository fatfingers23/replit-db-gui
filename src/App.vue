<template>
  <v-app>
    <v-app-bar v-show="store.dbUrl !== ''">
      <v-app-bar-title>{{ store.token.slug ?? 'Replit Name' }} User: {{ store.token['user'] }} </v-app-bar-title>
      <v-app-bar-title>Expires: {{ store.viewExpireDate }} Issued at: {{ store.viewIssuedDate }} </v-app-bar-title>
      <v-btn variant="outlined" v-on:click="logout">logout</v-btn>
    </v-app-bar>
    <v-main>
      <database-enter v-show="store.dbUrl === ''" />
      <database-list v-if="store.dbUrl !== ''" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import DatabaseEnter from '@/components/DatabaseEnter.vue';
import store from '@/store';
import DatabaseList from '@/components/DatabaseList.vue';

store.getDbUrl();
function logout(){
  window.localStorage.clear();
  window.location.reload();
}


</script>
