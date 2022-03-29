<template>
  <div id="gbar" />
</template>

<script>
import * as d3 from "d3"
import { GroupedBarChart } from "./grouped-bar.js"
import { data } from './mock.js'
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
      keys: ['targetValue', 'realValue']
    })
  },
}
</script>

<style lang="scss">
</style>
