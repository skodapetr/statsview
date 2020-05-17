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
    defaultColors,
  } from "../colors.js";

  import {
    range,
    computeMargin,
    computeLayout,
    createGraphSvg,
    configureGraphSvg,
    addXLinearScale,
    addYLinearScale,
    addFocusLine,
    addGrid,
    addText,
  } from "./utils.js";

  import "./style.css";

  export default {
    "name": "d3js-line-plot",
    "props": {
      "data": {"type": Array, "required": true},
      "text": {"type": Array, "default": () => ([])},
      "heightModifier": {"type": Number, "required": true},
      "resizeNotification": {"type": Object, "required": true},
      "args": {"type": Object, "default": () => ({})},
      "pretext": {"type": String, "default": () => ""},
      "units": {"type": String, "default": () => ""},
    },
    "data": () => ({
      "svg": null,
    }),
    "mounted": function () {
      this.svg = createGraphSvg(d3Select(this.$el));
      this.onPlot();
    },
    "watch": {
      "resizeNotification": function () {
        this.onPlot();
      },
      "data": function () {
        this.onPlot();
      }
    },
    "methods": {
      "getScreenSize": function () {
        const element = this.$el.parentElement;
        return {
          "width": element.offsetWidth,
          "height": element.offsetHeight
        };
      },
      "onPlot": function () {
        const args = getArgs(this.args);
        const xRange = range(this.data, (item) => item["x"], args.xRange);
        const yRange = range(this.data, (item) => item["y"], args.yRange);
        const margin = computeMargin(yRange, args["margin"]);
        const layout = computeLayout(margin, this.getScreenSize(), this.heightModifier);

        const plot = configureGraphSvg(this.svg, layout, margin);
        const x = addXLinearScale(plot, xRange, layout);
        const y = addYLinearScale(plot, yRange, layout, args["yScale"]);
        const colors = d3ScaleOrdinal(defaultColors);

        const lines = plot.selectAll("path.plot-line").data(this.data);
        lines.exit().remove();
        lines.enter()
          .append("path")
          .attr("class", "plot-line")
          .attr("fill", "none")
          .attr("stroke-width", 1.5)
          .merge(lines)
          .attr("stroke", selectColorFactory(colors))
          .attr("d", getLinePathFactory(x, y));

        if (args.useFocus) {
          addFocusLine(plot, x, y, layout, this.data, this.args, this.pretext, this.units);
        }

        addGrid(plot, x, y, layout);

        addText(plot, x, y, this.text);
      }
    }
  }

  function getArgs(args) {
    return {
      "useFocus": true,
      "xRange": {
        "higher": 0.01,
        "lower": 0.0,
      },
      "yRange": {
        "higher": 0.01,
        "lower": 0.0,
      },
      "yScale": {},
      "margin": {},
      ...args
    };
  }

  function selectColorFactory(colors) {
    return (data, index) => {
      if (data["color"]) {
        return data["color"];
      } else {
        return colors(index);
      }
    };
  }

  function getLinePathFactory(x, y) {
    return (data) => d3Line()
      .x(function (_, index) {
        return x(data.x[index]);
      })
      .y(function (_, index) {
        return y(data.y[index]);
      })(data.x);
  }

</script>