<template>
  <div class="map" @click="handleMapClick">
    <h3>Карта офиса</h3>
    <div v-if="!isLoading" class="map-root">
      <MapSVG ref="svg" />
      <TableSVG v-show="false" ref="table" />
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { select as d3Select } from "d3";
import MapSVG from "@/assets/images/map.svg";
import TableSVG from "@/assets/images/workPlace.svg";

export default {
  props: {
    tables: {
      type: Array,
      default: () => [],
    },
    selectedTable: {
      type: Object,
      default: null,
    },
  },
  components: {
    MapSVG,
    TableSVG,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  mounted() {
    this.isLoading = true;

    const g = d3Select(this.$refs?.svg).select("g");

    if (g) {
      this.drawTables();
    } else {
      alert("SVG is incorrect");
    }

    this.isLoading = false;
  },
  watch: {
    selectedTable(newTable, prevTable) {
      if (newTable?._id !== prevTable?._id) {
        this.drawSelectedTable(newTable?._id);
      }
    },
  },
  methods: {
    handleMapClick(evt) {
      const employerPlace = evt.target.closest(".employer-place");

      if (!employerPlace) {
        this.$emit("setUserOpenned", false);
        return;
      }

      const tableId = Number(employerPlace.getAttribute("id"));
      const table = this.tables.find((item) => item._id === tableId);

      if (!table) {
        return;
      }

      this.$emit("selectTable", table);
      this.$emit("setUserOpenned", true);
    },
    drawSelectedTable(tableId) {
      d3Select(`.employer-place_selected`).classed(
        "employer-place_selected",
        false
      );

      if (tableId) {
        d3Select(`.employer-place[id="${tableId}"]`).classed(
          "employer-place_selected",
          true
        );
      }
    },

    drawTables() {
      const svgTablesGroupPlace = d3Select(this.$refs?.svg)
        .select("g")
        .append("g")
        .classed("groupPlaces", true);

      this.tables.map((table) => {
        const targetSeat = svgTablesGroupPlace
          .append("g")
          .attr("transform", `translate(${table.x}, ${table.y}) scale(0.5)`)
          .attr("id", table._id)
          .classed("employer-place", true)
          .classed("employer-place_disabled", !Number.isFinite(table.group_id));

        targetSeat
          .append("g")
          .attr("transform", `rotate(${table.rotate || 0})`)
          .attr("group_id", table.group_id)
          .classed("table", true)
          .html(d3Select(this.$refs?.table).html())
          .attr("fill", table.groupColor);
      });
    },
  },
};
</script>

<style scoped>
.map {
  height: 100%;
  width: 100%;
  padding: 24px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.map-root {
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

::v-deep .employer-place_disabled {
  pointer-events: none;
}

::v-deep .employer-place_selected .table,
::v-deep .employer-place_selected .table:hover {
  fill: red;
  cursor: auto;
}

h3 {
  margin-top: 0px;
}

::v-deep svg {
  height: 100%;
  width: 100%;
}

::v-deep .table:hover {
  cursor: pointer;
  fill: tomato;
}
</style>
