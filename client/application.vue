<template>
  <div class="bg-light">
    <b-container
      class="p-0 bg-white"
      fluid="sm" 
    >
      <b-navbar
        toggleable="lg"
        type="light"
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
            >
            <label for="files">
              <div class="btn file-upload-button">
                <font-awesome-icon icon="upload" />
              </div>
            </label>
          </b-nav-form>
          <b-navbar-nav>
            <span style="margin-right: 1rem; margin-left: 1rem">
              <b>Active file:</b> {{ files[activeFileIndex]["label"] }}
            </span>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <example-text-list 
              v-model="activeExample"
              :data="activeViewExamples"
            />
            <acgt-cycles-view-menu
              v-if="activeViewIndex === 1"
              :data="menuData[1]"
            />
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <b-container
        fluid
      >
        <b-row>
          <b-col
            v-if="showFileList"
            :sm="6"
            :md="2"
            :class="{active: activeList === 0}"
            class="scroll-window"
          >
            <file-list
              v-model="activeFileIndex"
              :files="files"
              @delete="onDeleteFile"
            />
          </b-col>
          <b-col
            v-if="showViewList"
            :sm="6"
            :md="2"
            :class="{active: activeList === 1}"
            class="scroll-window"
          >
            <view-list
              style="overflow: hidden; resize: none"
              v-model="activeViewIndex"
              :views="views"
            />
          </b-col>
          <left-view-menu-column
            :files="showFileList"
            :views="showViewList"
            @toggleFiles="onToggleFiles"
            @toggleViews="onToggleViews"
          />
          <b-col>
            <view-column
              :active-view="activeViewIndex"
              :data="activeViewData"
              :menu-data="menuData"
              :options="options"
              :resize-notification="resizeNotification"
              :width="viewColumnWidth"
              :activeExample="activeExample"
              :thresholdsValues="thresholds"
              v-on:reset-example="activeExample = -1"
              v-on:change-thresholds="thresholds = $event.target.value"
            />
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </div>
</template>

