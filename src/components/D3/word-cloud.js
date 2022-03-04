import * as d3 from "d3"
import d3Cloud from "d3-cloud"
export const render = (
  data,
  {
    id,
    marginTop = 20,
    marginRight = 30,
    marginBottom = 30,
    marginLeft = 40,
    width = 480,
    height = 600,
    maxLength = 100,
    padding = 2,
    rotate = 0,
    colors = d3.schemeCategory10,
    name = d => d.name
  }
) => {
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("text-anchor", "middle")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

  const wordsData = data.map((item, index) => {
    let size = 30 - index < 12 ? 12 : 30 - index
    return {
      ...item,
      text: name(item),
      size,
      index
    }
  })

  const g = svg
    .append("g")
    .attr("transform", `translate(${marginLeft},${marginTop})`)

  const cloud = d3Cloud()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .words(wordsData)
    .padding(padding)
    .rotate(rotate)
    .spiral("rectangular")
    .fontSize(d => d.size)
    .on("word", ({ size, x, y, rotate, text, index }) => {
      g.append("text")
        .attr("font-size", size)
        .style("fill", colors[index % 10])
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .text(text)
        .on("mouseover", function (e, d, i) {
          tooltip.html(`<div>${text}</div>`).style("visibility", "visible")
          d3.select(this)
            .transition()
            .attr("fill", "#000000")
            .style("cursor", "default")
            .style("opacity", 0.8)
        })
        .on("mousemove", function (e) {
          tooltip
            .style("top", e.pageY - 10 + "px")
            .style("left", e.pageX + 10 + "px")
        })
        .on("mouseout", function (e) {
          tooltip.html(``).style("visibility", "hidden")
        })
    })

  cloud.start()
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "d3-cloud-tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("padding", "10px")
    .style("background", "rgba(0,0,0,.6)")
    .style("box-shadow", "0px 12px 30px rgba(227, 229, 247, 0.3)")
    .style("border-radius", "4px")
    .style("color", "#fff")
    .style("font-size", "14px")
    .text("a simple tooltip")
  const node = Object.assign(svg.node(), { value: null })
  if (id) {
    document.querySelector(id).append(node)
  } else {
    return node
  }

  const tipDetail = d3
    .create("svg")
    .attr("width", 200)
    .attr("height", 200)
    .attr("viewBox", [0, 0, 200, 200])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("style", "border: 1px solid #000")
    .attr("class", "d3-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(250,250,251,.6)")
}
