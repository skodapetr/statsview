import SummaryView from "./views/summary-view";
import AcgtCyclesView from "./views/acgt-cycles-view";
import GcConventView from "./views/gc-content-view";
import IndelCycleView from "./views/indel-cycles-view";
import InsertSizeView from "./views/insert-size-view";
import Quality2View from "./views/quality-2-view";
import Quality3View from "./views/quality-3-view";
import GcDepthView from "./views/gc-depth-view";
import {getNegativeExamples} from "./negative-data-examples";

const viewsList = [
  {
    "label": SummaryView.label,
    "value": 0,
    "examples": [],
  }, {
    "validator": AcgtCyclesView.validator,
    "label": AcgtCyclesView.label,
    "value": 1,
    "examples": getNegativeExamples("acgt-cycles"),
    "menuData": AcgtCyclesView.menuData,
  }, {
    "validator": GcConventView.validator,
    "label": GcConventView.label,
    "value": 2,
    "examples": getNegativeExamples("gc-content"),
  }, {
    "validator": IndelCycleView.validator,
    "label": IndelCycleView.label,
    "value": 3,
    "examples": getNegativeExamples("indel-cycles"),
  }, {
    "validator": InsertSizeView.validator,
    "label": InsertSizeView.label,
    "value": 4,
    "examples": getNegativeExamples("insert-size"),
  }, {
    "validator": Quality2View.validator,
    "label": Quality2View.label,
    "value": 5,
    "examples": getNegativeExamples("quality-2"),
  }, {
    "validator": Quality3View.validator,
    "label": Quality3View.label,
    "value": 6,
    "examples": getNegativeExamples("quality-3"),
  }, {
    "validator": GcDepthView.validator,
    "label": GcDepthView.label,
    "value": 7,
    "examples": getNegativeExamples("gc-depth"),
  }
];

export default viewsList;