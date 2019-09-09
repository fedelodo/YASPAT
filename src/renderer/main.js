import Vue from 'vue';
import axios from 'axios';
import Vuesax from 'vuesax';
import Vuex from 'vuex';

import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';
import 'typeface-roboto/index.css';

import VCharts from 'v-charts';
import ECharts from 'vue-echarts';

import App from './App';
import router from './router';
import store from './store';

Vue.use(require('vue-moment'));
Vue.use(Vuesax);
Vue.use(VCharts);
Vue.use(Vuex);
Vue.component('v-chart', ECharts);

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'));
}

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  data: {
    ip: '',
    port: 5000,
  },
}).$mount('#app');
