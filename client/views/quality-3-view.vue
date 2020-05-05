<template>
  <b-container
    style="height: 100%"
    fluid
  >
    <no-data v-if="!dataAvailable" />
    <b-row
      v-else
      style="height: 100%"
    >
      <b-col
        md="6"
        style="height: 100%"
      >
        <d3-line-plot
          :data="ffqData"
          :text="plotText"
          :heightModifier=2
          :resize-notification="resizeNotification"
          :args="args"
        />
      </b-col>
      <b-col
        md="6"
        style="height: 100%"
      >
        <d3-line-plot
          :data="lfqData"
          :text="plotText"
          :heightModifier=2
          :resize-notification="resizeNotification"
          :args="args"
        />
      </b-col> 
    </b-row>
  </b-container>
</template>

<script>
  import LinePlot from "../d3js/line-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "Quality III",
    //
    "name": "quality-3",
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
      "ffqData": function () {
        const data = selectData(this.data)["FFQ"];
        const x = rangeByStep(0, data[0].length, 1);
        return data.map((values, index) => ({
          "label": "Cycle " + index,
          "color": null,
          "y": values,
          "x": x
        }));
      },
      "lfqData": function () {
        const data = selectData(this.data)["LFQ"];
        const x = rangeByStep(0, data[0].length, 1);
        return data.map((values, index) => ({
          "label": "Cycle " + index,
          "color": null,
          "y": values,
          "x": x
        }));
      },
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
      },
      "args": function() {
        const options = selectData(this.options);
        return {
          "useFocus": false,
          "yScale": {
            "useScientificNotation": true
          },
          "margin": options["margin"]
        };
      },
    }
  };

  function selectData(data) {
    return data["quality-3"];
  }

  function validateData(data) {
    return STATUS_OK;
  }

</script>