<script>
  import {loadBchkFile} from "./bchk-reader";
  import ExamplesList from "./ui/example-text-list";
  import ViewList from "./ui/view-list";
  import createInitialOptions from "./default-options";
  import FileList from "./ui/file-list";
  import ViewColumn from "./view-column";
  import AcgtCyclesViewMenu from "./views/acgt-cycles-view-menu";
  import viewsList from "./view-list-definition";
  import LeftViewMenuColumn from "./ui/left-view-menu";
  import { STATUS_OK, worstStatus, STATUS_INVALID, STATUS_NONE } from './data-status';
  const FILE_LIST = 0;
  const VIEW_LIST = 1;

  export default {
    "name": "app",
    "components": {
      "view-list": ViewList,
      "file-list": FileList,
      "view-column": ViewColumn,
      "acgt-cycles-view-menu": AcgtCyclesViewMenu,
      "example-text-list": ExamplesList,
      "left-view-menu-column": LeftViewMenuColumn,
    },
    "data": () => ({
      "activeViewIndex": 0,
      "activeFileIndex": 0,
      "activeExample": -1,
      "showFileList": false,
      "showViewList": true,
      "activeList": VIEW_LIST,
      "thresholds": null,
      //
      "files": [
        {
          "label": "default 1",
          "content": loadBchkFile(window.rmme_data),
          "status": STATUS_NONE,
        }, {
          "label": "default 2",
          "content": loadBchkFile(window.rmme_data_2),
          "status": STATUS_NONE,
        }
      ],
      "options": createInitialOptions(),
      "resizeNotification": {},
      // Used to share view data between view and view-menu.
      "menuData": {
        [1]: viewsList[1].menuData
      },
    }),
    "mounted": function () {
      // TODO Unmount on destroy?
      window.addEventListener("resize", () => {
        this.resizeNotification = {};
      });
      document.addEventListener("keydown", (event) => {
        this.onKeyEvent(event)
      });
      this.resetThresholds();
      this.files[0]["status"] = this.fileStatus(0);
      this.files[1].status = this.fileStatus(1);

      
    },
    "watch": {
      "showFileList": function () {
        // React by resizing the element as well.
        this.resizeNotification = {};
      },
      "activeViewIndex": function() {
        // Update active to VIEW_LIST as we have last change in it.
        if (this.activeList !== VIEW_LIST) {
          this.activeList = VIEW_LIST;
        }
      },
      "activeFileIndex": function() {
        // Update active to FILE_LIST as we have last change in it.
        if (this.activeList !== FILE_LIST) {
          this.activeList = FILE_LIST;
        }
      },
    },
    "computed": {
      "views": function () {
        const result = [];
        for(let i = 0; i < viewsList.length; i++) {
          let item = viewsList[i];
          const newItem = {
            ...item
          };
          let data = this.files[this.activeFileIndex].content;
          if (item.validator && this.thresholds) {
            let threshold = this.thresholds.find(elem => elem.name == item.label);
            newItem.status = item.validator(data, threshold.thresholds);
          }
          result.push(newItem);
        };
        return result;
      },
      "activeViewData": function () {
        if (this.files.length === 0) {
          return {}
        }
        if (this.activeExample === -1) {
          return this.files[this.activeFileIndex].content;
        }
        const activeViewItem = viewsList[this.activeViewIndex];
        return activeViewItem.examples[this.activeExample].content;
      },
      "activeViewExamples": function () {
        return viewsList[this.activeViewIndex].examples;
      },
      "viewColumnWidth": function () {
        const visible = this.showFileList + this.showViewList;
        let sm = 12;
        let md;
        if (visible === 2) {
            md = 8;
        } else if (visible === 1) {
            md = 10;
        } else {
            md = 12;
        }
        return {
          "sm": sm+5,
          "md": md+1,
        };
      },
    },
    "methods": {
      "onKeyEvent": function (event) {
        if (event.key === "Tab") {
          if (this.activeList === FILE_LIST) {
            this.activeList = VIEW_LIST;
          } else {
            this.activeList = FILE_LIST;
          }
          event.preventDefault();
        } else if (event.key === "ArrowUp") {
          if (this.activeList === VIEW_LIST) {
            this.activeViewIndex = Math.max(0, this.activeViewIndex - 1);
          } else if (this.activeList === FILE_LIST) {
            this.activeFileIndex = Math.max(0, this.activeFileIndex - 1);
          }
          event.preventDefault();
        } else if (event.key === "ArrowDown") {
          if (this.activeList === VIEW_LIST) {
            this.activeViewIndex = Math.min(
              viewsList.length - 1, this.activeViewIndex + 1);
          } else if (this.activeList === FILE_LIST) {
            this.activeFileIndex = Math.min(
              this.files.length - 1, this.activeFileIndex + 1);
          }
          event.preventDefault();
        }
      },
      "resetThresholds": function(){ //sets thresholds back to default thresholds
        this.thresholds = [];
        viewsList.forEach((item) => {
          let thresholds = item.thresholds();
          let name = item.label;
          const newItem = {
            name,
            thresholds
          };
          this.thresholds.push(newItem);
        });
      },
      "fileStatus": function(fileIndex){
        return this.dataStatus(this.files[fileIndex].content);
      },
      "dataStatus": function(data){ 
        let result = STATUS_OK;
        for(let i = 0; i < viewsList.length; i++) {
          let item = viewsList[i];
          if (item.validator && this.thresholds) {
            let threshold = this.thresholds.find(elem => elem.name == item.label);
            let currStatus = item.validator(data, threshold.thresholds);
            result = worstStatus([currStatus, result]);
            if(result == STATUS_INVALID){
              break;
            }
          }
        };
        return result;
      },
      "onUploadFiles": function (event) {
        event.preventDefault();
        const files = event.target.files;
        let futureIndex = this.files.length;
        const onLoad = (file, reader) => {
          const content = loadBchkFile(reader.result);
          if(content["file"]){ // if uploaded file has specified, that it belongs to already existent file
            let f = this.files.find((val) => val.label == content["file"]);
            if(f && content["name"] && content["val"]){
              f["content"][content["name"]] = content["val"];
            }
          }else{
            this.files.push({
              "label": file["name"],
              "content": content,
              "status": this.dataStatus(content),
            });
          }
        };
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = () => onLoad(file, reader);
          reader.readAsText(file);
        }
        this.activeFileIndex = futureIndex;
        this.activeViewIndex = this.activeViewIndex;
      },
      "onDeleteFile": function (index) {
        this.files.splice(index, 1);
        // Check boundaries.
        if (this.activeFileIndex >= this.files.length) {
          this.activeFileIndex = this.files.length - 1;
        }
      },
      "onToggleFiles": function () {
        this.showFileList = !this.showFileList;
        // Notify size change.
        this.resizeNotification = {};
      },
      "onToggleViews": function () {
        this.showViewList = !this.showViewList;
        // Notify size change.
        this.resizeNotification = {};
      }
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
    padding-top: 1em;
    overflow-x: hidden;
    overflow-y: scroll;
    height: calc(100vh - 4em);
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

  .active {
    background-color: lightblue;
  }

</style>