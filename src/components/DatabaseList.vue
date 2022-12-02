<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-card
        class="mx-auto"
        title="Enter your Replit DB URL"
        width="75%"
      />
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
//
import store from "@/store";

const options = {
  headers: new Headers({'db_url': store.dbUrl})
};


fetch('http://127.0.0.1:3000/keys',options ).then(x => console.log(x)).catch(x => console.log(x))

</script>

<style scoped>

</style>
