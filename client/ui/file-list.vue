<template>
  <b-list-group>
    <b-list-group-item
      v-for="(item, index) in files"
      :key="index"
      :active="index === value"
      button
      :variant="variant(item)"
      class="d-flex justify-content-between align-items-center stayOnLine"
      style="padding-left: 0.35rem"
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
      <b-button
        pill
        variant="danger"
        @click.stop="onDelete(index)"
      >
        <font-awesome-icon icon="trash" />
      </b-button>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  import {selectIcon, selectColor, selectVariant} from "../data-status"

  export default {
    "name": "file-list",
    "props": {
      "files": {"type": Array, "required": true},
      "value": {"type": Number, "required": true},
    },
    "methods": {
      "onSelect": function (index) {
        this.$emit("input", index);
      },
      "onDelete": function (index) {
        this.$emit("delete", index);
      },
      "variant": function (item){
        return selectVariant(item.status);
      },
      "icon": function (item){
        return selectIcon(item.status);
      },
      "color": function (item){
        return selectColor(item.status);
      },
    },
  }
</script>

<style scoped>

.stayOnLine{
  white-space: nowrap;
}

</style>