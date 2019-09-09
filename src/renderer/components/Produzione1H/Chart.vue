<template>
  <div>
    <Dropdownmenu v-on:childToParent = 'onChildClick'></Dropdownmenu>
    <figure>
      <v-chart :options="option" autoresize />
    </figure>
  </div>
</template>

<script>
  import axios from 'axios';
  import _ from 'lodash';
  import moment from 'moment';
  import ECharts from 'vue-echarts';
  import 'echarts/lib/chart/line';
  import Dropdownmenu from './Dropdownmenu';

  const colors = ['#5793f3', '#d14a61', '#675bba'];
  const xaxis = [];
  const serieses = [];
  const legend = [];
  const DATA_FROM_BACKEND = {
    columns: [],
    rows: [],
  };

  export default {
  data() {
    return {
    option: {
        color: colors,

        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: legend,
        },
        grid: {
            top: 70,
            bottom: 50,
        },
        xAxis: xaxis,
        yAxis: [
            {
                type: 'value',
            },
        ],
        series: serieses,
         dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0, 1, 2],
            start: 1,
            end: 100,
        },
        {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            left: '93%',
            start: 0,
            end: 100,
        },
        {
            type: 'inside',
            xAxisIndex: [0, 1, 2],
            start: 0,
            end: 100,
        },
        {
            type: 'inside',
            yAxisIndex: [0],
            start: 0,
            end: 100,
        },
        ],
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
        xaxis.length = 0;
        legend.length = 0;
        serieses.length = 0;
         DATA_FROM_BACKEND.rows.length = 0;
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
            DATA_FROM_BACKEND.rows = rows.reverse();
            DATA_FROM_BACKEND.columns = [...col];
                      DATA_FROM_BACKEND.columns = DATA_FROM_BACKEND.columns.filter(item => item !== 'TimeString');
           DATA_FROM_BACKEND.columns.forEach((cols, index) => {
            xaxis.push({
              type: 'category',
               offset: index * 10,
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
               
                onZero: true,
                lineStyle: {
                    color: colors[index],
                },
              },
              data: [],
            });
            serieses.push({
              name: cols,
              type: 'line',
              xAxisIndex: index,
              smooth: true,
              data: [],
            });
            legend.push(cols);
           });
          DATA_FROM_BACKEND.rows.forEach((element) => {
            DATA_FROM_BACKEND.columns.forEach((cols, index) => {
            if (Object.prototype.hasOwnProperty.call(element, cols)) {
                this.option.xAxis[index].data.push(element.TimeString);
                this.option.series[index].data.push(element[cols]);
            }
            });
          });
        });
        setTimeout(() => {
          this.loading = false;
          console.log(this.option);
        }, 1000);
    },
  },
  created() {
    this.getData({
            __sort: '-TimeString',
            __limit: 100,
    });
  },
  components: {
    Dropdownmenu,
    'v-chart': ECharts,
},
};
</script>
<style>
figure {
  display: inline-block;
  position: relative;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  padding: 1.5em 2em;
  min-width: 100%;
}
figure .echarts {
  width: 100%;
  min-width: 400px;
  height: 450px;
}

</style>

