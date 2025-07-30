const fs = require('fs')
const path = require('path')

const basePackage = require('../package.json')

// 필요한 필드만 추출
const distPackage = {
  name: basePackage.name.replace('-component', ''),
  version: basePackage.version,
  license: basePackage.license,
  keywords: [
    "vue",
    "ibsheet",
    "grid",
    "component"
  ],
  repository: {
    "type": "git",
    "url": "https://github.com/ibsheet/ibsheet-vue-component.git"
  },
  bugs: {
    "url": "https://github.com/ibsheet/ibsheet-vue-component/issues"
  },
  homepage: "https://www.ibsheet.com/",
  main: 'ibsheet-vue.umd.js',
  module: 'ibsheet-vue.es.js',
  types: "./types/index.d.ts",
  exports: {
    '.': {
      types: "./types/index.d.ts",
      import: './ibsheet-vue.es.js',
      require: './ibsheet-vue.umd.js',
      default: './ibsheet-vue.umd.js',
    }
  },
  peerDependencies: {
    vue: '^3.0.0'
  }
}

fs.writeFileSync(
  path.resolve(__dirname, '../dist/ibsheet-vue/package.json'),
  JSON.stringify(distPackage, null, 2)
)