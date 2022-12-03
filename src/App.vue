<template>
  <v-app>
    <v-app-bar v-show="store.dbUrl !== ''">
      <v-app-bar-title>{{ store.token.slug ?? 'Replit Name' }} User: {{ store.token['user'] }} </v-app-bar-title>
      <v-app-bar-title>Expires: {{ viewExpireDate }} issued at: {{ viewIssuedDate }} </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <database-enter v-show="store.dbUrl === ''" />
      <database-list v-show="store.dbUrl !== ''" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import DatabaseEnter from '@/components/DatabaseEnter.vue';
import store from '@/store';
import {ref} from 'vue';
import DatabaseList from '@/components/DatabaseList.vue';

store.getDbUrl();

let viewExpireDate = ref();
let viewIssuedDate = ref();
if(store.dbUrl !== ''){
  const expiredDate = new Date(0);
  const issuedDate = new Date(0);
  expiredDate.setSeconds(store.token.exp);
  issuedDate.setSeconds(store.token.iat);

  viewExpireDate = ref(expiredDate.toLocaleString());
  viewIssuedDate = ref(issuedDate.toLocaleString());
}
</script>
