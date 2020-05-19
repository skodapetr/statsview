<template>
  <div style="height: 100%">
    <no-data v-if="!dataAvailable" />
    <d3-line-plot
      v-else
      :data="plotData"
      :text="plotText"
      :heightModifier=2
      :resize-notification="resizeNotification"
      :args="args"
    />
  </div>
</template>

<script>
  import LinePlot from "../d3js/line-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "Insert size",
    //
    "name": "insert-size",
    "components": {
      "d3-line-plot": LinePlot,
      "no-data": NoData,
    },
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "dataAvailable": function(){
        return selectData(this.data) != null;
      },
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
      },
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
      },
      "args": function() {
        const options = selectData(this.options);
        return {
          "yScale": {
            "useScientificNotation": true
          },
          "margin": options["margin"],
        }
      },
    }
  };

  function selectData(data) {
    return data["insert-size"];
  }

  function validateData(data) {
    return STATUS_OK;
  }

</script>
