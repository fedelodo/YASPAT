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
  import Table from './MainPage.1/Table';
  import Chart from './MainPage.1/Chart';
 
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