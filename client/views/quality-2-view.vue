<template>
  <b-container
    style="height: 100%"
    fluid
  >
    <b-row style="height: 100%">
      <b-col
        md="6"
        style="height: 100%;padding: 0;"
      >
        <d3-line-area-plot
          :line="ffqLineData"
          :area="ffqAreaData"
          :resize-notification="resizeNotification"
          :args="args"
        />
      </b-col>
      <b-col
        md="6"
        style="height: 100%;padding: 0;"
      >
        <d3-line-area-plot
          :line="lfqLineData"
          :area="lfqAreaData"
          :resize-notification="resizeNotification"
          :args="args"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import LineAreaPlot from "../d3js/line-area-plot";

  import {rangeByStep} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "Quality II",
    //
    "name": "quality-2",
    "components": {
      "d3-line-area-plot": LineAreaPlot,
    },
    "data": () => ({
      "args": {
        "yRange": {
          "max": 50,
          "min": 0,
        }
      }
    }),
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "ffqLineData": function () {
        const data = selectData(this.data)["FFQ"];
        const options = selectData(this.options)["FFQ"];
        return [
          {
            "label": "Median",
            "color": options.median,
            "y": data.median,
            "x": data.bins,
          }, {
            "label": "Mean",
            "color": options.mean,
            "y": data.mean,
            "x": data.bins,
          }
        ];
      },
      "ffqAreaData": function () {
        const data = selectData(this.data)["FFQ"];
        const options = selectData(this.options)["FFQ"];
        return [
          {
            "label": "Percentile",
            "color": options.percentile,
            "y-high": data["percentile-75"],
            "y-low": data["percentile-25"],
            "x": data.bins,
          }
        ];
      },
      "lfqLineData": function () {
        const data = selectData(this.data)["LFQ"];
        const options = selectData(this.options)["LFQ"];
        return [
          {
            "label": "Median",
            "color": options.median,
            "y": data.median,
            "x": data.bins,
          }, {
            "label": "Mean",
            "color": options.mean,
            "y": data.mean,
            "x": data.bins,
          }
        ];
      },
      "lfqAreaData": function () {
        const data = selectData(this.data)["LFQ"];
        const options = selectData(this.options)["LFQ"];
        return [
          {
            "label": "Percentile",
            "color": options.percentile,
            "y-high": data["percentile-75"],
            "y-low": data["percentile-25"],
            "x": data.bins,
          }
        ];
      }
    }
  };

  function selectData(data) {
    return data["quality-2"];
  }

  function validateData(data) {
    return STATUS_OK;
  }

</script>
