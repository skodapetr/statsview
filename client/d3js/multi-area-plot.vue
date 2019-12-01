<template>
  <div style="height: 100%"/>
</template>

<script>
  import {select as d3Select, area as d3Area} from "d3";

  import {
    range,
    computeMargin,
    computeLayout,
    createGraphSvg,
    configureGraphSvg,
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
      this.svg = d3Select(this.$el);
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
        const layout = computeLayout(margin, this.getScreenSize(), {
          "yLevels": this.data.length
        });

        // TODO: Merge bellow block into a single code.
        // Create elements.
        let plots = d3Select(this.$el).selectAll("svg").data(this.data);
        plots.exit().remove();
        plots.enter().append("svg").append("g");
        // Now we have all the elements so we can setup them.
        plots =
          d3Select(this.$el)
            .selectAll("svg")
            .data(this.data)
            .attr("width", layout.width + margin.left + margin.right)
            .attr("height", layout.height + margin.top + margin.bottom)
            .select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = addXLinearScale(plots, xRange, layout);
        const y = addYLinearScale(plots, yRange, layout);

        let areas = plots.select("path.plot-area");
        if (areas.empty()) {
          areas = plots
            .append("path")
            .attr("class", "plot-area")
            .attr("stroke", "none");
        }
        areas
          .attr("fill", (data) => data.color)
          .attr("d", getLinePathFactory(x, y, yRange));

        let labels = plots.select("text.plot-label");
        if (labels.empty()) {
          labels = plots.append("text")
            .attr("class", "plot-label")
            .attr("text-anchor", "start");
        }
        labels
          .attr("y", layout.height / 2)
          .attr("x", -40)
          .text((data) => data.label);

        addFocusLine(plots, x, y, layout, this.data, {
          "focusMouseMove": focusMouseMoveMultiDataStrategy,
          "yRange": {"min": yRange[0]},
        });
      },
    },
  };

  function getArgs(args) {
    return {
      "margin": {},
      ...args
    };
  }

  function getLinePathFactory(x, y, yRange) {
    return (data) => {
      return d3Area()
        .x((_, index) => x(data.x[index]))
        .y0(y(yRange[0]))
        .y1((_, index) => y(data.y[index]))
        (data.x);
    }
  }

</script>