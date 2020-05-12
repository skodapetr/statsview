<template>
  <b-list-group
    style="overflow-x:scroll; resize: inherit;"
  >
    <b-list-group-item
      v-for="(item, index) in views"
      :key="index"
      :variant="selectVariant(item)"
      :active="index === value"
      class="stayOnLine"
      button
      @click="onSelect(index)"
    >
      <span 
        :style="'color: ' + color(item)"
      >
        <font-awesome-icon
          :icon="icon(item)"
        />
      </span>
      {{ item.label }}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID, STATUS_NONE} from "./../data-status";

  export default {
    "name": "view-list",
    "props": {
      "views": {"type": Array, "required": true},
      "value": {"type": Number, "required": true},
    },
    "methods": {
      "onSelect": function (index) {
        this.$emit("input", index);
      },
      "selectVariant": function(item) {
        switch(item.status) {
          case STATUS_WARNING:
            return "warning";
          case STATUS_INVALID:
            return "danger";
          case STATUS_OK:
          default:
            return "info";
        }
      },
      "icon": function(item){
        switch(item.status) {
          case STATUS_WARNING:
            return "question-circle";
          case STATUS_INVALID:
            return "times-circle";
          case STATUS_NONE:
            return "";
          case STATUS_OK:
          default:
            return "check-circle";
        }
      },
      "color": function(item){
        let result;
        switch(item.status) {
          case STATUS_WARNING:
            result = "Yellow";
            break;
          case STATUS_INVALID:
            result = "Red";
            break;
          case STATUS_NONE:
            result = "White";
            break;
          case STATUS_OK:
          default:
            result = "LimeGreen";
            break;
        }
        return result;
      }
    },
  }
</script>

<style scoped>

.stayOnLine{
  white-space: nowrap;
}

</style>