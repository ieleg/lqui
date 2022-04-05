import * as d3 from "d3"

export function GroupedBarChart(
  data,
  {
    id,
    keys = [],
    groupKey = "date",
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    marginTop = 30, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 37, // left margin, in pixels
    width = 728, // outer width, in pixels
    height = 310, // outer height, in pixels
    xDomain, // array of x-values
    xRange = [marginLeft, data.length > 10 ? data.length / 10 * (width - marginRight) : width - marginRight], // [xmin, xmax]
    xPadding = 0.65, // amount of x-range to reserve to separate groups
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [ymin, ymax]
    zDomain, // array of z-values
    y2
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x)
  const Y = d3.map(data, y2)
  const Z = d3.map(data, z)
  console.log(Y);
  
  if (xDomain === undefined) xDomain = X
  if (zDomain === undefined) zDomain = Z
  // 最大的值
  const yMax = d3.max(data, d => d3.max(keys, key => d[key]))
  xDomain = new d3.InternSet(xDomain)
  yDomain = [0, yMax]
  zDomain = new d3.InternSet(zDomain)
  const y2Domain = [0, d3.max(Y)]

  const I = d3
    .range(X.length)

  const color = d3.scaleOrdinal().range(["#FF8B7B", "#877BF4"])

  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding)
  const yScale = yType(yDomain, yRange).nice()
  // 曲线
  const y2Scale = yType(y2Domain, yRange).nice()
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0)

  const yAxis = d3
    .axisLeft(yScale)
    .ticks(5)
    .tickFormat(d => {
      return yMax > 10e3 ? d / 10e3 + "万" : d
    })
  const y2Axis = d3
  .axisRight(y2Scale)
  // .tickValues([0, 100])
  // .ticks(10,',%')
  .tickFormat(d3.format(".0%"))
  .tickSize(0)

  const line = d3.line()
  .defined(i => Y[i])
  .curve(d3.curveNatural)
  .x(i => xScale(X[i]))
  .y(i => y2Scale(Y[i]))
  const x1 = d3
    .scaleBand()
    .domain(keys)
    .rangeRound([0, xScale.bandwidth()])
    .padding(0.25)

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
  // .attr("viewBox", [0, 0, width, height])
  // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(g =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1)
    )
      svg.append('g')
    .attr("transform", `translate(${width-marginRight},0)`)
    .call(y2Axis)
    .call(g => g.select(".domain").remove())


  // x-滚轮
  const overwidth = data.length > 10 ? data.length / 10 * (width - marginRight) : width - marginRight

  const parent = d3.create("div")

  // svg
  //   .append("g")
  //   .attr("transform", `translate(0,${height - marginBottom})`)
  //   .call(xAxis)
  const node = Object.assign(svg.node(), { value: null })
  if (id) {
    const root = document.querySelector(id)
    root.append(node)
    const scroll = parent
      .append("div")
      .attr('class', 'scroll-bar')
      .style("overflow-x", data.length > 10 ? "scroll" : 'none')
      .style("-webkit-overflow-scrolling", "touch")
    const p =  scroll
      .append("svg")
      .attr("width", overwidth)
      .attr("height", height)
      .style("display", "block")

      .call(svg =>
        svg
          .append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(xAxis)
      )
      p      .append("path")
      .attr("fill", "none")
      .attr("stroke", '#BAB4EF')
      .attr("stroke-width", '1.5px')
      .attr('filter', 'drop-shadow(2px 2px 4px rgba(138, 128, 234, 0.2)')
      .attr("d", line(I))
      p
      .append("g")
      .selectAll("g")
      .data(data)

      .join("g")
      .attr("transform", d => `translate(${xScale(d[groupKey])},0)`)
      .selectAll("rect")
      .data(d => {
        let allVals = []
        let desiredKeys = keys
        desiredKeys.forEach(dKey => {
          let val = {
            key: dKey,
            value: d[dKey]
          }
          allVals.push(val)
        })
        return allVals
      })
      .join("rect")
      .transition() // <---- Here is the transition
.duration(800)
      .attr("x", d => x1(d.key))
      .attr("y", d => yScale(d.value))
      .attr("rx", "3")
      .attr("width", x1.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.value))
      .attr("fill", d => color(d.key))
      .attr('opacity', .7)

    root.append(scroll.node())
  } else {
    return node
  }
}
