// Load the CSV data
d3.csv('data/shopping_trends.csv').then(data => {

    const svgWidth = 600;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    const svg = d3.select('body')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const xScale = d3.scaleLinear()
                    .domain([d3.min(data, d => +d.Age), d3.max(data, d => +d.Age)])
                    .range([margin.left, svgWidth - margin.right]);

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => +d["Purchase Amount (USD)"])])
                    .range([svgHeight - margin.bottom, margin.top]);

    // Scatter plot points
    svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.Age))
        .attr('cy', d => yScale(d["Purchase Amount (USD)"]))
        .attr('r', 5)
        .attr('fill', 'steelblue');

    // X-axis
    svg.append('g')
        .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', svgWidth / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Age');

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
