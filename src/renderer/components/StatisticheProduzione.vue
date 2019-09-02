<template>
  <div>
     <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
            <date-picker label="Date"
              v-on:clear="clear"
              v-on:change="changed" 
              v-model="time1" 
              append-to-body
              range :shortcuts="shortcuts" lang="it"
              format="YYYY-MM-DD HH:mm" 
              type="datetime">
            </date-picker>
          </vs-col>
      </vs-row>
      <vs-divider/>
    <div style="font-size:120%;">
      <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
        <vs-col  vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <p > Vita Macchina </p> 
        </vs-col>
        <vs-col  vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <span> {{ VitaMacchina }} </span> 
        </vs-col>
      </vs-row>
      <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
        <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <p> Pezzi Buoni </p> 
        </vs-col>
        <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <span> {{ PezziBuoni }} </span> 
        </vs-col>
      </vs-row>
      <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
        <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <p> Pezzi Scarti </p> 
        </vs-col>
        <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <span> {{ PezziScarti }} </span>   
        </vs-col>
      </vs-row>
       <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
        <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <p> Resa </p> 
        </vs-col>
        <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <span> {{ Resa }} </span>   
        </vs-col>
      </vs-row>    
    </div>
    <vs-divider/>
    <ve-gauge
          :data="chartData" 
          :settings="chartSettings">
    </ve-gauge>
  </div>
</template>

