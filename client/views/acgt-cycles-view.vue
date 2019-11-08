<template>
  <div style="height: 100%">
    <d3-area-plot
      v-if="menuData.graph === 'area'"
      :data="plotData"
      :resize-notification="resizeNotification"
    />
    <d3-line-plot
      v-if="menuData.graph === 'line'"
      :data="plotData"
      :args="linePlotArgs"
      :resize-notification="resizeNotification"
    />
  </div>
</template>

<script>
  import AreaPlot from "../d3js/multi-area-plot";
  import LinePlot from "../d3js/line-plot";

  import {rangeByStep} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "ACGT cycles",
    "menuData": {
      "graph": "area"
    },
    //
    "name": "acgt-cycles",
    "components": {
      "d3-area-plot": AreaPlot,
      "d3-line-plot": LinePlot,
    },
    "data": () => ({
      "linePlotArgs": {

      }
    }),
    "props": {
      "data": {"type": Object, "required": true},
      "menuData": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "plotData": function () {
        const data = selectData(this.data);
        const options = selectData(this.options);
        return [
          {
            "label": "A",
            "color": options.A,
            "y": data.A,
            "x": data.cycle,
          },
          {
            "label": "C",
            "color": options.C,
            "y": data.C,
            "x": data.cycle,
          },
          {
            "label": "G",
            "color": options.G,
            "y": data.G,
            "x": data.cycle,
          },
          {
            "label": "T",
            "color": options.T,
            "y": data.T,
            "x": data.cycle,
          },
        ];
      },
    }
  };

  function selectData(data) {
    return data["acgt-cycles"];
  }

  function validateData(data) {
    return STATUS_OK;
  }

</script>