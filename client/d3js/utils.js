//
// Functions used on multiple places in d3js modules.
//

import * as d3 from "d3";

export function range(data, selector, args) {
  args = {
    "min": Number.MAX_VALUE,
    "max": Number.MIN_VALUE,
    // TODO: Rename to marginUpper, marginLower
    "lower": 0,
    "higher": 0,
    ...args
  };
  let min = args["min"];
  let max = args["max"];
  data.forEach((item) => {
    const values = selector(item);
    min = Math.min(min, d3.min(values));
    max = Math.max(max, d3.max(values));
  });
  const range = max - min;
  return [min - (range * args["lower"]), max + (range * args["higher"])];
}

export function computeMargin(yRange, defaultMargin = {}) {
  const margin = {
    "top": 10,
    "right": 20,
    "bottom": 20,
    "left": 40,
    ...defaultMargin
  };
  if (yRange[1] > 1000) {
    margin.left = 40;
  }
  if (yRange[1] > 10000) {
    margin.left = 50;
  }
  if (yRange[1] > 1000000) {
    margin.left = 60;
  }
  return margin;
}

export function computeLayout(margin, size, args = {}) {
  args = {
    "xLevels": 1,
    "yLevels": 1,
    ...args,
  };
  return {
    "width": (size.width / args.xLevels) - margin.left - margin.right,
    "height": (size.height / args.yLevels) - margin.top - margin.bottom,
  }
}

export function appendGraphSvg(selection, layout, margin) {
  return selection
    .append("svg")
    .attr("width", layout.width + margin.left + margin.right)
    .attr("height", layout.height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
}

export function addXLinearScale(svg, range, layout) {
  const scale = d3.scaleLinear()
    .domain(range)
    .range([0, layout.width]);

  svg.append("g")
    .attr("transform", "translate(0," + layout.height + ")")
    .call(
      d3.axisBottom(scale)
      // Hide the first and the last tick.
        .tickSize(0)
        .tickSizeInner(5)
    );

  return scale;
}

export function addYLinearScale(svg, range, layout) {
  const scale = d3.scaleLinear()
    .domain(range)
    .range([layout.height, 0]);

  svg.append("g")
    .call(
      d3.axisLeft(scale)
      // Hide the first and the last tick.
        .tickSize(0)
        .tickSizeInner(5)
    );

  return scale;
}

export function addFocusLine(svg, x, y, layout, data, args = {}) {
  args = {
    "focusMouseMove": focusMouseMoveStrategy,
    "focusLabel": defaultLabel,
    ...args
  };

  const lines = svg
    .append("g")
    .append("line")
    .style("fill", "none")
    .attr("stroke", "black")
    .style("opacity", 0);

  // Set bottom of focus line, either to fixed value or
  // to minimum of all values.
  if (args.yMin !== undefined) {
    lines.attr("y1", y(args.yMin))
  } else {
    lines.attr("y1", y(d3.min(data.map((item) => d3.min(item.y)))))
  }

  const lineNodes = lines.nodes().map(d3.select);

  const {mousemove, focusText} =
    args.focusMouseMove(svg, x, y, data, args, lineNodes);

  svg
    .append("rect")
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr("width", layout.width)
    .attr("height", layout.height)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

  function mouseover() {
    lines.style("opacity", 1);
    focusText.style("opacity", 1)
  }

  function mouseout() {
    lines.style("opacity", 0);
    focusText.style("opacity", 0)
  }

}

function defaultLabel(data, valueY, valueX) {
  return data.label + ": " + valueX + ", " + (Math.round(valueY * 100) / 100);
}

export function focusMouseMoveStrategy(
  svg, x, y, data, args, focusNodes) {

  assert(focusNodes.length === 1,
    "Only one focus node can be provided.");

  const focusNode = focusNodes[0];

  let focusText = svg
    .append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("fill", (item) => item.color)
    .attr("alignment-baseline", "middle");

  // We go from bottom-up, as
  // we have multiple lines and it is not clear where should we stop.
  focusNode.attr("y2", y(d3.max(data.map((item) => item.y))));

  function mousemove() {
    const mouse = d3.mouse(this);
    const mouseX = x.invert(mouse[0]);
    const textLines = [];

    let valueX;
    for (let index = 0; index < data.length; ++index) {
      const dataRecord = data[index];
      const valueIndex = roundedIndex(dataRecord.x, mouseX);
      valueX = dataRecord.x[valueIndex];
      const valueY = dataRecord.y[valueIndex];
      textLines.push(args.focusLabel(dataRecord, valueY, valueX));
    }

    focusNode
      .attr("x1", x(valueX))
      .attr("x2", x(valueX));

    // TODO Allow for multiline text and move left/right from the line.

    focusText
      .html((_, index) => textLines[index])
      .attr("x", x(valueX) + 15)
      .attr("y", (data, index) => mouse[1] + index * 15)
  }

  return {
    "mousemove": mousemove,
    "focusText": focusText
  }
}

function assert(condition, message) {
  if (!condition) {
    throw "Assertion failed: " + message
  }
}

const bisect = d3.bisector((value) => value).left;

/**
 * When index is between two values, we need to round the index
 * to lower or higher values.
 *
 * The 'bisect' function gives us the higher index, so we need to check
 * and lower it in some cases.
 */
function roundedIndex(values, value) {
  // This give us upper index.
  let index = bisect(values, value);
  if (index >= values.length) {
    return values.length - 1;
  }
  if (index === 0) {
    return 0;
  }
  const middle = (values[index - 1] + values[index]) / 2;
  if (value < middle) {
    return index - 1;
  } else {
    return index;
  }
}

/**
 * Use when the number of focusNodes and focusTextNodes (in other words
 * svg focus elements) is equal to data.
 */
export function focusMouseMoveMultiDataStrategy(
  svg, x, y, data, args, focusNodes) {

  assert(focusNodes.length === data.length,
    "Number of data and focus nodes need to be equal.");

  const focusText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle");
  const focusTextNodes = focusText.nodes().map(d3.select);

  function mousemove() {
    const mouseX = x.invert(d3.mouse(this)[0]);
    for (let index = 0; index < data.length; ++index) {
      const dataRecord = data[index];
      const valueIndex = roundedIndex(dataRecord.x, mouseX);
      const valueX = dataRecord.x[valueIndex];
      const valueY = dataRecord.y[valueIndex];

      const activeFocus = focusNodes[index];
      activeFocus
        .attr("x1", x(valueX))
        .attr("x2", x(valueX))
        .attr("y2", y(valueY));

      // TODO Allow for multiline text and move left/right from the line.

      const activeText = focusTextNodes[index];
      activeText
        .html(args.focusLabel(dataRecord, valueY, valueX))
        .attr("x", x(valueX) + 15)
        .attr("y", y(valueY) + 20)
    }
  }

  return {
    "mousemove": mousemove,
    "focusText": focusText
  };
}


export function addGrid(svg, x, y, layout) {

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + layout.height + ")")
    .attr("stroke-dasharray", "2,2")
    .call(
      d3.axisBottom(x)
        .tickSizeInner(-layout["height"])
        .tickFormat("")
    )
    .call(g => g.select(".domain").remove());

  svg.append("g")
    .attr("class", "grid")
    .attr("stroke-dasharray", "2,2")
    .call(
      d3.axisLeft(y)
        .tickSize(-layout["width"])
        .tickFormat("")
    )
    .call(g => g.select(".domain").remove());

}