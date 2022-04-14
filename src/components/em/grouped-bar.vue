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
    background: #fff;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c7c6dc;
    border-radius: 4px;
  }
}

.d3-gmv-tooltip {
  z-index: 0;
  display: flex;
  width: 156px;
  height: 80px;
  flex-direction: column;
  justify-content: center;
  padding: 6px 10px;
  background: rgba(63, 61, 88, 0.85);
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;

  &-target {
    width: 6px;
    height: 6px;
    background: #ff8b7b;
    border-radius: 2px;
  }

  &-real {
    width: 6px;
    height: 6px;
    background: #877bf4;
    border-radius: 2px;
  }

  &-line {
    width: 12px;
    height: 2px;
    background: #bab4ef;
    border-radius: 2px;
  }

  &-title {
    width: 53px;
  }

  & > p {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin: 0;
    color: #fff;
    gap: 5px;
  }
}
</style>
