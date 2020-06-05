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
  return margin;
}

let longTimeParentHeight = 0
export function computeLayout(margin, size, heightModifier, args = {}) {
  if(longTimeParentHeight == 0){
    longTimeParentHeight = size.height;
  }
  args = {
    "xLevels": 1,
    "yLevels": 1,
    ...args,
  };
  return {
    "width": (size.width / args.xLevels) - margin.left - margin.right,
    "height": (longTimeParentHeight * heightModifier / args.yLevels) - margin.top - margin.bottom,
  }
}

export function createGraphSvg(svg) {
  const result = svg.append("svg");
  result.append("g");
  return result;
}

export function configureGraphSvg(svg, layout, margin) {
  return svg
    .attr("width", layout.width + margin.left + margin.right)
    .attr("height", layout.height + margin.top + margin.bottom)
    .select("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
}

export function addXLinearScale(svg, range, layout) {
  const scale = d3.scaleLinear()
    .domain(range)
    .range([0, layout.width]);

  let axis = selectOrCreate(
    svg, "g.x-linear",
    () => svg.append("g").attr("class", "x-linear"));

  axis
    .attr("transform", "translate(0," + layout.height + ")")
    .call(
      d3.axisBottom(scale)
        // Hide the first and the last tick.
        .tickSize(0)
        .tickSizeInner(5)
    );

  return scale;
}

function selectOrCreate(selection, selector, factory) {
  let result = selection.selectAll(selector);
  if (result.empty()) {
    return factory();
  } else {
    return result;
  }
}

export function addYLinearScale(svg, range, layout, args = {}) {
  args = {
    "useScientificNotation": false,
    // Allow to specify a threshold from which the scientific notation is used.
    "scientificNotationValue": 0,
    ...args
  };

  const scale = d3.scaleLinear()
    .domain(range)
    .range([layout.height, 0]);

  let format = (value) => value;
  if (args.useScientificNotation) {
    const d3Format = d3.format(".1e");
    format = (value) => {
      if (value > args.scientificNotationValue) {
        return d3Format(value);
      } else {
        return value;
      }
    }
  }

  let axis = selectOrCreate(
    svg, "g.y-linear",
    () => svg.append("g").attr("class", "y-linear"));

  axis
    .call(
      d3.axisLeft(scale)
        // Hide the first and the last tick.
        .tickSize(0)
        .tickSizeInner(5)
        .tickFormat(format)
    );

  return scale;
}

export function addFocusLine(svg, x, y, layout, data, args = {}, pretext, units) {
  args = {
    "focusMouseMove": focusMouseMoveStrategy,
    "focusLabel": defaultLabel,
    ...args
  };

  let lines = svg.selectAll("g.focus-line line");
  if (lines.empty()) {
    lines = svg.append("g")
      .attr("class", "focus-line")
      .append("line")
      .style("fill", "none")
      .attr("stroke", "black")
      .style("opacity", 0);
  }

  // Set bottom of focus line, either to fixed value or
  // to minimum of all values.
  if (args.yRange && args.yRange.min !== undefined) {
    lines.attr("y1", y(args.yRange.min))
  } else {
    lines.attr("y1", y(d3.min(data.map((item) => d3.min(item.y)))))
  }

  const lineNodes = lines.nodes().map(d3.select);

  const {mousemove, focusText} =
    args.focusMouseMove(svg, x, y, data, args, lineNodes, pretext, units);

  selectOrCreate(
    svg, "rect.focus-rect",
    () => svg.append("rect").attr("class", "focus-rect"))
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

function defaultLabel(data, valueY, units) {
  return data.label + ": " + fixedDecimalsString(valueY, 1) + units;
}

function fixedDecimalsString(num, decimals){
  let dec = Math.round(num * Math.pow(10, decimals)) % Math.pow(10, decimals);
  let finNum = Math.floor(num);
  return finNum + "." + dec;
}

export function focusMouseMoveStrategy(
  svg, x, y, data, args, focusLines, pretext, units) {

  assert(focusLines.length === 1,
    "Only one focus node can be provided.");

  const focusNode = focusLines[0];

  let textData = [
    {
      "label": "fool it",
      "color": "black",
      "indent": true,
    },
    ...data];
  let focusText = svg.selectAll("text.focus-text").data(textData);
  const wasThereTextBefore = !focusText.empty();
  focusText.exit().remove();
  focusText = focusText
    .enter()
    .append("text")
    .attr("class", "focus-text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
    .merge(focusText)
    .attr("fill", (item) => item.color);


  // We go from bottom-up, as
  // we have multiple lines and it is not clear where should we stop.
  focusNode.attr("y2", y(d3.max(data.map((item) => item.y))));

  // We keep the last mouse value for purpose of update
  // after graph change.
  function mousemove() {
    const mouse = d3.mouse(this);

    const mouseX = x.invert(mouse[0]);
    const textLines = [];

    let valueX;
    const dataRecord = data[data.length - 1];
    const valueIndex = roundedIndex(dataRecord.x, mouseX);
    valueX = dataRecord.x[valueIndex];
    textLines.push(pretext + " " + valueX + ":");
    for (let index = 0; index < data.length; ++index) {
      const dataRecord = data[index];
      const valueIndex = roundedIndex(dataRecord.x, mouseX);
      const valueY = dataRecord.y[valueIndex];
      textLines.push(args.focusLabel(dataRecord, valueY, units));
    }

    focusNode
      .attr("x1", x(valueX))
      .attr("x2", x(valueX));

    // TODO Allow for multiline text and move left/right from the line.
    function indentation(data, index){
      if(data["indent"]){
        return x(valueX) + 15;
      }else{
        return x(valueX) + 30;
      }
      
    }

    focusText
      .html((_, index) => textLines[index])
      .attr("x", indentation)
      .attr("y", (data, index) => mouse[1] + index * 15)
      

  }

  // If there was text before, we need to update it.
  if (wasThereTextBefore) {
    // TODO Update text.
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

  let focusText = svg.select("text.focus-text");
  const wasThereTextBefore = !focusText.empty();
  if (!wasThereTextBefore) {
    focusText = svg
      .append("text")
      .attr("class", "focus-text")
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");
  }

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
        .attr("x2", x(valueX));

      // TODO Allow for multiline text and move left/right from the line.

      const activeText = focusTextNodes[index];
      activeText
        .html(args.focusLabel(dataRecord, valueY, "UNITS"))
        .attr("x", x(valueX) + 15)
        .attr("y", y(valueY) - 5)
    }
  }

  // If there was text before, we need to update it.
  if (wasThereTextBefore) {
    // TODO Update text.
  }

  return {
    "mousemove": mousemove,
    "focusText": focusText
  };
}

export function addGrid(svg, x, y, layout) {

  selectOrCreate(svg, "g.grid-x", () => svg.append("g").attr("class", "grid-x"))
    .attr("transform", "translate(0," + layout.height + ")")
    .attr("stroke-dasharray", "1")
    .call(
      d3.axisBottom(x)
        .tickSizeInner(-layout["height"])
        .tickFormat("")
    )
    .call(g => g.select(".domain").remove());

  selectOrCreate(svg, "g.grid-y", () => svg.append("g").attr("class", "grid-y"))
    .attr("stroke-dasharray", "1")
    .call(
      d3.axisLeft(y)
        .tickSize(-layout["width"])
        .tickFormat("")
    )
    .call(g => g.select(".domain").remove());

}

/**
 * Does not support multiline text.
 */
export function addText(svg, x, y, text) {
  const textNodes = selectOrCreate(
    svg, "g.plot-text",
    () => svg.append("g").attr("class", "plot-text")
  ).selectAll("text").data(text);

  textNodes.exit().remove();

  textNodes.enter()
    .append("text")
    .merge(textNodes)
    .attr("x", (item) => x(item["x"]))
    .attr("y", (item) => y(item["y"]))
    .html((item) => item["value"]);
}
