<template>
  <div
  style="height: 250px;"
  >
    <no-data v-if="!dataAvailable" />
    <table
      v-else
      class="summary-table"
    >
      <tr>
        <th>Name</th>
        <th>Value</th>
      </tr>
      <tr
        v-for="(value, name) in data.summary"
        :key="name"
      >
        <td>
          {{ name }}
        </td>
        <td class="value-cell">
          {{ formatNumber(value) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import NoData from "../ui/no-data";
  import { STATUS_NONE } from '../data-status';

  export default {
    "validator": validateData,
    "label": "Summary                                                                       ",
    //
    "name": "summary-view",
    "components": {
      "no-data": NoData,
    },
    "props": {
      "data": {"type": Object, "required": true}
    },
    "computed": {
      "dataAvailable": function() {
        return this.data.summary;
      },
      "total": function () {
        return this.data.summary["sequences"];
      },
      "filteredSequences": function () {
        return this.data.summary["filtered sequences"];
      },
      "nonPrimaryAlignments": function () {
        return this.data.summary["non-primary alignments"];
      },
      "readsDuplicated": function () {
        return this.data.summary["reads duplicated"];
      },
      "readsMapped": function () {
        return this.data.summary["reads mapped"];
      },
      "readsMQ0": function () {
        return this.data.summary["reads MQ0"];
      },
      "averageLength": function () {
        return this.data.summary["average length"];
      }
    },
    "methods": {
      "formatNumber": function (number) {
        if (Number.isInteger) {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          return number;
        }
      },
    }
  };

  function validateData(data){
    return STATUS_NONE;
  }
</script>

<style scoped>
  .summary-table {
    margin-left: 2rem;
  }

  .value-cell {
    text-align: right;
  }
</style>