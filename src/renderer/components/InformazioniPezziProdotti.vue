<template>
<vs-row>
    <vs-tabs alignment="fixed">
      <vs-tab label="Grafico">
        <div>
          <Chart></Chart>
        </div>
      <vs-tab label="Tabella">
        <div>
          <Table></Table>
        </div>
      </vs-tab>
      </vs-tab>
    </vs-tabs>
</vs-row>
</template>

<script>
  import Table from './InformazioniPezziProdotti/Table';
  import Chart from './InformazioniPezziProdotti/Chart';
 
  export default {
    name: 'main-page',
    components: { Table, Chart },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>

<style>
 
</style>