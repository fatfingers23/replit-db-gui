<template>
  <v-container
    class="fill-height"
  >
    <v-responsive v-if="!store.localOnly" class="d-flex align-center">
      <div class="d-flex justify-center">
        <v-card class="ma-4" width="75%">
          <div class="ma-4">
          <v-card-title class="text-xs-h6 text-md-h5 text-lg-h4">Welcome to Replit DB VUI</v-card-title>
          <v-card-subtitle>
            An interactive GUI for manipulating ANY Replit DB you have access to as well as creating backups if you are logged in.
          </v-card-subtitle>
            <v-card-text>
<!--              <p class="text-subtitle-1 font-weight-bold">Some of the features are: {{features.join(', ')}}</p>-->
              <p></p>
              <p class="text-subtitle-1">Click <a href="#" v-on:click="toggleAlert">here</a> to learn why we use supabase for a database internally.</p>

            </v-card-text>

          </div>
        </v-card>
      </div>
      <v-alert
        v-model="store.alert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        title="Notice about your data and where its stored"
        class="text-left"
      >
        We use supabase over a pure Replit backend because of our limited size for Replit databases (Replit databses can only be 50mb). To make sure we can store your backups without fear of running out of space, we decided to use supabase. The App is 100% open source, and the SQL schema will be published with the repo.

        But if that is not your style. No worries! All CRUD operations can be used by just entering your <code>$REPLIT_DB_URL</code> below and using the app without logging in or storing any data in supabase.
      </v-alert>
    </v-responsive>

    <v-responsive class="d-flex v-flex-column align-center text-center ">

      <database-enter class="ma-2 pa-2"/>

    </v-responsive>



  </v-container>

</template>

<script setup lang="ts">
import DatabaseEnter from '@/components/DatabaseEnter.vue';
import {ref} from 'vue';
import store from '@/store';
import router from '@/router';

console.log(!store.loggedIn && store.dbUrl !== '');

if(store.localOnly){
  store.getLocalDbUrl();
  if(store.dbUrl !== ''){
    router.push({name: 'db-view', params: {id: 'local'}});
  }
}else if(!store.loggedIn){
  store.getLocalDbUrl();
  if(store.dbUrl !== ''){
    router.push({name: 'db-view', params: {id: 'local'}});
  }

}


const features = ref([
  'View your Replits DB keys by it\'s db url',
  'Run CRUD operations on your DB',
  'Save multiple DB urls. (Login only)',
  'Run, schedule, and restore multiple backups (Login only)'
]);

function toggleAlert(){
  store.alert = !store.alert;
}
</script>

<style scoped>

</style>
