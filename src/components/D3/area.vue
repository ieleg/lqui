<template>
  <div id="area" />
</template>

<script>
import { render } from "./area.js"
import { data } from "./mock/area.js"

export default {
  mounted() {
    render(data, {
      id: "#area",
      x: d => d.key,
      y: d => +d.value
    })
  }
}
</script>

<style lang="scss"></style>
