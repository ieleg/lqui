<template>
  <div id="line" />
</template>

<script>
import * as d3 from "d3"
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    console.log(new d3.InternSet([1, 1, 1]))
    const map = d3.map([{ name: "foo" }, { name: "bar" }], function (d) {
      return d.name
    })
    console.log(d3.range(-Math.PI * 2, Math.PI * 2, 1 / 2))
    var data = d3.range(-Math.PI * 2, Math.PI * 2, 1 / 256).map((x, k) => ({
      value: k % 2 ? Math.sin(x) : Math.cos(x),
      date: x,
      name: "名称" + (k % 2)
    }))
    const X = d3.map(data, d => d.date)
    const Y = d3.map(data, d => d.value)
    const Z = d3.map(data, () => 1)
    const O = d3.map(data, d => d)
    const zDomain = new d3.InternSet(Z)
    const I = d3.range(X.length).filter(i => zDomain.has(Z[i]))

    const width = 450
    const height = 450
    const margin = { top: 10, right: 30, bottom: 30, left: 60 }
    const xScale = d3.scaleLinear([-Math.PI * 2, Math.PI * 2], [0, width])
    const yScale = d3.scaleLinear([1, -1], [height, 0])
    const xAxis = d3.axisBottom(xScale).ticks(width / 30)
    const yAxis = d3.axisLeft(yScale).ticks(height / 60, "s")
    const group = d3.group(data, d => d.name)
    var svg = d3
      .select("#line")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)

    svg
      .append("g")
      .attr("transform", "translate(0," + height / 2 + ")")
      .call(xAxis)
      .call(g =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("y1", height / 2)

          .attr("y2", -height / 2)
          .attr("stroke-opacity", 0.1)
      )

    svg
      .append("g")
      .attr("transform", `translate(${width / 2},0)`)
      .call(yAxis)
      .call(g => g.select(".domain"))
      .call(g =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x1", width / 2)

          .attr("x2", -width / 2)
          .attr("stroke-opacity", 0.1)
      )
    const path = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.8)
      .selectAll("path")
      .data(group)
      .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d =>
        d3
          .line()
          .x(function (d) {
            return xScale(d.date)
          })
          .y(function (d) {
            return yScale(d.value)
          })(d[1])
      )
    const dot = svg.append("g").attr("display", "none")

    dot.append("circle").attr("r", 2.5)

    dot
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8)

    function pointerentered() {
      path.style("mix-blend-mode", null).style("stroke", "#ddd")
      dot.attr("display", null)
    }
    function pointermoved(event, d) {
      console.log(d)
      const [xm, ym] = d3.pointer(event)
      const i = d3.least(I, i =>
        Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)
      ) // closest point
      console.log(i)
      path.style("stroke", (d, i) => {
        console.log(d, i)
        return "red"
      })

      dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`)
      svg.property("value", O[i]).dispatch("input", { bubbles: true })
    }
    function pointerleft() {
      path.style("mix-blend-mode", "multiply").style("stroke", null)
      dot.attr("display", "none")
      svg.node().value = null
      svg.dispatch("input", { bubbles: true })
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
