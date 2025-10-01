# ibsheet-vue

A Vue.js wrapper component for IBSheet, providing seamless integration of IBSheet spreadsheet functionality into Vue 3 applications.

## Features

- 🔧 Easy integration with IBSheet library
- ⚡ Automatic initialization and cleanup
- 🎯 TypeScript support
- 🔄 Data synchronization support
- 📤 Event emission for sheet instance access
- 🎨 Customizable styling

## Installation

Make sure you have IBSheet library loaded in your project before using this component.

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
| `options`  | `IBSheetOptions`               | ✅       | -                                    | IBSheet configuration options      |
| `data`     | `any[]`                        | ❌       | `[]`                                 | Initial data for the spreadsheet   |
| `sync`     | `boolean`                      | ❌       | `false`                              | Enable data synchronization        |
| `style`    | `Partial<CSSStyleDeclaration>` | ❌       | `{ width: '100%', height: '800px' }` | Container styling object           |
| `exgSheet` | `IBSheetInstance`              | ❌       | `null`                               | Existing IBSheet instance to reuse |

## Events

| Event      | Payload           | Description                                            |
| ---------- | ----------------- | ------------------------------------------------------ |
| `instance` | `IBSheetInstance` | Emitted when the IBSheet instance is created and ready |

## TypeScript Support

Define your IBSheet options interface:

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

IBSheet interface: https://www.npmjs.com/package/@ibsheet/interface

## Lifecycle Management

The component handles Vue's lifecycle automatically:

1. **onMounted**: Creates container and initializes IBSheet
2. **onBeforeUnmount**: Cleans up intervals and disposes IBSheet instance

## Error Handling

The component includes comprehensive error handling:

- **Props Validation**: Validates that required `options` prop is provided
- **Initialization Retry**: Retries IBSheet initialization up to 50 times (5 seconds total)
- **Safe Disposal**: Safely disposes of IBSheet instances with error catching
- **Console Logging**: Provides detailed error messages for debugging

### Default Styling

The component applies default dimensions of 100% width and 800px height.

## Important Notes

1. **IBSheet Library**: Ensure the IBSheet library is loaded before component initialization
2. **Unique IDs**: Each component instance generates unique container and sheet IDs automatically
3. **Memory Management**: The component handles cleanup automatically on unmount
4. **Static Props**: Props are evaluated once during initialization. Changes to props after mount will not update the sheet
5. **Performance**: Consider using `v-if` instead of `v-show` for conditional rendering to ensure proper cleanup

## Troubleshooting

### Component not initializing

- Verify IBSheet library is loaded in your application
- Check browser console for error messages
- Ensure `options` prop contains valid IBSheet configuration

### IBSheet library not found error

```
[initializeIBSheet] IBSheet Initialization Failed: Maximum Retry Exceeded
```

**Solutions:**

- Add IBSheet script to your `index.html`
- Verify network requests are successful
- Check IBSheet version compatibility

### Props not updating the sheet

Since props are not reactive after initialization:

**Solutions:**

- Use IBSheet API methods to update data: `loadSearchData, doSearch, doSearchPaging`
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

## Load the IBSheet Library

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

## Local Setup of the IBSheet Library

- Install the IBSheet library in the project's `root/public` directory or a subdirectory within `root/public`
- If you are using the "Including External Script" method, set the path to the IBSheet library in `ibsheet_path`
- If you are using the "IBSheetLoader" method, set the path to the IBSheet library in `baseUrl`

## IBSheet Manual

https://docs.ibsheet.com/ibsheet/v8/manual/#docs/intro/1introduce

## Sample

- https://github.com/ibsheet/ibsheet-vue-sample.git
- https://github.com/ibsheet/loader-vue-guide-samples.git

## License

[MIT](./LICENSE)
