import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,vue}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
  {
    files: ['**/*.{js,vue,ts}'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'dist/', '.output/', '.nuxt/'],
    // 其他 ESLint 配置
  },
];