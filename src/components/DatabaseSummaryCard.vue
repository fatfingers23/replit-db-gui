<template>
  <v-card
    class="mx-auto"
  >
<!--    <v-card-title>{{token.slug}}</v-card-title>-->
    <v-card-item>
      <div class="ma-1">
        <div class="text-overline mb-1">
          <v-chip
            class="ma-2"
            :color="valid ? 'success' : 'error'"
            variant="outlined"
          >
            <v-icon start icon="mdi-server-plus"></v-icon>
            {{valid ? 'Valid': 'expired'}}
          </v-chip>
        </div>

        <p class="text-h4 ">
          <a :href="replitUrl"> {{props.database.slug}} </a>
        </p>
        <v-list>
          <v-list-item>User: {{props.database.user}}</v-list-item>
          <v-list-item>Issued at: {{new Date(props.database.url_issued_at).toLocaleString()}}</v-list-item>
          <v-list-item>Expires at: {{new Date(props.database.url_expire_date).toLocaleString()}}</v-list-item>
        </v-list>
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn v-on:click="viewDatabase" >
        view
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {defineProps, ref, computed} from 'vue';
import store from '@/store';
import router from '@/router';
import jwt_decode from 'jwt-decode';
const props = defineProps({
  database:{
    type: Object,
  }
});
console.log(props.database);
const valid = new Date(props.database?.url_expire_date) > new Date();
const replitUrl = `https://replit.com/@${props.database?.user}/${props.database?.slug}`;


function viewDatabase(){

  store.setDbUrl(props.database?.db_url, jwt_decode(props.database?.token));
  router.push({'name': 'db-view', params: {id: props.database?.database_id}});

}

</script>

<style scoped>

</style>
