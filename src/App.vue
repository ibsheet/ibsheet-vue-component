<script setup lang="ts">
import { shallowRef } from 'vue';
import IBSheetVue from './components/IBSheetVue.vue';
import { IB_Preset } from './components/IBPreset';
import type { IBSheetInstance, IBSheetOptions } from './components/IBSheetVue.Interface'
// import { IBSheetVue, IB_Preset, type IBSheetInstance, type IBSheetOptions } from '../dist/ibsheet-vue/types/index';

console.log('IBSheetVue:', IBSheetVue);

const sheet = shallowRef<IBSheetInstance | null>(null);

const onSheetReady = (instance: IBSheetInstance) => {
  sheet.value = instance;
  // console.log('onSheetReady :', instance);
  // console.log(sheet.value);
};

const Options: IBSheetOptions = {
  Cfg : {
    SearchMode:2
  },
  Cols : [
    {"Header": "문자열(Text)","Type": "Text","Name": "TextData","Width": 100,"Align": "Center","CanEdit": 1},
    {"Header": "줄넘김문자열(Lines)","Type": "Lines","Name": "LinesData","MinWidth": 250,"Align": "Center","CanEdit": 1,"RelWidth": 1},
    {"Header": "콤보(Enum)","Type": "Enum","Name": "ComboData","Width": 100,"Align": "Right","Enum": "|대기|진행중|완료","EnumKeys": "|01|02|03"},
    { Header: "Ymd", Name: "sDate_Ymd", Extend: IB_Preset.YMD, Width: 110 },
    { Header: "Ym",  Name: "sDate_Ym",  Extend: IB_Preset.YM,  Width: 90 },
    { Header: "Md",  Name: "sDate_Md",  Extend: IB_Preset.MD,  Width: 90 }  
  ],
  Events: {
    // onRenderFirstFinish: function (evtParam: any) {
    //   console.log('onRenderFirstFinish @@');
    //   evtParam.sheet.loadSearchData(Data);
    // }
  }
}
  
const Style = {
  width: '100%',
  height: '500px'
}

const sheetData = [
  { TextData: 'John Doe' },
  { TextData: 'Jane Smith' }
];

const sheetSync = true;
</script>

<template>
  <ibsheet-vue
    :options="Options"
    :data="sheetData"
    :sync="sheetSync"
    :style="Style"
    @sheet-instance="onSheetReady"
  >
  </ibsheet-vue>
</template>