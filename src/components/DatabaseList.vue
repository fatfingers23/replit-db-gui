<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-card
        class="mx-auto"
        title="Your Database Keys"
        v-model="panels">
        <v-card-item>
          <v-card-item>
            <v-container>
              <v-responsive>
              <v-text-field
                color="primary"
                label="Search For Key By Prefix"
                v-model="keyPrefix"
                v-on:update:modelValue="getDbKeysDebounced()">

              </v-text-field>

             <v-text-field
                color="primary"
                label="Add a new key"
                append-icon="mdi-plus"
                v-model="newKeyValue"
                v-on:click:append="createANewKey"
                v-on:keydown.enter="createANewKey"
                >
              </v-text-field>
                <v-container>
                  <v-btn variant="outlined" v-on:click="downloadBackup"><v-icon>mdi-download</v-icon> Download Backup</v-btn>
                </v-container>
              </v-responsive>
            </v-container>
          </v-card-item>
          <v-card-text v-show="keys.length === 0">
            There is currently no database keys or any that match that prefix
          </v-card-text>
          <v-expansion-panels
            v-show="keys.length !== 0"
            multiple
          >
            <v-expansion-panel
              v-for="(key, index) in keys"
              v-bind:key="index"
              :value="index"

            >
              <v-expansion-panel-title v-on:click="getKeyValue(key)">{{ key }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-container>
                  <div class="d-flex justify-space-around mb-4">
                    <v-btn
                      variant="outlined"
                    v-on:click="updateKeyValue(key)">
                      <v-icon>mdi-content-save</v-icon>
                      Save
                    </v-btn>

                    <v-btn
                      color="error"
                      variant="outlined"
                      v-on:click="deleteKey(key)"
                    >
                      <v-icon>mdi-delete</v-icon>
                      Delete
                    </v-btn>
                  </div>
                    <v-expansion-panel-text v-show="values[key] === undefined">Loading...</v-expansion-panel-text>
                    <json-editor-vue v-show="values[key] !== undefined" v-model="values[key]" class="jse-theme-dark"/>
                </v-container>
              </v-expansion-panel-text>

            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-item>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
//
import {ref} from 'vue';
import store from '@/store';
import webclient from '@/services/webclient';
import {debounce} from 'ts-debounce';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import JsonEditorVue from 'json-editor-vue';

const client = new webclient(store.dbUrl);

let keys = ref<string[]>([]);
let panels = ref<string[]>([]);
const keyPrefix = ref('');
type GenericObject = { [key: string]: any };
let values = ref<GenericObject>({});
let newKeyValue = ref('');

const getDbKeysDebounced = debounce(getDbKeys, 500);


async function getDbKeys() {
  client.getKeys(keyPrefix.value).then(x => keys.value = x);
}

async function getKeyValue(key: string): Promise<void> {
  client.getValue(key).then(x => values.value[key] = JSON.parse(x) );
}

function updateKeyValue(key:string): void {
  const updatedValue = values.value[key];
  client.setValue(key, updatedValue);

}

async function createANewKey(){
  await client.setValue(newKeyValue.value, ' ');
  newKeyValue.value = '';
  await getDbKeys();
}

async function deleteKey(key:string){
  await client.deleteKey(key);
  await getDbKeys();
}

async function downloadBackup(){
  const db = await client.getAll();
  let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db));
  console.log(dataStr);
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href',     dataStr);
  const rightNow = new Date();
  downloadAnchorNode.setAttribute('download', `${store.token.slug}-${rightNow.toLocaleString()}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();

}
getDbKeys();

</script>

<style scoped>

</style>
