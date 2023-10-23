// Load the CSV data
d3.csv('data/shopping_trends.csv').then(data => {

    // Aggregate the data to compute the total purchase amount for each category
    const aggregatedData = d3.rollups(
        data,
        v => d3.sum(v, leaf => leaf['Purchase Amount (USD)']),
        d => d.Category
    ).map(([key, value]) => ({ "Category": key, "Purchase Amount (USD)": value }));

    const svgWidth = 500;
    const svgHeight = 500;
    const radius = Math.min(svgWidth, svgHeight) / 2 - 40;

    const colors = d3.scaleOrdinal()
                     .domain(aggregatedData.map(d => d["Category"]))
                     .range(["steelblue", "lightblue", "royalblue", "midnightblue"]);

    const svg = d3.select('body')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`);

    const pie = d3.pie()
                  .sort(null)
                  .value(d => d["Purchase Amount (USD)"]);

    const arc = d3.arc()
                  .innerRadius(0)
                  .outerRadius(radius);

    const g = svg.selectAll('.arc')
                 .data(pie(aggregatedData))
                 .enter().append('g')
                 .attr('class', 'arc');

    g.append('path')
     .attr('d', arc)
     .style('fill', d => colors(d.data["Category"]))
     .transition()
     .duration(2000)
     .attrTween('d', function(d) {
         const i = d3.interpolate(d.startAngle, d.endAngle);
         return function(t) {
             d.endAngle = i(t);
             return arc(d);
         };
     });

    g.append('text')
     .attr('transform', d => `translate(${arc.centroid(d)})`)
     .attr('dy', '.35em')
     .text(d => d.data["Category"])
     .style('text-anchor', 'middle')
     .attr('fill', 'white');
});
