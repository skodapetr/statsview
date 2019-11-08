<template>
  <div style="height: 100%"/>
</template>

<script>
  import {select as d3Select, line as d3Line, area as d3Area} from "d3";

  import {
    range,
    computeMargin,
    computeLayout,
    appendGraphSvg,
    addXLinearScale,
    addYLinearScale,
    addFocusLine,
    addGrid
  } from "./utils.js";

  import "./style.css";

  export default {
    "name": "d3js-line-area-plot",
    "props": {
      "line": {"type": Array, "required": true},
      "area": {"type": Array, "required": true},
      "resizeNotification": {"type": Object, "required": true},
    },
    "mounted": function () {
      const allData = [...this.line, ...this.area];
      const xRange = range(allData, (item) => item["x"]);
      const yRange = range(allData, (item) => {
        if (item["y"] !== undefined) {
          return item["y"];
        }
        return [...item["y-low"], ...item["y-high"]]
      });
      const margin = computeMargin(yRange);
      const layout = computeLayout(margin, this.getScreenSize());

      let svg = appendGraphSvg(d3Select(this.$el), layout, margin);
      const x = addXLinearScale(svg, xRange, layout);
      const y = addYLinearScale(svg, yRange, layout);

      // Add areas.
      svg
        .selectAll("g.area")
        .data(this.area)
        .enter()
        .append("g")
        .attr("class", "area")
        .attr("opacity", 0.5)
        .append("path")
        .attr("fill", (data) => data["color"])
        .attr("stroke", "none")
        .attr("d", function(data) {
            return d3Area()
              .x(function (_, index) {
                return x(data.x[index]);
              })
              .y0((_, index) =>  y(data["y-low"][index]))
              .y1((_, index) =>  y(data["y-high"][index]))
              (data.x);
          }
        );

      // Add lines.
      svg
        .selectAll("g.path")
        .data(this.line)
        .enter()
        .append("g")
        .attr("class", "path")
        .append("path")
        .attr("fill", "none")
        .attr("stroke", (data) => data["color"])
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