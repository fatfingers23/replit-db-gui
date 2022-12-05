<template>
  <v-app>
<!--    <v-app-bar v-show="store.dbUrl !== ''">-->
<!--      <v-app-bar-title>{{ store.token.slug ?? 'Replit Name' }} User: {{ store.token['user'] }} </v-app-bar-title>-->
<!--      <v-app-bar-title>Expires: {{ store.viewExpireDate }} Issued at: {{ store.viewIssuedDate }} </v-app-bar-title>-->
<!--      <v-btn variant="outlined" v-on:click="LoginWithReplit">Login</v-btn>-->
<!--      <v-btn variant="outlined" v-on:click="logout">logout</v-btn>-->
<!--    </v-app-bar>-->
    <v-app-bar>

      <v-app-bar-title>
        Replit DB VUI
      </v-app-bar-title>



      <span class="mr-2 text-h6">{{store.userInfo.username}}</span>
      <v-btn v-if="!store.loggedIn && !store.localOnly" variant="outlined" v-on:click="LoginWithReplit">Login</v-btn>
      <v-btn v-if="store.loggedIn && !store.localOnly" variant="outlined" v-on:click="accountLogout">logout</v-btn>
      <v-btn v-if="(store.localOnly && store.dbUrl !== '') || !store.loggedIn && store.dbUrl !== ''"
             variant="outlined"
             v-on:click="localLogout"
             class="ml-3">
        clear loaded database
      </v-btn>

    </v-app-bar>
<!--    <v-navigation-drawer >...</v-navigation-drawer>-->
    <v-main>
<!--      <database-enter v-if="store.dbUrl === ''" />-->
<!--      <database-list v-if="store.dbUrl !== ''" />-->
      <RouterView />

    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import store from '@/store';
import router from '@/router';


function localLogout(){
  window.localStorage.clear();
  window.location.reload();
}

function accountLogout(){
  store.loggedIn = false;
  store.userInfo.id = '';
  store.userInfo.username = '';
  store.userDatabases = [];
}

function LoginWithReplit() {
  window.addEventListener('message', authComplete);
  let h = 500;
  let w = 350;
  let left = screen.width / 2 - w / 2;
  let top = screen.height / 2 - h / 2;

  let authWindow = window.open(
    'https://repl.it/auth_with_repl_site?domain=' + location.host,
    '_blank',
    'modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
    w +
    ', height=' +
    h +
    ', top=' +
    top +
    ', left=' +
    left,
  );

  function authComplete(e: {data: string}) {

    if (e.data !== 'auth_complete') {
      return;
    }

    window.removeEventListener('message', authComplete);
    if(authWindow !== null){
      authWindow.close();
    }
    location.reload();
  }
}


</script>
