import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/Segnalazioni',
      name: 'Segnalazioni',
      component: require('@/components/MainPage').default,
    },
    {
      path: '/Produzione1H',
      name: 'Produzione1H',
      component: require('@/components/MainPage.1').default,
    },
    {
      path: '/Scarti',
      name: 'Scarti',
      component: require('@/components/MainPage.2').default,
    },
    {
      path: '/Produzione1m',
      name: 'Produzione1m',
      component: require('@/components/MainPage.3').default,
    },
    {
      path: '/Settings',
      name: 'Impostazioni',
      component: require('@/components/Settings').default,
    },
    {
      path: '/Statistiche',
      name: 'Statistiche',
      component: require('@/components/StatisticheProduzione').default,
    },
    {
      path: '/',
      redirect: '/Segnalazioni',
    },
  ],
});
