
<template>
<div>
  <Dropdownmenu v-on:childToParent = 'onChildClick'></Dropdownmenu>
  <vue-good-table
    mode="remote"
    @on-page-change="onPageChange"
    @on-sort-change="onSortChange"
    @on-column-filter="onColumnFilter"
    @on-per-page-change="onPerPageChange"
    :totalRows="totalRecords"
    :isLoading.sync="isLoading"
    :pagination-options="{
      enabled: true,
    }"
    :rows="rows"
    :columns="columns"/>
</div>

</template>

<script>
  import { VueGoodTable } from 'vue-good-table';
  import axios from 'axios';
  import moment from 'moment';
  import 'vue-good-table/dist/vue-good-table.css';
  import Dropdownmenu from './Dropdownmenu';


  export default {
          data() {
            return {
              isLoading: false,
              columns: [
                {
                  label: 'Timestamp',
                  field: 'TimeString',
                  type: 'date',
                  dateInputFormat: 'YYYY-MM-DDTHH:mm:ss',
                  dateOutputFormat: 'YYYY-MM-DD HH:mm:ss',
                  sortable: true,
                },
                {
                  label: 'Nome Variabile',
                  field: 'VarName',
                  filterable: true,
                },
                {
                  label: 'Valore Variabile',
                  field: 'VarValue',
                  type: 'number',              
                },
              /*  {
                  label: 'Percent',
                  field: 'score',
                  type: 'percentage',
                }, */
              ],
              rows: [],
              totalRecords: 0,
              serverParams: {
                __sort: '-TimeString',
                __offset: 1, 
                __limit: 10,
              },
            }; 
          },
          methods: {
             onChildClick(value) {
               console.log(value);
                //  const starttim = value[0][0].toISOstring();
                if (value.length > 2) {
                  const startdate = moment(value[0][0]).format('YYYY-MM-DD HH:MM:SS');
                  const enddate = moment(value[0][1]).format('YYYY-MM-DD HH:MM:SS');
                  this.updateParams({
                   TimeString__gte: startdate,
                   TimeString__lte: enddate, 
                    VarValue: value[1], 
                    VarName: value[2],
                  });
                } else {
                    this.updateParams({
                      MsgNumber: value[0], 
                      MsgText: value[1],
                  });
                }
                console.log(this);
                this.loadItems();
              },

              updateParams(newProps) {
                this.serverParams = Object.assign({}, this.serverParams, newProps);
              },
      
              onPageChange(params) {
                console.log(params);
                this.updateParams({ __offset: (params.currentPage - 1) * params.currentPerPage });
                this.loadItems();
              },

              onPerPageChange(params) {
                this.updateParams({ __limit: params.currentPerPage });
                this.loadItems();
              },

              onSortChange(params) {
                this.updateParams((params[0].type === 'asc') ? { __sort: params[0].field } : { __sort: `-${params[0].field}` }); 
                this.loadItems();
              },
              
              onColumnFilter(params) {
                this.updateParams(params);
                this.loadItems();
              },

              // load items is what brings back the rows from server
              loadItems() {
                  axios.get(`http://${localStorage.ip}:${localStorage.port}/api/InformazionePezzoProdotto`, { params: this.serverParams })
                  .then((response) => { 
                      this.totalRecords = response.data.meta.total;
                      this.rows = response.data.data;
                  });
              },
          },
          components: {
              VueGoodTable,
              Dropdownmenu,
          },
      };

</script>
<style>

</style>