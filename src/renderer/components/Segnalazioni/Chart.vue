<template>
  <div>
    <Dropdownmenu v-on:childToParent = 'onChildClick'></Dropdownmenu>
    <ve-histogram
    :data="chartData" 
    :settings="chartSettings"
    :loading="loading"
    :data-empty="dataEmpty">
    </ve-histogram>
    <div  vs-type="flex"> 
      Tempo totale di fermo nel periodo selezionato:  
      <div vs-type="flex" vs-justify="flex-end" class="box"> {{ore}} ore,  {{ minuti }} minuti,  {{ TempoTotale }} secondi </div>
      <br>
      Numero totale di occorrenze degli allarmi:
      <div vs-type="flex" vs-justify="flex-end" class="box"> {{occurrencies}} </div>
    </div>
    <vs-divider/>
    <vue-good-table
    :rows="rows"
    :columns="columns"/>
   
  </div>
</template>

<script>
  import { VueGoodTable } from 'vue-good-table';
  import axios from 'axios';
  import moment from 'moment';
  import 'vue-good-table/dist/vue-good-table.css';
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
     isLoading: false,
      columns: [
        {
          label: 'Numero Allarme',
          field: 'num',
          type: 'number',
        },
        {
          label: 'Testo Allarme',
          field: 'text',              
        },
        {
          label: 'Tempo di occorrenza (s)',
          field: 'tim',
          type: 'number',
        },
        {
          label: 'Percentuale incidenza',
          field: 'perc',
          type: 'percentage',
        },
        {
          label: 'Occorrenze',
          field: 'occ',
          type: 'number',
        },
      ],
      rows: [],
      chartData: {
        columns: [],
        rows: [],
      },
      loading: false,
      dataEmpty: false,
      TempoTotale: 0,
      occurrencies: 0,
      minuti: 0,
      ore: 0,
    };
  },
  methods: {
    dateFromOADate(oaDate) {
        // Treat integer part is whole days
        const days = parseInt(oaDate, 10);
        // Treat decimal part as part of 24hr day, always +ve
        const ms = Math.abs((oaDate - days) * 8.64e7);
        const date = new Date(1899, 11, (30 + days), 0, 0, 0, ms);
        // Add days and add ms
        return date;
      },

      onChildClick(value) {
        let startdate;
        let enddate;
        if (value[0] !== '') {
          startdate = moment(value[0][0]).format('YYYY-MM-DD HH:MM:SS');
          enddate = moment(value[0][1]).format('YYYY-MM-DD HH:MM:SS');
          this.$store.dispatch('changesdate', moment(value[0][0]).valueOf());
          this.$store.dispatch('changeedate', moment(value[0][1]).valueOf());
        } 
        //  const starttim = value[0][0].toISOstring();
        this.getData({
          __sort: 'Time_ms',
          TimeString__gte: startdate,
          TimeString__lte: enddate, 
          MsgNumber: value[1], 
          MsgText__contains: value[2],
          });
      },
    getData(params) {
      this.loading = true;

      axios.get(`http://${localStorage.ip}:${localStorage.port}/api/Segnalazioni`, {
          params: params, // eslint-disable-line object-shorthand
        })
        .then((response) => {
          const temp = {};
          const tempn = {};
          const arrval = [];
          let totaltim = 0;
          let occurrencies = 0;
          const arr = response.data.data;
          const val = arr.reduce((result, item) => {
            const num = item.MsgNumber;
            const time = (this.dateFromOADate(item.Time_ms / 1000000).getTime() / 1000);
            const state = item.StateAfter;
            result[num] = (result[num]) ? result[num] : {};
            if (state === '1' || state === 1) { 
                (temp[num] = time);
                (tempn[num] = time); 
              } else {
                result[num].occ = (result[num].occ || 0) + 1;
                result[num].tim = (num in temp)
                  ? (result[num].tim || 0) + Math.abs(time - temp[num])
                  : null; 
                result[num].timn = (num in tempn)
                  ? (result[num].timn || 0) + Math.abs(time - tempn[num])
                  : null;                   
                delete temp[num];
                delete tempn[num];
                if (!(Object.keys(tempn).length === 0 && tempn.constructor === Object)) {
                  Object.keys(tempn).forEach((v) => { tempn[v] = time; });
                }
            }
            result[num].num = num;    
            result[num].text = (item.MsgText) ? item.MsgText : 'default';
            return result;   
        }, {});
         
        Object.keys(val).forEach((element) => {
         arrval.push(val[element]);
        });

        let perc = arrval.reduce((result, item) => {
          totaltim += (item.timn || 0); 
          return totaltim;
         }, []);

         const occurs = arrval.reduce((result, item) => {
          occurrencies += (item.occ || 0); 
          return occurrencies;
         }, []);

       arrval.forEach((element) => { 
        element.perc = (element.tim / perc);
        element.tim = Math.round(element.tim);
         });

        DATA_FROM_BACKEND.columns = [
          'text', 'occ', 'perc',
        ];
        DATA_FROM_BACKEND.rows = arrval;
        this.rows = arrval;
        this.ore = Math.floor(perc / 3600);
        perc %= 3600;
        this.minuti = Math.floor(perc / 60);
        this.TempoTotale = Math.round(perc % 60);
        this.occurrencies = occurs;
      });
      setTimeout(() => { 
        this.chartData = DATA_FROM_BACKEND;
        // this.dataEmpty = !this.chartData.data.length;
        this.loading = false;
      }, 1000);
    },
  },
  created() {
    this.getData({
      __sort: 'Time_ms',
      TimeString__lte: moment(this.$store.state.Date.enddate).format('YYYY-MM-DD HH:mm:ss'),
      TimeString__gte: moment(this.$store.state.Date.startdate).format('YYYY-MM-DD HH:mm:ss'),
      __limit: 100,
    });
  },
  components: {
    VueGoodTable,
    Dropdownmenu,
},
};
</script>
<style>
.box {
  width: auto;
  padding: 10px;
  border: 2px solid gray;
  margin: 0; 
}

</style>

