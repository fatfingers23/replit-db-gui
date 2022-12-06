<template>
  <v-card
    class="mx-auto"
  >
    <!--    <v-card-title>{{token.slug}}</v-card-title>-->
    <v-toolbar
      color="rgba(0, 0, 0, 0)"
      theme="dark"
    >
      <template v-slot:prepend>
        <v-chip
          class="ma-2"
          :color="valid ? 'success' : 'error'"
          variant="outlined"
        >
          <v-icon start
                  icon="mdi-server-plus"></v-icon>
          {{valid ? 'Valid': 'expired'}}
        </v-chip>
      </template>

      <v-toolbar-title class="text-h5">
        <a :href="replitUrl"> {{props.database?.slug}} </a>
      </v-toolbar-title>

      <template v-slot:append>
        <v-btn
          v-on:click="deleteDialog = true"
          color="red"
          icon="mdi-delete"></v-btn>
      </template>
    </v-toolbar>
    <v-card-item>
      <div class="ma-1">
        <v-alert v-if="!valid"
                 icon="mdi-cloud-alert"
                 type="warning"
                 variant="outlined" >You can enter in a new DB url in the above input to update this DB back to a vavlid saved token</v-alert>
        <v-list>
          <v-list-item>User: {{props.database?.user}}</v-list-item>
          <v-list-item>Issued at: {{new Date(props.database?.url_issued_at).toLocaleString()}}</v-list-item>
          <v-list-item>Expires at: {{new Date(props.database?.url_expire_date).toLocaleString()}}</v-list-item>
          <v-list-item>Last backup: <span class="font-weight-bold">{{lastBackup}}
            <v-tooltip
              activator="parent"
              location="bottom"
            >{{lastBackupFull}}</v-tooltip>
          </span>
          </v-list-item>
        </v-list>
      </div>
    </v-card-item>

    <v-card-actions class="d-flex flex-wrap ">
      <v-btn
        :disabled="!valid"
        v-on:click="viewDatabase"
        variant="outlined"
        class="ml-5 mb-3"
        prepend-icon="mdi-database-eye"
      >
        view database
      </v-btn>
      <v-btn
        v-on:click="() => router.push({name:'db-backups', params:{id: props.database?.database_id}})"
        variant="outlined"
        class="ml-3 mb-3"
        to="db-backups"
        prepend-icon="mdi-backup-restore"
      >
        View Backups
      </v-btn>
      <br>
      <v-btn
        :disabled="!valid"
        variant="outlined"
        class="mb-3 ml-3"
        prepend-icon="mdi-cloud-upload"
        v-on:click="createABackup"
      >
        backup
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-model="deleteDialog"
      :width="mobile ? '100%' : '50%'"
    >
      <v-card>
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template v-slot:append>
            <v-btn
              v-on:click="deleteDialog = false"
              icon="mdi-close"></v-btn>
          </template>
        </v-toolbar>
        <v-card-text>
          <v-alert type="error"
                   variant="outlined">Are you sure you want to delete the database: <span class="text-decoration-underline font-weight-bold"> {{props.database?.slug}}</span> and all of the backups you have saved from our system?
            All of your data will still be on your Replit DB still. Just no longer in our system.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary"
                 block
                 v-on:click="deleteDatabase">
            Yes i am sure, delete it all.</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import store from '@/store';
import router from '@/router/index';
import jwt_decode from 'jwt-decode';
import Webclient from '@/services/webclient';
import { DateTime } from 'ts-luxon';
import {ref} from 'vue';
import {useDisplay} from 'vuetify';
const emit = defineEmits(['refresh']);
const { mobile } = useDisplay();

const client = new Webclient('');
const props = defineProps({
  database:{
    type: Object,
  }
});

const deleteDialog = ref(false);
const valid = new Date(props.database?.url_expire_date) > new Date();
const replitUrl = `https://replit.com/@${props.database?.user}/${props.database?.slug}`;

const lastBackupFull = props.database?.user_backups.length === 0 ? 'Never' : new Date(props.database?.user_backups[0].created_at).toLocaleString();
const lastBackup = props.database?.user_backups.length === 0 ? 'Never' : DateTime.fromISO(props.database?.user_backups[0].created_at).toRelative();

async function viewDatabase(){
  store.setDbUrl(props.database?.db_url, jwt_decode(props.database?.token));
  await router.push({'name': 'db-view', params: {id: props.database?.database_id}});
}

async function createABackup(){
  await client.createABackup(props.database?.database_id);
  emit('refresh');
}

async function deleteDatabase(){
  await client.deleteDatabase(props.database?.database_id);
  emit('refresh');
}

</script>

<style scoped>

</style>
