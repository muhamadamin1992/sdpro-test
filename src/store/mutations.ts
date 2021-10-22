import { MutationTree } from 'vuex';
import { State } from './state';

const mutation: MutationTree<State> = {
  clearPrevPages(state) {
    state.prevPages = [];
  },
  addPrevPages(state, payload) {
    state.prevPages.push(payload);
  },
  popPrevPages(state) {
    state.prevPages.pop();
  },
  addValueToLastPage(state, payload: string) {
    if (state.prevPages.length === 0) {
      return;
    }
    state.prevPages[state.prevPages.length - 1].value = payload;
  },
};

export default mutation;
