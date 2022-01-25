<template>
  <div id="line" />
</template>

<script>
import * as d3 from "d3"
import { LineChart } from "./tip.js"
export default {
  props: {
    /**
     * 改变傅里叶展开层级
     */
    n: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    }
  },

  mounted() {
    const data = d3.range(-Math.PI * 2, Math.PI * 2, 1 / 256).map((x, k) => {
      return {
        y: this.fft(k % 2 ? this.n : 0, x),
        x: x,
        name: "名称" + (k % 2)
      }
    })
    LineChart(data, {
      id: "#line",
      x: d => d.x,
      y: d => d.y,
      z: d => d.name,
      yLabel: "y",
      height: 500,
      color: "#4a61d9"
    })
  },
  methods: {
    fft(n, x) {
      let sum = 0
      for (let i = 0; i <= Math.abs(n); i++) {
        sum = Math.sin(x * (2 * i + 1)) / (2 * i + 1) + sum
      }
      return (4 / Math.PI) * sum
    }
  }
}
</script>

<style lang="scss">
.pie {
  &:hover {
    fill-opacity: 0.8;
  }
}

.pie-tooltip {
  position: absolute;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.3s;

  &::after {
    position: absolute;
    top: -12px;
    left: 50%;
    display: block;
    border-width: 6px;
    border-style: solid dashed dashed dashed;
    border-color: transparent transparent #fff transparent;
    content: "";
    font-size: 0;
    line-height: 0;
    transform: translateX(-50%);
  }
}
</style>
