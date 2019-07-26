<template>
  <div>
     <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
       <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
         <p>NOTA: La funzionalità è ancora sperimentale si sconsiglia di selezionare lunghi periodi
           se si vogliono evitare lunghi tempi di attesa.
         </p>
       </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
            <date-picker label="Date" 
             v-on:change="changed" 
             v-model="time1" 
             append-to-body range lang="it" 
             format="YYYY-MM-DDTHH:mm:ss"
             type="datetime"></date-picker>
          </vs-col>
      </vs-row>
      <vs-divider/>
    <div>
      <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
        <vs-col  vs-w="6" vs-type="flex" vs-justify="center" vs-align="center">
          <p> Vita Macchina </p> 
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
    <vs-row vs-w="12" vs-align="center" vs-type="flex" vs-justify="center" >
      <vs-col vs-w="6" vs-type="flex" vs-justify="center" vs-align="center"> 
          <vs-input-number label="Resa Teorica" v-model="number1"/>
     </vs-col>
    </vs-row>  
   
    
  </div>
</template>

<script>

  import axios from 'axios';
  import _ from 'lodash'; 
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
      };
    },
    name: 'main-page',
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },   
     changed() {
       const value = this.time1;
        console.log(value);
        //  const starttim = value[0][0].toISOstring();
        this.getData({
            TimeString__gte: value[0],
            TimeString__lte: value[1],
          });
      },
      getData(params) {
        this.loading = true;
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
                timework[j].push(response.data.data[i].Time_ms);
              } else {
                timestop[j].push(response.data.data[i].Time_ms);
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
        });
    },
  },
  mounted() {
    const date = new Date();
    const now = date.toISOString();
    const monthago = (date.setDate(date.getDate() - 30)).toISOString();
    console.log(now);
    console.log(monthago);
    this.getData({
      TimeString__lte: now,
      TimeString__gte: monthago,
    });
    },
  };
</script>

<style>
 
</style>