<template>
  <plot-view
    :plot="plot"
    :scales="scales"
    :resize-notification="resizeNotification"
    :examples="examples"
  />
</template>

<script>
  import PlotView from "../plot/abstract-svg-line-plot";
  import {rangeByStep} from "../vue-svg-canvas/scale-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "label": "Indels per cycle",
    //
    "name": "indel-cycle",
    "components": {
      "plot-view": PlotView,
    },
    "data": () => ({
      "examples": []
    }),
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "plot": function () {
        const data = selectData(this.data);
        const options = selectData(this.options);
        const x = rangeByStep(0, data.count, 1);
        return [
          {
            "label": "Insertions (Fwd)",
            "color": options.insertionsFwd,
            "y": data.insertionsFwd,
            "x": x,
          },
          {
            "label": "Insertions (Rev)",
            "color": options.insertionsRev,
            "y": data.insertionsRev,
            "x": x,
          },
          {
            "label": "Deletions (Fwd)",
            "color": options.deletionsFwd,
            "y": data.deletionsFwd,
            "x": x,
          },
          {
            "label": "Deletions (Rev)",
            "color": options.deletionsRev,
            "y": data.deletionsRev,
            "x": x,
          },
        ];
      },
      "scales": function () {
        const data = selectData(this.data);
        return {
          "x": {
            "title": "Read cycle",
            "min": 0,
            "max": data.count,
            "step": 10,
          },
          "y": {
            "title": "Indel count",
            "min": 0,
            "max": data.max,
            "step": 500,
          },
        };
      }
    }
  };

  function selectData(data) {
    return data["indel-cycles"];
  }

  function validateData(data) {
    data = selectData(data);
    return STATUS_OK;
  }

</script>
