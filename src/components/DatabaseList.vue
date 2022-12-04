<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-card
        class="mx-auto"
        :title="`Your database for ${store.token.slug}`"
        v-model="panels">
        <v-card-text v-if="store.expiredToken">
          <v-alert
            prominent
            type="error"
            variant="outlined"
          >
            You will need to get a new REPLIT DB URL. This one expired at {{store.viewExpireDate}}. Can press Logout above to enter a new url.
          </v-alert>
        </v-card-text>
        <v-card-text v-if="!store.expiredToken">
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
                <v-btn variant="outlined" v-on:click="downloadBackup">
                  <v-icon>mdi-download</v-icon>
                  Download Backup
                </v-btn>
              </v-container>
            </v-responsive>
          </v-container>
        </v-card-text>
        <v-card-text v-if="keys.length === 0">
          There is currently no database keys or any that match that prefix
        </v-card-text>
        <v-card-text>
          <v-expansion-panels
            v-show="keys.length !== 0 && !store.expiredToken"
            multiple
            v-model="panels"
            class="mb-2">

            <v-expansion-panel
              v-for="(key, index) in keys"
              v-bind:key="index"
              :value="key"
            >
              <v-expansion-panel-title v-on:click="getKeyValue(key)">{{ key }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-container>
                  <div class="d-flex justify-space-around mb-4">
                    <v-btn
                      :disabled="disableSave[key]"
                      variant="outlined"
                      v-on:click="updateKeyValue(key)">
                      <v-icon>mdi-content-save</v-icon>
                      Save
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      v-on:click="simpleEditor = !simpleEditor">
                      <v-icon>mdi-file-document-edit-outline</v-icon>
                      {{simpleEditor ?   'Use the JSON Editor (for complex objects)'  : 'Use The Simple Editor (For string values)'}}

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
                  <p v-show="!simpleEditor" class="text-h6">Note if there is no text below and this is a new key may have to click the three dots to create a new node</p>
                  <p v-show="simpleEditor" class="text-h6">Note if the key's value is a JSON object this simple editor does not parse it, will want to use the JSON editor</p>
                  <v-expansion-panel-text v-show="values[key] === undefined">Loading...</v-expansion-panel-text>
                  <v-container v-show="values[key] !== undefined">
                    <json-editor-vue
                      v-if="!simpleEditor && values[key] !== undefined"
                      v-model="values[key]"
                      class="jse-theme-dark"
                      v-on:change="turnOnSave(key)"
                    />
                    <v-textarea
                      v-show="simpleEditor"
                      counter
                      :label="`Simple editor for the key ${key}`"
                      v-on:change="turnOnSave(key)"
                      v-model="values[key]"
                    ></v-textarea>
                  </v-container>

                </v-container>
              </v-expansion-panel-text>

            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
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
let simpleEditor = ref(false);
let disableSave = ref<{ [key: string]: boolean}>({});


const turnOnSave = (key: string) => {
  if(values.value[key] !== undefined){
    disableSave.value[key] = false;
  }
};

const getDbKeysDebounced = debounce(getDbKeys, 500);


async function getDbKeys() {
  await client.getKeys(keyPrefix.value).then(x => keys.value = x);
  panels.value = [];
}

async function getKeyValue(key: string): Promise<void> {
  disableSave.value[key] = true;
  client.getValue(key).then(x => {
    //HACK Again reallllly should not do this
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    values.value[key] = JSON.parse(x);
  });
}

function updateKeyValue(key: string): void {
  const updatedValue = values.value[key];
  disableSave.value[key] = true;
  client.setValue(key, updatedValue);

}

async function createANewKey() {
  if(newKeyValue.value !== ''){
    const newKey = newKeyValue.value;
    await client.setValue(newKey, '');
    keys.value.push(newKey);
    newKeyValue.value = '';
    await getKeyValue(newKey);
    panels.value = [newKey];
  }
}

async function deleteKey(key: string) {
  await client.deleteKey(key);
  panels.value.splice(panels.value.findIndex((possibleKey: string) => possibleKey === key), 1);
  await getDbKeys();
}

async function downloadBackup() {
  const db = await client.getAll();
  let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db));
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
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
