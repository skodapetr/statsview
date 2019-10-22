<template>
  <div style="height:100%">
    <b-row
      v-if="!showExamples"
      style="height: 1rem"
      align-h="end"
    >
      <b-col
        sm="12"
        md="2"
      >
        <b-form-checkbox
          v-model="showExamples"
        >
          Show examples
        </b-form-checkbox>
      </b-col>
    </b-row>
    <b-row style="height: calc(100% - 1rem);">
      <svg-2d-lines-plot
        v-if="!showExamples"
        :lines="plot"
        :scales="scales"
        :resize-notification="resizeNotification"
        :show-legend="true"
      />
      <b-col
        v-if="showExamples"
        sm="12"
        md="5"
      >
        <svg-2d-lines-plot
          :lines="plot"
          :scales="scales"
          :resize-notification="resizeNotification"
          :show-legend="true"
        />
      </b-col>
      <b-col
        v-if="showExamples"
        sm="12"
        md="5"
      >
        <svg-2d-lines-plot
          v-if="activeExample"
          :lines="activeExample.plot"
          :scales="activeExample.scales"
          :resize-notification="resizeNotification"
        />
        <div
          v-if="!activeExample"
          style="text-align: center"
        >
          <br/>
          Select example data to show.
        </div>
      </b-col>
      <b-col
        v-if="showExamples"
        sm="12"
        md="2"
      >
        <b-form-checkbox
          v-model="showExamples"
        >
          Show examples
        </b-form-checkbox>
        <b-list-group>
          <b-list-group-item
            v-for="(item, index) in examples"
            :key="index"
            :variant="selectVariant(item)"
            button
            @click="selectExample(item)"
          >
            {{ item.label }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
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
    "data": () => ({
      "showExamples": false,
      "activeExample": undefined,
    }),
    "props": {
      "plot": {"type": Array, "required": true},
      "scales": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "required": true},
      "examples": {"type": Array, "required": true},
    },
    "methods": {
      "selectExample": function(example) {
        this.activeExample = example;
      },
      "selectVariant": function(example) {
        switch(example.status) {
          case STATUS_WARNING:
            return "warning";
          case STATUS_INVALID:
            return "danger";
          case STATUS_OK:
          default:
            return null;
        }
      },
    }
  };
</script>