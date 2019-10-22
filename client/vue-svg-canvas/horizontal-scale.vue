<template>
  <g text-anchor="middle">
    <path
      :d="domainPath"
      stroke="#000"
    />
    <g
      v-for="(item, index) in ticks"
      :key="index"
      class="tick"
      opacity="1"
      :transform="item.transform"
    >
      <line
        stroke="#000"
        y2="6"
      />
      <text
        fill="#000"
        y="12"
        dy="1em"
      >
        {{ item.label }}
      </text>
    </g>
  </g>
</template>

<script>
  export default {
    "name": "horizontal-scale",
    "props": {
      "layout": {"type": Object, "required": true},
      "labels": {"type": Array, "required": true},
      "labelsPositions": {"type": Array, "required": true},
      "min": {"type": Number, "required": true},
      "max": {"type": Number, "required": true},
    },
    "computed": {
      "domainPath": function () {
        const x = this.layout.x;
        const y = this.layout.y + this.layout.height;
        const size = x + this.layout.width;
        return `M${x},${y}H${size}`;
      },
      "ticks": function () {
        const ticks = [];
        const minX = this.layout.x;
        const maxX = this.layout.x + this.layout.width;
        const step = this.layout.width / (this.max - this.min);
        for (let index = 0; index < this.labels.length; ++index) {
          const x =
            this.layout.x +
            step * (this.labelsPositions[index] - this.min);
          if (minX > x || x > maxX) {
            // Value is outside of the axis space.
            continue;
          }
          const y = this.layout.y + this.layout.height;
          ticks.push({
            "transform": `translate(${x},${y})`,
            "label": this.labels[index]
          });
        }
        return ticks;
      }
    }
  }
</script>