<template>
  <div>
    <Dropdownmenu v-on:childToParent = 'onChildClick'></Dropdownmenu>
    <ve-line
    :data="chartData" 
    :settings="chartSettings"
    :loading="loading"
    :data-zoom="dataZoom"
    :data-empty="dataEmpty">
    </ve-line>
  </div>
</template>

<script>
  import axios from 'axios';
  import _ from 'lodash';
  import moment from 'moment';
  import 'v-charts/lib/style.css';
  import Dropdownmenu from './Dropdownmenu';

 const DATA_FROM_BACKEND = {
    columns: [],
    rows: [],
  };

  export default {
  data() {
    this.chartSettings = {
      dimension: ['TimeString'],
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
  methods: {
      onChildClick(value) {
        console.log(value);
        //  const starttim = value[0][0].toISOstring();
        const startdate = moment(value[0][0]).format('YYYY-MM-DD HH:MM:SS');
        const enddate = moment(value[0][1]).format('YYYY-MM-DD HH:MM:SS');
        this.getData({
            __sort: '-TimeString',
            TimeString__gte: startdate,
            TimeString__lte: enddate,
          });
      },
    getData(params) {
      this.loading = true;

      axios.get(`http://${localStorage.ip}:${localStorage.port}/api/Produzione1H`, {
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
          console.log(rows);

            DATA_FROM_BACKEND.rows = rows.reverse();
            DATA_FROM_BACKEND.columns = [...col];
      });
        setTimeout(() => {
          this.chartData = DATA_FROM_BACKEND;
          this.dataEmpty = !this.chartData.rows.length;
          this.loading = false;
        }, 1000);
    },
  },
  created() {
    this.getData({
            __sort: '-TimeString',
            __limit: 100,
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

