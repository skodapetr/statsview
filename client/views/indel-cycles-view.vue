<template>
  <div style="height: 100%">
    <no-data v-if="!dataAvailable" />
    <d3-line-plot
      v-else
      :data="plotData"
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
    "label": "Indels per cycle",
    //
    "name": "indel-cycle",
    "components": {
      "d3-line-plot": LinePlot,
      "no-data": NoData,
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
      "dataAvailable": function(){
        return selectData(this.data) != null;
      },
      "plotData": function () {
        const data = selectData(this.data);
        const options = selectData(this.options);
        const x = rangeByStep(0, data.count, 1);
        return [
          {
            "label": "Insertions (Fwd)",
            "color": options["insertionsFwd"],
            "y": data["insertionsFwd"],
            "x": x,
          },
          {
            "label": "Insertions (Rev)",
            "color": options["insertionsRev"],
            "y": data["insertionsRev"],
            "x": x,
          },
          {
            "label": "Deletions (Fwd)",
            "color": options["deletionsFwd"],
            "y": data["deletionsFwd"],
            "x": x,
          },
          {
            "label": "Deletions (Rev)",
            "color": options["deletionsRev"],
            "y": data["deletionsRev"],
            "x": x,
          },
        ];
      },
      "args": function () {
        const options = selectData(this.options);
        return {
          "margin": options["margin"],
        }
      },
    }
  };

  function selectData(data) {
    return data["indel-cycles"];
  }

  function validateData(data) {
    return STATUS_OK;
  }

</script>
