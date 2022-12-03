<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-card
        class="mx-auto"
        title="Your Database Keys"
        v-model="panels">
        <v-card-item>
          <v-card-item>
            <v-text-field
              color="primary"
              label="Search For Key By Prefix"
              v-model="keyPrefix"
              v-on:update:modelValue="getDbKeysDebounced">

            </v-text-field>
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
                      variant="outlined">
                      <v-icon>mdi-content-save</v-icon>
                      Save
                    </v-btn>

                    <v-btn
                      color="error"
                      variant="outlined"
                    >
                      <v-icon>mdi-delete</v-icon>
                      Delete
                    </v-btn>
                  </div>

                    <json-editor-vue v-model="values[key]"  class="jse-theme-dark" :onchange="valueEdited" />
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

const getDbKeysDebounced = debounce(getDbKeys, 500);


async function getDbKeys() {
  client.getKeys(keyPrefix.value).then(x => keys.value = x);
}

async function getKeyValue(key: string): Promise<void> {
  const result = client.getValue(key).then(x => values.value[key] = x);
}

async function valueEdited(oldVal, newval) {
  console.log(oldVal);
  console.log(newval);

}

getDbKeys();

</script>

<style scoped>

</style>
