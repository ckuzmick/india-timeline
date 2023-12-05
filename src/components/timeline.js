'use client'

import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

const Timeline = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        const margin = { top: 30, right: 50, bottom: 30, left: 50 },
            width = 700 - margin.left - margin.right,
            height = 2 * window.innerHeight - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "plot")
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)

        d3.csv('https://raw.githubusercontent.com/ckuzmick/d3-file-hosting/main/data.csv').then(data => {

        const y = d3.scaleLinear()
            .domain([1850, 1940])
            .range([0, height]);

        svg.append("g")
            .call(d3.axisLeft(y).tickValues([]))

        const events = svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("g")
            .attr("class", "event")
            .attr("transform", d => `translate(0, ${y(+d.Year)})`);

        // Add text labels for events
        events.append("text")
            .attr("class", "event-label")
            .attr("x", 10)
            .attr("y", 5)
            .text(d => d.Event);

        // Add lines connecting events to the axis
        events.append("line")
            .attr("class", "event-line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 5) // align with the axis
            .attr("y2", 0)
            .style("stroke", "black")
            .style("stroke-width", 2);
        });
    }, []); // <-- closing parenthesis for useEffect hook

    return <svg ref={svgRef} className='place-self-center'/>;
}

export default Timeline;