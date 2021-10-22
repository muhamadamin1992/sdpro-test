<template>
  <q-page padding>
    <div class="page-top">
      <h1 class="head-title">{{ title }}</h1>
      <q-btn color="primary" :to="`${path}/new/edit`">New</q-btn>
    </div>
    <q-table
      :rows="rows"
      :columns="columns"
    >
      <template v-slot:body-cell-action="slotProps">
        <td class="text-right">
          <router-link :to="`${path}/${slotProps.row.id}/edit`" class="q-mr-lg">Edit</router-link>
          <router-link
            v-if="lastPage"
            :to="lastPage"
            @click.prevent="select(slotProps.row.id)"
          >Select</router-link>
        </td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent, ref, onBeforeMount, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';
import Api from 'src/api/Api';
import { ResponseItem } from 'src/shared/models';

export default defineComponent({
  name: 'PageIndex',
  props: {
    title: String,
    path: String,
    api: {
      type: String,
      required: true,
    },
    childApi: String,
    parentApi: String,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const rows = ref();

    const parentColumn = ref<Record<string, string | undefined>>({
      name: 'parentName',
      field: 'parentName',
    });

    const columns = [
      {
        name: 'id',
        label: 'ID',
        field: 'id',
      },
      {
        name: 'name',
        label: 'Name',
        field: 'name',
      },
      parentColumn.value,
      {
        name: 'action',
        field: 'action',
      },
    ];

    const lastPage = computed(() => {
      if (store.state.prevPages.length) {
        return store.state.prevPages[store.state.prevPages.length - 1];
      }
      return undefined;
    });

    async function setParentNames({ field, data }: { field?: string, data: Array<ResponseItem> }) {
      if (props.parentApi !== undefined) {
        const { data: parentData } = await Api.get({ url: props.parentApi });
        if (parentData && Array.isArray(parentData)) {
          const parentObject = parentData.reduce((acc: Record<string, string>, { id, name }) => {
            acc[id] = name;
            return acc;
          }, {});
          return data.map((el) => {
            const res = { ...el };
            if (field) {
              res.parentName = parentObject[el[field]];
            }
            return res;
          });
        }
      }
      return data;
    }

    async function init() {
      const { data } = await Api.get({ url: props.api });
      if (data && Array.isArray(data) && data.length) {
        const field = Object.keys(data[0]).find((el) => el.endsWith('_id'));
        parentColumn.value.label = field?.slice(0, -3);
        rows.value = await setParentNames({ field, data });
      }
    }

    function select(id: string) {
      if (lastPage.value === undefined) {
        return;
      }
      if (lastPage.value.api === props.childApi) {
        store.commit('addValueToLastPage', id);
        void router.push(lastPage.value.path);
      }
    }

    onBeforeMount(init);
    watch(
      () => props.api,
      init,
    );

    return {
      columns, rows, select, lastPage: lastPage.value?.path,
    };
  },
});
</script>
