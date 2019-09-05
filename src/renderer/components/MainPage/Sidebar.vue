<template>
  <div id="parentx">
    <vs-button @click="active=!active" vs-allign="center" size="large" 
                color="primary" type="flat">
                 <vs-icon icon="apps" size="large" color="rgb(70, 150, 0)"></vs-icon>
                 </vs-button>
    <vs-sidebar parent="body" default-index="1"  color="primary" class="sidebarx" spacer v-model="active">

      <!-- <div class="header-sidebar" slot="header">
        <vs-avatar  size="70px" src="~@/assets/logo.png"/>

        <h4>
          Nuova Star
        </h4>

      </div> -->
       <vs-sidebar-item v-show="Statistiche" :to="{ name: 'Statistiche'}" index="1" icon="score">
          Statistiche Produzione
        </vs-sidebar-item>
        <vs-sidebar-item v-show="Segnalazioni" :to="{ name: 'Segnalazioni'}" index="2" icon="error">
          Segnalazioni
        </vs-sidebar-item>
        <vs-sidebar-item v-show="Produzione1H"  :to="{ name: 'Produzione1H'}" index="3" icon="trending_up">
          Produzione 1H
        </vs-sidebar-item>
        <vs-sidebar-item v-show="Produzione1m" index="4" :to="{ name: 'Produzione1m'}" icon="trending_flat">
          Produzione 1m
        </vs-sidebar-item>
        <vs-sidebar-item v-show="Scarti" index="5" :to="{ name: 'Scarti'}" icon="delete">
          Scarti
        </vs-sidebar-item>
        <vs-sidebar-item v-show="StatoImpianto" index="6" :to="{ name: 'StatoImpianto'}" icon="device_hub">
          Stato Impianto
        </vs-sidebar-item>
        <vs-sidebar-item v-show="DatiAnalogici" index="7"  :to="{ name: 'DatiAnalogici'}" icon="build">
          DatiAnalogici
        </vs-sidebar-item>
        <vs-sidebar-item  v-show="IPP" index="8"  :to="{ name: 'IPP'}" icon="help">
          Informazioni Pezzi Prodotti
        </vs-sidebar-item>

      <div class="footer-sidebar" slot="footer">
        <vs-button icon="settings" :to="{ name: 'Impostazioni'}" color="primary" type="border"></vs-button>
        <vs-button icon="info"  @click="info=true" color="primary" type="border"></vs-button>
      </div>
      <vs-popup class="holamundo"  title="Informazioni" :active.sync="info">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <img id="YASPAT" src="~@/assets/yaspat.png" width="400" height="250" alt="YASPAT">
        </vs-col>
      <vs-row  vs-type="flex" vs-justify="space-between">
      <p>
        YASPAT - Yet Another Simple Production Analysis Tool 
      </p>
      <p  style="color: #ff0000">Blue Berylium</p>
      </vs-row>
      <vs-divider/>
      <div> 
        Author: Federico Lodovici
      </div>

    </vs-popup>
    </vs-sidebar>
  </div>

</template>

<script>
  export default {
    data: () => ({
      info: false,
      active: false,
      Statistiche: true,
      Segnalazioni: true,
      Produzione1H: true,
      Produzione1m: true,
      Scarti: false,
      StatoImpianto: false,
      IPP: false,
      DatiAnalogici: false,
    }),
    mounted() {
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
      if (localStorage.IPP) {
        this.IPP = localStorage.getItem('IPP') === 'true';
      }
      if (localStorage.DatiAnalogici) {
        this.DatiAnalogici = localStorage.getItem('DatiAnalogici') === 'true';
      }
    },
  };
</script>

<style>
  .header-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}
.header-sidebar h4 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.header-sidebar h4 > button {
  margin-left: 10px;
}
.footer-sidebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.footer-sidebar > button {
  border: 0px solid rgba(0,0,0,0) !important;
  border-left: 1px solid rgba(0,0,0,0.07) !important;
  border-radius: 0px !important;
}
</style>