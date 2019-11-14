<template>
    <div>
        <vs-row vs-w="12" vs-align="flex-start" vs-type="flex" vs-justify="center" >
            <table id="firstTable">
                <thead>
                    <tr>
                    <th>Nome</th>
                    <th>Valore</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(value, key) in data">
                        <td>{{ key }}</td>
                        <td>{{ value }}</td>
                    </tr>
                </tbody>
            </table>
        </vs-row>
    </div>
</template>

<script>
  import axios from 'axios';
  export default {
    data() {
        return {
            data: [],
            interval: 60000,
        };       
    },
    name: 'main-page',
      methods: {
    getData() {
      axios.get(`http://${localStorage.ip}:${localStorage.port}/api/RealTime`, {})
        .then((response) => {
            this.data = response.data;
            console.log(this.data);
        }); 
    },
  },
  created() {
     this.getData();
  },
  };
</script>

<style>
table {
  border-collapse: collapse;
  border: 1px solid #000;
  width: 100%;
  height: 100%;
}

th, td {
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #4CAF50;
  color: white;
}
</style>