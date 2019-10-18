<template>
  <div>
    <Dropdownmenu v-on:childToParent = 'onChildClick'></Dropdownmenu>
    <p>{{ startdate }}</p>
    <ve-line
    :data="chartData" 
    :settings="chartSettings"
    :loading="loading"
    :data-zoom="dataZoom">
    </ve-line>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
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
       // xAxisType: 'time',
    };
    return {
        chartData: {
          columns: [],
          rows: [],
        },
        loading: false,
        dataEmpty: false,
      };
  },
  computed: mapState(['startdate', 'enddate']),
  methods: {
      onChildClick(value) {
        //  const starttim = value[0][0].toISOstring();
        const startdate = moment(value[0][0]).format('YYYY-MM-DD HH:MM:SS');
        const enddate = moment(value[0][1]).format('YYYY-MM-DD HH:MM:SS');
        this.$store.commit('changesdate', startdate);
        this.$store.commit('changeedate', enddate);
        this.getData({
            __sort: '-TimeString',
            TimeString__gte: startdate,
            TimeString__lte: enddate,
          });
      },
    getData(params) {
      this.loading = true;
      axios.get(`http://${localStorage.ip}:${localStorage.port}/api/Produzione1m`, {
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
        });
        setTimeout(() => {
          this.chartData = DATA_FROM_BACKEND;
          this.dataEmpty = !this.chartData.rows.length;
          this.loading = false;
        }, 5000);
        console.log('"test"');
        console.log(startdate);
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
    Dropdownmenu,
},
};
</script>
<style>
</style>