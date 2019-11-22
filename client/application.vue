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
      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <b-nav-form>
          <input
            id="files"
            type="file"
            name="files"
            class="file-upload"
            multiple
            @change="onUploadFiles"
          />
          <label for="files">
            <div class="btn file-upload-button">
              <font-awesome-icon icon="upload" />
            </div>
          </label>
        </b-nav-form>
        <b-navbar-nav v-if="files.length > 1">
          {{ files[activeFileIndex]["name"] }}
        </b-navbar-nav>
        <acgt-cycles-view-menu
          v-if="activeViewName === ACGT_CYCLES_VIEW"
          :data="viewData[ACGT_CYCLES_VIEW]"
        />
      </b-collapse>
    </b-navbar>
    <b-container
      fluid
      style="margin-top: 1rem"
    >
      <b-row>
        <b-col
          sm="12"
          md="2"
          class="scroll-window"
        >
          <view-list
            v-model="activeViewIndex"
            :views="viewsList"
          />
        </b-col>
        <b-col
          sm="12"
          md="10"
          class="fixed-window"
        >
          <summary-view
            v-if="activeViewName === SUMMARY_VIEW"
            :data="files[activeFileIndex].content"
            :options="options"
          />
          <acgt-cycles-view
            v-if="activeViewName === ACGT_CYCLES_VIEW"
            :data="files[activeFileIndex].content"
            :menu-data="viewData[ACGT_CYCLES_VIEW]"
            :options="options"
            :resize-notification="resizeNotification"
          />
          <gc-content-view
            v-if="activeViewName === GC_CONTENT_VIEW"
            :data="files[activeFileIndex].content"
            :options="options"
            :resize-notification="resizeNotification"
          />
          <indel-cycle-view
            v-if="activeViewName === INDEL_CYCLES_VIEW"
            :data="files[activeFileIndex].content"
            :options="options"
            :resize-notification="resizeNotification"
          />
          <insert-size-view
            v-if="activeViewName === INSERT_SIZE_VIEW"
            :data="files[activeFileIndex].content"
            :options="options"
            :resize-notification="resizeNotification"
          />
          <quality-2-view
            v-if="activeViewName === QUALITY_2_VIEW"
            :data="files[activeFileIndex].content"
            :options="options"
            :resize-notification="resizeNotification"
          />
          <quality-3-view
            v-if="activeViewName === QUALITY_3_VIEW"
            :data="files[activeFileIndex].content"
            :options="options"
            :resize-notification="resizeNotification"
          />
        </b-col>
      </b-row>
    </b-container>
    <div class="circle-menu">
      <half-circle-list/>
    </div>
  </div>
</template>

<script>
  import {loadBchkFile} from "./bchk-reader";
  import CircleList from "./ui/half-circle-list";
  import ViewList from "./ui/view-list";
  import SummaryView from "./views/summary-view";
  import AcgtCyclesView from "./views/acgt-cycles-view";
  import AcgtCyclesViewMenu from "./views/acgt-cycles-view-menu";
  import GcConventView from "./views/gc-content-view";
  import IndelCycleView from "./views/indel-cycles-view";
  import InsertSizeView from "./views/insert-size-view";
  import Quality2View from "./views/quality-2-view";
  import Quality3View from "./views/quality-3-view";
  import createDefaultOptions from "./default-options";

  const SUMMARY_VIEW = 1;
  const ACGT_CYCLES_VIEW = 2;
  const GC_CONTENT_VIEW = 3;
  const INDEL_CYCLES_VIEW = 4;
  const INSERT_SIZE_VIEW = 5;
  const QUALITY_2_VIEW = 6;
  const QUALITY_3_VIEW = 7;

  const viewsNames = {
    "SUMMARY_VIEW": SUMMARY_VIEW,
    "ACGT_CYCLES_VIEW": ACGT_CYCLES_VIEW,
    "GC_CONTENT_VIEW": GC_CONTENT_VIEW,
    "INDEL_CYCLES_VIEW": INDEL_CYCLES_VIEW,
    "INSERT_SIZE_VIEW": INSERT_SIZE_VIEW,
    "QUALITY_2_VIEW": QUALITY_2_VIEW,
    "QUALITY_3_VIEW": QUALITY_3_VIEW,
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
      "validator": GcConventView.validator,
      "label": GcConventView.label,
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
      "validator": Quality2View.validator,
      "label": Quality2View.label,
      "value": QUALITY_2_VIEW,
    }, {
      "validator": Quality3View.validator,
      "label": Quality3View.label,
      "value": QUALITY_3_VIEW,
    }
  ];

  export default {
    "name": "app",
    "components": {
      "view-list": ViewList,
      "summary-view": SummaryView,
      "acgt-cycles-view": AcgtCyclesView,
      "acgt-cycles-view-menu": AcgtCyclesViewMenu,
      "indel-cycle-view": IndelCycleView,
      "insert-size-view": InsertSizeView,
      "gc-content-view": GcConventView,
      "half-circle-list": CircleList,
      "quality-2-view": Quality2View,
      "quality-3-view": Quality3View,
    },
    "data": () => ({
      ...viewsNames,
      "activeFileIndex": 0,
      "files": [
        {
          "name": "default 1",
          "content": loadBchkFile(window.rmme_data)
        }, {
          "name": "default 2",
          "content": loadBchkFile(window.rmme_data_2)
        }
      ],
      "options": createDefaultOptions(),
      "resizeNotification": {},
      "activeViewIndex": 0,
      "viewData": {
        [ACGT_CYCLES_VIEW]: AcgtCyclesView.menuData
      },
    }),
    "mounted": function () {
      // TODO Unmount on destroy?
      window.addEventListener("resize", () => {
        this.resizeNotification = {};
      });
      document.addEventListener("keyup", (event) => {
        this.onPageKeyUp(event)
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
      },
      "activeViewName": function () {
        return viewsList[this.activeViewIndex]["value"];
      },
    },
    "methods": {
      "onPageKeyUp": function (event) {
        if (event.key === "ArrowUp") {
          this.activeViewIndex = Math.max(0, this.activeViewIndex - 1);
          event.preventDefault();
        } else if (event.key === "ArrowDown") {
          this.activeViewIndex = Math.min(
            viewsList.length - 1, this.activeViewIndex + 1);
          event.preventDefault();
        } else  if (event.key === "PageUp") {
          this.activeFileIndex = Math.max(0, this.activeFileIndex - 1);
          event.preventDefault();
        } else if (event.key === "PageDown") {
          this.activeFileIndex = Math.min(
            this.files.length - 1, this.activeFileIndex + 1);
          event.preventDefault();
        }
      },
      "onUploadFiles": function(event) {
        event.preventDefault();
        const files = event.target.files;
        const onLoad = (file, reader) => {
          const content = loadBchkFile(reader.result);
          this.files.push({
            "name": file["name"],
            "content": content,
          });
        };
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = () => onLoad(file, reader);
          reader.readAsText(file);
        }
      },
    }
  }
</script>

<style scoped>
  .navbar {
    height: 3rem;
  }

  .circle-menu {
    position: fixed;
    top: 0.5rem;
    left: 50%;
  }

  .scroll-window {
    overflow-y: scroll;
    height: calc(100vh - 5em);
  }

  .fixed-window {
    overflow-y: hidden;
    height: calc(100vh - 5em);
  }

  /* https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/ */
  .file-upload {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .file-upload-button {
    cursor: pointer;
  }

</style>