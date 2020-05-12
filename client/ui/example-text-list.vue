<template>
  <b-navbar-nav
    v-show="data.length > 0"
  >
    <b-nav-item-dropdown right>
      <template v-slot:button-content>
          Examples
      </template>
      <b-dropdown-item 
        v-for="(item, index) in data"
        :key="index"
        @click="onSelect(index)"
      >
        Example {{index + 1}}
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </b-navbar-nav>
</template>

<script>
  export default {
    "name": "example-text-list",
    "props": {
      "data": {"type": Array, "required": true},
      "value": {"type": Number, "required": true},
    },
    "methods": {
      "onSelect": function (value) {
        this.$emit("input", value);
      },
      "onDeselect": function () {
        this.$emit("input", -1)
      },
    },
  }
</script>