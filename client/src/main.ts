import "reflect-metadata";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createContainer } from './dependencyInjection/Container'
import App from './App.vue'
import router from './router'
// import '@/assets/js/main.js'
import '@/assets/css/custom.css'

createContainer()
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
