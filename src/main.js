import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
/* 1era importación de firebase*/
import firebase from "firebase";
/*importacion de objeto firebase de carpeta config */

/* 2da importación de firebase: objeto de firebase (poner solo el titulo firebaseConfig),
Crear carpeta config y poner apikey de firebase(llave)*/



Vue.config.productionTip = false;

new Vue({
  router,
  store,
  //se pone aca para que este disponible en todo el proyecto
  firebase,
  render: (h) => h(App),
}).$mount("#app");
