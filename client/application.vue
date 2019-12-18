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
          >
          <label for="files">
            <div class="btn file-upload-button">
              <font-awesome-icon icon="upload"/>
            </div>
          </label>
        </b-nav-form>
        <b-navbar-nav>
          <span style="margin-right: 1rem; margin-left: 1rem">
            <b>Active file:</b> {{ files[activeFileIndex]["label"] }}
          </span>
        </b-navbar-nav>
        <acgt-cycles-view-menu
          v-if="activeViewIndex === 1"
          :data="menuData[1]"
        />
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
        <view-column
          :active-view="activeViewIndex"
          :data="activeViewData"
          :menu-data="menuData"
          :options="options"
          :resize-notification="resizeNotification"
          :width="viewColumnWidth"
        />
      </b-row>
    </b-container>
    <div class="circle-menu">
      <half-circle-list
        v-model="activeExample"
        :data="activeViewExamples"
      />
    </div>
  </div>
</template>

<script>
  import {loadBchkFile} from "./bchk-reader";
  import CircleList from "./ui/half-circle-list";
  import ViewList from "./ui/view-list";
  import createDefaultOptions from "./default-options";
  import FileList from "./ui/file-list";
  import ViewColumn from "./view-column";
  import AcgtCyclesViewMenu from "./views/acgt-cycles-view-menu";
  import viewsList from "./view-list-definition";
  import LeftViewMenuColumn from "./ui/left-view-menu";

  const FILE_LIST = 0;
  const VIEW_LIST = 1;

  export default {
    "name": "app",
    "components": {
      "view-list": ViewList,
      "file-list": FileList,
      "view-column": ViewColumn,
      "acgt-cycles-view-menu": AcgtCyclesViewMenu,
      "half-circle-list": CircleList,
      "left-view-menu-column": LeftViewMenuColumn,
    },
    "data": () => ({
      "activeViewIndex": 0,
      "activeFileIndex": 0,
      "activeExample": -1,
      "showFileList": false,
      "showViewList": true,
      "activeList": VIEW_LIST,
      //
      "files": [
        {
          "label": "default 1",
          "content": loadBchkFile(window.rmme_data)
        }, {
          "label": "default 2",
          "content": loadBchkFile(window.rmme_data_2)
        }
      ],
      "options": createDefaultOptions(),
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
    },
    "watch": {
      "showFileList": function () {
        // React by resizing the element as well.
        this.resizeNotification = {};
      },
    },
    "computed": {
      "views": function () {
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
        if (visible === 2) {
          return {
            "sm": 12,
            "md": 8,
          };
        } else if (visible === 1) {
          return {
            "sm": 12,
            "md": 10,
          };
        } else {
          return {
            "sm": 12,
            "md": 12,
          };
        }
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
      "onUploadFiles": function (event) {
        event.preventDefault();
        const files = event.target.files;
        const onLoad = (file, reader) => {
          const content = loadBchkFile(reader.result);
          this.files.push({
            "label": file["name"],
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