<template>
  <v-container
    class="fill-height"
  >
    <v-responsive class="d-flex align-center text-center fill-height">
        <v-card
          class="mx-auto"
          title="Enter your Replit DB URL"
          width="75%"
        >
          <v-form v-on:submit="submit" v-model="form">
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

              <v-btn color="success" type="submit" :disabled="!form">
                View Database
                <v-icon icon="mdi-chevron-right" end></v-icon>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>

    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
//
import {ref} from "vue";
import store from "@/store";
import jwt_decode from "jwt-decode"
const dbUrl = ref('');
const form = ref(false);

function isValidHttpUrl(string: string): boolean  {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

const rules = {
  url: (value: string) => isValidHttpUrl(value) || "This is not formatted as a url",
  required: (value: string) => !!value || 'Required.',
}

async function submit(event: Event){
  event.preventDefault()
  try {
    const url = new URL(dbUrl.value);
    const splitUrlPaths = url.pathname.split('/');
    const token = splitUrlPaths[2]
    const decodedToken: Object = jwt_decode(token);
    console.log(decodedToken);
    store.setDbUrl(dbUrl.value, decodedToken);

  }catch (error: unknown){
    alert('I have reason to believe that this is not a Replit db url. Check console for a tiny bit more info.')
    console.log(error)
  }

}

</script>

<style scoped>

</style>
