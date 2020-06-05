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
    "parentDisplaysError": isParentDisplayingErrors,
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

  function isParentDisplayingErrors(){
    return true;
  }
  
  function defaultTresholds(){
    return {
      "Bad": 40,
      "Ok": 20,
      "legend": "maximal % peak in comparison to average of surrounding values"
    }
  }

  let jump = 2;
  function validateData(data, thresholds, forceCompute=false) {
    data = selectData(data);
    if(data["status"] && !forceCompute){
      return data["status"];
    }else{
      let status = STATUS_OK;
      let message = "";

      let sData = smoothenData(data);
      for (let index = jump; index < sData["count"] - jump; ++index) {
        let curr = validateSpecificIndex(index, sData, thresholds);
        if(curr["status"] === STATUS_INVALID){
          if(status != STATUS_INVALID){
            message = "";
          }
          message += curr["message"] + " on " + index + "\n"; 
          status = STATUS_INVALID;
        }
        else if (curr === STATUS_WARNING && status != STATUS_INVALID){
          message += curr["message"] + " on " + index + "\n"; 
          status = STATUS_WARNING;
        }
      }
      if(status != STATUS_OK){
        message = "Folowing fragments resulted in current state:\n" + message;
      }
      let result = {
        "status": status,
        "message": message,
      }
      data["status"] = result;
      return result;
    }
  }

  function validateSpecificIndex(index, data, thresholds){
    let insertionsFwd = validateIndexOnString(data,"insertionsFwd",index, thresholds);
    let insertionsRev = validateIndexOnString(data,"insertionsRev",index, thresholds);
    let deletionsFwd = validateIndexOnString(data,"deletionsFwd",index, thresholds);
    let deletionsRev = validateIndexOnString(data,"deletionsRev",index, thresholds);
    let worst = worstStatus([insertionsFwd,insertionsRev,deletionsFwd,deletionsRev]);

//#region message formating
    let message = "";
    let worstNames = [];
    if (worst != STATUS_OK){
      if(insertionsFwd === worst){
        worstNames.push("Insertions (fwd)")
      }
      if(insertionsRev === worst){
        worstNames.push("Insertions (rev)")
      }
      if(deletionsFwd === worst){
        worstNames.push("Deletions (fwd)")
      }
      if(deletionsRev === worst){
        worstNames.push("Insertions (rev)")
      }
      if(worstNames.length > 0){
        message = worstNames[0];
        for(let i = 1; i < worstNames.length; i++){
          message += ", " + worstNames[i];
        }
      }
    }
//#endregion

    return {
      "status": worst,
      "message": message,
    }
  }
  
  function validateIndexOnString(data, string, index, thresholds){
    let currVal = data[string][index];

    let prevIndex = Math.max(index - jump, 0);
    let previous = data[string][prevIndex];
    let upcomIndex = Math.min(index + jump, data["count"] - 1);
    let upcoming = data[string][upcomIndex];

    //minimum is taken from all values, cause peak pointing downwards is less suspicious
    let min = Math.min(...data[string].slice(prevIndex, index - 1), ...data[string].slice(index + 1, upcomIndex));
    let max = Math.max(previous, upcoming);

    if(currVal > min * (1 - (thresholds["Ok"] * 2/100)) && currVal < max * (1 + (thresholds["Ok"]/100))){
      return STATUS_OK;
    }
    else if (currVal > min * (1 - (thresholds["Bad"]*2/100)) && currVal < max * (1 + (thresholds["Bad"]/100))){
      return STATUS_WARNING;
    }else{
      /*/
      //uncomment to get console output

      console.log("indel-cycles status invalid reason:");
      console.log("previous: " + previous + ", upcoming:" + upcoming);
      console.log("indel-cycles :- " + index + ": " + currVal + " not in (" + min * (1 - (thresholds["Bad"]*2/100)) + ", "
       + max * (1 + (thresholds["Bad"]/100)) + ")");
      /**/
      return STATUS_INVALID;
    }
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
