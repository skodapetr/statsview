import Vue from "vue";
import {
  LayoutPlugin,
  NavbarPlugin,
  ButtonPlugin,
  ListGroupPlugin,
  FormCheckboxPlugin,
} from "bootstrap-vue";

import App from "./application";

//import "bootstrap/dist/css/bootstrap.css";
import "./bootstrap.scss";
// import "bootstrap-vue/dist/bootstrap-vue.css";


// TODO ... Insert custom style .. 

import {library} from "@fortawesome/fontawesome-svg-core";
import {
  faPlus,
  faMinus,
  faEye,
  faCog,
  faUpload,
  faAngleRight,
  faAngleLeft,
  faTrash,

  faTimes,
  faTimesCircle,
  faCheckCircle,
  faQuestionCircle,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import "./data.js";

// Add icons we need.
library.add([
  faPlus, faMinus, faEye, faCog, faUpload, faAngleRight, faAngleLeft, faTrash,

  faTimes, faTimesCircle, faCheckCircle, faQuestionCircle, faSpinner
]);

Vue.config.productionTip = false;

Vue.use(LayoutPlugin);
Vue.use(NavbarPlugin);
Vue.use(ButtonPlugin);
Vue.use(ListGroupPlugin);
Vue.use(FormCheckboxPlugin);

Vue.component("font-awesome-icon", FontAwesomeIcon);

/* eslint-disable no-new */
new Vue({
  "el": "#app",
  "render": (h) => h(App)
});
