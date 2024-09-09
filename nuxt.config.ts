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
    '~/plugins/ant-design-vue.ts',
    '~/plugins/graphql-client.ts'
  ],
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      backendApiUrl: process.env.BACKEND_API_URL
    }
  },
})