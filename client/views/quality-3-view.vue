<template>
  <b-container
    style="height: 100%"
    fluid
  >
    <b-row style="height: 100%">
      <b-col
        md="6"
        style="height: 100%"
      >
        <d3-line-plot
          :data="ffqData"
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
          :resize-notification="resizeNotification"
          :args="args"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import LinePlot from "../d3js/line-plot";

  import {rangeByStep} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "Quality III",
    //
    "name": "quality-3",
    "components": {
      "d3-line-plot": LinePlot,
    },
    "data": () => ({
      "args": {
        "useFocus": false,
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
      "ffqData": function () {
        const data = selectData(this.data)["FFQ"];
        const options = selectData(this.options);
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
        const options = selectData(this.options);
        const x = rangeByStep(0, data[0].length, 1);
        return data.map((values, index) => ({
          "label": "Cycle " + index,
          "color": null,
          "y": values,
          "x": x
        }));
      }
    }
  };

  function selectData(data) {
    return data["quality-3"];
  }

  function validateData(data) {
    return STATUS_OK;
  }

</script>
