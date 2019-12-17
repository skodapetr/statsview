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
              <font-awesome-icon icon="upload" />
            </div>
          </label>
        </b-nav-form>
        <b-navbar-nav v-if="files.length > 1">
          <span style="margin-right: 1rem; margin-left: 1rem">
            <b>Active file:</b> {{ files[activeFileIndex]["label"] }}
          </span>
          <b-form-checkbox
            v-model="showFileList"
            switch
          >
            Show file list
          </b-form-checkbox>
        </b-navbar-nav>
        <acgt-cycles-view-menu
          v-if="activeViewIndex === 1"
          :data="menuData[1]"
        />
      </b-collapse>
    </b-navbar>
    <b-container
      fluid
      style="margin-top: 1rem"
    >
      <b-row>
        <b-col
          v-if="showFileList"
          sm="12"
          md="2"
          class="scroll-window"
        >
          <file-list
            v-model="activeFileIndex"
            :files="files"
          />
        </b-col>
        <b-col
          :sm="viewListColumnWidth.sm"
          :md="viewListColumnWidth.md"
          class="scroll-window"
        >
          <view-list
            v-model="activeViewIndex"
            :views="views"
          />
        </b-col>
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

  export default {
    "name": "app",
    "components": {
      "view-list": ViewList,
      "file-list": FileList,
      "view-column": ViewColumn,
      "acgt-cycles-view-menu": AcgtCyclesViewMenu,
      "half-circle-list": CircleList,
    },
    "data": () => ({
      "activeViewIndex": 0,
      "activeFileIndex": 0,
      "activeExample": -1,
      "showFileList": false,
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
      document.addEventListener("keyup", (event) => {
        this.onPageKeyUp(event)
      });
    },
    "watch": {
      "showFileList": function() {
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
        if (this.activeExample === -1) {
          return this.files[this.activeFileIndex].content;
        }
        const activeViewItem = viewsList[this.activeViewIndex];
        return activeViewItem.examples[this.activeExample].content;
      },
      "activeViewExamples": function () {
        return viewsList[this.activeViewIndex].examples;
      },
      "viewListColumnWidth": function () {
        return {
          "sm": 12,
          "md": 2,
        };
      },
      "viewColumnWidth": function () {
        if (this.showFileList) {
          return {
            "sm": 12,
            "md": 8,
          };
        }
        return {
          "sm": 12,
          "md": 10,
        };
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
        } else if (event.key === "PageUp") {
          this.activeFileIndex = Math.max(0, this.activeFileIndex - 1);
          event.preventDefault();
        } else if (event.key === "PageDown") {
          this.activeFileIndex = Math.min(
            this.files.length - 1, this.activeFileIndex + 1);
          event.preventDefault();
        }
      },
      "onUploadFiles": function (event) {
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