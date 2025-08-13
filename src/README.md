# ibsheet-vue

A Vue.js wrapper component for IBSheet, providing seamless integration of IBSheet spreadsheet functionality into Vue 3 applications using the Composition API.

## Features

- 🔧 Easy integration with IBSheet library
- ⚡ Automatic initialization and cleanup
- 🎯 TypeScript support with Vue 3 Composition API
- 🔄 Data synchronization support
- 📤 Event emission for sheet instance access
- 🎨 Customizable styling
- 🔍 Reactive props with automatic re-initialization
- 🚀 Template ref exposure for direct access

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
    <h1>My Spreadsheet</h1>
    <IBSheetVue :options="sheetOptions" :data="sheetData" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IBSheetVue, type IBSheetOptions } from '@ibsheet/vue'

  const sheetOptions: IBSheetOptions = {
    // Your IBSheet configuration options
    Cfg: {
      SearchMode: 2,
      HeaderMerge: 3,
    },
    Cols: [
      { Header: 'ID', Type: 'Text', Name: 'id' },
      { Header: 'Name', Type: 'Text', Name: 'name' },
      { Header: 'Age', Type: 'Int', Name: 'age' },
    ],
  }

  const sheetData = [
    { id: '1', name: 'John Doe', age: 30 },
    { id: '2', name: 'Jane Smith', age: 25 },
  ]
</script>
```

### Advanced Usage with Event Handling

```vue
<template>
  <div>
    <div>
      <button @click="addRow">Add Row</button>
      <button @click="getDataRows">Get DataRows</button>
    </div>

    <IBSheetVue
      :options="sheetOptions"
      :data="sheetData"
      :sync="false"
      :style="customStyle"
      @instance="getInstance"
    />
  </div>
</template>

<script setup lang="ts">
  import { shallowRef } from 'vue'
  import {
    IBSheetVue,
    IB_Preset,
    type IBSheetInstance,
    type IBSheetOptions,
    type IBSheetEvents,
  } from '@ibsheet/vue'

  type OnAfterChangeParam = Parameters<
    NonNullable<IBSheetEvents['onAfterChange']>
  >[0]

  const sheet = shallowRef<IBSheetInstance | null>(null)

  const sheetOptions: IBSheetOptions = {
    // Your IBSheet configuration options
    Cfg: {
      SearchMode: 2,
      HeaderMerge: 3,
    },
    Cols: [
      { Header: 'ID', Type: 'Text', Name: 'id' },
      { Header: 'Name', Type: 'Text', Name: 'name' },
      { Header: 'Age', Type: 'Int', Name: 'age' },
      { Header: 'Ymd', Name: 'sDate_Ymd', Extend: IB_Preset.YMD, Width: 110 },
      { Header: 'Ym', Name: 'sDate_Ym', Extend: IB_Preset.YM, Width: 90 },
      { Header: 'Md', Name: 'sDate_Md', Extend: IB_Preset.MD, Width: 90 },
    ],
  }

  const sheetData = [
    // Your data
  ]

  const customStyle = {
    width: '100%',
    height: '600px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  }

  const getInstance = (sheetInstance: IBSheetInstance) => {
    console.log('Sheet instance ready:', sheetInstance)
    sheet.value = sheetInstance

    // Set up event listeners
    if (sheet.value.addEventListener) {
      sheet.value.addEventListener(
        'onAfterChange',
        (event: OnAfterChangeParam) => {
          console.log('Data changed value:', event.val)
        }
      )
    }
  }

  const addRow = () => {
    if (sheet.value && sheet.value.addRow) {
      sheet.value.addRow()
    }
  }

  const getDataRows = () => {
    if (sheet.value && sheet.value.getDataRows) {
      const data = sheet.value.getDataRows()
      console.log('Sheet data:', data)
    }
  }
</script>
```

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
3. **watch**: Monitors prop changes and reinitializes when needed

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
4. **Reactivity**: Props are deeply watched and changes trigger sheet reinitialization
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

### Performance issues with reactive props

- Use `shallowRef` for large data arrays if deep reactivity isn't needed
- Consider using `v-memo` for expensive re-renders
- Implement debouncing for rapid prop changes

### Memory leaks

The component handles cleanup automatically, but ensure:

- Don't hold references to sheet instances after component unmount
- Remove custom event listeners you've added manually

## load to IBSheet

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
reference: https://www.npmjs.com/package/@ibsheet/loader
manual: https://ibsheet.github.io/loader-manual

## IBSheet Manual

https://docs.ibsheet.com/ibsheet/v8/manual/#docs/intro/1introduce

## License

[MIT](./LICENSE)
