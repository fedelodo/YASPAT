<template>
<vs-row>
    <vs-tabs alignment="fixed">
      <vs-tab label="Grafico">
        <div>
          <Chart></Chart>
        </div>
      </vs-tab>
      <vs-tab label="Tabella">
        <div>
          <Table></Table>
        </div>
      </vs-tab>
    </vs-tabs>
</vs-row>
</template>

<script>
  import Table from './DatiAnalogici/Table';
  import Chart from './DatiAnalogici/Chart';
 
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