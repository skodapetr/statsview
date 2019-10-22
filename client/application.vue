<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="info"
      class="navbar"
    >
      <b-navbar-brand href="#">
        RMME Viewer
      </b-navbar-brand>
    </b-navbar>
    <b-container
      fluid
      style="margin-top: 1rem"
    >
      <b-row>
        <b-col
          sm="12"
          md="2"
          class="fixed-window"
        >
          <view-list
            :views="viewsList"
            @select="onSelectView"
          />
        </b-col>
        <b-col
          sm="12"
          md="10"
          class="fixed-window"
        >
          <summary-view
            v-if="view === SUMMARY_VIEW"
            :data="data"
            :options="options"
          />
          <acgt-cycles-view
            v-if="view === ACGT_CYCLES_VIEW"
            :data="data"
            :options="options"
            :resize-notification="resizeNotification"
          />
          <indel-cycle-view
            v-if="view === INDEL_CYCLES_VIEW"
            :data="data"
            :options="options"
            :resize-notification="resizeNotification"
          />
          <insert-size-view
            v-if="view === INSERT_SIZE_VIEW"
            :data="data"
            :options="options"
            :resize-notification="resizeNotification"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import {loadBchkFile} from "./bchk-reader";
  import ViewList from "./view-list";
  import SummaryView from "./views/summary-view";
  import AcgtCyclesView from "./views/acgt-cycles-view";
  import IndelCycleView from "./views/indel-cycles-view"
  import InsertSizeView from "./views/insert-size-view"
  import createDefaultOptions from "./default-options";

  const SUMMARY_VIEW = 1;
  const ACGT_CYCLES_VIEW = 2;
  const GC_CONTENT_VIEW = 3;
  const INDEL_CYCLES_VIEW = 4;
  const INSERT_SIZE_VIEW = 5;
  const QUALS_PERCENTIL_VIEW = 6;
  const QUALS_SIZE_VIEW = 7;

  const viewsNames = {
    "SUMMARY_VIEW": SUMMARY_VIEW,
    "ACGT_CYCLES_VIEW": ACGT_CYCLES_VIEW,
    "GC_CONTENT_VIEW": GC_CONTENT_VIEW,
    "INDEL_CYCLES_VIEW": INDEL_CYCLES_VIEW,
    "INSERT_SIZE_VIEW": INSERT_SIZE_VIEW,
    "QUALS_PERCENTIL_VIEW": QUALS_PERCENTIL_VIEW,
    "QUALS_SIZE_VIEW": QUALS_SIZE_VIEW,
  };

  const viewsList = [
    {
      "label": SummaryView.label,
      "value": SUMMARY_VIEW,
    }, {
      "validator": AcgtCyclesView.validator,
      "label": AcgtCyclesView.label,
      "value": ACGT_CYCLES_VIEW,
    }, {
      "label": "GC content",
      "value": GC_CONTENT_VIEW,
    }, {
      "validator": IndelCycleView.validator,
      "label": IndelCycleView.label,
      "value": INDEL_CYCLES_VIEW,
    }, {
      "validator": InsertSizeView.validator,
      "label": InsertSizeView.label,
      "value": INSERT_SIZE_VIEW,
    }, {
      "label": "Quality per cycle",
      "value": QUALS_PERCENTIL_VIEW,
    }, {
      "label": "Quality per cycle",
      "value": QUALS_SIZE_VIEW,
    }
  ];

  export default {
    "name": "app",
    "components": {
      "view-list": ViewList,
      "summary-view": SummaryView,
      "acgt-cycles-view": AcgtCyclesView,
      "indel-cycle-view": IndelCycleView,
      "insert-size-view": InsertSizeView,
    },
    "data": () => ({
      ...viewsNames,
      "view": ACGT_CYCLES_VIEW,
      "data": loadBchkFile(window.rmme_data),
      "options": createDefaultOptions(),
      "resizeNotification": {}
    }),
    "mounted": function() {
      window.addEventListener("resize", () => {
        this.resizeNotification = {};
      });
    },
    "computed": {
      "viewsList": function () {
        const result = [];
        viewsList.forEach((item) => {
          const newItem = {
            ...item
          };
          if (item.validator) {
            newItem.status = item.validator(this.data);
          }
          result.push(newItem);
        });
        return result;
      }
    },
    "methods": {
      "onSelectView": function (view) {
        this.view = view.value;
      }
    }
  }
</script>

<style scoped>
  .navbar {
    height: 3rem;
  }

  .fixed-window {
    overflow-y: scroll;
    height: calc(100vh - 5em);
  }
</style>