// Fetch initial data and render graph
fetch('/api/spheregrid')
  .then(response => response.json())
  .then(data => initializeGraph(data));

let simulation, svg, link, node, nodesData, linksData;

function initializeGraph(data) {
  nodesData = data.nodes;
  linksData = data.links;

  svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

function arrangeRadial(nodesData) {
  const width = 1200;
  const height = 800;
  const centerX = width / 2;
  const centerY = height / 2;

  const clusterNodes = nodesData.filter(d => d.group === "role");
  const certNodes = nodesData.filter(d => d.group === "certification" || d.group === "skill" || d.group === "degree");

  const clusterRadius = 0;  // Center
  const roleRadius = 200;   // 1st Ring
  const certRadius = 350;   // 2nd Ring

  // Arrange Clusters (centered)
  const angleStepClusters = (2 * Math.PI) / clusterNodes.length;
  clusterNodes.forEach((node, i) => {
    const angle = i * angleStepClusters;
    node.x = centerX + clusterRadius * Math.cos(angle);
    node.y = centerY + clusterRadius * Math.sin(angle);
  });

  // Arrange Roles
  const roleNodes = nodesData.filter(d => d.group === "role");
  const angleStepRoles = (2 * Math.PI) / roleNodes.length;
  roleNodes.forEach((node, i) => {
    const angle = i * angleStepRoles;
    node.x = centerX + roleRadius * Math.cos(angle);
    node.y = centerY + roleRadius * Math.sin(angle);
  });

  // Arrange Certs/Skills
  const angleStepCerts = (2 * Math.PI) / certNodes.length;
  certNodes.forEach((node, i) => {
    const angle = i * angleStepCerts;
    node.x = centerX + certRadius * Math.cos(angle);
    node.y = centerY + certRadius * Math.sin(angle);
  });
}

simulation = d3.forceSimulation(nodesData)
    .force("link", d3.forceLink(linksData).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-50))  // not too strong
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(20));  // avoid overlap

  link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(linksData)
    .join("line")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", d => d.type === "discipline" ? "4 2" : "none");

  node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodesData)
    .join("circle")
      .attr("r", 12)
      .attr("fill", d => nodeColor(d))
      .call(drag(simulation));

    node.append("title")
        .text(d => 
        `Name: ${d.id}
    Group: ${d.group}
    Lane: ${d.lane}
    Acquired: ${d.acquired_date}`
        );

  simulation.on("tick", ticked);
}

function ticked() {
  link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
}

function nodeColor(d) {
  switch (d.group) {
    case "certification": return "lightgreen";
    case "skill": return "lightblue";
    case "degree": return "mediumpurple";
    case "project": return "orange";
    case "role": return "gold";
    default: return "gray";
  }
}

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

// Modal and Form Logic
const modal = document.getElementById("addNodeModal");
const btn = document.getElementById("addNodeBtn");
const span = document.getElementById("closeModal");
const form = document.getElementById("addNodeForm");

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

form.onsubmit = function(e) {
  e.preventDefault();
  
  const newNode = {
    id: document.getElementById('nodeId').value,
    group: document.getElementById('nodeGroup').value,
    lane: document.getElementById('nodeLane').value,
    acquired_date: document.getElementById('nodeDate').value
  };

  fetch('/api/add_node', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newNode)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      nodesData.push(newNode);
      restartSimulation();
    } else {
      alert(data.message);
    }
  });

  modal.style.display = "none";
};

function restartSimulation() {
  // Rebind links
  link = svg.selectAll("line")
      .data(linksData, d => d.source.id + "-" + d.target.id);
  
  link.exit().remove();
  
  link = link.enter()
      .append("line")
      .attr("stroke-width", 2)
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-dasharray", d => d.type === "discipline" ? "4 2" : "none")
    .merge(link);

  // Rebind nodes
  node = svg.selectAll("circle")
      .data(nodesData, d => d.id);
  
  node.exit().remove();
  
  node = node.enter()
      .append("circle")
      .attr("r", 12)
      .attr("fill", d => nodeColor(d))
      .call(drag(simulation))        // <-- Drag reattachment
      .on("mouseover", function(event, d) {
        simulation.alphaTarget(0.3).restart();
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 20);
      })
      .on("mouseout", function(event, d) {
        simulation.alphaTarget(0);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 12);
      })
      .on("click", function(event, d) {
        document.getElementById('editNodeId').value = d.id;
        document.getElementById('editNodeGroup').value = d.group;
        document.getElementById('editNodeLane').value = d.lane;
        document.getElementById('editNodeDate').value = d.acquired_date;

        selectedNode = d;
        document.getElementById('editNodeModal').style.display = "block";
      })
      .append("title")
      .text(d => 
        `Name: ${d.id}
Group: ${d.group}
Lane: ${d.lane}
Acquired: ${d.acquired_date}`
      )
    .merge(node);

  // Update simulation
  simulation.nodes(nodesData);
  simulation.force("link").links(linksData);
  arrangeRadial(nodesData);
  simulation.alpha(1).restart();
}

let mouseForce = d3.forceRadial()
  .strength(0.05)
  .radius(0);

simulation.force("mouse", mouseForce);

svg.on("mousemove", (event) => {
  const [x, y] = d3.pointer(event);
  mouseForce.x(x).y(y);
  simulation.alphaTarget(0.1).restart();
});

// Cluster Modal Logic
const clusterModal = document.getElementById("addClusterModal");
const clusterBtn = document.getElementById("addClusterBtn");
const clusterClose = document.getElementById("closeClusterModal");
const clusterForm = document.getElementById("addClusterForm");

clusterBtn.onclick = function() {
  clusterModal.style.display = "block";
}

clusterClose.onclick = function() {
  clusterModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == clusterModal) {
    clusterModal.style.display = "none";
  }
}

clusterForm.onsubmit = function(e) {
  e.preventDefault();
  
  const newCluster = {
    name: document.getElementById('clusterName').value,
    type: document.getElementById('clusterType').value
  };

  fetch('/api/add_cluster', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newCluster)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Cluster added successfully! Refresh to see updated grid.");
      // Ideally: trigger live update later.
    } else {
      alert(data.message);
    }
  });

  clusterModal.style.display = "none";
};

node.on("mouseover", function(event, d) {
  simulation.alphaTarget(0.3).restart();
  d3.select(this)
    .transition()
    .duration(200)
    .attr("r", 20);
})
.on("mouseout", function(event, d) {
  simulation.alphaTarget(0);
  d3.select(this)
    .transition()
    .duration(200)
    .attr("r", 12);
});

node.on("click", function(event, d) {
  document.getElementById('editNodeId').value = d.id;
  document.getElementById('editNodeGroup').value = d.group;
  document.getElementById('editNodeLane').value = d.lane;
  document.getElementById('editNodeDate').value = d.acquired_date;

  selectedNode = d; // Save selected node
  document.getElementById('editNodeModal').style.display = "block";
});

// Handle Edit Form
document.getElementById('editNodeForm').onsubmit = function(e) {
  e.preventDefault();
  
  selectedNode.id = document.getElementById('editNodeId').value;
  selectedNode.group = document.getElementById('editNodeGroup').value;
  selectedNode.lane = document.getElementById('editNodeLane').value;
  selectedNode.acquired_date = document.getElementById('editNodeDate').value;

  simulation.alpha(1).restart();
  document.getElementById('editNodeModal').style.display = "none";

  // TODO: POST update to backend (future step!)
};