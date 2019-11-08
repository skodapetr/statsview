<template>
  <div style="height: 100%" />
</template>

<script>
  import {
    select as d3Select,
    line as d3Line,
    scaleOrdinal as d3ScaleOrdinal,
    schemeAccent as d3SchemeAccent,
  } from "d3";

  import {
    range,
    computeMargin,
    computeLayout,
    appendGraphSvg,
    addXLinearScale,
    addYLinearScale,
    addFocusLine,
    addGrid,
  } from "./utils.js";

  import "./style.css";

  export default {
    "name": "d3js-line-plot",
    "props": {
      "data": {"type": Array, "required": true},
      "resizeNotification": {"type": Object, "required": true},
      "args": {"type": Object, "default": () => ({})},
    },
    "mounted": function () {
      const args = {
        "useFocus": true,
        "xRange": {
          "higher": 0.01,
          "lower": 0.0,
        },
        "yRange": {
          "higher": 0.01,
          "lower": 0.0,
        },
        ...this.args
      };
      const xRange = range(this.data, (item) => item["x"], args.xRange);
      const yRange = range(this.data, (item) => item["y"], args.yRange);
      const margin = computeMargin(yRange);
      const layout = computeLayout(margin, this.getScreenSize());

      let svg = appendGraphSvg(d3Select(this.$el), layout, margin);
      const x = addXLinearScale(svg, xRange, layout);
      const y = addYLinearScale(svg, yRange, layout);

      // TODO Make as an option.
      const colors = d3ScaleOrdinal(d3SchemeAccent);
      svg
        .selectAll("g.path")
        .data(this.data)
        .enter()
        .append("g")
        .attr("class", "path")
        .append("path")
        .attr("fill", "none")
        .attr("stroke", (data, index) => {
          if (data["color"]) {
            return data["color"];
          } else {
            return colors(index);
          }
        })
        .attr("stroke-width", 1.5)
        .attr("d", function (data) {
            return d3Line()
              .x(function (_, index) {
                return x(data.x[index]);
              })
              .y(function (_, index) {
                return y(data.y[index]);
              })(data.x);
          }
        );

      if (args.useFocus) {
        addFocusLine(svg, x, y, layout, this.data, this.args);
      }

      addGrid(svg, x, y, layout);

    },
    "watch": {
      "resizeNotification": function () {

      }
    },
    "methods": {
      "getScreenSize": function () {
        const element = this.$el.parentElement;
        return {
          "width": element.offsetWidth,
          "height": element.offsetHeight
        };
      }
    }
  }

</script>