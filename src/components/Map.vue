<template>
  <div class="map" @click="handleOutsideTableClick">
    <h3>Карта офиса</h3>
    <div v-if="!isLoading" class="map-root">
      <MapSVG ref="svg" />
      <TableSVG v-show="false" ref="table" />
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import * as d3 from "d3";
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
      svg: null,
      g: null,
      tableSVG: null,
    };
  },
  mounted() {
    this.isLoading = true;

    this.svg = d3.select(this.$refs.svg);
    this.g = this.svg.select("g");
    this.tableSVG = d3.select(this.$refs.table);

    if (this.g) {
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
    handleOutsideTableClick() {
      this.$emit("update:isUserOpenned", false);
    },
    handleTableClick(evt) {
      evt.stopPropagation();

      const tableId = Number(evt.currentTarget.getAttribute("id"));
      const table = this.tables.find((item) => item._id === tableId);
      this.$emit("onSelectTable", table);
      this.$emit("update:isUserOpenned", true);
    },
    drawSelectedTable(tableId) {
      d3.select(`.employer-place_selected`).classed(
        "employer-place_selected",
        false
      );

      if (tableId) {
        d3.select(`.employer-place[id="${tableId}"]`).classed(
          "employer-place_selected",
          true
        );
      }
    },

    drawTables() {
      const svgTablesGroupPlace = this.g
        .append("g")
        .classed("groupPlaces", true);

      this.tables.map((table) => {
        const targetSeat = svgTablesGroupPlace
          .append("g")
          .attr("transform", `translate(${table.x}, ${table.y}) scale(0.5)`)
          .attr("id", table._id)
          .classed("employer-place", true)
          .classed("employer-place_disabled", !Number.isFinite(table.group_id))
          .on("click", this.handleTableClick);

        targetSeat
          .append("g")
          .attr("transform", `rotate(${table.rotate || 0})`)
          .attr("group_id", table.group_id)
          .classed("table", true)
          .html(this.tableSVG.html())
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
