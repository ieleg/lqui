<template>
  <div id="cloud" />
</template>

<script>
import { render } from "./word-cloud.js"
import { data } from "./mock/word.js"

export default {
  mounted() {
    render(data, {
      id: "#cloud",
      name: d => d.stWords
    })
  }
}
</script>

<style lang="scss"></style>
