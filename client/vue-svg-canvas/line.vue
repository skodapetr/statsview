<template>
  <g>
    <path
      :d="path"
      fill="none"
      :stroke="color"
      stroke-width="1.5"
    />
  </g>
</template>

<script>
  export default {
    "name": "plot-line",
    "props": {
      "layout": {"type": Object, "required": true},
      "valuesX": {"type": Array, "required": true},
      "valuesY": {"type": Array, "required": true},
      "color": {"type": String, "default": "#000"},
      "maxX": {"type": Number, "required": true},
      "maxY": {"type": Number, "required": true},
    },
    "computed": {
      "path": function () {
        const {x, y, width, height} = this.layout;
        let pathString = "";
        let prefix = "M";
        for (let index = 0; index < this.valuesX.length; ++index) {
          const relativeX = asRelative(this.valuesX[index], this.maxX);
          const relativeY = asRelative(this.valuesY[index], this.maxY);
          const posX = x + width * relativeX;
          const posY = y + height - (height * relativeY);
          pathString += `${prefix}${posX},${posY}`;
          prefix = ",L";
        }
        return pathString;
      }
    }
  }

  function asRelative(value, maxValue) {
    if (value === 0 || value === undefined) {
      return 0;
    }
    return value / maxValue;
  }

</script>