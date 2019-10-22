<template>
  <plot-view
    :plot="plot"
    :scales="scales"
    :resize-notification="resizeNotification"
    :examples="examples"
  />
</template>

<script>
  import PlotView from "./plot-view";
  import {rangeByStep} from "../vue-svg-canvas/scale-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "Insert size",
    //
    "name": "insert-size",
    "components": {
      "plot-view": PlotView,
    },
    "data": () => ({
      "examples": []
    }),
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "plot": function () {
        const data = selectData(this.data);
        const options = selectData(this.options);
        const x = rangeByStep(0, data.count, 1);
        return [
          {
            "label": "All",
            "color": options.pairsTotal,
            "y": data.pairsTotal,
            "x": x,
          },
          {
            "label": "Inward",
            "color": options.inwardOrientedPairs,
            "y": data.inwardOrientedPairs,
            "x": x,
          },
          {
            "label": "Outward",
            "color": options.outwardOrientedPairs,
            "y": data.outwardOrientedPairs,
            "x": x,
          },
          {
            "label": "Other",
            "color": options.otherPairs,
            "y": data.otherPairs,
            "x": x,
          }
        ];
      },
      "scales": function () {
        const data = selectData(this.data);
        return {
          "x": {
            "title": "Insert cycle",
            "min": 0,
            "max": data.count,
            "step": 50,
          },
          "y": {
            "title": "Number of pairs",
            "min": 0,
            "max": data.max,
            "step": 50000,
          },
        };
      }
    }
  };

  function selectData(data) {
    return data["insert-size"];
  }

  function validateData(data) {
    data = selectData(data);
    return STATUS_OK;
  }

</script>
