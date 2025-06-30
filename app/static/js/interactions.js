// User Interactions and Event Handlers

class InteractionSystem {
    constructor(sphereGrid) {
        this.sphereGrid = sphereGrid;
        this.legendVisible = true;
    }

    setupAllInteractions() {
        this.setupNodeInteractions();
        this.setupLegendInteractions();
        this.setupButtonInteractions();
        this.setupBackgroundInteractions();
    }

    setupNodeInteractions() {
        this.sphereGrid.nodeGroups
            .on("click", (event, d) => {
                event.stopPropagation();
                this.handleNodeClick(d);
            })
            .on("mouseenter", (event, d) => {
                this.handleNodeMouseEnter(event, d);
            })
            .on("mouseleave", (event, d) => {
                this.handleNodeMouseLeave(event, d);
            });
    }

    setupLegendInteractions() {
        document.querySelectorAll('.legend-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const character = e.currentTarget.dataset.character;
                this.sphereGrid.switchCharacterPath(character);
            });
        });
    }

    setupButtonInteractions() {
        document.getElementById('reset-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.sphereGrid.resetView();
        });

        document.getElementById('simulate-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.sphereGrid.simulateProgress();
        });

        document.getElementById('toggle-formations-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.sphereGrid.toggleFormations();
        });

        document.getElementById('highlight-paths-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.sphereGrid.highlightAllPaths();
        });
    }

    setupBackgroundInteractions() {
        this.sphereGrid.svg.on("click", () => {
            this.hideSkillInfo();
            this.sphereGrid.clearHighlights();
        });
    }

    handleNodeClick(node) {
        this.showSkillInfo(node);
        this.sphereGrid.highlightSkillPath(node);
        
        // If clicking on a disciple, show their paths
        if (node.type === 'disciple') {
            this.sphereGrid.switchCharacterPath(node.disciple);
        }
    }

    handleNodeMouseEnter(event, node) {
        const baseRadius = node.type === 'disciple' ? 
            this.sphereGrid.nodeRadius * 1.8 : this.sphereGrid.nodeRadius;
        
        d3.select(event.currentTarget)
            .select("circle")
            .transition()
            .duration(200)
            .attr("r", baseRadius * 1.2);
    }

    handleNodeMouseLeave(event, node) {
        const baseRadius = node.type === 'disciple' ? 
            this.sphereGrid.nodeRadius * 1.8 : this.sphereGrid.nodeRadius;
        
        d3.select(event.currentTarget)
            .select("circle")
            .transition()
            .duration(200)
            .attr("r", baseRadius);
    }

    showSkillInfo(skill) {
        const infoPanel = document.getElementById("skill-info");
        
        if (skill.type === 'disciple') {
            this.showDiscipleInfo(skill);
        } else {
            this.showRegularSkillInfo(skill);
        }
        
        infoPanel.style.display = "block";
    }

    showDiscipleInfo(skill) {
        const disciple = this.sphereGrid.discipleSystem.getDiscipleInfo(skill.disciple);
        
        document.getElementById("skill-title").textContent = disciple.name;
        document.getElementById("skill-description").textContent = disciple.description;
        
        // Show learning paths for this disciple
        const paths = this.sphereGrid.discipleSystem.getPathsForDisciple(skill.disciple);
        const pathNames = paths.map(pathKey => 
            this.sphereGrid.discipleSystem.getLearningPath(pathKey)?.name
        ).filter(Boolean);
        
        document.getElementById("skill-requirements").textContent = 
            `Learning Paths: ${pathNames.join(", ")}`;
        document.getElementById("skill-resources").textContent = 
            `Click to highlight all ${disciple.name} learning paths`;
    }

    showRegularSkillInfo(skill) {
        document.getElementById("skill-title").textContent = skill.name;
        document.getElementById("skill-description").textContent = 
            `${skill.formation} - ${skill.type} skill`;
        
        const prereqs = skill.prerequisites.length > 0 
            ? `Prerequisites: ${skill.prerequisites.map(id => 
                this.sphereGrid.skills.find(s => s.id === id)?.name
              ).join(", ")}`
            : "No prerequisites";
        document.getElementById("skill-requirements").textContent = prereqs;
        
        // Show which disciple this skill belongs to
        const discipleName = skill.disciple ? 
            this.sphereGrid.discipleSystem.getDiscipleInfo(skill.disciple)?.name : 'None';
        document.getElementById("skill-resources").textContent = 
            `Disciple: ${discipleName} • Type: ${skill.type}`;
    }

    hideSkillInfo() {
        document.getElementById("skill-info").style.display = "none";
    }

    toggleLegend() {
        const panel = document.getElementById('ui-panel');
        const toggleBtn = document.getElementById('toggle-panel');
        const icon = document.getElementById('toggle-icon');
        
        this.legendVisible = !this.legendVisible;
        
        if (this.legendVisible) {
            panel.classList.remove('hidden');
            toggleBtn.classList.add('panel-visible');
            icon.textContent = '✕';
        } else {
            panel.classList.add('hidden');
            toggleBtn.classList.remove('panel-visible');
            icon.textContent = '☰';
        }
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'r':
                case 'R':
                    this.sphereGrid.resetView();
                    break;
                case 's':
                case 'S':
                    this.sphereGrid.simulateProgress();
                    break;
                case 'f':
                case 'F':
                    this.sphereGrid.toggleFormations();
                    break;
                case 'h':
                case 'H':
                    this.sphereGrid.highlightAllPaths();
                    break;
                case 'l':
                case 'L':
                    this.toggleLegend();
                    break;
                case 'Escape':
                    this.hideSkillInfo();
                    this.sphereGrid.clearHighlights();
                    break;
            }
        });
    }

    // Touch/mobile support
    setupTouchInteractions() {
        let touchStartTime = 0;
        
        this.sphereGrid.nodeGroups
            .on("touchstart", (event) => {
                touchStartTime = Date.now();
            })
            .on("touchend", (event, d) => {
                const touchDuration = Date.now() - touchStartTime;
                if (touchDuration < 300) { // Quick tap
                    this.handleNodeClick(d);
                }
            });
    }

    // Analytics/tracking (placeholder for future implementation)
    trackUserAction(action, data = {}) {
        // Future implementation for user analytics
        console.log(`User action: ${action}`, data);
    }
}

// Global function for HTML onclick handlers
function toggleLegend() {
    if (window.sphereGrid && window.sphereGrid.interactionSystem) {
        window.sphereGrid.interactionSystem.toggleLegend();
    }
}