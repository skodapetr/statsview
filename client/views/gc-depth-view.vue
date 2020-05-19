<template>
  <div style="height: 100%">
    <no-data v-if="!dataAvailable" />
    <d3-line-area-plot
      v-else
      :line="lineData"
      :area="areaData"
      :text="plotText"
      :heightModifier=2
      :resize-notification="resizeNotification"
      :args="args"
    />
  </div>
</template>

<script>
  import LineAreaPlot from "../d3js/line-area-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "GC depth",
    //
    "name": "gc-depth",
    "components": {
      "d3-line-area-plot": LineAreaPlot,
      "no-data": NoData,
    },
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "dataAvailable": function () {
        return selectData(this.data) != null;
      },
      "lineData": function () {
        const data = selectData(this.data);
        const options = selectData(this.options);
        return [
          {
            "label": "Median",
            "color": options["median"],
            "y": data["50"],
            "x": data["x"]
          }
        ];
      },
      "areaData": function () {
        const data = selectData(this.data);
        const options = selectData(this.options);
        return [
          {
            "label": "10-90",
            "color": options["10-90"],
            "y-high": data["90"],
            "y-low": data["10"],
            "x": data["x"],
          }, {
            "label": "25-75",
            "color": options["25-75"],
            "y-high": data["75"],
            "y-low": data["25"],
            "x": data["x"],
          }
        ];
      },
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
      },
      "args": function () {
        const options = selectData(this.options);
        return {
          "margin": options["margin"],
        }
      }
    }
  };

  function selectData(data) {
    return data["gc-depth"];
  }

  function validateData(data) {
    return STATUS_OK;
  }

</script>