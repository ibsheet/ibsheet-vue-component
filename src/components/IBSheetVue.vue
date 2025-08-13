<script lang="ts">
  import {
    defineComponent,
    shallowRef,
    onMounted,
    onBeforeUnmount,
    watch,
  } from 'vue'
  import type {
    IBSheetCreateOptions,
    IBSheetInstance,
    IBSheetOptions,
  } from '@ibsheet/interface'

  function generateId(len: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  export default defineComponent({
    name: 'IBSheetVue',
    props: {
      options: {
        type: Object as () => IBSheetOptions,
        required: true,
      },
      data: {
        type: Array as () => any[],
        default: () => [],
      },
      sync: {
        type: Boolean,
        default: false,
      },
      style: {
        type: Object as () => Partial<CSSStyleDeclaration>,
        default: () => ({ width: '100%', height: '800px' }), // 기본 스타일 지정
      },
      exgSheet: {
        type: Object as () => IBSheetInstance,
        default: null,
      },
    },
    emits: ['instance'],
    setup(props, { emit }) {
      const containerRef = shallowRef<HTMLDivElement | null>(null)
      const containerId = 'ibsheet-container-' + generateId(10)
      const sheetId = 'sheet_' + generateId(10)
      const sheetObj = shallowRef<IBSheetInstance | null>(null)
      const retryInterval = shallowRef<ReturnType<typeof setInterval> | null>(
        null
      )

      function initializeSheet() {
        if (!props.options) {
          console.error('[IBSheetVue] required input value "options" not set')
          throw new Error(
            '[IBSheetVue] "options" is a required input; you must provide an IBSheet setting object'
          )
        }

        if (!containerRef.value) {
          console.error('[IBSheetVue] containerRef is not assigned')
          return
        }

        const containerDiv = document.createElement('div')
        containerDiv.id = containerId
        containerDiv.className = 'ibsheet-container'

        if (props.style) {
          Object.assign(containerDiv.style, props.style)
        }

        containerRef.value.appendChild(containerDiv)

        let retryCount = 0
        const maxRetries = 50
        const intervalTime = 100

        retryInterval.value = setInterval(() => {
          const IBSheet = (window as any).IBSheet
          if (IBSheet && IBSheet.version) {
            if (retryInterval.value) {
              clearInterval(retryInterval.value)
              retryInterval.value = null
            }

            try {
              const opt: IBSheetCreateOptions = {
                id: sheetId,
                el: containerDiv,
                options: props.options,
                data: props.data ?? [],
                sync: props.sync ?? false,
              }

              const sheet = IBSheet.create(opt)
              sheetObj.value = sheet
              emit('instance', sheet)
            } catch (err) {
              console.error('Error initializing IBSheet:', err)
            }
          } else {
            retryCount++
            if (retryCount >= maxRetries) {
              if (retryInterval.value) {
                clearInterval(retryInterval.value)
                retryInterval.value = null
              }
              console.error(
                '[initializeIBSheet] IBSheet Initialization Failed: Maximum Retry Exceeded'
              )
            }
          }
        }, intervalTime)
      }

      onMounted(() => {
        if (props.exgSheet) {
          const sheet = props.exgSheet
          const el = document.getElementById((sheet as any).id)
          if (
            el &&
            containerRef.value &&
            el.parentElement !== containerRef.value
          ) {
            el.parentElement?.removeChild(el)
            containerRef.value.appendChild(el)
          }
          sheetObj.value = sheet
          emit('instance', sheet)
        } else {
          initializeSheet()
        }
      })

      onBeforeUnmount(() => {
        if (retryInterval.value) clearInterval(retryInterval.value)
        if (sheetObj.value?.dispose) {
          try {
            sheetObj.value.dispose()
          } catch (err) {
            console.warn('Dispose error:', err)
          }
        }
      })

      watch(
        () => [props.options, props.data, props.sync, props.style],
        () => {
          if (retryInterval.value) {
            clearInterval(retryInterval.value)
            retryInterval.value = null
          }
          if (sheetObj.value && typeof sheetObj.value.dispose === 'function') {
            try {
              sheetObj.value.dispose()
            } catch (err) {
              console.warn('Error disposing IBSheet instance:', err)
            }
            sheetObj.value = null
          }
          if (containerRef.value) containerRef.value.innerHTML = ''
          initializeSheet()
        }
      )

      return {
        containerRef,
      }
    },
  })
</script>

<template>
  <div ref="containerRef" />
</template>
