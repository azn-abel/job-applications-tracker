import React, { useEffect, useRef } from "react";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import * as d3 from "d3";

const SankeyChart = ({
  applications,
  interviews,
  offers,
  noResponse,
  rejectionsNoInterview,
  applicationsNoResponse,
  interviewsNoResponse,
  interviewsRejected,
}) => {
  const ref = useRef();

  useEffect(() => {
    const width = 600;
    const height = 300;

    const rawNodes = [
      { name: "Applications" }, // 0
      { name: "Interviews" }, // 1
      { name: "Offers" }, // 2
      { name: "Rejected" }, // 3
      { name: "No Response" }, // 4
    ];

    const rawLinks = [
      { source: 0, target: 1, value: interviews },
      { source: 0, target: 3, value: rejectionsNoInterview },
      {
        source: 0,
        target: 4,
        value: applicationsNoResponse,
      },

      // Interviews → Offers or Drop
      { source: 1, target: 2, value: offers },
      { source: 1, target: 3, value: interviewsRejected },
      { source: 1, target: 4, value: interviewsNoResponse },
    ];

    const filteredLinks = rawLinks.filter((link) => link.value > 0);

    const data = {
      nodes: rawNodes,
      links: filteredLinks,
    };

    const svg = d3.select(ref.current).attr("viewBox", [0, 0, width, height]);
    svg.selectAll("*").remove();

    const { nodes, links } = sankey()
      .nodeWidth(15)
      .nodePadding(30)
      .extent([
        [1, 20],
        [width - 1, height - 20],
      ])(data);

    svg
      .append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", (d) => d?.x0 || 0)
      .attr("y", (d) => d?.y0 || 0)
      .attr("height", (d) => (d && d.y1 && d.y0 ? d.y1 - d.y0 : 0))
      .attr("width", (d) => (d && d.x1 && d.x0 ? d.x1 - d.x0 : 0))
      .attr("fill", "#4f46e5");

    svg
      .append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", "#a5b4fc")
      .attr("stroke-width", (d) => Math.max(1, d.width))
      .attr("opacity", 0.5);

    svg
      .append("g")
      .style("font", "12px sans-serif")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", (d) => (d && d.x0 ? d.x0 - 6 : 0))
      .attr("y", (d) => (d && d.y1 && d.y0 ? (d.y1 + d.y0) / 2 : 0))
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text((d) => `${d.name} (${d.value || 0})`)
      .filter((d) => d.x0 < width / 2)
      .attr("x", (d) => d.x1 + 6)
      .attr("text-anchor", "start")
      .text((d) => `${d.name} (${d.value || 0})`);
  }, [applications, interviews, offers]);

  return (
    <svg
      ref={ref}
      style={{
        width: "80%",
        maxWidth: "768px",
        height: "80%",
        maxHeight: "512px",
      }}
    />
  );
};

export default SankeyChart;
