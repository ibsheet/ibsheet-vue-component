# ibsheet-vue

**@ibsheet/vue** is a Vue data grid component: the official wrapper for using [**IBsheet 8**](https://www.ibsheet.com), a JavaScript data grid, in Vue 3. IBsheet 8 supports tree, grouping, subtotals, pivot, formulas, frozen panes, cell merge, and Excel export and import.

**@ibsheet/vue**는 Vue(뷰) 데이터 그리드 컴포넌트입니다. 웹 데이터 그리드 [**IBsheet 8**](https://www.ibsheet.com)을 Vue 3에서 쓰기 위한 공식 래퍼입니다. IBsheet 8은 트리 · 그룹핑 · 소계 · 피벗 · 수식 · 틀고정 · 셀 병합 · 엑셀 내보내기와 가져오기를 지원합니다.

- IBsheet 8 homepage (제품 소개): https://www.ibsheet.com
- IBsheet 8 manual (매뉴얼): https://docs.ibsheet.com/ibsheet/v8/manual/
- MCP server for AI coding tools such as Claude Code, Cursor, GitHub Copilot, Codex CLI and Gemini CLI (AI 코딩 도구 연동): https://docs.ibsheet.com/ibsheet/v8/manual/docs/start/mcp.html

## Features

- 🔧 Easy integration with IB Sheet library
- ⚡ Automatic initialization and cleanup
- 🎯 TypeScript support
- 🔄 Data synchronization support
- 📤 Event emission for sheet instance access
- 🎨 Customizable styling

## Installation

Make sure you have IB Sheet library loaded in your project before using this component.

Using npm:

```bash
npm install @ibsheet/vue
```

Using yarn:

```bash
yarn add @ibsheet/vue
```

## Usage

### Basic Usage

```vue
<template>
  <div>
    <IBSheetVue :options="sheetOptions" :data="sheetData" />
  </div>
</template>

<script setup lang="ts">
  import { IBSheetVue, type IBSheetInstance } from '@ibsheet/vue'

  const sheetOptions: IBSheetOptions = {
    // Your IBSheet configuration options
    Cfg: {
      SearchMode: 2,
      HeaderMerge: 3,
    },
    Cols: [
      { Header: 'ID', Type: 'Text', Name: 'sId' },
      { Header: 'Name', Type: 'Text', Name: 'name' },
      { Header: 'Age', Type: 'Int', Name: 'age' },
    ],
  }

  const sheetData = [
    { sId: '1', name: 'John Doe', age: 30 },
    { sId: '2', name: 'Jane Smith', age: 25 },
  ]
</script>
```

Example: https://stackblitz.com/edit/vitejs-vite-brpanol5

### Advanced Usage with Event Handling

```vue
<template>
  <div>
    <div>
      <button @click="handleAddRow">Add Row</button>
      <button @click="handleExportExcel">Export Excel</button>
    </div>

    <IBSheetVue
      :options="sheetOptions"
      :data="sheetData"
      @instance="getInstance"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    IBSheetVue,
    IB_Preset,
    type IBSheetInstance,
    type IBSheetOptions,
    type IBSheetEvents,
  } from '@ibsheet/vue'

  
  const handleAfterChange: IBSheetEvents['onAfterChange'] = (param) => { 
    // The type of the parameter is automatically inferred.
    console.log('Data changed value:', param.val); 
  };

  const sheetOptions: IBSheetOptions = {
    // Your IBSheet configuration options
    Cfg: {
      SearchMode: 2,
      HeaderMerge: 3,
    },
    Cols: [
      { Header: 'ID', Type: 'Text', Name: 'sId' },
      { Header: 'Name', Type: 'Text', Name: 'name' },
      { Header: 'Age', Type: 'Int', Name: 'age' },
      { Header: 'Ymd', Name: 'sDate_Ymd', Extend: IB_Preset.YMD, Width: 110 }
    ],
  }

  const sheetData = [
    // Your data
    { sId: '1', name: 'John Doe', age: 30, sDate_Ymd:'20250923' },
    { sId: '2', name: 'Jane Smith', age: 25, sDate_Ymd:'20251002' }
  ]

  const customStyle = {
    width: '100%',
    height: '600px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  }

  let mySheet: IBSheetInstance;

  const getInstance = (sheet: IBSheetInstance) => {
    // You can store the sheet instance or perform initial operations
    mySheet = sheet
  }

  const handleAddRow = () => {
    if (mySheet) {
      mySheet.addRow();
    }
  }

  const handleExportExcel = () => {
    if (mySheet) {
      // exportData method requires the jsZip library
      // When checking for the jsZip library, if it hasn't been loaded separately, the file at ./plugins/jszip.min.js (relative to ibsheet.js) will be loaded automatically.
      mySheet.exportData({fileName:'ibsheet_vue_export_example.xlsx'});
    }
  }
</script>
```

Example: https://stackblitz.com/edit/vitejs-vite-fx91nwtn

## Props

| Prop       | Type                           | Required | Default                              | Description                        |
| ---------- | ------------------------------ | -------- | ------------------------------------ | ---------------------------------- |
| `options`  | `IBSheetOptions`               | ✅       | -                                    | IB Sheet configuration options      |
| `data`     | `any[]`                        | ❌       | `[]`                                 | Initial data for the spreadsheet   |
| `sync`     | `boolean`                      | ❌       | `false`                              | Enable data synchronization        |
| `style`    | `Partial<CSSStyleDeclaration>` | ❌       | `{ width: '100%', height: '800px' }` | Container styling object           |
| `exgSheet` | `IBSheetInstance`              | ❌       | `null`                               | Existing IB Sheet instance to reuse |

## Events

| Event      | Payload           | Description                                            |
| ---------- | ----------------- | ------------------------------------------------------ |
| `instance` | `IBSheetInstance` | Emitted when the IB Sheet instance is created and ready |

## TypeScript Support

Define your IB Sheet options interface:

```typescript
export interface IBSheetOptions {
  Cfg?: IBSheetProperties
  Def?: object
  Cols?: IBCol[]
  LeftCols?: IBCol[]
  RightCols?: IBCol[]
  Head?: any[]
  Foot?: any[]
  Solid?: any[]
  Filter?: any[]
  Events?: IBSheetEvents
}
```

IB Sheet interface: https://www.npmjs.com/package/@ibsheet/interface

## Lifecycle Management

The component handles Vue's lifecycle automatically:

1. **onMounted**: Creates container and initializes IB Sheet
2. **onBeforeUnmount**: Cleans up intervals and disposes IB Sheet instance

## Error Handling

The component includes comprehensive error handling:

- **Props Validation**: Validates that required `options` prop is provided
- **Initialization Retry**: Retries IB Sheet initialization up to 50 times (5 seconds total)
- **Safe Disposal**: Safely disposes of IB Sheet instances with error catching
- **Console Logging**: Provides detailed error messages for debugging

### Default Styling

The component applies default dimensions of 100% width and 800px height.

## Important Notes

1. **IB Sheet Library**: Ensure the IB Sheet library is loaded before component initialization
2. **Unique IDs**: Each component instance generates unique container and sheet IDs automatically
3. **Memory Management**: The component handles cleanup automatically on unmount
4. **Static Props**: Props are evaluated once during initialization. Changes to props after mount will not update the sheet
5. **Performance**: Consider using `v-if` instead of `v-show` for conditional rendering to ensure proper cleanup

## Troubleshooting

### Component not initializing

- Verify IB Sheet library is loaded in your application
- Check browser console for error messages
- Ensure `options` prop contains valid IB Sheet configuration

### IB Sheet library not found error

```
[initializeIBSheet] IBSheet Initialization Failed: Maximum Retry Exceeded
```

**Solutions:**

- Add IB Sheet script to your `index.html`
- Verify network requests are successful
- Check IB Sheet version compatibility

### Props not updating the sheet

Since props are not reactive after initialization:

**Solutions:**

- Use IB Sheet API methods to update data: `loadSearchData, doSearch, doSearchPaging`
- For configuration changes, recreate the component using `v-if` or key changes
- Access the sheet instance through the `@instance` event for manual updates

### Performance issues with reactive props

- Use `shallowRef` for large data arrays if deep reactivity isn't needed
- Consider using `v-memo` for expensive re-renders
- Implement debouncing for rapid prop changes

### Memory leaks

The component handles cleanup automatically, but ensure:

- Don't hold references to sheet instances after component unmount
- Remove custom event listeners you've added manually

## Load the IB Sheet Library

Using Including External Script

ex) in index.html

```html
<link rel="stylesheet" href="ibsheet_path/css/default/main.css" />

<script src="ibsheet_path/ibsheet.js"></script>
<script src="ibsheet_path/locale/ko.js"></script>
<script src="ibsheet_path/plugins/ibsheet-common.js"></script>
<script src="ibsheet_path/plugins/ibsheet-dialog.js"></script>
<script src="ibsheet_path/plugins/ibsheet-excel.js"></script>
```

Using IBSheetLoader

- reference: https://www.npmjs.com/package/@ibsheet/loader
- manual: https://ibsheet.github.io/loader-manual

## Local Setup of the IB Sheet Library

- Install the IB Sheet library in the project's `root/public` directory or a subdirectory within `root/public`
- If you are using the "Including External Script" method, set the path to the IB Sheet library in `ibsheet_path`
- If you are using the "IBSheetLoader" method, set the path to the IB Sheet library in `baseUrl`

## IB Sheet Manual

https://docs.ibsheet.com/ibsheet/v8/manual/#docs/intro/1introduce

## Sample

- https://github.com/ibsheet/ibsheet-vue-sample.git
- https://github.com/ibsheet/loader-vue-guide-samples.git

## License

[MIT](./LICENSE)
