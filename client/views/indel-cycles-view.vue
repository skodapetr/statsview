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

  let okTreshold = 20;
  let badTreshold = 40;

  let jump = 2;
  function validateData(data) {
    let result = STATUS_OK;
    
    data = selectData(data);
    for (let index = jump; index < data["count"] - jump; ++index) {
      let curr = validateSpecificIndex(index, data);
      if(curr == STATUS_INVALID){
        return STATUS_INVALID;
      }
      else if (curr >= STATUS_WARNING){
        result = STATUS_WARNING;
      }
    }
    return result;
  }

  function validateSpecificIndex(index, data){
    let insertionsFwd = validateIndexOnString(data,"insertionsFwd",index);
    let insertionsRev = validateIndexOnString(data,"insertionsRev",index);
    let deletionsFwd = validateIndexOnString(data,"deletionsFwd",index);
    let deletionsRev = validateIndexOnString(data,"deletionsRev",index);
    return Math.max(insertionsFwd,insertionsRev,deletionsFwd,deletionsRev);
  }
  
  function validateIndexOnString(data, string, index){
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

    if(currVal > min * (1 - (okTreshold*2/100)) && currVal < max * (1 + (okTreshold/100))){
      return STATUS_OK;
    }
    else if (currVal > min * (1 - (badTreshold*2/100)) && currVal < max * (1 + (badTreshold/100))){
      return STATUS_WARNING;
    }else{
      console.log("indel-cycles :- " + index + ": " + currVal + " /€/ (" + min * (1 - (badTreshold*2/100)) + ", "
       + max * (1 + (badTreshold/100)) + ")");
      return STATUS_INVALID;
    }
    /**/
  }
</script>
