<template>
  <v-overlay
    :model-value="true"
    class="align-center justify-center">
    <v-progress-circular
      indeterminate
      size="64"
      color="primary"
    ></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts" setup>
  const overlay = true;
</script>

<style scoped>

</style>
