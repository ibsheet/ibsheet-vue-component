<script lang="ts">
import { defineComponent, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue';
import type { IBSheetOptions } from './IBSheetVue.Interface';

function generateId(len: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default defineComponent({
  name: 'IBSheetVue',
  props: {
    options: {
      type: Object as () => IBSheetOptions,
      required: true
    },
    data: {
      type: Array as () => any[],
      default: () => []
    },
    sync: {
      type: Boolean,
      default: false
    },
    style: {
      type: Object as () => Partial<CSSStyleDeclaration>,
      default: () => ({})
    }
  },
  emits: ['sheet-instance'],
  setup(props, { emit }) {
    const containerRef = shallowRef<HTMLDivElement | null>(null);
    const containerId = 'ibsheet-container-' + generateId(10);
    const sheetId = 'sheet_' + generateId(10);
    const sheetObj = shallowRef<any>(null);
    let retryInterval: ReturnType<typeof setInterval> | null = null;

    function initializeIBSheet() {
      if (!props.options) {
        console.error('[IBSheetVue] required input value "options" not set');
        throw new Error('[IBSheetVue] "options" is a required input; you must provide an IBSheet setting object');
      }

      if (!containerRef.value) {
        console.error('[IBSheetVue] containerRef is not assigned');
        return;
      }

      const containerDiv = document.createElement('div');
      containerDiv.id = containerId;
      containerDiv.className = 'ibsheet-container';

      if (props.style) {
        Object.assign(containerDiv.style, props.style);
      } else {
        containerDiv.style.width = '100%';
        containerDiv.style.height = '800px';
      }

      containerRef.value.appendChild(containerDiv);

      let retryCount = 0;
      const maxRetries = 50;
      const intervalTime = 100;

      retryInterval = setInterval(() => {
        const IBSheet = (window as any).IBSheet;
        if (IBSheet && IBSheet.version) {
          if (retryInterval) {
            clearInterval(retryInterval);
            retryInterval = null;
          }

          try {
            const sheet = IBSheet.create({
              id: sheetId,
              el: containerDiv,
              options: props.options,
              data: props.data ?? [],
              sync: props.sync ?? false,
            });

            sheetObj.value = sheet;
            emit('sheet-instance', sheet);
          } catch (err) {
            console.error('Error initializing IBSheet:', err);
          }
        } else {
          retryCount++;
          if (retryCount >= maxRetries) {
            if (retryInterval) {
              clearInterval(retryInterval);
              retryInterval = null;
            }
            console.error('[initializeIBSheet] IBSheet Initialization Failed: Maximum Retry Exceeded');
          }
        }
      }, intervalTime);
    }

    onMounted(() => {
      initializeIBSheet();
    });

    onBeforeUnmount(() => {
      if (retryInterval) {
        clearInterval(retryInterval);
      }
      if (sheetObj.value && typeof sheetObj.value.dispose === 'function') {
        try {
          sheetObj.value.dispose();
        } catch (err) {
          console.warn('Error disposing IBSheet instance:', err);
        }
      }
    });

    watch(
      () => [props.options, props.data, props.sync, props.style],
      () => {
        if (retryInterval) {
          clearInterval(retryInterval);
          retryInterval = null;
        }
        if (sheetObj.value && typeof sheetObj.value.dispose === 'function') {
          try {
            sheetObj.value.dispose();
          } catch (err) {
            console.warn('Error disposing IBSheet instance:', err);
          }
          sheetObj.value = null;
        }
        if (containerRef.value) {
          containerRef.value.innerHTML = '';
        }
        initializeIBSheet();
      }
    );

    return {
      containerRef,
    };
  }
});
</script>

<template>
  <div ref="containerRef" />
</template>