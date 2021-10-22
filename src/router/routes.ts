import { RouteRecordRaw } from 'vue-router';
import { Config } from 'src/shared/models';
import configs from 'src/shared/configs';

const children = configs.reduce((
  acc: Array<RouteRecordRaw>,
  { path, api, title: { plural, singular } }: Config,
  i,
  arr,
) => {
  interface IDynamicFormProp {
    title: string,
    api: string;
    selectOptions?: {
      api: string;
      path: string;
      title: string;
    }
  }

  interface IProps {
    title: string,
    api: string;
    path: string;
    childApi?: string;
    parentApi?: string;
  }

  const dynamicFormProps: IDynamicFormProp = {
    title: singular,
    api,
  };

  const props: IProps = {
    title: plural,
    api,
    path,
  };

  if (i !== 0) {
    const prevConfig = arr[i - 1];
    dynamicFormProps.selectOptions = {
      api: prevConfig.api,
      path: prevConfig.path,
      title: prevConfig.title.singular,
    };
    props.parentApi = prevConfig.api;
  }
  if (arr.length - 1 > i) {
    props.childApi = arr[i + 1].api;
  }
  acc.push({
    path,
    component: () => import('pages/Index.vue'),
    props,
  });

  acc.push({
    path: `${path}/:id/edit`,
    component: () => import('src/pages/DynamicForm.vue'),
    props: dynamicFormProps,
  });
  return acc;
}, []);

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children,
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
