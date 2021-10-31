<template>
  <div id="app">
    <div class="office">
      <Map
        :tables="tablesWithGroupColor"
        :selectedTable="selectedTable"
        @setUserOpenned="isUserOpenned = $event"
        @selectTable="handleSelectTable"
      />
      <SideMenu
        :legend="legendWithCounter"
        :isUserOpenned="isUserOpenned"
        :selectedTable="selectedTable"
        :department="selectedDepartment"
        :person="selectedTableUser"
        @setUserOpenned="isUserOpenned = $event"
      />
    </div>
  </div>
</template>

<script>
import Map from "@/components/Map.vue";
import SideMenu from "@/components/SideMenu.vue";
import people from "@/assets/data/people.json";
import legend from "@/assets/data/legend.json";
import tables from "@/assets/data/tables.json";
import { getLegendCount, getGroupColor } from "@/helpers";

export default {
  name: "App",
  components: {
    Map,
    SideMenu,
  },
  data() {
    return {
      people: [],
      legend: [],
      tables: [],
      selectedTable: null,
      isUserOpenned: false,
    };
  },
  watch: {
    isUserOpenned(openned) {
      if (!openned) {
        this.selectedTable = null;
      }
    },
  },
  computed: {
    selectedTableUser() {
      return this.people.find(
        ({ table_id }) => table_id === this.selectedTable?._id
      );
    },
    selectedDepartment() {
      return this.legend.find(
        ({ group_id }) => group_id === this.selectedTable?.group_id
      );
    },
    legendWithCounter() {
      const result = this.legend.map((item) => ({
        ...item,
        counter: getLegendCount(this.tables, item.group_id),
      }));

      const freeTables = this.tables.filter((item) => item.group_id === null);

      return [
        ...result,
        { text: "Незакрепленные места", counter: freeTables.length },
      ];
    },
    tablesWithGroupColor() {
      return this.tables.map((table) => ({
        ...table,
        groupColor: getGroupColor(this.legend, table.group_id),
      }));
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.tables = tables;
      this.people = people;
      this.legend = legend;
    },
    handleSelectTable(table) {
      this.selectedTable = table;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  background-color: #fafafa;
  padding: 24px;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

* {
  box-sizing: border-box;
}

h3 {
  margin-top: 0px;
}

.office {
  display: grid;
  grid-template-columns: 1fr 320px;
  border-radius: 6px;
  border: 1px solid #ccd8e4;
  height: 100%;
  background: white;
  max-width: 1500px;
  margin: 0 auto;
}
</style>
