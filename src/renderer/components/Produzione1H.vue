<template>
    <vs-tabs alignment="fixed">
      <vs-tab label="Tabella">
        <div>
          <Table></Table>
        </div>
      </vs-tab>
      <vs-tab label="Grafico">
        <div>
          <Chart></Chart>
        </div>
      </vs-tab>
    </vs-tabs>
</template>

<script>
  import Table from './Produzione1H/Table';
  import Chart from './Produzione1H/Chart';
 
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