<template>
  <div style="height: 100%"/>
</template>

<script>
  import * as d3 from "d3";

  export default {
    "name": "d3js-area-plot",
    "props": {
      "data": {"type": Array, "required": true},
      "resizeNotification": {"type": Object, "required": true},
    },
    "mounted": function () {
      const size = this.getScreenSize();
      const margin = {"top": 10, "right": 20, "bottom": 20, "left": 40};
      const width = size.width - margin.left - margin.right;
      const height = (size.height / 4) - margin.top - margin.bottom;

      // TODO Do this only on init.
      const svg = d3.select(this.$el)
        .selectAll("charts")
        .data(this.data)
        .enter()
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // X axis
      const x = d3.scaleLinear()
        .domain([d3.min(this.data[0].x), d3.max(this.data[0].x)])
        .range([0, width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Y axis
      const y = d3.scaleLinear()
        .domain([0, d3.max(this.data[0].y)])
        .range([height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // Add the area
      svg.append("path")
        .attr("fill", function(data) {return data.color;})
        .attr("stroke", "none")
        .attr("d", function(data) {
          return d3.area()
            .x(function (_, index) {
              return x(data.x[index]);
            })
            .y0(y(0))
            .y1(function (_, index) {
              return y(data.y[index]);
            })(data.x);
          }
        );

      // Add titles
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", height / 2)
        .attr("x", -37)
        .text(function(d){ return(d.label)});

      //
      // Show line with values.
      //

      const bisect = d3.bisector(function(value) {
        return value;
      }).left;

      const focus = svg
        .append("g")
        .append("line")
        .style("fill", "none")
        .attr("stroke", "black")
        .attr("y1", y(0))
        .style("opacity", 0);
      const focusNodes = focus.nodes().map(d3.select);

      const focusText = svg
        .append("g")
        .append("text")
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");
      const focusTextNodes = focusText.nodes().map(d3.select);

      svg
        .append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

      function mouseover() {
        focus.style("opacity", 1);
        focusText.style("opacity",1)
      }

      const $this = this;

      function mousemove() {
        const mouseX = x.invert(d3.mouse(this)[0]);
        for (let index = 0; index < $this.data.length; ++index) {
          const data = $this.data[index];
          const valueX = bisect(data.x, mouseX, 1);
          const valueIndex = data.x.indexOf(valueX);
          const valueY = data.y[valueIndex];
          //
          const activeFocus = focusNodes[index];
          activeFocus
            .attr("x1", x(valueX))
            .attr("x2", x(valueX))
            .attr("y2", y(valueY));

          const activeText = focusTextNodes[index];
          activeText
            .html("" + valueY)
            .attr("x", x(valueX) + 15)
            .attr("y", y(valueY) + 20)
        }
      }

      function mouseout() {
        focus.style("opacity", 0);
        focusText.style("opacity", 0)
      }
    },
    "watch": {
      "resizeNotification": function() {

      }
    },
    "methods": {
      "getScreenSize": function() {
        const element = this.$el.parentElement;
        return {
          "width": element.offsetWidth,
          "height" : element.offsetHeight
        };
      }
    }
  };



</script>