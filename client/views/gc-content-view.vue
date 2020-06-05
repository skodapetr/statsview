<template>
  <div style="height: 100%">
    <no-data v-if="!dataAvailable" />
    <d3-line-plot
      v-else
      :data="plotData"
      :text="plotText"
      :heightModifier=2
      :resize-notification="resizeNotification"
      :args="args"
    />
  </div>
</template>

<script>
  import LinePlot from "../d3js/line-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep, unifiedRound} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID, worstStatus} from "../data-status";

  export default {
    "validator": validateData,
    "thresholds": defaultTresholds,
    "parentDisplaysError": isParentDisplayingErrors,
    "label": "GC content",
    //
    "name": "gc-content",
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
      "plotData": function () {
        const data = selectData(this.data);
        let ref = selectRef(this.data);
        const options = selectData(this.options);
        let result =  [
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
        if(ref){
          if(!ref["mapped"]){
            let ratio = data["gcl-x"][data["gcl-x"].length - 1] / ref["ref-x"][ref["ref-x"].length - 1];
            ref["ref-x"] = ref["ref-x"].map(value => value * ratio);
            ref["mapped"] = true;
          }
          result.push({
            "label": "Reference",
            "color": options["ref"],
            "y": ref["ref-y"],
            "x": ref["ref-x"],
          });
        }
        return result;
      },
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
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

  function selectRef(data) {
    return data["gc-content-ref"];
  }

  function isParentDisplayingErrors(){
    return true;
  }
  
  function defaultTresholds(){
    return {
      "Bad": badTreshold,
      "Ok": okTreshold,
      "legend": "maximal % difference of actual value and average of surounding ones"
    }
  }
  let okTreshold = 15;
  let badTreshold = 30;

  function validateData(data, thresholds, forceCompute=false) {
    data = selectData(data);
    if(data["status"] && !forceCompute){
      return data["status"];
    }else{
      let status = STATUS_OK;
      let message = "";

      for (let index = 1; index < data["count"] - 1; ++index) {
        let curr = validateSpecificIndex(index, data);
        if(curr["status"] === STATUS_INVALID){
          if(status != STATUS_INVALID){
            message = "";
          }
          message += curr["message"] + " on " + index + ", ";
          status = STATUS_INVALID;
        }
        else if (curr["status"] === STATUS_WARNING && status != STATUS_INVALID){
          message += curr["message"] + " on " + index + ", ";
          status = STATUS_WARNING;
        }
      }
      if(status != STATUS_OK){
        message = "Folowing fragments are in worst state:\n" + message;
      }
      let result = {
        "status": status,
        "message": message,
      }
      data["status"] = result;
      return result;
    }
  }

  function validateSpecificIndex(index, data){
    let gcf = validateIndexOnString(data,"gcf-y","gcf-x",index);
    let gcl = validateIndexOnString(data,"gcl-y","gcl-x",index);
    let worst = worstStatus([gcf, gcl]);
    let message = "";
    if(worst != STATUS_OK){
      if(gcl === gcf){
        message = "both"
      }else if(gcl === worst){
        message = "last";
      }
      else{
        message = "first";
      }
    }
    return {
      "status": worst,
      "message": message,
    };
  }
  
  function validateIndexOnString(data, stringY, stringX, index){
    let currVal = data[stringY][index];
    let currX = data[stringX][index];

    let prevIndex = Math.max(index - 1, 0);
    let previousY = data[stringY][prevIndex];
    let previousX = data[stringX][prevIndex];
    let upcomIndex = Math.min(index + 1, data[stringX].length - 1);
    let upcomingY = data[stringY][upcomIndex];
    let upcomingX = data[stringX][upcomIndex];

    let distance = upcomingX - previousX; 
    let average = (previousY * (upcomingX - currX) + upcomingY * (currX-previousX))/distance;
    let min = Math.min(previousY, upcomingY);
    let max = Math.max(previousY, upcomingY);

    if((currVal > min && currVal < max) || isTresholdOk(okTreshold, currVal, average)){
      return STATUS_OK;
    }
    else if (isTresholdOk(badTreshold, currVal, average)){
      /*/
      //uncomment to activate console output
      console.log(currX + ": " + currVal + " /€/ (" + average * (1 - (badTreshold/100)) + ", "
       + average * (1 + (badTreshold/100)) + ") - average = " + average + " (all rounded by unifiedRound)");
      console.log(average + " = (" + previousY + " * " + " (" + upcomingX + " - " + currX + ") + "
       + upcomingY + " * (" + currX + " - " + previousX + ")) / (" + upcomingX + " - " + previousX + ")");
      /**/
      return STATUS_WARNING;
    }else{
      return STATUS_INVALID;
    }
    return STATUS_OK;
  }

  function isTresholdOk(treshold, currVal, average){
    currVal = unifiedRound(currVal);
    return currVal >= unifiedRound(average * (1 - (treshold/100)))
     && currVal <= unifiedRound(average * (1 + (treshold/100)));
  }
</script>