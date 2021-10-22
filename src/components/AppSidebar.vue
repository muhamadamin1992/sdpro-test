<template>
  <q-drawer
    show-if-above
    bordered
  >
    <q-list>
      <q-item-label
        header
        class="logo"
      >
        Logo
      </q-item-label>
      <q-item
        v-for="config in configs"
        :key="config.path"
      >
        <router-link
          :to="config.path"
        >
          {{ config.title.plural }}
        </router-link>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script>
import configs from 'src/shared/configs';

export default {
  setup() {
    return { configs };
  },
};
</script>

<style lang="scss">
  .logo {
    font-size: 48px;
    color:#000;
    text-align: center;
  }
</style>
