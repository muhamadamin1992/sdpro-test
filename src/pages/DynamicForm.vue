<template>
  <q-page class="dynamic-form" padding>
    <h1 class="head-title dynamic-form--title">{{ pageTitle }}</h1>
    <form @submit.prevent="add" class="dynamic-form__form">
      <q-input
        v-model="name"
        class="dynamic-form__input"
        label="Name"
        :dense="true"
        required
        filled
      />
      <q-select
        v-model="optionSelected"
        v-if="selectOptions"
        :dense="true"
        :options="options"
        :label="selectOptions.title"
        option-value="id"
        option-label="name"
        required
        filled
        emit-value
        map-options
      >
        <template #after-options>
          <div
            class="q-item q-item-type row no-wrap q-item--clickable
              q-link cursor-pointer q-manual-focusable"
          >
            <router-link
              :to="selectOptions.path"
              @click.prevent="redirectToParent(selectOptions.path)"
              class="q-mr-auto"
            >View All</router-link>
            <router-link
              @click.prevent="redirectToParent(`${selectOptions.path}/new/edit`)"
              :to="`${selectOptions.path}/new/edit`"
            >New</router-link>
          </div>
        </template>
      </q-select>
      <div class="form-actions">
        <q-btn color="primary" class="form-actions__item" type="submit">Save</q-btn>
        <q-btn @click="redirectToList" class="form-actions__item">Cancel</q-btn>
      </div>
    </form>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent, ref, onBeforeMount, PropType, watch, computed,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ResponseItem } from 'src/shared/models';
import Api from 'src/api/Api';
import { useStore } from 'src/store';

interface SelectOptions {
  api: string;
  path: string;
  title: string;
}

export default defineComponent({
  name: 'PageIndex',
  props: {
    title: {
      type: String,
      required: true,
    },
    api: {
      type: String,
      required: true,
    },
    selectOptions: Object as PropType<SelectOptions>,
  },
  setup(props) {
    const name = ref('');
    const options = ref<Array<ResponseItem>>([]);
    const optionSelected = ref<number | string>();
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const pageTitle = ref<string>();
    let pageType: string;

    const lastPage = computed(() => {
      if (store.state.prevPages.length) {
        return store.state.prevPages[store.state.prevPages.length - 1];
      }
      return undefined;
    });

    async function setOptions() {
      if (props.selectOptions !== undefined) {
        const { data, error } = await Api.get({ url: props.selectOptions.api });
        if (error) {
          return;
        }
        if (data && Array.isArray(data)) {
          options.value = data;
        }
      }
    }

    async function setEditValuesFromApi() {
      await Api.get({ url: `${props.api}/${route.params.id.toString()}` }).then(({ data }) => {
        if (data !== null && data !== undefined && !Array.isArray(data)) {
          pageTitle.value = `Edit ${data.name} ${props.title}`;
          name.value = data.name;
          if (props.selectOptions === undefined) {
            return;
          }
          optionSelected.value = data[`${props.selectOptions.api}_id`];
        }
      });
    }

    function init() {
      void setOptions();
      pageType = route.params.id === 'new' ? 'new' : 'edit';
      if (pageType === 'new') {
        name.value = '';
        pageTitle.value = `New ${props.title}`;
        optionSelected.value = undefined;
      }
      if (lastPage.value?.api === props.api) {
        optionSelected.value = lastPage.value.value;
        name.value = lastPage.value.name;
        store.commit('popPrevPages');
        return;
      }
      void setEditValuesFromApi();
      if (lastPage.value?.parentApi !== props.api) {
        store.commit('clearPrevPages');
      }
    }

    function redirectToParent(path: string) {
      store.commit('addPrevPages', {
        id: route.params.id,
        name: name.value,
        path: route.path,
        api: props.api,
        parentApi: props.selectOptions?.api,
      });
      void router.push(path);
    }

    onBeforeMount(init);
    watch(
      () => props.api,
      init,
    );

    function redirectToList() {
      void router.push(route.path.split('/').slice(0, -2).join('/'));
    }

    async function add() {
      const body: Record<string, string | number | undefined> = {
        name: name.value,
      };

      if (props.selectOptions !== undefined && optionSelected.value) {
        body[`${props.selectOptions.api}_id`] = optionSelected.value;
      }
      if (pageType === 'edit' && !Array.isArray(route.params.id)) {
        body.id = route.params.id;
      }

      const editMethods:Record<string, 'POST' | 'PUT'> = {
        new: 'POST',
        edit: 'PUT',
      };

      const { error } = await Api.request({
        url: props.api, method: editMethods[pageType], body,
      });
      if (error === undefined) {
        redirectToList();
      }
    }
    return {
      add, name, options, optionSelected, pageTitle, redirectToParent, redirectToList,
    };
  },
});
</script>

<style lang="scss">
  .dynamic-form {
    display: flex;
    flex-direction: column;

    &__title {
      margin-bottom: 27px;
    }

    &__form {
      display: flex;
      max-width: 284px;
      flex-direction: column;
      flex-grow: 1;
    }

    &__input {
      margin-bottom: 25px;
    }
  }

  .form-actions {
    margin-top: auto;

    &__item {
      margin-right: 21px;
    }
  }
</style>
