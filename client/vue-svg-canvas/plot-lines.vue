<template>
  <svg
    v-if="layout"
    :width="width"
    :height="height"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @wheel="onWheel"
  >
    <plot-legend
      v-if="showLegend"
      :data="lines"
      :layout="layout"
    />
    <defs>
      <!-- Define drawing space for the plot content. -->
      <clipPath id="graph">
        <rect
          :x="layout.x"
          :y="layout.y"
          :width="layout.width"
          :height="layout.height"
        />
      </clipPath>
    </defs>
    <g clip-path="url(#graph)">
      <g :transform="transform">
        <plot-line
          v-for="(item, index) in lines"
          :key="index"
          :layout="layout"
          :valuesX="item.x"
          :valuesY="item.y"
          :color="item.color"
          :maxX="scaleBottom.max"
          :maxY="scaleLeft.max"
        />
      </g>
    </g>
    <g>
      <vertical-scale
        :layout="layout"
        :labels="scaleLeft.labels"
        :labelsPositions="scaleLeft.ticks"
        :min="scaleLeft.scaledMin"
        :max="scaleLeft.scaledMax"
      />
      <horizontal-scale
        :layout="layout"
        :labels="scaleBottom.labels"
        :labelsPositions="scaleBottom.ticks"
        :min="scaleBottom.scaledMin"
        :max="scaleBottom.scaledMax"
      />
    </g>
  </svg>
</template>

