<template>
  <b-list-group
    style="overflow-x:scroll; resize: inherit;"
  >
    <b-list-group-item
      v-for="(item, index) in views"
      :key="index"
      :variant="variant(item)"
      :active="index === value"
      class="stayOnLine"
      style="padding-left: 0.35rem"
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
  import {STATUS_OK,
   STATUS_WARNING,
   STATUS_INVALID,
   STATUS_NONE,
   selectIcon,
   selectColor,
   selectVariant} from "./../data-status";

  export default {
    "name": "view-list",
    "props": {
      "views": {"type": Array, "required": true},
      "value": {"type": Number, "required": true},
    },
    "methods": {
      "onSelect": function (index) {
        this.$emit("change-view-index", index);
      },
      "variant": function (item){
        if(item.status){
          return selectVariant(item.status["status"]);
        }else{
          return selectVariant(undefined);
        }
      },
      "icon": function (item){
        if(item.status){
          return selectIcon(item.status["status"]);
        }else{
          return selectIcon(undefined);
        }
      },
      "color": function (item){
        if(item.status){
          return selectColor(item.status["status"]);
        }else{
          return selectColor(undefined);
        }
      },
    },
  } 

</script>

<style scoped>

.stayOnLine{
  white-space: nowrap;
}

</style>