<template>
  <b-navbar-nav
    v-show="data.length > 0"
  >
    <b-nav-form
      v-show="active == true"
    >
      <b-button
        @click="onDeselect"
      >
        Back
      </b-button>
    </b-nav-form>
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
    "data": () => ({
      "active": false
    }),
    "props": {
      "data": {"type": Array, "required": true},
      "value": {"type": Number, "required": true},
    },
    "methods": {
      "onSelect": function (value) {
        this.active = true;
        this.$emit("input", value);
      },
      "onDeselect": function () {
        this.active = false;
        this.$emit("input", -1)
      },
    },
  }
</script>