<script>
  import HorizontalScale from "./horizontal-scale"
  import VerticalScale from "./vertical-scale";
  import {rangeByStep, rangeByStepFromOrigin} from "./scale-utils";
  import Line from "./line";
  import Legend from "./legend";

  export default {
    "name": "svg-2d-lines-plot",
    "components": {
      "horizontal-scale": HorizontalScale,
      "vertical-scale": VerticalScale,
      "plot-line": Line,
      "plot-legend": Legend,
    },
    "props": {
      "lines": {
        // Lines to plot.
        "type": Array, "required": true
      },
      "scales": {
        // Definition of 'x' and 'y' scaled.
        "type": Object
      },
      "resizeNotification": {
        // Watched for changes, used to notify for size change.
        "type": Object,
        "require": true
      },
      "movable": {
        // Allow pan & zoom.
        "type": Boolean,
        "default": false
      },
      "showLegend": {
        "type": Boolean,
        "default": false
      },
    },
    "data": () => ({
      "width": undefined,
      "height": undefined,
      // Client values.
      "clientX": 0,
      "clientY": 0,
      "clientScaleX": undefined,
      "clientScaleY": undefined,
      "zoom": 1.0,
      // Mouse.
      "mouseDown": false,
      "mouseX": undefined,
      "mouseY": undefined,
      // Layout.
      "layout": undefined,
      // Scales.
      "scaleBottom": {
        "title": undefined,
        "min": undefined,
        "max": undefined,
        "scale": undefined,
        "scaledMin": undefined,
        "scaledMax": undefined,
        "labels": [],
        "ticks": [],
      },
      "scaleLeft": {
        "title": undefined,
        "min": undefined,
        "max": undefined,
        "scale": undefined,
        "scaledMin": undefined,
        "scaledMax": undefined,
        "labels": [],
        "ticks": [],
      },
    }),
    "mounted": function () {
      initializeScale(this.scaleBottom, this.scales.x);
      initializeScale(this.scaleLeft, this.scales.y);
      this.updateLayout();
      // Requires scale factor set.
      initializeScaleLabels(this.scaleBottom, this.scales.x);
      initializeScaleLabels(this.scaleLeft, this.scales.y);
    },
    "computed": {
      "transform": function () {
        return "translate(" + this.clientX + " " + this.clientY + ") " +
          "scale(" + this.zoom + ")";
      },
    },
    "watch": {
      "resizeNotification": function () {
        this.updateLayout();
      }
    },
    "methods": {
      "updateLayout": function () {
        // Get element size from our parent.
        const element = this.$el.parentElement;
        this.width = element.offsetWidth;
        this.height = element.offsetHeight;
        if (this.width === undefined || this.height === undefined) {
          this.layout = undefined;
          return;
        }
        // Compute layout - we need some labels.
        let leftLabels;
        if (this.scaleLeft.labels.length > 0) {
          leftLabels = this.scaleLeft.labels;
        } else {
          leftLabels = rangeByStepFromOrigin(
            this.scales.y.min,
            this.scales.y.min,
            this.scales.y.max,
            this.scales.y.step);
        }

        this.layout = computeLayout({
          "width": this.width,
          "height": this.height,
          "leftLabels": leftLabels
        });
        // Update scales.
        this.scaleBottom.scale =
          this.layout.width / (this.scaleBottom.max - this.scaleBottom.min);
        this.scaleLeft.scale =
          this.layout.height / (this.scaleLeft.max - this.scaleLeft.min)
      },
      "onMouseDown": function (event) {
        if (!this.movable) {
          return;
        }
        consumeEvent(event);
        this.mouseDown = true;
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
      },
      "onMouseMove": function (event) {
        if (!this.mouseDown || !this.movable) {
          return;
        }
        consumeEvent(event);
        this.clientX += (event.offsetX - this.mouseX);
        this.clientY += (event.offsetY - this.mouseY);
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
        this.updateScales();
      },
      "updateScales": function () {
        updateScaleOnMove(
          this.scaleLeft, -this.clientY, this.zoom, this.scales.y);
        updateScaleOnMove(
          this.scaleBottom, this.clientX, this.zoom, this.scales.x);
      },
      "onMouseUp": function (event) {
        if (!this.movable) {
          return;
        }
        consumeEvent(event);
        this.mouseDown = false;
      },
      "onWheel": function (event) {
        if (!this.movable) {
          return;
        }
        const cx = (event.offsetX - this.layout.x);
        const cy = (this.layout.y + this.layout.height - event.offsetY);
        if (cx < 0 || cx > this.width || cy < 0 || cy > this.layout.height) {
          // Zoom outside of drawing area.
          return;
        }
        consumeEvent(event);
        const scale = mouseWheelToScale(event);
        this.zoom *= scale;
        // this.updateScales();

        // const cx = (this.layout.width / 2) -
        //   (event.offsetX - this.layout.x);
        // const cy = (this.layout.height / 2) -
        //   (this.layout.y + this.layout.height - event.offsetY);


        //   this.cx = this.cx + (this.zoom * cx);
        //   this.cy = this.cy + (this.zoom * cy);
      },
    },
  };

  function initializeScale(scale, userScale) {
    scale.title = userScale.title;
    scale.min = userScale.min;
    scale.max = userScale.max;
  }

  function initializeScaleLabels(scale, userScale) {
    if (userScale.ticks && userScale.labels) {
      scale.scaledMin = userScale.min;
      scale.scaledMax = userScale.max;
      scale.labels = userScale.labels;
      scale.ticks = userScale.ticks;
    } else if (userScale.step) {
      updateScaleOnMove(scale, 0, 1, userScale);
    }
  }

  function computeLayout(config) {
    let longestLeftLabel = Math.max(...
      config.leftLabels.map((item) => (item+"").length)
    ) ;
    let offsetLeft = 10 + longestLeftLabel * 10;
    let offsetRight = 10;
    let offsetTop = 10;
    let offsetBottom = 30;
    let sizeX = config.width - offsetLeft - offsetRight;
    let sizeY = config.height - offsetTop - offsetBottom;
    return {
      "x": offsetLeft,
      "y": offsetTop,
      "width": sizeX,
      "height": sizeY,
    };
  }

  function updateScaleOnMove(scale, clientPosition, zoom, userScale) {
    const scaledClientPosition = (clientPosition / scale.scale);
    let intervalSize = (scale.max - scale.min) / 2;
    const intervalCenter = scale.min + intervalSize;
    // Scale the interval, we need the opposite transformation,
    // when we zoom-in we actually need to decrease the interval.
    intervalSize /= zoom;
    // We need to move the interval in opposite direction to the
    // use movement, that is why we use '-'.
    scale.scaledMin = -scaledClientPosition - (intervalCenter - intervalSize);
    scale.scaledMax = -scaledClientPosition + (intervalCenter + intervalSize);
    const range = rangeByStepFromOrigin(
      scale.min,
      scale.scaledMin,
      scale.scaledMax,
      userScale.step);
    scale.labels = range.map((item) => Math.round(item));
    scale.ticks = range;
  }

  function consumeEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function mouseWheelToScale(event) {
    if (event.wheelDeltaY < 0) {
      return 0.95;
    } else {
      return 1.05;
    }
  }

  function debounce(callback) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }
      timeout = window.requestAnimationFrame(() => {
        callback.apply(context, args);
      });
    }
  }

</script>