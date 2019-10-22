<template>
  <g :transform="transform">
    <rect
      class="legend-box"
      :x="0"
      :y="0"
      :height="height"
      :width="width"
    />
    <g transform="translate(0 20)">
      <text
        v-for="(item, index) in labels"
        :key="'text-' + index"
        :y="item.textY"
        x="2rem"
      >
        {{ item.label }}
      </text>
      <circle
        v-for="(item, index) in labels"
        :key="'circle' + index"
        :cy="item.circleY"
        :fill="item.color"
        cx="1em"
        r="0.35em"
      />
    </g>
  </g>
</template>

<script>
  export default {
    "name": "plot-legend",
    "props": {
      "layout": {"type": Object, "required": true},
      "data": {"type": Array, "required": true},
    },
    "computed": {
      "transform": function () {
        const x = this.layout.x + this.layout.width - this.width;
        const y = this.layout.y;
        return "translate(" + x + ", " + y + ")"
      },
      "width": function () {
        let maxLabelWidth = 0;
        this.data.forEach((item) => {
          maxLabelWidth = Math.max(maxLabelWidth, item.label.length);
        });
        return 45 + maxLabelWidth * 8;
      },
      "height": function () {
        return this.data.length * 25;
      },
      "labels": function () {
        const result = [];
        for (let index = 0; index < this.data.length; ++index) {
          if (!this.data.hasOwnProperty(index)) {
            continue;
          }
          const y = 1.5 * index;
          result.push({
            "label": this.data[index].label,
            "color": this.data[index].color,
            "textY": y + "em",
            "circleY": (y - 0.35) + "em",
          });
        }
        return result;
      }
    }
  }
</script>

<style scoped>
  .legend-box {
    fill: white;
    stroke: black;
  }
</style>