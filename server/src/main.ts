import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// import cors from 'cors'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// app.use(cors({origin: 'http://localhost:4000'}), function (req: any, res: any, next: any) {
//   req.header.common['Access-Control-Allow-Origin'] = '*'
// });

app.mount('#app')
