<template>
  <div style="height: 100%">
    <no-data v-if="!dataAvailable" />
    <d3-area-plot
      v-else-if="menuData.graph === 'area'"
      :data="plotData"
      :text="plotText"
      :heightModifier=3.5
      :args="args"
      :resize-notification="resizeNotification"
      pretext="Cycle"
      units="%"
    />
    <d3-line-plot
      v-else-if="menuData.graph === 'line'"
      :data="plotData"
      :text="plotText"
      :heightModifier=2
      :args="args"
      :resize-notification="resizeNotification"
      pretext="Cycle"
      units="%"
    />
  </div>
</template>

<script>
  import AreaPlot from "../d3js/multi-area-plot";
  import LinePlot from "../d3js/line-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";
  import { black } from '../colors';

  export default {
    "validator": validateData,
    "thresholds": defaultTresholds,
    "label": "ACGT cycles",
    "menuData": {
      "graph": "line"
    },
    //
    "name": "acgt-cycles",
    "components": {
      "d3-area-plot": AreaPlot,
      "d3-line-plot": LinePlot,
      "no-data": NoData,
    },
    "props": {
      "data": {"type": Object, "required": true},
      "menuData": {"type": Object, "required": true},
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
        return [
          {
            "label": "A",
            "color": options["A"],
            "y": data["A"],
            "x": data["cycle"],
          },
          {
            "label": "C",
            "color": options["C"],
            "y": data["C"],
            "x": data["cycle"],
          },
          {
            "label": "G",
            "color": options["G"],
            "y": data["G"],
            "x": data["cycle"],
          },
          {
            "label": "T",
            "color": options["T"],
            "y": data["T"],
            "x": data["cycle"],
          },
        ];
      },
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
      },
      "args": function () {
        const options = selectData(this.options);
        return {
          "yRange": {
            "max": 100,
            "min": 0,
          },
          "margin": options["margin"],
        }
      },
    }
  };

  function selectData(data) {
    return data["acgt-cycles"];
  }

  function defaultTresholds(){
    return {
      "Bad": 10,
      "Ok": 5,
      "legend": "maximal difference between A and T, respective C and G",
    }
  }

  function validateData(data, thresholds) {
    let result = STATUS_OK;

    data = selectData(data);
    for (let index = 0; index < data["count"]; ++index) {
      let CG = Math.abs(data["C"][index] - data["G"][index]);
      let AT = Math.abs(data["A"][index] - data["T"][index]);
      let ma = Math.max(CG,AT);
      if(thresholds["Ok"] >= ma){
        continue;
      }
      else if (thresholds["Bad"] >= ma){
        result = STATUS_WARNING;
      }
      else{
        return STATUS_INVALID;
      }
    }
    return result;
  }
</script>