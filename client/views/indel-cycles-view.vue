<template>
  <div style="height: 100%">
    <no-data v-if="!dataAvailable" />
    <d3-line-plot
      v-else
      :data="plotData"
      :text="plotText"
      :heightModifier=2.5
      :resize-notification="resizeNotification"
      :args="args"
    />
  </div>
</template>

<script>
  import LinePlot from "../d3js/line-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep, smoothenArray} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID, worstStatus} from "../data-status";

  export default {
    "validator": validateData,
    "thresholds": defaultTresholds,
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
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
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

  function defaultTresholds(){
    return {
      "Bad": badTreshold,
      "Ok": okTreshold,
      "legend": "maximal % peak in comparison to average of surrounding values"
    }
  }
  let okTreshold = 20;
  let badTreshold = 40;

  let jump = 2;
  function validateData(data, thresholds) {
    let result = STATUS_OK;
    
    data = selectData(data);
    data = smoothenData(data);
    for (let index = jump; index < data["count"] - jump; ++index) {
      let curr = validateSpecificIndex(index, data, thresholds);
      if(curr == STATUS_INVALID){
        return STATUS_INVALID;
      }
      else if (curr >= STATUS_WARNING){
        result = STATUS_WARNING;
      }
    }
    return result;
  }

  function validateSpecificIndex(index, data, thresholds){
    let insertionsFwd = validateIndexOnString(data,"insertionsFwd",index, thresholds);
    let insertionsRev = validateIndexOnString(data,"insertionsRev",index, thresholds);
    let deletionsFwd = validateIndexOnString(data,"deletionsFwd",index, thresholds);
    let deletionsRev = validateIndexOnString(data,"deletionsRev",index, thresholds);
    return worstStatus([insertionsFwd,insertionsRev,deletionsFwd,deletionsRev]);
  }
  
  function validateIndexOnString(data, string, index, thresholds){
    let currVal = data[string][index];

    let prevIndex = Math.max(index - jump, 0);
    let previous = data[string][prevIndex];
    let upcomIndex = Math.min(index + jump, data["count"] - 1);
    let upcoming = data[string][upcomIndex];
    /*/
    let range = Math.abs(upcoming - previous);
    let average = (previous + upcoming) / 2;
    let diff = Math.abs(currVal - average);

    if(diff < range * okTreshold){
      return STATUS_OK
    }else if (diff < range * badTreshold){
      return STATUS_WARNING;
    }else{
      console.log(string + " on " + index + " (diff=" + diff + ", average=" + average + ")");
      return STATUS_INVALID;
    }
    /*/
    let min = Math.min(...data[string].slice(prevIndex, currVal - 1), ...data[string].slice(currVal + 1, upcomIndex));
    let max = Math.max(previous, upcoming);

    if(currVal > min * (1 - (thresholds["Ok"] * 2/100)) && currVal < max * (1 + (thresholds["Ok"]/100))){
      return STATUS_OK;
    }
    else if (currVal > min * (1 - (thresholds["Bad"]*2/100)) && currVal < max * (1 + (thresholds["Bad"]/100))){
      return STATUS_WARNING;
    }else{
      console.log(previous + " " + upcoming);
      console.log("indel-cycles :- " + index + ": " + currVal + " /€/ (" + min * (1 - (thresholds["Bad"]*2/100)) + ", "
       + max * (1 + (thresholds["Bad"]/100)) + ")");
      return STATUS_INVALID;
    }
    /**/
  }

  function smoothenData(data){
    let inf = smoothenArray(data["insertionsFwd"]);
    let inr = smoothenArray(data["insertionsRev"]);
    let def = smoothenArray(data["deletionsFwd"]);
    let der = smoothenArray(data["deletionsRev"]);
    return {
      "insertionsFwd": inf,
      "insertionsRev": inr,
      "deletionsFwd": def,
      "deletionsRev": der,
      "count": data["count"],
    }
  }
</script>
