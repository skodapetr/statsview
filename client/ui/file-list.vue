<template>
  <b-list-group>
    <b-list-group-item
      v-for="(item, index) in files"
      :key="index"
      :active="index === value"
      button
      @click="onSelect(index)"
    >
      {{ item.label }}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
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
    },
  }
</script>