<template>
  <b-navbar-nav class="ml-auto">
    <b-nav-item-dropdown right>
      <template v-slot:button-content>
        <font-awesome-icon icon="cog"/>
      </template>
      <b-dropdown-item @click="onAreaGraph">
        Area graph
      </b-dropdown-item>
      <b-dropdown-item @click="onLineGraph">
        Line graph
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </b-navbar-nav>
</template>

<script>
  export default {
    "name": "acgt-cycles-menu",
    "props": {
      "data": {"type": Object, "required": true},
    },
    "methods": {
      "onAreaGraph": function () {
        this.data.graph = "area";
      },
      "onLineGraph": function () {
        this.data.graph = "line";
      }
    },
  }
</script>