<script>

  import axios from 'axios';
  import _ from 'lodash'; 
  import moment from 'moment';
  import DatePicker from 'vue2-datepicker';

  export default {
    components: { DatePicker },
    data() {
      this.chartSettings = {
        dataType: {
          rate: 'percent',
        },
        seriesMap: {
         rate: {
            min: 0,
            max: 1,
            axisLine: {
              lineStyle: {
                color: [[0.2, '#FF0000'], [0.8, '#FFFF00'], [1, '#ADFF2F']],
              },
            },
          },
        },
      };
      return {
        rate: 0,
        VitaMacchina: 0,
        PezziBuoni: 0,
        PezziScarti: 0,
        time1: '',
        Resa: 0,
        totaltim: 0,
        number1: 1,
        chartData: {
          columns: [],
          rows: [],
        },
        shortcuts: [
                {
                  text: 'Oggi',
                  onClick: (self) => {
                    const d = new Date();
                    const d1 = new Date();
                    d.setHours(0, 0, 0);
                    d1.setHours(23, 59, 0);
                    self.currentValue = [d, d1];
                    self.updateDate(true);
                  },
                },
                {
                  text: 'Ieri',
                  onClick: (self) => {
                    const d = new Date();
                    const d1 = new Date();
                    d.setDate(d.getDate() - 1);
                    d1.setDate(d1.getDate() - 1);
                    d.setHours(0, 0, 0);
                    d1.setHours(23, 59, 0);
                    self.currentValue = [d, d1];
                    self.updateDate(true);
                  },
                },
                {
                  text: 'Ultima Settimana',
                  onClick: (self) => {
                    const d = new Date();
                    const d1 = new Date();
                    d.setDate(d1.getDate() - 7);
                    d.setHours(0, 0, 0);
                    d1.setHours(23, 59, 0);
                    self.currentValue = [d, d1];
                    self.updateDate(true);
                  },
                },
                {
                  text: 'Ultimo Mese',
                  onClick: (self) => {
                    const d = new Date();
                    const d1 = new Date();
                    d.setDate(d1.getDate() - 30);
                    d.setHours(0, 0, 0);
                    d1.setHours(23, 59, 0);
                    self.currentValue = [d, d1];
                    self.updateDate(true);
                  },
                },
              ],
      };
    },
    name: 'main-page',
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
      persist() {
        localStorage.resa = this.number1;
        this.chartData = {
              columns: ['type', 'value'],
              rows: [
                { type: 'rate', value: (this.Resa / this.number1) },
              ],
            };
      },
      open(link) {
        this.$electron.shell.openExternal(link);
      },   
     changed() {
       const value = this.time1;
        const startdate = moment(value[0]).format('YYYY-MM-DD HH:MM:SS');
        const enddate = moment(value[1]).format('YYYY-MM-DD HH:MM:SS');
        this.getData({
            TimeString__gte: startdate,
            TimeString__lte: enddate,
          });
      },
      getData(params) {
        this.$vs.loading();
        axios.get(`http://${localStorage.ip}:${localStorage.port}/api/StatoImpianto`, {
            params: params, // eslint-disable-line object-shorthand
          })
          .then((response) => {
            const timework = [[]];
            const timestop = [[]];
            let j = 0;
            for (let i = 0, len = response.data.data.length; i < len; i += 1) {
              if (response.data.data[i].VarValue === 1) {
                if (timestop[j].lenght) {
                  j += 1;
                }
                timework[j].push(this.dateFromOADate(response.data.data[i].Time_ms
                 / 1000000).getTime() / 1000);
              } else {
                timework[j].push(this.dateFromOADate(response.data.data[i].Time_ms 
                / 1000000).getTime() / 1000);
              }
            }
            let temptim = 0;
            for (let k = 0; k <= j; k += 1) {
              const maxtimw = Math.max(...timework[k]);
              const mintimw = Math.min(...timework[k]);
              temptim += (maxtimw - mintimw);
            }
          this.totaltim = temptim / (1000);
          });
        axios.get(`http://${localStorage.ip}:${localStorage.port}/api/Produzione1m`, {
            params: params, // eslint-disable-line object-shorthand
          })
          .then((response) => {
            const arr = _(response.data.data.map((element) => {
              const { VarName, VarValue, ...rest } = element;
              return { 
                ...rest,
                [VarName]: VarValue,
                };
              }))
              .groupBy('TimeString')
              .map((g) => _.mergeWith({}, ...g, (obj, src) =>
              _.isArray(obj) ? obj.concat(src) : undefined))
              .value();
            let minvm = arr[0].OPCUA_Produzione_VITA_MACCHINA;
            let maxvm = arr[0].OPCUA_Produzione_VITA_MACCHINA;
            let maxb = arr[0].OPCUA_Produzione_BUONI;
            let minb = arr[0].OPCUA_Produzione_BUONI;
            let maxs = arr[0].OPCUA_Produzione_SCARTI;
            let mins = arr[0].OPCUA_Produzione_SCARTI;
            for (let i = 1, len = arr.length; i < len; i += 1) {
              const vm = arr[i].OPCUA_Produzione_VITA_MACCHINA;
              const b = arr[i].OPCUA_Produzione_BUONI;
              const s = arr[i].OPCUA_Produzione_SCARTI;
              minvm = (vm < minvm) ? vm : minvm;
              maxvm = (vm > maxvm) ? vm : maxvm;
              minb = (b < minb) ? b : minb;
              maxb = (b > maxb) ? b : maxb;
              mins = (s < mins) ? s : mins;
              maxs = (s > maxs) ? s : maxs;
            }

            this.VitaMacchina = (maxvm - minvm >= 0) ? maxvm - minvm : 0;
            this.PezziBuoni = (maxb - minb >= 0) ? maxb - minb : 0;
            this.PezziScarti = (maxs - mins >= 0) ? maxs - mins : 0;
            this.Resa = Math.round(this.PezziBuoni / (this.totaltim / 60));
            this.chartData = {
              columns: ['type', 'value'],
              rows: [
                { type: 'rate', value: (this.Resa / this.number1) },
              ],
            };
            setTimeout(() => {
              this.$vs.loading.close();
            }, 2000);
        });
    },
  },
  mounted() {
    if (localStorage.resa) {
      this.number1 = localStorage.resa;
    }
    const d = new Date();
    const d1 = new Date();
    d.setDate(d1.getDate() - 30);
    d.setHours(0, 0, 0);
    d1.setHours(23, 59, 0);
    this.getData({
      TimeString__lte: d1,
      TimeString__gte: d,
    });
    },
  };
</script>

<style>
 
</style>