<template>
  <v-card
    class="mx-auto"
    title="Enter your Replit DB URL"
    width="75%"
  >
    <v-card-text>You can find your Replit DB Url by typing the command below into your Replit shell.</v-card-text>
    <v-code>echo "$REPLIT_DB_URL"</v-code>
    <v-form v-on:submit="submit"
            v-model="form">
      <v-container>
        <v-text-field
          v-model="dbUrl"
          color="primary"
          :rules="[rules.url, rules.required]"
          label="Data base url"
          variant="underlined"
          autofocus
          type="url"
        ></v-text-field>

      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success"
               type="submit"
               :disabled="!form">
          {{local ? 'View Database' : 'Add a new database'}}
          <v-icon icon="mdi-chevron-right"
                  end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
//
import {ref, defineProps} from 'vue';
import store from '@/store';
import jwt_decode from 'jwt-decode';
import router from '@/router';
import webclient from '@/services/webclient';
const clientWithoutDbHeader = new webclient('');

const dbUrl = ref('');
const form = ref(false);

const props = defineProps({
  local: {
    type: Boolean,
    default: true
  }
});

function isValidHttpUrl(string: string): boolean  {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

const rules = {
  url: (value: string) => isValidHttpUrl(value) || 'This is not formatted as a url',
  required: (value: string) => !!value || 'Required.',
};


async function submit(event: Event){
  event.preventDefault();

  if(props.local){
    try {
      const url = new URL(dbUrl.value);
      const splitUrlPaths = url.pathname.split('/');
      const token = splitUrlPaths[2];
      const decodedToken: object = jwt_decode(token);
      store.setDbUrl(dbUrl.value, decodedToken);
      router.push({'name': 'db-view', params: {id: 'local'}});
    }catch (error: unknown){
      alert('I have reason to believe that this is not a Replit db url. Check console for a tiny bit more info.');
      console.log(error);
    }
  }else{
    try {
      await clientWithoutDbHeader.addDatabase(dbUrl.value);
      store.userDatabases = await clientWithoutDbHeader.listDatabases();
    }catch (error: unknown){
      alert('I have reason to believe that this is not a Replit db url. Check console for a tiny bit more info.');
      console.log('Can also be an issue with the server.');
      console.log(error);
    }
  }
}

</script>

<style scoped>

</style>
