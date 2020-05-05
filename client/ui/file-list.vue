<template>
  <b-list-group>
    <b-list-group-item
      v-for="(item, index) in files"
      :key="index"
      :active="index === value"
      button
      class="d-flex justify-content-between align-items-center"
      @click="onSelect(index)"
    >
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
      }
    },
  }
</script>