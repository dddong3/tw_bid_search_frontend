import { defineNuxtPlugin } from '#app'
import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/reset.css'
// import 'ant-design-vue/dist/antd.css';
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Antd)
})
