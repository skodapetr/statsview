<template>
  <div style="height:100%">
    <svg-2d-lines-plot
      :lines="plot"
      :scales="scales"
      :resize-notification="resizeNotification"
      :show-legend="true"
    />
  </div>
</template>

<script>
  import Plot from "../vue-svg-canvas/plot-lines";
  import {rangeByStep} from "../vue-svg-canvas/scale-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "name": "plot-view",
    "components": {
      "svg-2d-lines-plot": Plot,
    },
    "props": {
      "plot": {"type": Array, "required": true},
      "scales": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "required": true},
    },
  };
</script>