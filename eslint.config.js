import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    ignores: ['dist/**'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': tsPlugin,
      prettier,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules, // TypeScript recommended
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['error', { singleline: 3 }],
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'warn',
    },
  },
]
