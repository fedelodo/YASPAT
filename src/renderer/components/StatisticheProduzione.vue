<template>
  <div>
     <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
            <date-picker label="Date"
              v-on:clear="clear"
              v-on:change="changed" 
              v-model="time1" 
              append-to-body
              confirm = "true"
              range :shortcuts="shortcuts" lang="it"
              format="YYYY-MM-DD HH:mm" 
              type="datetime">
            </date-picker>
          </vs-col>
      </vs-row>
      <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
        <vs-col  vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <p > Intervallo attuale </p> 
        </vs-col>
        <vs-col  vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <span> {{ startdate }} - {{ enddate }} </span> 
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
    </div>
    <vs-divider/>
      <div style="font-size:120%;">
        <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
          <vs-col  vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
            <p >Macchina in servizio </p> 
          </vs-col>
          <vs-col  vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
            <span>  {{ temposolare[0] }} ore,  {{ temposolare[1] }} minuti,  {{ temposolare[2] }} secondi  </span> 
          </vs-col>
        </vs-row>
        <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
          <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
            <p> Tempo di carico </p> 
          </vs-col>
          <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
            <span> {{ tempodisponibilita[0] }} ore,  {{ tempodisponibilita[1] }} minuti,  {{ tempodisponibilita[2] }} secondi </span> 
          </vs-col>
        </vs-row>
         <vs-divider/>
        <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
          <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
            <p> Tempo di lavoro </p> 
          </vs-col>
          <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
            <span> {{ tempolavoro[0] }} ore,  {{ tempolavoro[1] }} minuti,  {{ tempolavoro[2] }} secondi </span>   
          </vs-col>
          <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
            <p> Resa </p> 
          </vs-col>
          <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
            <span> {{ Resa }} </span>   
          </vs-col>
      </vs-row>  
      <ve-gauge
        :data="chartData" 
       :settings="chartSettings">
      </ve-gauge>
       <vs-divider/>
      <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
        <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
          <p> Tempo di lavoro netto </p> 
        </vs-col>
          <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
            <span> {{ tempolavoronetto[0] }} ore,  {{ tempolavoronetto[1] }} minuti,  {{ tempolavoronetto[2] }} secondi </span>   
          </vs-col>
        <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
          <p> Resa Netta </p> 
        </vs-col>
        <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
          <span> {{ ResaNetta }} </span>   
        </vs-col>
      </vs-row>       
      </div>

      <ve-gauge
        :data="chartData1" 
        :settings="chartSettings1">
      </ve-gauge>   
    
    <vs-divider/>

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
        dataName: {
          rate: 'Resa',
        },
        dataType: {
          rate: 'percent',
        },
        seriesMap: {
         rate: {
            min: 0,
            max: 1,
            axisLine: {
              lineStyle: {
                color: [[0.2, '#FF0000'], [0.8, '#FF8C00'], [1, '#ADFF2F']],
              },
            },
          },
        },
      };
      this.chartSettings1 = {
        dataName: {
          rate: 'Resa Netta',
        },
        dataType: {
          rate: 'percent',
        },
        seriesMap: {
         rate: {
            min: 0,
            max: 1,
            axisLine: {
              lineStyle: {
                color: [[0.2, '#FF0000'], [0.8, '#FF8C00'], [1, '#ADFF2F']],
              },
            },
          },
        },
      };
      return {
        startdate: moment(this.$store.state.Date.startdate).format('YYYY-MM-DD HH:mm:ss'),
        enddate: moment(this.$store.state.Date.enddate).format('YYYY-MM-DD HH:mm:ss'),
        rate: 0,
        VitaMacchina: 0,
        PezziBuoni: 0,
        PezziScarti: 0,
        time1: '',
        Resa: 0,
        ResaNetta: 0,
        totaltim: 0,
        totaltimnetto: 0,
        number1: 1,
        one: 0,
        zero: 0,
        two: 0,
        three: 0,
        temposolare: [0, 0, 0],
        tempodisponibilita: [0, 0, 0],
        tempolavoro: [0, 0, 0],
        tempolavoronetto: [0, 0, 0],
        chartData: {
          columns: [],
          rows: [],
        },
        chartData1: {
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
    computed: {
    },
    methods: {
      epochtohms(epoch) {
        const ore = Math.floor(epoch / 3600);
        epoch %= 3600;
        const minuti = Math.floor(epoch / 60);
        const secondi = Math.round(epoch % 60);
        return [ore, minuti, secondi];
      },

      calcb(arr) {
        let maxb = arr[0].OPCUA_Produzione_BUONI;
        let minb = arr[0].OPCUA_Produzione_BUONI;
        let totb = 0;
        for (let i = 1, len = arr.length; i < len; i += 1) {
          const b = arr[i].OPCUA_Produzione_BUONI;
          if (b === 0 || b === '0') {
            len = i;
            totb += this.calcb(arr.slice(i));
          } else {
            minb = (b < minb) ? b : minb;
            maxb = (b > maxb) ? b : maxb;
          }
        }
        totb += (maxb - minb >= 0) ? maxb - minb : 0;
        return totb;
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
        this.$store.dispatch('changesdate', moment(value[0]).valueOf());
        this.$store.dispatch('changeedate', moment(value[1]).valueOf());
        this.enddate = moment(this.time1[1]).format('YYYY-MM-DD HH:mm:ss');
        this.startdate = moment(this.time1[0]).format('YYYY-MM-DD HH:mm:ss');
        this.getData({
            TimeString__lte: moment(this.time1[1]).format('YYYY-MM-DD HH:mm:ss'),
            TimeString__gte: moment(this.time1[0]).format('YYYY-MM-DD HH:mm:ss'),
          });
      },
      getData(params) {
        this.$vs.loading();
        axios.get(`http://${localStorage.ip}:${localStorage.port}/api/StatoImpianto`, {
            params: { ...params, VarName: 'OPCUA_Produzione_StatoImpianto' }, // eslint-disable-line object-shorthand
          })
          // (Math.round(this.dateFromOADate(response.data.data[i].Time_ms
          //      / 1000000).getTime() / 1000))
          .then((response) => {
          const zero = [];
          const one = [];
          const two = [];
          const three = [];
           const arr = response.data.data.reverse();
           arr.forEach((element, index) => {
            if (index > 0) { 
               const prev = arr[index - 1]; 
              if (element.VarValue === 1 || element.VarValue === '1') {
                const prevtim = (Math.round(this.dateFromOADate(prev.Time_ms
                  / 1000000).getTime() / 1000));
                const curtim = (Math.round(this.dateFromOADate(element.Time_ms
                  / 1000000).getTime() / 1000));
                one.push(Math.abs(curtim - prevtim));
               }
              if (element.VarValue === 2 || element.VarValue === '2') {
                const prevtim = (Math.round(this.dateFromOADate(prev.Time_ms
                  / 1000000).getTime() / 1000));
                const curtim = (Math.round(this.dateFromOADate(element.Time_ms
                  / 1000000).getTime() / 1000));
                two.push(Math.abs(curtim - prevtim));
               }
              if (element.VarValue === 3 || element.VarValue === '3') {
                const prevtim = (Math.round(this.dateFromOADate(prev.Time_ms
                  / 1000000).getTime() / 1000));
                const curtim = (Math.round(this.dateFromOADate(element.Time_ms
                  / 1000000).getTime() / 1000));
                three.push(Math.abs(curtim - prevtim));
               }
              if (element.VarValue === 0 || element.VarValue === '0') {
                const prevtim = (Math.round(this.dateFromOADate(prev.Time_ms
                  / 1000000).getTime() / 1000));
                const curtim = (Math.round(this.dateFromOADate(element.Time_ms
                  / 1000000).getTime() / 1000));
                zero.push(Math.abs(curtim - prevtim));
               }              
            }
           });
            this.zero = zero.reduce((a, b) => a + b, 0);
            this.one = one.reduce((a, b) => a + b, 0);
            this.two = two.reduce((a, b) => a + b, 0);
            this.three = three.reduce((a, b) => a + b, 0);
            this.temposolare = this.epochtohms(this.one + this.two + this.three + this.zero);
            this.tempodisponibilita = this.epochtohms(this.one + this.two + this.three);
            this.tempolavoro = this.epochtohms(this.two + this.three);
            this.tempolavoronetto = this.epochtohms(this.three);
            this.totaltim = (this.three + this.two) / 60;
            this.totaltimnetto = (this.three) / 60;
            setTimeout(() => {
              this.$vs.loading.close();
            }, 500);
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
            let maxs = arr[0].OPCUA_Produzione_SCARTI;
            let mins = arr[0].OPCUA_Produzione_SCARTI;
            for (let i = 1, len = arr.length; i < len; i += 1) {
              const s = arr[i].OPCUA_Produzione_SCARTI;
              mins = (s < mins) ? s : mins;
              maxs = (s > maxs) ? s : maxs;
            }
            this.PezziBuoni = this.calcb(arr);
            this.VitaMacchina = arr[arr.length - 1].OPCUA_Produzione_VITA_MACCHINA;      
            this.PezziScarti = (maxs - mins >= 0) ? maxs - mins : 0;
            this.Resa = Math.round(this.PezziBuoni / (this.totaltim / 60));
            this.ResaNetta = Math.round(this.PezziBuoni / (this.totaltimnetto / 60));
            this.chartData = {
              columns: ['type', 'value'],
              rows: [
                { type: 'rate', value: (this.Resa / this.number1) },
              ],
            };
            this.chartData1 = {
              columns: ['type', 'value'],
              rows: [
                { type: 'rate', value: (this.ResaNetta / this.number1) },
              ],
            };
            setTimeout(() => {
              this.$vs.loading.close();
            }, 500);
        });
    },
  },
  mounted() {
    console.log(this.$store);
    if (localStorage.resa) {
      this.number1 = localStorage.resa;
    }
     this.getData({
            TimeString__lte: moment(this.$store.state.Date.enddate).format('YYYY-MM-DD HH:mm:ss'),
            TimeString__gte: moment(this.$store.state.Date.startdate).format('YYYY-MM-DD HH:mm:ss'),
    });
    },
  };
</script>

<style>
 
</style>