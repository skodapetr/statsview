<template>
  <div
    v-show="data.length > 0"
    id="menu"
    @mouseleave="onDeactivate"
  >
    <input
      id="on-check"
      v-model="visible"
      type="checkbox"
      name="on-check"
    >
    <label
      id="activator"
      for="on-check"
      @mouseenter="onActivate"
    >
      <span>
        <div>
          <font-awesome-icon icon="eye" />
        </div>
      </span>
    </label>
    <div
      id="menu-items"
      :style="menuStyle"
    >
      <div
        v-for="(item, index) in data"
        :key="index"
        class="negative"
      >
        <!-- By this we allow to show the original graph between items. -->
        <span
          @mouseenter="onSelect(index)"
          @mouseleave="onDeselect(index)"
        >
          <font-awesome-icon icon="minus" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  // https://www.inserthtml.com/demo/rotating-menu/

  export default {
    "name": "half-circle-list",
    "data": () => ({
      "visible": false
    }),
    "props": {
      "data": {"type": Array, "required": true},
      "value": {"type": Number, "required": true},
    },
    "computed": {
      "menuStyle": function () {
        if (!this.visible) {
          return {
            "width": 0,
            "left": 0,
            "height": 0,
          };
        }
        const width = this.data.length * 6;
        const left = -(width / 2) + 1.5;
        return {
          "width": width + "rem",
          "left": left + "rem",
          "height": "4.0rem",
        };
      },
    },
    "methods": {
      "onActivate": function () {
        this.visible = true;
      },
      "onDeactivate": function () {
        this.visible = false;
        this.$emit("input", -1);
      },
      "onSelect": function (value) {
        this.$emit("input", value)
      },
      "onDeselect": function () {
        this.$emit("input", -1);
      }
    },
  }
</script>

<style scoped>

  /* Hide the radio and checkboxes */
  #menu > input {
    display: none;
  }

  /* Just for positioning the menu correctly */
  #menu {
    position: relative;
    margin-top: 1rem;
    margin-left: 45%;
  }

  /* The button in the middle the user will press to activate the menu */
  #activator {
    border-radius: 120px;
    width: 46px;
    height: 46px;
    float: left;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    cursor: pointer;
    background-color: #313b3d;
    pointer-events: none;
  }

  /* The spans inside the on button. */
  #activator > span {
    -webkit-transition: all 0.3s linear;
    -moz-transition: all 0.3s linear;
    -ms-transition: all 0.3s linear;
    -o-transition: all 0.3s linear;
    transition: all 0.3s linear;
    display: block;
    width: 15px;
    height: 15px;
    background: #313b3d;
    border-radius: 120px;
    pointer-events: auto;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    padding: 20px;
    margin: 4px;
    z-index: 15;
  }

  /* Center icons in the activator. */
  #activator > span > div {
    color: #fff;
    position: relative;
    left: -0.85rem;
    top: -1.25rem;
    font-size: 1.5em;
  }

  /* The styling of the menu items container div */
  #menu-items {
    width: 5px;
    height: 5px;
    background: #aaa;
    position: absolute;
    top: 2rem;
    z-index: 10;
    overflow: hidden;
    left: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    /* Animation for any change. */
    -webkit-transition: all 0.2s linear;
    -moz-transition: all 0.2s linear;
    -ms-transition: all 0.2s linear;
    -o-transition: all 0.2s linear;
    transition: all 0.2s linear;
    border-radius: 20px;
  }

  #menu-items div {
    position: relative;
    display: inline-block;
    justify-content: center;
    margin: 0.5rem;
    margin-top: 1.0rem;
    width: 5rem;
    height: 3rem;
    font-size: 2.5rem;
    cursor: pointer;
  }

  #menu-items div svg {
    display: block;
    margin: auto;
  }

  .negative:hover {
    color: red;
  }

</style>