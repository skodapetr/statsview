<template>
  <div
  style="height: 250px;"
  >
    <no-data v-if="!dataAvailable" />
    <table
      v-else
      class="summary-table"
    >
      <tr>
        <th>Name</th>
        <th>Value</th>
        <th>{{"% of '" + currDividor + "'"}}</th>
      </tr>
      <tr
        v-for="(value, index) in included"
        :key="value"
        :style="'color: ' + itemColor(value)"
      >
        <td 
          @click="setDividor(index)" 
          :style="setCursor(index)"
        >
          {{ value["string"] }}
        </td>
        <td class="value-cell">
          {{ formatNumber(data.summary[value["string"]]) }}
        </td>
        <td style="padding-left: 1rem" class="value-cell">
          {{ percents(index) }}
        </td>
      </tr>
    </table>
    <div style="padding-top: 1rem; text-align: center; color: gray;">
      Hint: click on a name to change the percents
    </div>
  </div>
</template>

<script>
  import NoData from "../ui/no-data";
  import { STATUS_OK, STATUS_WARNING, selectColor, STATUS_INVALID } from '../data-status';
import { unifiedRound } from './views-utils';

  export default {
    "validator": validateData,
    "thresholds": defaultThresholds,
    "parentDisplaysError": isParentDisplayingErrors,
    "label": "Summary",
    //
    "name": "summary-view",
    "components": {
      "no-data": NoData,
    },
    "data": () => ({
      "included": defaultIncluded(),
      "currDividor": "sequences",
    }),
    "props": {
      "data": {"type": Object, "required": true}
    },
    "computed": {
      "dataAvailable": function() {
        return this.data.summary;
      },
      "total": function () {
        return this.data.summary["sequences"];
      },
      "filteredSequences": function () {
        return this.data.summary["filtered sequences"];
      },
      "nonPrimaryAlignments": function () {
        return this.data.summary["non-primary alignments"];
      },
      "readsDuplicated": function () {
        return this.data.summary["reads duplicated"];
      },
      "readsMapped": function () {
        return this.data.summary["reads mapped"];
      },
      "readsMQ0": function () {
        return this.data.summary["reads MQ0"];
      },
      "averageLength": function () {
        return this.data.summary["average length"];
      }
    },
    "methods": {
      "formatNumber": function (number) {
        number = Math.round(number * 1000)/1000;
        if (Number.isInteger) {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          return number;
        }
      },
      "itemColor": function(itemName){
        if(this.data["status"] && this.data["status"]["message"].includes(itemName)){
          return selectColor(STATUS_INVALID);
        }else{
          return selectColor(undefined);
        }
      },
      "setDividor": function(index){
        if(!this.included[index]["noPercents"]){
          this.currDividor = this.included[index]["string"];
        }
      },
      "percents": function(index){
        if(!this.included[index]["noPercents"]){
          return unifiedRound(this.data.summary[this.included[index]["string"]] * 100
          / this.data.summary[this.currDividor]);
        }else{
          return "";
        }
      },
      "setCursor": function(index){
        if(!this.included[index]["noPercents"]){
          return "cursor: pointer";
        }else{
          return "";
        }
      }
    }
  };

  function defaultIncluded(){
    return [
        {
          "string": "sequences"
        },
        {
          "string": "reads mapped"
        },
        {
          "string": "reads mapped and paired"
        },
        {
          "string": "reads properly paired"
        },
        {
          "string": "reads MQ0"
        },
        {
          "string": "reads duplicated"
        },
        {
          "string": "total length",
          "noPercents": true
        },
        {
          "string": "bases mapped",
          "noPercents": true
        },
        {
          "string": "error rate",
          "noPercents": true
        },
        {
          "string": "average length",
          "noPercents": true
        },
        {
          "string": "average quality",
          "noPercents": true
        },
      ]
  }

  function selectData(data){
    return data.summary;
  }

  function isParentDisplayingErrors(){
    return false;
  }

  function defaultThresholds(){
    return {
      "Bad": "-",
      "Ok": "-",
      "legend": ""
    }
  }

  //ok if mapped > 90%, only 02% error ratio, mapped and paired > 80%
  function validateData(data, thresholds, forceCompute=false) {
    data = selectData(data);
    if(data["status"] && !forceCompute){
      return data["status"];
    }else{
      let status;
      let message = "";
      if(data["bases mapped (cigar)"] / data["total length"] < 0.9){
        message += "reads mapped\n";
      }
      if(data["error rate"] > 0.0002){
        message += "error rate\n";
      }
      if(data["reads duplicated"]/data["sequences"] > 0.05){
        message += "reads duplicated\n";
      }
      if(data["reads mapped and paired"]/data["sequences"] < 0.8){
        message += "reads mapped and paired\n";
      }
      if(message != ""){
        status = STATUS_WARNING;
      }else{
        status = STATUS_OK;
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

<style scoped>
  .summary-table {
    margin-left: 2rem;
  }

  .value-cell {
    text-align: right;
  }
</style>