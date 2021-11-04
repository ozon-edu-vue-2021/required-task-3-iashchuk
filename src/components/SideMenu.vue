<template>
  <div class="menu">
    <div class="toolbar">
      <div class="toolbar__header">
        <template v-if="!isUserOpenned">
          <h3>Информация</h3>
        </template>
        <template v-else>
          <div class="action">
            <div class="arrow" @click="closeProfile"></div>
          </div>
          <h3>Профиль</h3>
        </template>
      </div>
      <div class="toolbar__actions"></div>
    </div>
    <div class="content">
      <div v-if="!isUserOpenned" class="legend">
        <div class="legend__data">
          <div v-if="draggableLegend.length > 0" class="legend__items">
            <Draggable v-model="draggableLegend">
              <LegendItem
                v-for="(item, index) in draggableLegend"
                :key="index"
                :color="item.color"
                :text="item.text"
                :counter="item.counter"
                class="legend__item"
              />
            </Draggable>
            <span class="legend__reference"
              >Для того, чтобы установить сотруднику незакрепленное место, его
              предварительно необходимо закрепить за подразделением</span
            >
          </div>
          <span v-else class="legend--empty"> Список пуст </span>
        </div>
        <div class="legend__chart">
          <PieChart ref="chart" />
        </div>
      </div>
      <div v-else class="profile">
        <PersonCard v-if="person" :person="person" />
        <div v-else-if="selectedTable && department" class="profile__empty">
          Стол <b>№{{ selectedTable._id }}</b> закреплен за
          <b>{{ department.text }}</b
          >, но не занят
        </div>
        <div v-else class="profile__empty">
          Нет информации по выбранному столу
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import { Doughnut as PieChart } from "vue-chartjs";
import LegendItem from "./SideMenu/LegendItem.vue";
import PersonCard from "./SideMenu/PersonCard.vue";

const CHART_OPTIONS = {
  borderWidth: "10px",
  legend: {
    display: false,
  },
};

export default {
  props: {
    legend: {
      type: Array,
      default: () => [],
    },
    isUserOpenned: {
      type: Boolean,
      default: false,
    },
    person: {
      type: Object,
      default: null,
    },
    department: {
      type: Object,
      default: null,
    },
    selectedTable: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      draggableLegend: [],
      needRenderChart: true,
    };
  },
  components: {
    LegendItem,
    PersonCard,
    Draggable,
    PieChart,
  },
  created() {
    this.draggableLegend = this.legend;
  },
  mounted() {
    this.makeChart();
  },
  updated() {
    if (this.needRenderChart) {
      this.makeChart();
      this.needRenderChart = false;
    }
  },

  watch: {
    isUserOpenned() {
      this.needRenderChart = !this.isUserOpenned;
    },
  },
  computed: {
    chartData() {
      return {
        labels: this.legend.map((legendItem) => legendItem.text),
        datasets: [
          {
            label: "Легенда",
            backgroundColor: this.legend.map((legendItem) => legendItem.color),
            data: this.legend.map((legendItem) => legendItem.counter),
          },
        ],
      };
    },
  },
  methods: {
    closeProfile() {
      this.$emit("setUserOpenned", false);
    },
    makeChart() {
      this.$refs?.chart?.renderChart(this.chartData, CHART_OPTIONS);
    },
  },
};
</script>

<style scoped>
.menu {
  border-left: 1px solid #ccd8e4;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar .toolbar__actions button {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08rem;
  padding: 2px 6px;
}

.toolbar__header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.toolbar__header .action {
  cursor: pointer;
  margin-right: 14px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toolbar__header .action .arrow {
  width: 10px;
  height: 10px;
  border-top: 2px solid blue;
  border-right: 2px solid blue;
  transform: rotate(-135deg);
}

h3 {
  margin: 0;
}

.content {
  flex: 1;
}

.content .legend {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.content .legend .legend__data {
  display: flex;
  height: 100%;
}

.content .legend .legend__items {
  flex: 1;
  width: 100%;
}

.content .legend .legend__items .legend__item:not(:first-child) {
  margin-top: 16px;
}

.content .legend .legend__items .legend__item {
  cursor: grabbing;
}

.content .legend .legend__items .legend__item.sortable-chosen {
  opacity: 25%;
}

.content .legend .legend--empty {
  align-self: center;
  width: 100%;
  text-align: center;
}

.content .legend__reference {
  display: flex;
  margin-top: 20px;
  font-size: 12px;
}

.profile {
  padding-top: 20px;
}
</style>
