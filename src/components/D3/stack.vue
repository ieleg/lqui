<template>
  <div id="stack" />
</template>

<script>
import { render } from "./stacks.js"
import { data } from "./mock/stacks.js"
import { onMounted } from "@vue/composition-api"
export default {
  setup() {
    onMounted(() => {
      render(data, {
        id: "#stack"
      })
    })
  }
}
</script>

<style lang="scss"></style>
