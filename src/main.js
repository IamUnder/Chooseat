import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
import config from './firebase.json'

Vue.config.productionTip = false

// Configuración de firebase
const firebaseConfig = config

// Inicializar Firebase

initializeApp(firebaseConfig);
export const db = getFirestore();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
