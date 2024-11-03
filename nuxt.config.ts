export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  plugins: [
    '~/plugins/graphql-client.ts',
    '~/plugins/ant-design-vue.ts',
    '~/plugins/piniaPersist.client.ts',
  ],
  css: ['~/assets/css/tailwind.css'],
  modules: [
    '@ant-design-vue/nuxt',
    '@pinia/nuxt',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pinia: {
    disableVuex: true,
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },
  runtimeConfig: {
    public: {
      backendApiUrl: process.env.BACKEND_API_URL
    }
  },
})