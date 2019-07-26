import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState, createSharedMutations } from 'vuex-electron';

import modules from './modules';

Vue.use(Vuex);
Vue.config.devtools = true;

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    createSharedMutations(),
  ],
  strict: process.env.NODE_ENV !== 'production',
  state: {
    date: '',
    msgnum: -1,
    msgtext: '',
    ip: '0.0.0.0',
    port: 5000,
  },
  actions: {
    updateip(context, payload) {
      console.log(`selecting ip, ${payload}`);
      context.commit('updateip', payload);
    },
    updateport(context, payload) {
      console.log(`selecting port, ${payload}`);
      context.commit('updateport', payload);
    },
  },
  mutations: {
    updateip(state, payload) {
      console.log(`selecting ip, ${payload}`);
      state.ip = payload;
    },
    updateport(state, payload) {
      console.log(`selecting port, ${payload}`);
      state.port = payload;
    },
    changedate(state, date) {
      state.date = date;
    },
    changemsgnum(state, msgnum) {
      state.msgnum = msgnum;
    },
    changemsgtext(state, msgtext) {
      state.msgtext = msgtext;
    },
  },
  getters: {
    ip: state => state.ip,
    port: state => state.port,
    date: state => state.date,
    msgnum: state => state.msgnum,
    msgtext: state => state.msgtext,
  },
});
