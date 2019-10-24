<template>
  <div style="height: 100%">
    <plot-view
      v-if="false"
      :plot="plot"
      :scales="scales"
      :resize-notification="resizeNotification"
    />
    <d3-area-plot
      :data="plot"
      :resize-notification="resizeNotification"
    />
  </div>
</template>

<script>
  import PlotView from "../plot/abstract-svg-line-plot";
  import AreaPlot from "../d3js/area-plot";

  import {rangeByStep} from "../vue-svg-canvas/scale-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "ACGT cycles",
    //
    "name": "acgt-cycles",
    "components": {
      "plot-view": PlotView,
      "d3-area-plot": AreaPlot,
    },
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "plot": function () {
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
      "scales": function () {
        const data = selectData(this.data);
        return {
          "x": {
            "title": "Read Cycle",
            "min": 0,
            "max": Math.max(...data["cycle"]),
            "step": 10,
          },
          "y": {
            "title": "Base content [%]",
            "min": 0,
            "max": 100,
            "step": 20,
          },
        };
      },
    }
  };

  function selectData(data) {
    return data["acgt-cycles"];
  }

  function validateData(data) {
    data = selectData(data);
    return STATUS_OK;
  }

</script>