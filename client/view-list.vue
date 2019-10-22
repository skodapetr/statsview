<template>
  <b-list-group>
    <b-list-group-item
      v-for="(item, index) in views"
      :key="index"
      :variant="selectVariant(item)"
      button
      @click="onSelect(item)"
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
    },
    "methods": {
      "onSelect": function (item) {
        this.$emit("select", item);
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
      }
    },
  }
</script>