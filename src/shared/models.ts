export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

interface body {
  id?: number;
  name?: string;
}

export interface Request {
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  body?: body | FormData;
}

export interface ResponseItem {
  id: number;
  name: string;
  [key: string]: string | number;
}

export interface Response {
  data?: Array<ResponseItem> | ResponseItem;
  error?: Error,
}

export interface Config {
  title: {
    plural: string,
    singular: string,
  };
  path: string;
  api: string;
}
