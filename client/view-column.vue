<template>
  <b-col
    :sm="width.sm"
    :md="width.md"
    :class="'fixed-window view-column' + borderClass()"
  >
    <font-awesome-icon
      v-show="showExample()"
      class="cross button"
      @click="resetExamples()"
      icon="times" 
    />
    <div 
      class="rotated text-center"
    >
      <div class="upside-down">
        {{yCaption()}}
      </div>
    </div>
    <b-col class="ml-2">
      <summary-view
        v-if="activeView === 0"
        :data="data"
        :options="options"
      />
      <acgt-cycles-view
        v-else-if="activeView === 1"
        :data="data"
        :menu-data="menuData[1]"
        :options="options"
        :resize-notification="resizeNotification"
      />
      <gc-content-view
        v-else-if="activeView === 2"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
      />
      <indel-cycle-view
        v-else-if="activeView === 3"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
      />
      <insert-size-view
        v-else-if="activeView === 4"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
      />
      <quality-2-view
        v-else-if="activeView === 5"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
      />
      <quality-3-view
        v-else-if="activeView === 6"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
      />
      <gc-depth
        v-else-if="activeView === 7"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
      />
      <thresholds
        v-else-if="activeView === 8"
        :resize-notification="resizeNotification"
        :thresholdsVals="thresholdsValues"
        v-model="thresholdsValues"
      />
    </b-col>
    <div class="text-center">{{xCaption()}}<div>
    <div v-show="showExample()" style="margin-top: 1rem;">
      Example text to be shown under example graph. Because we all know that example without explanation is useless.
    </div>
  </b-col>
</template>

<script>
  import SummaryView from "./views/summary-view";
  import AcgtCyclesView from "./views/acgt-cycles-view";
  import AcgtCyclesViewMenu from "./views/acgt-cycles-view-menu";
  import GcContentView from "./views/gc-content-view";
  import IndelCycleView from "./views/indel-cycles-view";
  import InsertSizeView from "./views/insert-size-view";
  import Quality2View from "./views/quality-2-view";
  import Quality3View from "./views/quality-3-view";
  import GcDepthView from "./views/gc-depth-view";
  import ThresholdsView from "./views/threshold-view";
import gcContentViewVue from './views/gc-content-view.vue';

  export default {
    "name": "view-column",
    "components": {
      "summary-view": SummaryView,
      "acgt-cycles-view": AcgtCyclesView,
      "acgt-cycles-view-menu": AcgtCyclesViewMenu,
      "indel-cycle-view": IndelCycleView,
      "insert-size-view": InsertSizeView,
      "gc-content-view": GcContentView,
      "quality-2-view": Quality2View,
      "quality-3-view": Quality3View,
      "gc-depth": GcDepthView,
      "thresholds": ThresholdsView,
    },
    "props": {
      "activeView": {"type": Number, "required": true},
      "activeExample": {"type": Number, "required": true},
      "data": {"type": Object, "required": true},
      "menuData": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "required": true},
      "width": {"type": Object, "required": true},
      "thresholdsValues": {"type": Object, "required": true},
    },
    "methods": {
      "xCaption": function () {
        switch(this.activeView){
        case 1:
          return "Cycle";
        default:
          return this.defaultCaption("X");
        }
      },
      "yCaption": function () {
        switch(this.activeView){
        case 1:
          return "% representation of bases";
        default:
          return this.defaultCaption("X");
        }
      },
      //inner function - it will not exist in the final 
      "defaultCaption": function (char){
        switch(this.activeView){
          case 0:
            return "";
          case 1:
            return "Cycles " + char + " caption";
          case 2:
            return "GC-Content " + char + " caption";
          case 3:
            return "Indel-cycle " + char + " caption";
          case 4:
            return "insert-size " + char + " caption";
          case 5:
            return "quality2 " + char + " caption";
          case 6:
            return "quality3 " + char + " caption";
          case 7:
            return "GC-depth " + char + " caption";
          case 8:
            return "";
        }
        return "Graph index is " + this.activeView + ". Something went wrong!";
      },
      "showExample": function (){
        return this.activeExample != -1;
      },
      "borderClass": function(){
        if(this.showExample()){
          return " border border-primary";
        }else{
          return "";
        }
      },
      "resetExamples": function (){
        this.$emit("reset-example");
      },
      "applyThresholds": function(){
        this.$emit("change-thresholds", this.thresholdsValues);
      },
    }
  }
</script>

<style scoped>

.view-column{
  padding-left: 2.2rem;
  padding-top: 1.1rem;
  margin-top: 0.8rem;
  margin-left: 2.2rem;
  overflow: hidden;
}

.rotated{
  position: absolute;
  padding: 0%;
  margin: 0%;
  -webkit-transform-origin: 0% 100%;
  -ms-transform-origin: 0% 100%;
  transform-origin:0% 100%;
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}

.upside-down{
  text-align: right;
  padding: 0%;
  margin: 0%;
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.cross{
  position: absolute;
  text-align: center;
  right: 0%;
  top: 0%;
  width: 1.4rem;
  height: 1.4rem;
  background-color: darkorange;
  color: red;
}
</style>