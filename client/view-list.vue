<template>
  <b-list-group>
    <b-list-group-item
      v-for="(item, index) in views"
      :key="index"
      :variant="selectVariant(item)"
      :active="index === value"
      button
      @click="onSelect(index)"
    >
      {{ item.label }}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "./data-status";

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
            return null;
        }
      },
    },
  }
</script>