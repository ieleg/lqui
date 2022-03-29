import * as d3 from "d3"

export function GroupedBarChart(
  data,
  {
    id,
    keys = [],
    groupKey="date",
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xDomain, // array of x-values
    xRange = [marginLeft, width - marginRight], // [xmin, xmax]
    xPadding = 0.5, // amount of x-range to reserve to separate groups
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [ymin, ymax]
    zDomain, // array of z-values
    zPadding = 0.05, // amount of x-range to reserve to separate bars
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const Z = d3.map(data, z)

  // Compute default domains, and unique the x- and z-domains.
  if (xDomain === undefined) xDomain = X
  if (zDomain === undefined) zDomain = Z
  xDomain = new d3.InternSet(xDomain)
  yDomain = [0, d3.max(data, d => d3.max(keys, key => d[key]))]
  zDomain = new d3.InternSet(zDomain)

  // Omit any data not present in both the x- and z-domain.
  const I = d3
    .range(X.length)
    .filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]))

   const color = d3.scaleOrdinal()
    .range(["#2a73b8","#9bc2e7"])

  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding)
  const xzScale = d3
    .scaleBand(zDomain, [0, xScale.bandwidth()])
    .padding(zPadding)
  const yScale = yType(yDomain, yRange).nice()
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale).ticks(10)
const x1 = d3.scaleBand()
.domain(keys)
.rangeRound([0, xScale.bandwidth()])
.padding(0.45)
  // Compute titles.
  if (title === undefined) {
    const formatValue = yScale.tickFormat(100, yFormat)
    title = i => `${X[i]}\n${Z[i]}\n${formatValue(Y[i])}`
  } else {
    const O = d3.map(data, d => d)
    const T = title
    title = i => T(O[i], i, data)
  }

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

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
    .call(g =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)
    )

    svg.append("g")
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", d => `translate(${xScale(d[groupKey])},0)`)
    .selectAll("rect")
    .data(d => {
        let allVals = [];
        let desiredKeys = keys
        desiredKeys.forEach((dKey) => {
          let val = {
            key: dKey,
            value: d[dKey]
          }
          allVals.push(val);
        })
        return allVals;
      })
    .join("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => yScale(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.value))
      .attr("fill", d => color(d.key));

  // svg.append("g")
  //     .call(xAxis);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
  if (id) {
    document.querySelector(id).append(node)
  }
  const node = Object.assign(svg.node(), { value: null })
  if (id) {
    document.querySelector(id).append(node)
  } else {
    return node
  }
}
