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
        style="height: 100%;padding: 0;"
      >
        <d3-line-area-plot
          :line="ffqLineData"
          :area="ffqAreaData"
          :text="plotText"
          :heightModifier=3
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
          :heightModifier=3
          :resize-notification="resizeNotification"
          :args="args"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import LineAreaPlot from "../d3js/line-area-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep, unifiedRound} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "thresholds": defaultTresholds,
    "parentDisplaysError": isParentDisplayingErrors,
    "label": "Quality II",
    //
    "name": "quality-2",
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
      },
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
      },
      "args": function () {
        const options = selectData(this.options);
        return {
          "yRange": {
            "max": 50,
            "min": 0,
          },
          "margin": options["margin"],
        }
      },
    }
  };

  function selectData(data) {
    return data["quality-2"];
  }

  function isParentDisplayingErrors(){
    return true;
  }
  
  function defaultTresholds(){
    return {
      "Bad": badTreshold,
      "Ok": okTreshold,
      "legend": "maximal difference between maximum and minimum in the graph",
    }
  }
  let okTreshold = 8;
  let badTreshold = 15;
  function validateData(data, thresholds, forceCompute=false) {
    data = selectData(data);
    if(data["status"] && !forceCompute){
      return data["status"];
    }else{
      let min = Math.min(...data["FFQ"].mean, ...data["FFQ"].median,
                        ...data["LFQ"].mean, ...data["LFQ"].median); 
      let max = Math.max(...data["FFQ"].mean, ...data["FFQ"].median,
                        ...data["LFQ"].mean, ...data["LFQ"].median); 

      let diff = max - min;
      diff = unifiedRound(diff);

      let status;
      let message;
      if(diff < okTreshold){
        message = "";
        status = STATUS_OK;
      }else{
        let state;
        if (diff < badTreshold){
          state = "suspecious";
          status = STATUS_WARNING;
        }else{
          state = "wronng";
          status = STATUS_INVALID;
        }
        message = "Property is considered " + state + ", because difference(" + diff + 
          ") between maximal(" + max + ") and minmal(" + min + ") value is too large."
      }
      let result = {
        "status": status,
        "message": message,
      }
      data["status"] = result;
      return result;
    }
  }

</script>
