import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/Segnalazioni',
      name: 'Segnalazioni',
      component: require('@/components/Segnalazioni').default,
    },
    {
      path: '/Produzione1H',
      name: 'Produzione1H',
      component: require('@/components/Produzione1H').default,
    },
    {
      path: '/Scarti',
      name: 'Scarti',
      component: require('@/components/Scarti').default,
    },
    {
      path: '/Produzione1m',
      name: 'Produzione1m',
      component: require('@/components/Produzione1m').default,
    },  
    {
      path: '/DatiAnalogici',
      name: 'DatiAnalogici',
      component: require('@/components/DatiAnalogici').default,
    },
    {
      path: '/InformazioniPezziProdotti',
      name: 'IPP',
      component: require('@/components/InformazioniPezziProdotti').default,
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
      path: '/StatoImpianto',
      name: 'StatoImpianto',
      component: require('@/components/StatoImpianto').default,
    },
    {
      path: '/RealTime',
      name: 'RealTime',
      component: require('@/components/RealTime').default,
    },
    {
      path: '/',
      redirect: '/Statistiche',
    },
  ],
});
