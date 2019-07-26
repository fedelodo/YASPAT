<template>
  <div id="app">
    <vs-row vs-w="12"  vs-justify="flex-start" vs-align="center">
      <vs-col vs-type="flex" vs-justify="flex-start" vs-align="center" vs-w="1">
        <Sidebar  :key="reloadsidebar"></Sidebar>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="flex-start" vs-align="left" vs-w="6">
       <img id="logo" src="~@/assets/RCM_logo.png" alt="electron-vue">
      </vs-col>
    </vs-row>
    <router-view></router-view>
  </div>
</template>

<script>

  import Sidebar from './components/MainPage/Sidebar';

  export default {
    name: 'YASPAT',
    components: { Sidebar },
    data() {
      return {
        reloadsidebar: 0,
      };
    },
    methods: {
      forceRerender() {
        console.log('Triggerato');
        this.reloadsidebar += 1;  
      },
    },
  };
</script>

<style>

   #logo {
    height: 50%;
    margin: 1%;
    width: 30%;
  }

  * {
    font-family: Roboto, sans-serif;  
  }

</style>
