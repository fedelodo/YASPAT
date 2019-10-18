<template>
  <div>
    <Dropdownmenu v-on:childToParent = 'onChildClick'></Dropdownmenu>
    <ve-line
    :data="chartData" 
    :settings="chartSettings"
    :loading="loading"
    :data-zoom="dataZoom"
    :extend="chartExtend">
    </ve-line>
    <vs-divider/>
    <vue-good-table
    :rows="rowstab"
    :columns="columnstab"/>
  </div>
</template>

<script>
  import { VueGoodTable } from 'vue-good-table';
  import 'vue-good-table/dist/vue-good-table.css';
  import axios from 'axios';
  import 'v-charts/lib/style.css';
  import moment from 'moment';
  import _ from 'lodash'; 
  import Dropdownmenu from './Dropdownmenu';
     
 const DATA_FROM_BACKEND = {
    columns: [],
    rows: [],
  };

  export default {
  data() {
    this.chartSettings = {
        xAxisType: 'time',
      };
    this.chartExtend = {
      series: {
        smooth: false,
        step: 'end',
      },
      yAxis: {
        type: 'value',
        splitNumber: 4,
        minInterval: 1,
      },
    };
    return {
      columnstab: [
        {
          label: 'Stato',
          field: 'stat',
          type: 'number',
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
      rowstab: [],
      chartData: {
        columns: [],
        rows: [],
      },
        loading: false,
        dataEmpty: false,
      };
  },
  methods: {
      epochtohms(epoch) {
        const ore = Math.floor(epoch / 3600);
        epoch %= 3600;
        const minuti = Math.floor(epoch / 60);
        const secondi = Math.round(epoch % 60);
        return [ore, minuti, secondi];
      },
      
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
        //  const starttim = value[0][0].toISOstring();
        const startdate = moment(value[0][0]).format('YYYY-MM-DD HH:MM:SS');
        const enddate = moment(value[0][1]).format('YYYY-MM-DD HH:MM:SS');
        this.$store.dispatch('changesdate', moment(value[0][0]).valueOf());
        this.$store.dispatch('changeedate', moment(value[0][1]).valueOf());
        this.getData({
            __sort: '-TimeString',
            TimeString__gte: startdate,
            TimeString__lte: enddate,
            VarName: value[1], 
          });
      },

    getData(params) {
      this.loading = true;
      axios.get(`http://${localStorage.ip}:${localStorage.port}/api/StatoImpianto`, {
          params: params, // eslint-disable-line object-shorthand
        })
        .then((response) => {
            const col = new Set(['TimeString']);
            // TODO UNIRE GLI OGGETTI CON LO STESSO TIMESTRING
            let rows = (response.data.data.map((element) => {
              const { VarName, VarValue, ...rest } = element;
              col.add(VarName);
              return { 
                ...rest,
                [VarName]: VarValue,
                };
              }));
            rows = _(rows).groupBy('TimeString').map((g) => _.mergeWith({}, ...g, (obj, src) =>
             _.isArray(obj) ? obj.concat(src) : undefined))
              .value();

            DATA_FROM_BACKEND.rows = rows.reverse();
            DATA_FROM_BACKEND.columns = [...col];
            const final = [];
            const tim = [];
            const zero = [];
            const one = [];
            const two = [];
            const three = [];
            let oneocc = 0;
            let twoocc = 0;
            let threeocc = 0;
            let zeroocc = 0;
            const arr = response.data.data;
            arr.forEach((element, index) => {
              if (index > 0) { 
                const prev = arr[index - 1]; 
                if (element.VarValue === 1 || element.VarValue === '1') {
                  const prevtim = (Math.round(this.dateFromOADate(prev.Time_ms
                    / 1000000).getTime() / 1000));
                  const curtim = (Math.round(this.dateFromOADate(element.Time_ms
                    / 1000000).getTime() / 1000));
                  one.push(Math.abs(curtim - prevtim));
                  oneocc = (oneocc || 1) + 1;
                }
                if (element.VarValue === 2 || element.VarValue === '2') {
                  const prevtim = (Math.round(this.dateFromOADate(prev.Time_ms
                    / 1000000).getTime() / 1000));
                  const curtim = (Math.round(this.dateFromOADate(element.Time_ms
                    / 1000000).getTime() / 1000));
                  two.push(Math.abs(curtim - prevtim));
                  twoocc = (twoocc || 1) + 1;
                }
                if (element.VarValue === 3 || element.VarValue === '3') {
                  const prevtim = (Math.round(this.dateFromOADate(prev.Time_ms
                    / 1000000).getTime() / 1000));
                  const curtim = (Math.round(this.dateFromOADate(element.Time_ms
                    / 1000000).getTime() / 1000));
                  three.push(Math.abs(curtim - prevtim));
                  threeocc = (threeocc || 1) + 1;
                }
                if (element.VarValue === 0 || element.VarValue === '0') {
                  const prevtim = (Math.round(this.dateFromOADate(prev.Time_ms
                    / 1000000).getTime() / 1000));
                  const curtim = (Math.round(this.dateFromOADate(element.Time_ms
                    / 1000000).getTime() / 1000));
                  zero.push(Math.abs(curtim - prevtim));
                  zeroocc = (zeroocc || 1) + 1;
                }              
              }
            });
            tim[0] = zero.reduce((a, b) => a + b, 0);
            tim[1] = one.reduce((a, b) => a + b, 0);
            tim[2] = two.reduce((a, b) => a + b, 0);
            tim[3] = three.reduce((a, b) => a + b, 0);

            const occ = [zeroocc, oneocc, twoocc, threeocc];
            const totaltim = tim.reduce((a, b) => a + b, 0);
            const stato = ['Spenta/Ferma', 'Operazioni Manuali', 'Anomalie Presenti', 'In Ciclo'];
            console.log(tim);
            console.log(occ);

            for (let i = 0; i < 4; i += 1) {
            const time = this.epochtohms(tim[i]);
            final.push({
                stat: stato[i],
                tim: `${time[0]} ore ${time[1]} minuti ${time[2]} secondi`,
                occ: occ[i],
                perc: tim[i] / totaltim,
              });
            }

            this.rowstab = final;
            console.log(this.rowstab);
        });
        setTimeout(() => {
          this.chartData = DATA_FROM_BACKEND;
          this.dataEmpty = !this.chartData.rows.length;
          this.loading = false;
        }, 5000);
    },
  },
  created() {
    this.getData({
            __sort: '-TimeString',
            __limit: 100,
            TimeString__lte: moment(this.$store.state.Date.enddate).format('YYYY-MM-DD HH:mm:ss'),
            TimeString__gte: moment(this.$store.state.Date.startdate).format('YYYY-MM-DD HH:mm:ss'),
    });

    this.dataZoom = [
        {
          type: 'slider',
          start: 0,
          end: 100,
        },
      ];
  },
  components: {
    VueGoodTable,
    Dropdownmenu,
},
};
</script>
<style>
</style>