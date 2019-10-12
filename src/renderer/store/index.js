import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState, createSharedMutations } from 'vuex-electron';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState(),
    createSharedMutations(),
  ],
  state: {
    date: '',
    msgnum: -1,
    msgtext: '',
    ip: '0.0.0.0',
    port: 5000,
    resa: 1,
    startdate: new Date().setHours(0, 0, 0),
    enddate: new Date().setHours(23, 59, 59),
  },
  getters: {
    // other getters
  },
  mutations: {
    set_startdate: (state, newValue) => {
      state.startdate = newValue;
    },

    set_enddate: (state, newValue) => {
      state.enddate = newValue;
    },
    // other mutations
  },
  actions: {
    setStartDate: (context, newValue) => {
      context.commit('set_startdate', newValue);
    },

    setEndDate: (context, newValue) => {
      context.commit('set_enddate', newValue);
    },
  }, // other actions
});
