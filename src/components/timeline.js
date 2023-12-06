'use client'

import * as d3 from 'd3';
import { useRef, useEffect } from 'react';
import '@/app/globals.css'

const Timeline = () => {
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

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

        const tooltipDiv = d3.select(tooltipRef.current)
            .style("position", "fixed")
            .style("top", "0")
            .style("right", "0")
            .style("height", "100%")
            .style("width", "50%") // Set the width of the fixed div
            .style("overflow-y", "auto")

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

        events.append("text")
            .attr("class", "event-label")
            .attr("x", 25)
            .attr("y", 5)
            .text(d => d.Year + ' - ' + d.Event)
            .on("mouseover", function (event, d) {
                // Show tooltip on hover
                tooltipDiv.html(`
                    <h3>${d.Event}</h3>
                    <img src="${d.Image}" />
                    <p>${d.Description}</p>
                `);
            })
            .on("mouseout", function () {
                // Hide tooltip on mouseout
                tooltipDiv.html("");
            });

            
        events.append("line")
            .attr("class", "event-line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 20)
            .attr("y2", 0)
            .style("stroke", "black")
            .style("stroke-width", 1);
        });
    }, []);

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <svg ref={svgRef} className='place-self-center' />
            <div ref={tooltipRef} className='tooltip-div'></div>
        </div>
    );
}

export default Timeline;