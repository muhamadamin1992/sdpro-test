interface PrevPage {
  id: string;
  name: string;
  path: string;
  api: string;
  value?: string;
  parentApi: string;
}

export type PrevPages = Array<PrevPage>;

export interface State {
  prevPages: PrevPages;
}

function state(): State {
  return {
    prevPages: [],
  };
}

export default state;
