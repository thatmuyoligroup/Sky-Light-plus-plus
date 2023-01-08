import {createApp} from 'vue/dist/vue.esm-bundler';
import {createPinia} from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import Vant from 'vant';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import dayjs from "dayjs";
import App from './App.vue'
import router from './router'

import './assets/main.css'
import './assets/sky.scss'
import 'leaflet/dist/leaflet.css'
import 'vant/lib/index.css';

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Default from "./sky/i18n/Default";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)

const app = createApp(App)
app.use(ElementPlus, Default.elLocal)
app.use(Vant)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)
app.use(router)
app.mount('#app')

