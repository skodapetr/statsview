<template>
  <span>
    <table
      class="thresholds-table"
    >
    <colgroup>
      <col/>
      <col/>
      <col/>
      <col span="2"/>
    </colgroup>
      <tr>
        <th>View</th>
        <th class="value-cell">
          <span 
            :style="'color: ' + color(status_ok)"
          >
            <font-awesome-icon
              :icon="icon(status_ok)"
            />
          </span>
          <span> / </span>
          <span 
            :style="'color: ' + color(status_warning)"
          >
            <font-awesome-icon
              :icon="icon(status_warning)"
            />
          </span>
        </th>
        <th class="value-cell">
          <span 
            :style="'color: ' + color(status_warning)"
          >
            <font-awesome-icon
              :icon="icon(status_warning)"
            />
          </span>
          <span> / </span>
          <span 
            :style="'color: ' + color(status_invalid)"
          >
            <font-awesome-icon
              :icon="icon(status_invalid)"
            />
          </span>
        </th>
        <th class="value-cell">Meaning</th>
      </tr>
      <tr
        v-for="(value, name) in thresholdsVals"
        :key="name"
      >
        <td style="white-space: nowrap;">
          {{ value.name }}
        </td>
        <td class="value-cell">
          <input 
            size="4"
            v-model.number="value.thresholds['Ok']" 
            :placeholder="value.thresholds['Ok']">
        </td>
        <td class="value-cell">
          <input
            size="4"
            v-model.number="value.thresholds['Bad']" 
            :placeholder="value.thresholds['Bad']">
        </td>
        <td class="value-cell">
          {{ value.thresholds["legend"] ? value.name + " thresholds meaning" : ""  }}
        </td>
      </tr>
    </table>
    <div style="text-align: right; padding: 1rem">
      <span>
        <label @click="save" class="clickable-button">Save</label>
      </span>
      <span>
        <label @click="apply" class="clickable-button">Apply</label>
      </span>
      <span>
        <label for="Loading" class="clickable-button">Load </label>
      </span>
      <input
        id="Loading"
        type="file"
        name="Loading"
        class="file-upload"
        multiple
        @change="load"
      >
    </div>
  </span>
</template>

<script>
  import { STATUS_NONE, STATUS_OK, STATUS_WARNING, STATUS_INVALID,
      selectIcon,
      selectColor} from '../data-status'
  import {loadThresholds, saveThresholds} from '../bchk-reader'
  import {indexOfWithAttr} from './views-utils'
  export default {
    "validator": validateData,
    "thresholds": defaultThresholds,
    "parentDisplaysError": isParentDisplayingErrors,
    "label": "Auto QC",
    //
    "name": "thresholds-view",
    "props":{
        "thresholdsVals": {"type": Array, "required": true},
    },
    "data":() => ({
      "status_ok": STATUS_OK,
      "status_invalid": STATUS_INVALID,
      "status_warning": STATUS_WARNING 
    }),
    "methods": {
      "save": function(){
        saveThresholds(this.thresholdsVals);
      },
      "apply": function(){
        this.$emit("input", this.thresholdsVals);
      },
      "load": function(event){
        event.preventDefault();
        const files = event.target.files;
        const onLoad = (file, reader) => {
          const content = loadThresholds(reader.result);

          //TODO: thresholds file may include file, that its attached to, but we do not implement it

          if(content["thresholds"]){  // user uploaded thresholds
            let newThresholds = content["thresholds"];
            for(const prop in newThresholds){
              let index = indexOfWithAttr(this.thresholdsVals, "name", prop);
              if(index >= 0){
                this.thresholdsVals[index]["thresholds"] = newThresholds[prop];
              }
            }
          }
        };
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = () => onLoad(file, reader);
          reader.readAsText(file);
        }
        this.apply();
      },
      "icon": function(status){
        return selectIcon(status);
      },
      "color": function(status){
        return selectColor(status);
      },
    }
  }

  function selectData(data){
    return undefined;
  }

  function defaultThresholds(){
    return {
      "Bad": "-",
      "Ok": "-",
      "legend": "",
    }
  }
    
  function isParentDisplayingErrors(){
    return false;
  }

  function validateData(data, thresholds, forceCopmute=false){
    return {
      "status": STATUS_NONE,
      "message": "",
    };
  }
</script>

<style scoped>
  .thresholds-table {
    overflow-x: scroll;
    padding: 0rem;
    margin: 0rem;
  }

  .value-cell {
    padding-left: 2rem;
    white-space: nowrap;
  }

  .file-upload {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
    padding: 0px;
    margin: 0px;
  }

  .clickable-button {
    cursor: pointer;
    background-color: lightskyblue;
    padding: 1rem;
  }

</style>