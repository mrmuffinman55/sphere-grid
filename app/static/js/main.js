// Core Application - Main Sphere Grid Class

class AuthenticFFXSphereGrid {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.nodeRadius = 10;
        this.showFormations = true;
        this.currentCharacter = 'dr-g';

        // Initialize systems
        this.discipleSystem = new DiscipleSystem();
        this.formationSystem = new FormationSystem(this.discipleSystem);
        this.interactionSystem = new InteractionSystem(this);

        // Initialize the application
        this.init();
    }

    init() {
        this.initSVG();
        this.generateAllContent();
        this.createVisualization();
        this.setupInteractions();
    }

    initSVG() {
        this.svg = d3.select("#sphere-grid")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        this.g = this.svg.append("g");

        this.zoom = d3.zoom()
            .scaleExtent([0.3, 5])
            .on("zoom", (event) => {
                this.g.attr("transform", event.transform);
            });

        this.svg.call(this.zoom);

        const initialTransform = d3.zoomIdentity
            .translate(this.width / 2, this.height / 2)
            .scale(0.7);
        this.svg.call(this.zoom.transform, initialTransform);
    }

    generateAllContent() {
        const content = this.formationSystem.generateAllFormations();
        this.skills = content.skills;
        this.formations = content.formations;
        this.connections = content.connections;
    }

    createVisualization() {
        this.drawFormationOutlines();
        this.drawConnections();
        this.drawCharacterPaths();
        this.drawSkillNodes();
        this.drawFormationLabels();
    }

    setupInteractions() {
        this.interactionSystem.setupAllInteractions();
        this.interactionSystem.setupKeyboardShortcuts();
        this.interactionSystem.setupTouchInteractions();
    }

    drawFormationOutlines() {
        this.formations.forEach(formation => {
            if (formation.type === 'circle') {
                this.g.append("circle")
                    .attr("class", "formation-outline")
                    .attr("cx", formation.center.x)
                    .attr("cy", formation.center.y)
                    .attr("r", formation.radius + 15);
            } else if (formation.type === 'semicircle') {
                const arc = d3.arc()
                    .innerRadius(formation.radius + 10)
                    .outerRadius(formation.radius + 15)
                    .startAngle(formation.nodes[0].angle)
                    .endAngle(formation.nodes[formation.nodes.length - 1].angle);

                this.g.append("path")
                    .attr("class", "formation-outline")
                    .attr("d", arc)
                    .attr("transform", `translate(${formation.center.x}, ${formation.center.y})`);
            } else if (formation.type === 'linear') {
                this.g.append("line")
                    .attr("class", "formation-outline")
                    .attr("x1", formation.startPoint.x - 20)
                    .attr("y1", formation.startPoint.y)
                    .attr("x2", formation.endPoint.x + 20)
                    .attr("y2", formation.endPoint.y);
            }
        });
    }

    drawConnections() {
        this.connections.forEach(connection => {
            const source = connection.source;
            const target = connection.target;
            
            if (connection.type === 'within-formation') {
                this.g.append("line")
                    .attr("class", "connection-line within-formation")
                    .attr("x1", source.x)
                    .attr("y1", source.y)
                    .attr("x2", target.x)
                    .attr("y2", target.y);
            } else if (connection.type === 'disciple-connection') {
                this.g.append("line")
                    .attr("class", "connection-line disciple-connection")
                    .attr("x1", source.x)
                    .attr("y1", source.y)
                    .attr("x2", target.x)
                    .attr("y2", target.y);
            } else if (connection.type === 'formation-to-disciple') {
                this.g.append("line")
                    .attr("class", "connection-line formation-to-disciple")
                    .attr("x1", source.x)
                    .attr("y1", source.y)
                    .attr("x2", target.x)
                    .attr("y2", target.y)
                    .style("stroke", this.discipleSystem.getDiscipleColor(target.disciple))
                    .style("stroke-width", 2)
                    .style("opacity", 0.4)
                    .style("stroke-dasharray", "3,3");
            }
        });
    }

    drawCharacterPaths() {
        this.switchCharacterPath(this.currentCharacter);
    }

    drawSkillNodes() {
        const nodeGroups = this.g.selectAll(".skill-node-group")
            .data(this.skills)
            .enter()
            .append("g")
            .attr("class", "skill-node-group")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        // Draw node circles
        nodeGroups.append("circle")
            .attr("class", d => `skill-node ${d.state} ${d.type}`)
            .attr("r", d => {
                if (d.type === 'disciple') return this.nodeRadius * 1.8;
                return this.nodeRadius;
            })
            .style("fill", d => {
                if (d.type === 'disciple') {
                    return this.discipleSystem.getDiscipleColor(d.disciple);
                }
                if (d.state === 'locked') return '#2c2c2c';
                return this.formationSystem.getSkillColor(d.type);
            })
            .style("stroke", d => {
                if (d.type === 'disciple') {
                    return this.discipleSystem.getDiscipleColor(d.disciple);
                }
                return d.state === 'locked' ? '#444' : '#fff';
            })
            .style("stroke-width", d => d.type === 'disciple' ? 4 : 2);

        // Add symbols for disciple nodes
        nodeGroups.filter(d => d.type === 'disciple')
            .append("text")
            .attr("class", "disciple-symbol")
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("pointer-events", "none")
            .text(d => this.discipleSystem.getDiscipleSymbol(d.disciple));

        // Add skill labels for non-disciple nodes
        nodeGroups.filter(d => d.type !== 'disciple')
            .append("text")
            .attr("class", "skill-label")
            .attr("dy", "0.35em")
            .text(d => d.name.length > 7 ? d.name.substring(0, 5) + '.' : d.name)
            .style("fill", d => d.state === 'locked' ? '#666' : 'white');

        // Add labels below disciple nodes
        nodeGroups.filter(d => d.type === 'disciple')
            .append("text")
            .attr("class", "disciple-label")
            .attr("dy", "2.5em")
            .style("text-anchor", "middle")
            .style("fill", d => this.discipleSystem.getDiscipleColor(d.disciple))
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("pointer-events", "none")
            .text(d => d.name);

        this.nodeGroups = nodeGroups;
    }

    drawFormationLabels() {
        this.formations.forEach(formation => {
            let labelX = formation.center ? formation.center.x : (formation.startPoint.x + formation.endPoint.x) / 2;
            let labelY = formation.center ? formation.center.y - formation.radius - 30 : formation.startPoint.y - 30;

            this.g.append("text")
                .attr("class", "formation-label")
                .attr("x", labelX)
                .attr("y", labelY)
                .text(formation.name);
        });
    }

    switchCharacterPath(character) {
        this.currentCharacter = character;
        
        document.querySelectorAll('.legend-item').forEach(item => {
            item.classList.toggle('active', item.dataset.character === character);
        });

        // Clear all path highlights
        this.g.selectAll('.character-path').remove();

        // Show paths for selected character
        const characterData = this.discipleSystem.getCharacterPaths(character);
        if (characterData) {
            characterData.paths.forEach(pathKey => {
                const pathData = this.discipleSystem.getLearningPath(pathKey);
                if (pathData && pathData.skills) {
                    this.drawPathForSkills(pathData.skills, pathData.color, character);
                }
            });
        }
    }

    drawPathForSkills(skills, color, character) {
        for (let i = 0; i < skills.length - 1; i++) {
            const skill1 = skills[i];
            const skill2 = skills[i + 1];
            
            this.g.append("line")
                .attr("class", `character-path character-${character}`)
                .attr("x1", skill1.x)
                .attr("y1", skill1.y)
                .attr("x2", skill2.x)
                .attr("y2", skill2.y)
                .style("stroke", color)
                .style("stroke-width", 4)
                .style("opacity", 0.8)
                .style("stroke-dasharray", "3,3")
                .style("animation", "march 1s linear infinite");
        }
    }

    highlightAllPaths() {
        // Clear existing paths
        this.g.selectAll('.character-path').remove();
        
        // Draw all learning paths with different colors
        Object.entries(this.discipleSystem.getAllLearningPaths()).forEach(([pathKey, pathData]) => {
            this.drawPathForSkills(pathData.skills, pathData.color, `path-${pathKey}`);
        });
    }

    highlightSkillPath(skill) {
        this.clearHighlights();
        
        // Find connections involving this skill
        this.connections.forEach((connection, index) => {
            if (connection.source.id === skill.id || connection.target.id === skill.id) {
                this.g.selectAll(".connection-line")
                    .filter((d, i) => i === index)
                    .classed("active", true);
            }
        });
        
        // Also highlight character path if this skill is part of current character's route
        const currentPaths = this.discipleSystem.getCharacterPaths(this.currentCharacter);
        if (currentPaths) {
            currentPaths.paths.forEach(pathKey => {
                const pathData = this.discipleSystem.getLearningPath(pathKey);
                if (pathData && pathData.skills.some(s => s.id === skill.id)) {
                    this.g.selectAll(`.character-${this.currentCharacter}`)
                        .style("opacity", 1)
                        .style("stroke-width", 5);
                }
            });
        }
    }

    clearHighlights() {
        this.g.selectAll(".connection-line").classed("active", false);
        this.g.selectAll(".character-path")
            .style("opacity", 0.8)
            .style("stroke-width", 4);
    }

    resetView() {
        const initialTransform = d3.zoomIdentity
            .translate(this.width / 2, this.height / 2)
            .scale(0.7);
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, initialTransform);
    }

    simulateProgress() {
        this.skills.forEach(skill => {
            if (skill.type === 'disciple') return; // Don't change disciple states
            
            if (skill.state === 'available' && Math.random() > 0.7) {
                skill.state = 'completed';
            } else if (skill.state === 'locked' && Math.random() > 0.8) {
                skill.state = 'available';
            } else if (skill.state === 'completed' && Math.random() > 0.9) {
                skill.state = 'mastered';
            }
        });

        this.updateNodeStates();
    }

    updateNodeStates() {
        this.g.selectAll(".skill-node")
            .data(this.skills)
            .transition()
            .duration(500)
            .attr("class", d => `skill-node ${d.state} ${d.type}`)
            .style("fill", d => {
                if (d.type === 'disciple') {
                    return this.discipleSystem.getDiscipleColor(d.disciple);
                }
                if (d.state === 'locked') return '#2c2c2c';
                return this.formationSystem.getSkillColor(d.type);
            });
    }

    toggleFormations() {
        this.showFormations = !this.showFormations;
        this.g.selectAll('.formation-outline')
            .style("opacity", this.showFormations ? 0.8 : 0);
    }

    // Resize handler
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.svg
            .attr("width", this.width)
            .attr("height", this.height);
    }
}

// Global variables and initialization
let sphereGrid;

// Initialize when page loads
window.addEventListener('load', () => {
    sphereGrid = new AuthenticFFXSphereGrid();
    
    // Make sphere grid available globally for interactions
    window.sphereGrid = sphereGrid;
});

// Handle window resize
window.addEventListener('resize', () => {
    if (sphereGrid) {
        sphereGrid.resize();
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthenticFFXSphereGrid;
}