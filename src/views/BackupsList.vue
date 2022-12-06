<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-card
        class="mx-auto"
        :title="`Your backups for ${database.slug}`">

        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">
                  Backup Time
                </th>
                <th class="text-left">

                </th>
                <th class="text-left">

                </th>
                <th class="text-left">

                </th>
              </tr>
            </thead>
            <tbody class="text-left">
              <tr
                v-for="(backup, index) in database.user_backups"
                :key="index"
              >
                <td>{{new Date(backup.created_at).toLocaleString() }}</td>
                <td><v-btn
                  variant="outlined"
                  prepend-icon="mdi-database-eye"
                  v-on:click="getBackup(backup?.id)">
                  view
                </v-btn>
                </td>
                <td>
                  <v-btn
                    variant="outlined"
                    color="yellow"
                    :disabled="!valid"
                    prepend-icon="mdi-backup-restore"
                    v-on:click="() => {
                      restoreDialog = true;
                      selectedBackup = backup
                    }">
                    Restore
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    variant="outlined"
                    color="red"
                    prepend-icon="mdi-database-eye"
                    v-on:click="deleteBackup(backup?.id)"
                  >
                    delete
                  </v-btn>
                </td>

              </tr>

            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-responsive>

    <!-- Dialog for restore -->
    <v-dialog
      v-model="
        restoreDialog"
      width="50%"
    >
      <v-card>
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template v-slot:append>
            <v-btn
              v-on:click="restoreDialog = false"
              icon="mdi-close"></v-btn>
          </template>
        </v-toolbar>
        <v-card-text>
          <v-alert type="warning"
                   variant="outlined">Are you sure you want to restore the backup taken on <span class="text-decoration-underline font-weight-bold">{{new Date(selectedBackup?.created_at).toLocaleString()}}</span>  onto the database: <span class="text-decoration-underline font-weight-bold"> {{database?.slug}}</span>. This cannot be undone and will replace
            all the data in this database with the backup.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary"
                 block
                 v-on:click="restoreBackup">
            Yes i am sure, restore to this backup.</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- view dialog -->
  <v-dialog
    v-model="viewDialog"
  >
    <readonly-d-b-view :database="database"
                       :backup="viewingBackup" />
  </v-dialog>
</template>

<script lang="ts" setup>
import {useRoute} from 'vue-router';
import Webclient from '@/services/webclient';
import {computed, ref} from 'vue';
import ReadonlyDBView from '@/components/ReadonlyDBView.vue';

const client = new Webclient('');
const route = useRoute();
const routeId = route.params.id;
const database = ref<{ [key:string] : any }>([]);
const restoreDialog = ref(false);
const viewDialog = ref(false);
const selectedBackup = ref<{[key:string]: any}>();
const viewingBackup = ref<{[key:string]: any}>();
const valid = computed(() => new Date(database.value?.url_expire_date) > new Date());

client.listBackups(routeId as string).then(x => database.value = x);

function restoreBackup(){
  client.restoreBackup(selectedBackup.value?.id).then(x => {
    restoreDialog.value = false;
    selectedBackup.value = {};
  });
}

function deleteBackup(id: bigint){
  client.deleteBackup(id);
  client.listBackups(routeId as string).then(x => database.value = x);
}

function getBackup(id:bigint){
  client.getBackup(id).then(x => {
    viewingBackup.value = x;
    viewDialog.value =true;
  });
}

</script>

<style scoped>

</style>
