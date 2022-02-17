import * as d3 from "d3"

export const BarChart = (
  data,
  {
    id,
    width = 600,
    height = 480,
    margin = [20, 20, 20, 20], // 画布margin 上右下左
    xRange = [margin[3], width - margin[1]], // 从左往右 -去margin
    yRange = [height - margin[0], margin[2]], // 从下往上 -去margin
    xPadding = 0.00000001,
    xScaleType = d3.scaleBand,
    yScaleType = d3.scaleLinear,
    x = d => d.x,
    y = d => d.y
  }
) => {
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const I = d3.range(X.length)

  const xScale = xScaleType()
    .domain(d3.extent(X))
    .range(xRange)
    .padding(xPadding)
  const yScale = yScaleType().domain(d3.extent(Y)).range(yRange)
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin[2]})`)
    .call(xAxis)
  svg.append("g").attr("transform", `translate(${margin[3]})`).call(yAxis)
  const bar = svg
    .append("g")
    .attr("fill", "grey")
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", i => xScale(X[i]))
    .attr("y", i => yScale(Y[i]))
    .attr("height", i => yScale(0) - yScale(Y[i]))
    .attr("width", xScale.bandwidth())
  const init = () => {}

  const update = () => {}

  const destory = () => {}
  const node = Object.assign(svg.node(), { value: null })
  if (id) {
    document.querySelector(id).append(node)
  } else {
    return node
  }
}
