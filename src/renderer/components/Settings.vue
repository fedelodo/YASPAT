<template>
  <div>
    <br/>
    <vs-row >
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <label for="">Statistiche</label>
        <vs-switch v-model="Statistiche"/>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <label for="">Segnalazioni</label>
        <vs-switch v-model="Segnalazioni"/>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <label for="">Produzione 1H</label>
        <vs-switch v-model="Produzione1H"/>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">  
        <label for="">Produzione 1m</label>
        <vs-switch v-model="Produzione1m"/>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <label for="">Scarti</label>
        <vs-switch v-model="Scarti"/>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <label for="">Stato Impianto</label>
        <vs-switch v-model="StatoImpianto"/>
      </vs-col>
       <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <label for="">Dati Analogici</label>
        <vs-switch v-model="DatiAnalogici"/>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <label for="">Informazioni Pezzi Prodotti</label>
        <vs-switch v-model="IPP"/>
      </vs-col>
    </vs-row>  
    <br />
    <vs-divider/>
    <vs-row vs-w="12"> 
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <vs-input type="text" placeholder="IP" v-model="ip"/>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <vs-input type="number" placeholder="Porta" v-model="port"/>
      </vs-col>  
    </vs-row>   
      <br />
    <vs-divider/>
    <vs-row vs-w="12"> 
      <vs-col vs-type="flex" vs-justify="center" vs-align="center">
        <vs-button color="primary" type="filled" @click="persist" icon="save">Save</vs-button>
      </vs-col>  
    </vs-row>   
  </div>
</template>

<script>
  
  export default {
    name: 'main-page',
     data() {
      return {
        ip: '',
        port: 5000,
        Statistiche: true,
        Segnalazioni: true,
        Produzione1H: true,
        Produzione1m: true,
        Scarti: false,
        StatoImpianto: false, 
        DatiAnalogici: false,
        IPP: false,
      };
  },
 
  mounted() {
    if (localStorage.ip) {
      this.ip = localStorage.ip;
    }
        
    if (localStorage.port) {
      this.port = localStorage.port;
    }

    if (localStorage.Statistiche) {
      this.Statistiche = localStorage.getItem('Statistiche') === 'true';
    }
    if (localStorage.Segnalazioni) {
      this.Segnalazioni = localStorage.getItem('Segnalazioni') === 'true';
    }
    if (localStorage.Produzione1H) {
      this.Produzione1H = localStorage.getItem('Produzione1H') === 'true';
    }
    if (localStorage.Produzione1m) {
      this.Produzione1m = localStorage.getItem('Produzione1m') === 'true';
    }
    if (localStorage.Scarti) {
      this.Scarti = localStorage.getItem('Scarti') === 'true';
    }
    if (localStorage.StatoImpianto) {
      this.StatoImpianto = localStorage.getItem('StatoImpianto') === 'true';
    }
    if (localStorage.DatiAnalogici) {
      this.DatiAnalogici = localStorage.getItem('DatiAnalogici') === 'true';
    }
    if (localStorage.IPP) {
      this.IPP = localStorage.getItem('IPP') === 'true';
    }
  },

  methods: {
    persist() {
      localStorage.Statistiche = this.Statistiche;
      localStorage.Segnalazioni = this.Segnalazioni;
      localStorage.Produzione1H = this.Produzione1H;
      localStorage.Produzione1m = this.Produzione1m;
      localStorage.Scarti = this.Scarti;
      localStorage.StatoImpianto = this.StatoImpianto;
      localStorage.DatiAnalogici = this.DatiAnalogici;
      localStorage.IPP = this.IPP;
      localStorage.ip = this.ip;
      localStorage.port = this.port;
      this.$parent.forceRerender();
    },
  },
  };
</script>

<style>
 
</style>