<template>
  <q-layout view="lHh Lpr lFf">
    <app-sidebar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import AppSidebar from 'src/components/AppSidebar.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    AppSidebar,
  },

  setup() {
    return {};
  },
});
</script>
