import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import loader from '@ibsheet/loader'
// ibsheet loader 호출 (1회만 하면 됨)
loader.load({
  name: 'ibsheet',
  baseUrl: '/ibsheet8',
  // theme: 'mint', // css 파일 테마  (설정이 없으면 /css/default/main.css 사용)
  locales: ['ko'], // locale 파일 (설정이 없으면 /locale/ko.js 파일 사용)
  plugins: [
    // plugin 파일
    'dialog',
    'common',
    'excel',
  ],
  // ibsheet license string
  license:
    'W2FtSztPKCRwbjY0YjJxbn9PM1xwGWkvd3w4O2U3ZiY8allnFCoRdCUzbyp7LHsrIihlDWUOKQB8IiU0bz1jMn90MCEZf11nHDpraTVtIX4jP3VzJVRlAHdKOHsqfip9Y3wkNmw/JiMVO0tuA0cZSTtqezF1OHJfKRtn',
})

createApp(App).mount('#app')
