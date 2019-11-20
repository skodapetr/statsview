<template>
  <div style="height: 100%"/>
</template>

<script>
  import {select as d3Select, area as d3Area} from "d3";

  import {
    range,
    computeMargin,
    computeLayout,
    appendGraphSvg,
    addXLinearScale,
    addYLinearScale,
    addFocusLine,
    focusMouseMoveMultiDataStrategy
  } from "./utils.js";

  import "./style.css";

  export default {
    "name": "d3-multi-area-plot",
    "props": {
      "data": {"type": Array, "required": true},
      "resizeNotification": {"type": Object, "required": true},
      "args": {"type": Object, "default": () => ({})},
    },
    "mounted": function () {
      const args = {
        "margin": {},
        ...this.args
      };

      const xRange = range(this.data, (item) => item["x"], args.xRange);
      const yRange = range(this.data, (item) => item["y"], args.yRange);
      const margin = computeMargin(yRange, args["margin"]);
      const layout = computeLayout(margin, this.getScreenSize(), {
        "yLevels": 4
      });

      // TODO Do this only on init -> we should recognize charts somehow
      let svg = d3Select(this.$el)
        .selectAll("svg")
        .data(this.data)
        .enter();
      svg = appendGraphSvg(svg, layout, margin);

      const x = addXLinearScale(svg, xRange, layout);
      const y = addYLinearScale(svg, yRange, layout);

      svg.append("path")
        .attr("fill", (data) => data.color)
        .attr("stroke", "none")
        .attr("d", function (data) {
          return d3Area()
            .x((_, index) => x(data.x[index]))
            .y0(y(yRange[0]))
            .y1((_, index) => y(data.y[index]))
            (data.x);
        });

      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", layout.height / 2)
        .attr("x", -40)
        .text((data) => data.label);

      addFocusLine(svg, x, y, layout, this.data, {
        "focusMouseMove": focusMouseMoveMultiDataStrategy,
        "yMin": yRange[0]
      });

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
  };
</script>