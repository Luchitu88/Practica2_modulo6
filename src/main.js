import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios';

createApp(App).use(router).mount('#app')

axios.get('http://localhost:3000/vehiculos')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));