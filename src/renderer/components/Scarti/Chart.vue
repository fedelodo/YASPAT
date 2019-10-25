<template>
  <div>
    <Dropdownmenu v-on:childToParent = 'onChildClick'></Dropdownmenu>
    <ve-line
    :data="chartData" 
    :settings="chartSettings"
    :loading="loading"
    :data-empty="dataEmpty">
    </ve-line>
  </div>
</template>

<script>
  import axios from 'axios';
  import 'v-charts/lib/style.css';
  import Dropdownmenu from './Dropdownmenu';

 const DATA_FROM_BACKEND = {
    columns: [],
    rows: [],
  };

  export default {
  data() {
    this.chartSettings = {
      metrics: ['VarValue'],
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
        //  const starttim = value[0][0].toISOstring();
        const startdate = value[0][0].toISOString();
        const enddate = value[0][1].toISOString();
        this.getData({
            __sort: '-VarName',
            TimeString__gte: startdate,
            TimeString__lte: enddate,
          });
      },
    getData(params) {
      this.loading = true;

      axios.get(`http://${localStorage.ip}:${localStorage.port}/api/Scarti`, {
          params: params, // eslint-disable-line object-shorthand
        })
        .then((response) => {
          DATA_FROM_BACKEND.columns = [
          'TimeString', 'VarValue', 
        ];
        DATA_FROM_BACKEND.rows = response.data.data;
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
            TimeString__lte: moment(this.$store.state.Date.enddate).format('YYYY-MM-DD HH:mm:ss'),
            TimeString__gte: moment(this.$store.state.Date.startdate).format('YYYY-MM-DD HH:mm:ss'),
    });
  },
  components: {
    Dropdownmenu,
},
};
</script>
<style>
</style>
