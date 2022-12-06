<template>
  <v-app>
    <v-app-bar>
      <template v-if="store.loggedIn"
                v-slot:prepend>
        <v-app-bar-nav-icon v-on:click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>
        Replit DB VUI

      </v-app-bar-title>


      <v-btn v-if="!store.loggedIn && !store.localOnly"
             variant="outlined"
             v-on:click="LoginWithReplit">Login</v-btn>
      <v-btn v-if="store.loggedIn && !store.localOnly"
             variant="outlined"
             v-on:click="accountLogout">logout</v-btn>
      <v-btn v-if="(store.localOnly && store.dbUrl !== '') || !store.loggedIn && store.dbUrl !== ''"
             variant="outlined"
             v-on:click="localLogout"
             class="ml-3">
        clear loaded database
      </v-btn>

    </v-app-bar>
    <v-navigation-drawer
      v-if="store.loggedIn"
      v-model="drawer"
      temporary
    >
      <v-list-item
        :prepend-avatar="store.userInfo.profileImage"
        :title="store.userInfo.username"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list density="compact"
              nav>
        <v-list-item href="/databases/list"
                     prepend-icon="mdi-database"
                     title="Databases"
                     value="db-list"></v-list-item>
        <!--        <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>-->
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block
                 v-on:click="accountLogout">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
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

const drawer = ref(false);

function localLogout(){
  window.localStorage.clear();
  window.location.reload();
}

async function accountLogout(){
  store.loggedIn = false;
  store.userInfo.id = '';
  store.userInfo.username = '';
  store.userDatabases = [];
  drawer.value = false;
  await fetch('/api/logout');
  await router.push({name:'home'});
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
