<template>
  <div>
    <Dropdownmenu v-on:childToParent = 'onChildClick'></Dropdownmenu>
    <ve-histogram
    :data="chartData" 
    :settings="chartSettings"
    :loading="loading"
    :data-empty="dataEmpty">
    </ve-histogram>
    <span> Il tempo totale di fermo nel periodo selezionato e' {{ TempoTotale }} secondi ovvero 
      circa {{ minuti }} minuti</span>   
  </div>
</template>

<script>
  import axios from 'axios';
  import 'v-charts/lib/style.css';
  import { mapState } from 'vuex';
  import Dropdownmenu from './Dropdownmenu';

 const DATA_FROM_BACKEND = {
    columns: [],
    rows: [],
  };

  export default {
  computed: {
      ...mapState(['ip', 'port']),
    },
  data() {
    this.chartSettings = {
      axisSite: { right: ['perc'] },
        yAxisType: ['normal', 'percent'],
        yAxisName: ['occorenze', 'percentuali fermo'],
      };
  return {
      chartData: {
        columns: [],
        rows: [],
      },
      loading: false,
      dataEmpty: false,
      TempoTotale: 0,
      minuti: 0,
    };
  },
  methods: {
      onChildClick(value) {
        console.log(value);
        //  const starttim = value[0][0].toISOstring();
        const startdate = value[0][0].toISOString();
        const enddate = value[0][1].toISOString();
        this.getData({
            __sort: '-MsgText',
            TimeString__gte: startdate,
            TimeString__lte: enddate,
            MsgNumber: value[1], 
            MsgText: value[2],
          });
      },
    getData(params) {
      this.loading = true;

      axios.get(`http://${localStorage.ip}:${localStorage.port}/api/Segnalazioni`, {
          params: params, // eslint-disable-line object-shorthand
        })
        .then((response) => {
          const temp = {};
          const arrval = [];
          let totaltim = 0;
          const arr = response.data.data;
          const val = arr.reduce((result, item) => {
            const num = item.MsgNumber;
            const time = item.Time_ms;
            const state = item.StateAfter;
            result[num] = (result[num]) ? result[num] : {};
            if (state === '1' || state === 1) { 
                (temp[num] = time); 
              } else {
                result[num].tim = (num in temp)
                  ? (result[num].tim || 0) + (time - temp[num])
                  : null; 
            } 
            result[num].occ = (result[num].occ || 0) + 1;
            result[num].num = num;    
            result[num].text = (item.MsgText) ? item.MsgText : 'default';
            return result;   
        }, {});
         
        Object.keys(val).forEach((element) => {
         arrval.push(val[element]);
        });

        const perc = arrval.reduce((result, item) => {
          totaltim += (item.tim || 0); 
          return totaltim; 
         }, []);

       arrval.forEach((element) => { element.perc = (element.tim / perc); });

        DATA_FROM_BACKEND.columns = [
          'text', 'occ', 'perc',
        ];
        DATA_FROM_BACKEND.rows = arrval;
        console.log(perc);
        this.TempoTotale = Math.round(perc / 1000);
        this.minuti = Math.round(this.TempoTotale / 60);
        console.log(DATA_FROM_BACKEND);
      });
      setTimeout(() => { 
        this.chartData = DATA_FROM_BACKEND;
        // this.dataEmpty = !this.chartData.data.length;
        console.log(this.chartData);
        this.loading = false;
      }, 1000);
    },
  },
  created() {
    this.getData({
      __limit: 100,
    });
  },
  components: {
    Dropdownmenu,
},
};
</script>
<style>

</style>

