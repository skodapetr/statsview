<template>
  <div style="height: 100%">
    <d3-line-plot
      :data="plotData"
      :resize-notification="resizeNotification"
      :args="args"
    />
  </div>
</template>

<script>
  import LinePlot from "../d3js/line-plot";

  import {rangeByStep} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "Insert size",
    //
    "name": "insert-size",
    "components": {
      "d3-line-plot": LinePlot,
    },
    "data": () => ({
      "args": {
        "yScale": {
          "useScientificNotation": true
        },
      }
    }),
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "plotData": function () {
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
      }
    }
  };

  function selectData(data) {
    return data["insert-size"];
  }

  function validateData(data) {
    return STATUS_OK;
  }

</script>
