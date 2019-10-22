import Vue from "vue";
import {
  LayoutPlugin,
  NavbarPlugin,
  ButtonPlugin,
  ListGroupPlugin,
  FormCheckboxPlugin,
} from "bootstrap-vue";

import App from "./application";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "./data.js";

Vue.config.productionTip = false;

Vue.use(LayoutPlugin);
Vue.use(NavbarPlugin);
Vue.use(ButtonPlugin);
Vue.use(ListGroupPlugin);
Vue.use(FormCheckboxPlugin);

/* eslint-disable no-new */
new Vue({
  "el": "#app",
  "render": (h) => h(App)
});
