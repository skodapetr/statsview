<template>
  <g text-anchor="end">
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
        x2="-6"
      />
      <text
        fill="#000"
        x="-12"
        dy="0.35em"
      >
        {{ item.label }}
      </text>
    </g>
  </g>
</template>

<script>
  export default {
    "name": "vertical-scale",
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
        const y = this.layout.y;
        const size = y + this.layout.height;
        return `M${x},${y}V${size}`;
      },
      "ticks": function () {
        const ticks = [];
        const minY = this.layout.y;
        const maxY = this.layout.y + this.layout.height;
        const step = this.layout.height / (this.max - this.min);
        for (let index = 0; index < this.labels.length; ++index) {
          const x = this.layout.x;
          const y =
            this.layout.y + this.layout.height -
            (step * (this.labelsPositions[index] - this.min));
          if (minY > y || y > maxY) {
            // Value is outside of the axis space.
            continue;
          }
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