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
    "label": "GC content",
    //
    "name": "gc-content",
    "components": {
      "d3-line-plot": LinePlot,
    },
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "plotData": function () {
        const data = selectData(this.data);
        const options = selectData(this.options);
        return [
          {
            "label": "First fragment",
            "color": options["gcf"],
            "y": data["gcf-y"],
            "x": data["gcf-x"]
          }, {
            "label": "Last fragment",
            "color": options["gcl"],
            "y": data["gcl-y"],
            "x": data["gcl-x"]
          }
        ];
      },
      "args": function() {
        const options = selectData(this.options);
        return {
          "margin": options["margin"],
        }
      }
    }
  };

  function selectData(data) {
    return data["gc-content"];
  }

  function validateData(data) {
    return STATUS_OK;
  }

</script>