import * as d3 from "d3"

export const BarChart = (
  data,
  {
    id,
    width = 400,
    height = 400,
    margin = [0, 10, 40, 28], // 画布margin 上右下左
    miniMargin = [0, 40, 0, 28], // 画布margin 上右下左
    mainHeight = 300,
    miniHeight = height -
      mainHeight -
      margin[0] -
      margin[3] -
      miniMargin[0] -
      miniMargin[3],
    xRange = [margin[3], width - margin[1]], // 从左往右 -去margin
    yRange = [mainHeight - margin[0], margin[2]], // 从下往上 -去margin
    miniyRange = [miniMargin[2], miniHeight - miniMargin[0]], // 从下往上 -去margin
    xPadding = 0.6,
    xScaleType = d3.scaleBand,
    yScaleType = d3.scaleLinear,
    x = d => d.x,
    y = d => d.y,
    color = "#7783d3"
  }
) => {
  const minimapPositionTranslate =
    "" +
    miniMargin[3] +
    "," +
    parseFloat(margin[0] + mainHeight + margin[2] + miniMargin[0])
  const mainWidth = width - margin[1] - margin[3]
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const xDomain = new d3.InternSet(X)
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]))
  const xScale = xScaleType().domain(X).range(xRange).padding(xPadding)
  const yScale = yScaleType()
    .domain([0, d3.max(Y)])
    .range(yRange)
    .nice()
  const x_time = d3
    .scaleTime()
    .domain(d3.extent(X).map(item => new Date(item)))
    .range(xRange)
    .nice()
  const xAxis = d3
    .axisBottom(x_time)
    .tickFormat(d3.timeFormat("%Y-%m"))
    // .tickValues(d3.timeDay.range(new Date(2015, 0, 2), new Date(2015, 0, 8), 2))
    .tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0)
  // mini area
  const miniXScale = d3
    .scaleBand()
    .domain(X)
    .range([0, mainWidth])
    .padding(xPadding)
  const miniYScale = d3
    .scaleLinear()
    .domain([0, d3.max(Y)])
    .range(miniyRange)
  const mainXZoom = d3
    .scaleLinear()
    .range([0, mainWidth])
    .domain([0, mainWidth])
  function update(width) {
    const transform =
      mainWidth - width > 50
        ? "translate(0,0)rotate(0)"
        : "translate(15,10)rotate(30)"
    const ticks = width < mainWidth / 3 ? 20 : 10
    d3.selectAll(".bars rect")
      .data(I)
      .attr("x", i => x_time(new Date(X[i])) - xScale.bandwidth() / 2)
      .attr("y", i => yScale(Y[i]))
      .attr("height", i => yScale(0) - yScale(Y[i]))
      .attr("width", xScale.bandwidth())
    svg
      .selectAll(".x-axis")
      .call(xAxis.ticks(ticks))
      .selectAll(".tick text")
      .transition()
      .duration(300)
      .attr("transform", transform)
    // .attr("fill", 'red')
  }
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null)
  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [mainWidth, miniHeight]
    ])
    .on("brush", brushmove)
  function brushmove(event) {
    // const extentX = [0, 200]
    const extentX = event.selection

    const selected = miniXScale.domain().filter(i => {
      return (
        extentX[0] - miniXScale.bandwidth() + 1e-2 <= miniXScale(i) &&
        miniXScale(i) <= extentX[1] - 1e-2
      )
    })
    // console.log(event, selected)

    d3.select(".miniGroup")
      .selectAll("rect")
      .style("fill", i => {
        return ~selected.indexOf(X[i]) ? "red" : "blue"
      })

    let originalRange = mainXZoom.range()
    mainXZoom.domain(extentX)

    xScale.range([mainXZoom(originalRange[0]), mainXZoom(originalRange[1])])
    x_time.range([mainXZoom(originalRange[0]), mainXZoom(originalRange[1])])
    d3.select(".x-axis").call(xAxis)
    console.log(x_time.range(), x_time.domain(), originalRange, extentX)
    update(extentX[1] - extentX[0])
  }

  const miniGroup = svg
    .append("g")
    .attr("class", "miniGroup")
    .attr("transform", "translate(" + minimapPositionTranslate + ")")

  const brushGroup = svg
    .append("g")
    .attr("class", "brushGroup")
    .attr("transform", "translate(" + minimapPositionTranslate + ")")
    .append("g")
    .attr("class", "brush")
    .call(brush)
  brushGroup.selectAll("rect").attr("width", mainWidth)
  brushGroup
    .select(".overlay")
    .each(d => {
      console.log(d)
      return (d.type = "selection")
    })
    .on("mousedown touchstart", brushcenter)

  const miniBars = miniGroup.selectAll(".mini-bar").data(I)
  function brushcenter(event, node) {
    let selection = d3.brushSelection(brushGroup.node()),
      size = selection[1] - selection[0],
      range = miniXScale.range(),
      cx = event.offsetX,
      x0 = cx - size / 2,
      x1 = cx + size / 2,
      y1 = d3.max(range) + miniXScale.bandwidth(),
      pos = x1 > y1 ? [y1 - size, y1] : x0 < 0 ? [0, size] : [x0, x1]
    brushGroup.call(brush.move, pos)
  }
  miniBars
    .enter()
    .append("rect")
    .attr("class", "ddbar")
    .attr("x", i => miniXScale(X[i]))
    .attr("y", i => miniHeight - miniYScale(Y[i]))
    .attr("width", miniXScale.bandwidth())
    .attr("height", i => miniYScale(Y[i]))
    .style("fill", "grey")
  console.log(312, miniYScale(23), miniBars)

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${mainHeight})`)
    .call(xAxis)
    .selectAll(".tick text")
    .attr("transform", "translate(0,10)rotate(30)")
    // .style("text-anchor", "end")
    .style("font-size", 10)
  svg
    .append("g")
    .attr("transform", `translate(${margin[3]})`)
    .call(yAxis)
    .call(g =>
      g
        .selectAll(".tick line")
        .attr("x2", 0)
        .clone()
        .attr("x2", width - margin[1] - margin[3])
        .attr("stroke-opacity", 0.2)
    )
    .selectAll(".domain")
    .style("opacity", 0)
  const bar = svg
    .append("g")
    .attr("class", "bars")
    .attr("fill", color)
    .selectAll("rect")
    .data(I)
    .join("rect")
    // .attr("x", i => {
    //   return x_time(new Date(X[i])) - xScale.bandwidth() / 2
    // })
    // .attr("y", i => yScale(Y[i]))
    // .attr("height", i => yScale(0) - yScale(Y[i]))
    // .attr("width", xScale.bandwidth())
    .on("mouseover", function (e, d, i) {
      tooltip
        .html(`<div>y: ${Y[d]}</div><div>x: ${X[d]}</div>`)
        .style("visibility", "visible")
      d3.select(this).transition().attr("fill", "#000000")
    })
    .on("mousemove", function (e) {
      tooltip
        .style("top", e.pageY - 10 + "px")
        .style("left", e.pageX + 10 + "px")
    })
    .on("mouseout", function (e) {
      tooltip.html(``).style("visibility", "hidden")
      d3.select(this).transition().attr("fill", color)
    })

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "d3-bar-tooltip")
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
  brushGroup.call(brush.move, [mainWidth / 3, mainWidth])
  if (id) {
    document.querySelector(id).append(node)
  } else {
    return node
  }
}
