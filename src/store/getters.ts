import { GetterTree } from 'vuex';
import { State, PrevPages } from './state';

const getters: GetterTree<State, State> = {
  getPrevPages(state): PrevPages {
    return state.prevPages;
  },
};

export default getters;
