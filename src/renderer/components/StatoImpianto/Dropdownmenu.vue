<template>
  <div>
    <vs-collapse type="border">
      <vs-collapse-item>
        <div slot="header">
          Filtri
       </div>
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
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
            <vs-select
              placeholder="Descrizione"
              class="selectExample"
              v-model="select2"
              autocomplete
               v-on:change="changed" name="MsgVar"
              >
              <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in options2" />
            </vs-select>
          </vs-col>
          <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="2">
            <vs-button color="primary" type="border" icon="print" v-on:click="print"></vs-button>
          </vs-col>
          <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="2">
            <vs-button color="primary" type="border" icon="replay" v-on:click="changed"></vs-button>
          </vs-col>
        </vs-row>
      </vs-collapse-item>
    </vs-collapse>
    <vs-divider/>
  </div>
</template>

<script>
  import axios from 'axios';
  import DatePicker from 'vue2-datepicker';
  import moment from 'moment';

  export default {
          components: { DatePicker },
          data() {
            return {
              select1Normal: '',
              select2Normal: '',
              select3Normal: '',
              select1: [],
              select2: [],
              select3: [],
              options1: [],
              options2: [],
              options3: [],
              time1: '',
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
          mounted() {
           this.loadItems({
            __sort: '-TimeString',
            __limit: 100,
          });
          },
          methods: {
            loadItems(params) {                  
              axios.get(`http://${localStorage.ip}:${localStorage.port}/api/StatoImpianto`, {
                      params: params, // eslint-disable-line object-shorthand
                      }).then((response) => {
                      this.options2 = [{ text: '', value: '' }];
                      const values2 = [...new Set(response.data.data.map(x => x.VarName))];
                      values2.forEach((value) => {
                        const text = value;
                        this.options2.push({ text, value });
                      });
                  });
              },
            changed() {
              const startdate = moment(this.time1[0]).format('YYYY-MM-DD HH:MM:SS');
              const enddate = moment(this.time1[1]).format('YYYY-MM-DD HH:MM:SS');
              this.loadItems({
                  __sort: '-TimeString',
                  TimeString__gte: startdate,
                  TimeString__lte: enddate,
                });
              this.select2 = (this.select2.length === 0) ? '' : this.select2;
              this.$emit('childToParent', [this.time1, this.select2]);
            },

            clear() {
              this.select2 = (this.select2.length === 0) ? '' : this.select2;
              this.$emit('childToParent', [this.select2, this.select3]);
            },

             print() {
              window.print();
            },           
           },
        };
</script>