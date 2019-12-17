<template>
  <b-col
    :sm="width.sm"
    :md="width.md"
    class="fixed-window"
    style="padding-left: 2.2rem"
  >
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
  </b-col>
</template>

<script>
  import SummaryView from "./views/summary-view";
  import AcgtCyclesView from "./views/acgt-cycles-view";
  import AcgtCyclesViewMenu from "./views/acgt-cycles-view-menu";
  import GcConventView from "./views/gc-content-view";
  import IndelCycleView from "./views/indel-cycles-view";
  import InsertSizeView from "./views/insert-size-view";
  import Quality2View from "./views/quality-2-view";
  import Quality3View from "./views/quality-3-view";
  import GcDepthView from "./views/gc-depth-view";

  export default {
    "name": "view-column",
    "components": {
      "summary-view": SummaryView,
      "acgt-cycles-view": AcgtCyclesView,
      "acgt-cycles-view-menu": AcgtCyclesViewMenu,
      "indel-cycle-view": IndelCycleView,
      "insert-size-view": InsertSizeView,
      "gc-content-view": GcConventView,
      "quality-2-view": Quality2View,
      "quality-3-view": Quality3View,
      "gc-depth": GcDepthView,
    },
    "props": {
      "activeView": {"type": Number, "required": true},
      "data": {"type": Object, "required": true},
      "menuData": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "required": true},
      "width": {"type": Object, "required": true},
    },
  }
</script>