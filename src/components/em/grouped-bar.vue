<template>
  <div id="gbar" style="width: 700px" />
</template>

<script>
import * as d3 from "d3"
import { GroupedBarChart } from "./grouped-bar.js"
import { data } from "./mock.js"
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  mounted() {
    GroupedBarChart(data, {
      id: "#gbar",
      x: d => d.date,
      y2: d => d.lineValue,
      keys: ["targetValue", "realValue"]
    })
  }
}
</script>

<style lang="scss">
.scroll-bar {
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 4px;
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background: #c7c6dc;
    border-radius: 4px;
  }
}
</style>
