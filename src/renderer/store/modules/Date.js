import moment from 'moment';

const state = {
  startdate: moment().startOf('day'),
  enddate: moment().endOf('day'),
};

const mutations = {
  changesdate(state, startdate) {
    state.startdate = startdate;
  },
  changeedate(state, enddate) {
    state.enddate = enddate;
  },
};

const actions = {
  changesdate({ commit }, startdate) {
    // do something async
    commit('changesdate', startdate);
  },
  changeedate({ commit }, startdate) {
    // do something async
    commit('changeedate', startdate);
  },
};

const getters = {
  startdate: (state) => state.startdate,
  enddate: (state) => state.enddate,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
