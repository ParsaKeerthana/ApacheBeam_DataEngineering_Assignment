// Load the CSV data
d3.csv('data/shopping_trends.csv').then(data => {

    // Aggregate the data to compute the total purchase amount for each category
    const aggregatedData = d3.rollups(
        data,
        v => d3.sum(v, leaf => leaf['Purchase Amount (USD)']),
        d => d.Category
    ).map(([key, value]) => ({ "Category": key, "Purchase Amount (USD)": value }));

    const svgWidth = 600;
    const svgHeight = 400;
    const barPadding = 5;
    const barWidth = (svgWidth / aggregatedData.length);
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    
    const colors = d3.scaleOrdinal()
                     .domain(aggregatedData.map(d => d["Category"]))
                     .range(["steelblue", "lightblue", "royalblue", "midnightblue"]);

    const svg = d3.select('body')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const xScale = d3.scaleBand()
                    .domain(aggregatedData.map(d => d["Category"]))
                    .range([margin.left, svgWidth - margin.right])
                    .padding(0.4);

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(aggregatedData, d => d["Purchase Amount (USD)"])])
                    .range([svgHeight - margin.bottom, margin.top]);

    // Bars
    svg.selectAll('.bar')
        .data(aggregatedData)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d["Category"]))
        .attr('y', d => yScale(d["Purchase Amount (USD)"]))
        .attr('height', d => yScale(0) - yScale(d["Purchase Amount (USD)"]))
        .attr('width', xScale.bandwidth())
        .attr('fill', d => colors(d["Category"]));

    // X-axis
    svg.append('g')
        .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', svgWidth / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Category');

    // Y-axis
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left)
        .attr('x', -svgHeight / 2)
        .attr('dy', '1em')
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Purchase Amount (USD)');
});
