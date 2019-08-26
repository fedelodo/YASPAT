<template>
<vs-row>
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
</vs-row>
</template>

<script>
  import Table from './MainPage/Table';
  import Chart from './MainPage/Chart';
 
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