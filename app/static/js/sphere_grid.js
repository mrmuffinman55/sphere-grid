class AuthenticFFXSphereGrid {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.nodeRadius = 10;
        this.showFormations = true;

        this.currentCharacter = 'dr-g';

        this.initSVG();
        this.generateFFXFormations();
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

    // Create circular formation of nodes
    generateCircularFormation(centerX, centerY, radius, numNodes, startAngle = 0) {
        const nodes = [];
        const angleStep = (2 * Math.PI) / numNodes;
        
        for (let i = 0; i < numNodes; i++) {
            const angle = startAngle + (i * angleStep);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            nodes.push({
                x: x,
                y: y,
                angle: angle,
                circleIndex: i
            });
        }
        
        return nodes;
    }

    // Create semi-circular (arc) formation
    generateSemiCircularFormation(centerX, centerY, radius, numNodes, startAngle, endAngle) {
        const nodes = [];
        const totalAngle = endAngle - startAngle;
        const angleStep = totalAngle / (numNodes - 1);
        
        for (let i = 0; i < numNodes; i++) {
            const angle = startAngle + (i * angleStep);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            nodes.push({
                x: x,
                y: y,
                angle: angle,
                arcIndex: i
            });
        }
        
        return nodes;
    }

    // Create linear pathway between points
    generateLinearPath(startX, startY, endX, endY, numNodes) {
        const nodes = [];
        
        for (let i = 0; i < numNodes; i++) {
            const t = i / (numNodes - 1);
            const x = startX + t * (endX - startX);
            const y = startY + t * (endY - startY);
            
            nodes.push({
                x: x,
                y: y,
                pathIndex: i,
                pathProgress: t
            });
        }
        
        return nodes;
    }

    generateFFXFormations() {
        this.skills = [];
        this.formations = [];
        this.teleporterNodes = [];
        this.disciples = {};
        let skillId = 0;

        // Create disciples/personas based on your Canvas structure
        this.disciples = {
            'dr-g': { 
                name: 'Dr. G. (Theory)', 
                color: '#590328', 
                position: { x: 0, y: 0 },
                description: 'Master theorist and central figure'
            },
            'anthony': { 
                name: 'Anthony (Engineer)', 
                color: '#e1ff00', 
                position: { x: -200, y: 0 },
                description: 'Engineer & Practitioner'
            },
            'janet': { 
                name: 'Janet (Architect)', 
                color: '#3e0359', 
                position: { x: 200, y: 0 },
                description: 'Architect & Design'
            },
            'christopher': { 
                name: 'Christopher (Admin)', 
                color: '#033f59', 
                position: { x: 0, y: 200 },
                description: 'Administration & STEM'
            },
            'phoenix': { 
                name: 'Phoenix (Self-Mastery)', 
                color: '#590303', 
                position: { x: 0, y: -200 },
                description: 'Self-Mastery and personal development'
            }
        };

        // Create Dr. G. central node
        const drGNode = {
            id: skillId++,
            name: 'Dr. G.',
            formation: 'Central Theory',
            x: 0,
            y: 0,
            state: 'available',
            type: 'disciple',
            disciple: 'dr-g',
            prerequisites: [],
            connections: []
        };
        this.skills.push(drGNode);

        // Cyber Security Path (Anthony's domain)
        const cyberFormation = {
            type: 'linear',
            name: 'Cyber Security Mastery',
            startPoint: { x: -300, y: -100 },
            endPoint: { x: -50, y: -100 },
            disciple: 'anthony',
            skills: []
        };

        const cyberPath = [
            { name: 'Cyber Mastery', state: 'locked' },
            { name: 'CompTIA', state: 'locked' },
            { name: 'Sec+', state: 'locked' },
            { name: 'PenTest+', state: 'locked' },
            { name: 'CySA+', state: 'locked' }
        ];

        cyberPath.forEach((skill, i) => {
            const x = -300 + (i * 60);
            const y = -100;
            const cyberSkill = {
                id: skillId++,
                name: skill.name,
                formation: 'Cyber Security Mastery',
                x: x,
                y: y,
                state: skill.state,
                type: 'cyber',
                disciple: 'anthony',
                prerequisites: i === 0 ? [] : [skillId - 2],
                connections: []
            };
            cyberFormation.skills.push(cyberSkill);
            this.skills.push(cyberSkill);
        });

        this.formations.push(cyberFormation);

        // Systems Engineering Path (Anthony's domain)
        const systemsFormation = {
            type: 'linear',
            name: 'Systems Engineering',
            startPoint: { x: -300, y: 50 },
            endPoint: { x: -50, y: 50 },
            disciple: 'anthony',
            skills: []
        };

        const systemsPath = [
            { name: 'Systems', state: 'locked' },
            { name: 'CompTIA', state: 'locked' },
            { name: 'Server+', state: 'locked' },
            { name: 'Linux+', state: 'locked' }
        ];

        systemsPath.forEach((skill, i) => {
            const x = -300 + (i * 80);
            const y = 50;
            const systemSkill = {
                id: skillId++,
                name: skill.name,
                formation: 'Systems Engineering',
                x: x,
                y: y,
                state: skill.state,
                type: 'systems',
                disciple: 'anthony',
                prerequisites: i === 0 ? [] : [skillId - 2],
                connections: []
            };
            systemsFormation.skills.push(systemSkill);
            this.skills.push(systemSkill);
        });

        this.formations.push(systemsFormation);

        // Data Science Path (Janet's domain)
        const dataFormation = {
            type: 'semicircle',
            name: 'Data Science & ML',
            center: { x: 200, y: -100 },
            radius: 60,
            nodes: this.generateSemiCircularFormation(200, -100, 60, 5, -Math.PI/3, Math.PI/3),
            disciple: 'janet',
            skills: []
        };

        const dataSkills = ['Data Science', 'Machine Learning', 'Algorithms', 'Python ML', 'Deep Learning'];
        dataFormation.nodes.forEach((node, i) => {
            const skill = {
                id: skillId++,
                name: dataSkills[i],
                formation: 'Data Science & ML',
                x: node.x,
                y: node.y,
                state: 'locked',
                type: 'data',
                disciple: 'janet',
                prerequisites: [],
                connections: []
            };
            dataFormation.skills.push(skill);
            this.skills.push(skill);
        });

        this.formations.push(dataFormation);

        // Software Architecture Path (Janet's domain)
        const softwareFormation = {
            type: 'circle',
            name: 'Software Architecture',
            center: { x: 200, y: 100 },
            radius: 50,
            nodes: this.generateCircularFormation(200, 100, 50, 6),
            disciple: 'janet',
            skills: []
        };

        const softwareSkills = ['Design Patterns', 'Architecture', 'Microservices', 'Cloud Design', 'System Design', 'DevOps'];
        softwareFormation.nodes.forEach((node, i) => {
            const skill = {
                id: skillId++,
                name: softwareSkills[i],
                formation: 'Software Architecture',
                x: node.x,
                y: node.y,
                state: 'locked',
                type: 'software',
                disciple: 'janet',
                prerequisites: [],
                connections: []
            };
            softwareFormation.skills.push(skill);
            this.skills.push(skill);
        });

        this.formations.push(softwareFormation);

        // STEM Foundation Path (Christopher's domain)
        const stemFormation = {
            type: 'linear',
            name: 'STEM Foundations',
            startPoint: { x: -150, y: 200 },
            endPoint: { x: 150, y: 200 },
            disciple: 'christopher',
            skills: []
        };

        const stemPath = [
            { name: 'Algebra', state: 'available' },
            { name: 'Geometry', state: 'locked' },
            { name: 'Calculus', state: 'locked' },
            { name: 'Physics', state: 'locked' },
            { name: 'Chemistry', state: 'locked' }
        ];

        stemPath.forEach((skill, i) => {
            const x = -150 + (i * 75);
            const y = 200;
            const stemSkill = {
                id: skillId++,
                name: skill.name,
                formation: 'STEM Foundations',
                x: x,
                y: y,
                state: skill.state,
                type: 'stem',
                disciple: 'christopher',
                prerequisites: i === 0 ? [] : [skillId - 2],
                connections: []
            };
            stemFormation.skills.push(stemSkill);
            this.skills.push(stemSkill);
        });

        this.formations.push(stemFormation);

        // Self-Mastery Path (Phoenix's domain)
        const selfMasteryFormation = {
            type: 'circle',
            name: 'Self-Mastery',
            center: { x: 0, y: -200 },
            radius: 60,
            nodes: this.generateCircularFormation(0, -200, 60, 8),
            disciple: 'phoenix',
            skills: []
        };

        const selfMasterySkills = ['Philosophy', 'Psychology', 'Leadership', 'Communication', 'Critical Thinking', 'Creativity', 'Discipline', 'Growth Mindset'];
        selfMasteryFormation.nodes.forEach((node, i) => {
            const skill = {
                id: skillId++,
                name: selfMasterySkills[i],
                formation: 'Self-Mastery',
                x: node.x,
                y: node.y,
                state: i < 2 ? 'available' : 'locked',
                type: 'selfmastery',
                disciple: 'phoenix',
                prerequisites: [],
                connections: []
            };
            selfMasteryFormation.skills.push(skill);
            this.skills.push(skill);
        });

        this.formations.push(selfMasteryFormation);

        // Create disciple nodes
        Object.entries(this.disciples).forEach(([key, disciple]) => {
            if (key !== 'dr-g') { // Dr. G already created
                const discipleNode = {
                    id: skillId++,
                    name: disciple.name.split('(')[0].trim(),
                    formation: 'Disciples',
                    x: disciple.position.x,
                    y: disciple.position.y,
                    state: 'available',
                    type: 'disciple',
                    disciple: key,
                    prerequisites: [],
                    connections: []
                };
                this.skills.push(discipleNode);
            }
        });

        // Create connections and paths
        this.createDiscipleConnections();
        this.createLearningPaths();
    }

    createDiscipleConnections() {
        this.connections = [];
        const drG = this.skills.find(s => s.type === 'disciple' && s.disciple === 'dr-g');

        // Connect Dr. G to all other disciples
        this.skills.filter(s => s.type === 'disciple' && s.disciple !== 'dr-g').forEach(disciple => {
            this.connections.push({
                source: drG,
                target: disciple,
                type: 'disciple-connection',
                formation: 'Disciples'
            });
        });

        // Connect formations to their disciples
        this.formations.forEach(formation => {
            if (formation.disciple) {
                const disciple = this.skills.find(s => s.type === 'disciple' && s.disciple === formation.disciple);
                if (disciple && formation.skills.length > 0) {
                    // Connect closest skill in formation to disciple
                    const closestSkill = this.findClosestSkillToDisciple(formation, disciple);
                    if (closestSkill) {
                        this.connections.push({
                            source: closestSkill,
                            target: disciple,
                            type: 'formation-to-disciple',
                            formation: formation.name
                        });
                    }
                }
            }

            // Connect adjacent nodes within each formation
            formation.skills.forEach((skill, i) => {
                if (formation.type === 'circle') {
                    // Connect to next node in circle
                    const nextIndex = (i + 1) % formation.skills.length;
                    this.connections.push({
                        source: skill,
                        target: formation.skills[nextIndex],
                        type: 'within-formation',
                        formation: formation.name
                    });
                } else if (formation.type === 'semicircle' || formation.type === 'linear') {
                    // Connect to next node in sequence
                    if (i < formation.skills.length - 1) {
                        this.connections.push({
                            source: skill,
                            target: formation.skills[i + 1],
                            type: 'within-formation',
                            formation: formation.name
                        });
                    }
                }
            });
        });
    }

    findClosestSkillToDisciple(formation, disciple) {
        let closestSkill = null;
        let minDistance = Infinity;

        formation.skills.forEach(skill => {
            const distance = Math.sqrt(
                Math.pow(skill.x - disciple.x, 2) + 
                Math.pow(skill.y - disciple.y, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestSkill = skill;
            }
        });

        return closestSkill;
    }

    createLearningPaths() {
        // Create directed learning paths based on your Canvas structure
        this.learningPaths = {
            'cyber-engineer': {
                name: 'Cyber Engineer Path',
                color: '#ff4757',
                disciple: 'anthony',
                skills: this.skills.filter(s => s.type === 'cyber'),
                description: 'Complete cybersecurity certification path'
            },
            'systems-engineer': {
                name: 'Systems Engineer Path', 
                color: '#5352ed',
                disciple: 'anthony',
                skills: this.skills.filter(s => s.type === 'systems'),
                description: 'Infrastructure and systems administration'
            },
            'data-scientist': {
                name: 'Data Scientist Path',
                color: '#3742fa',
                disciple: 'janet',
                skills: this.skills.filter(s => s.type === 'data'),
                description: 'Machine learning and data analysis'
            },
            'software-architect': {
                name: 'Software Architect Path',
                color: '#a55eea',
                disciple: 'janet',
                skills: this.skills.filter(s => s.type === 'software'),
                description: 'Software design and architecture'
            },
            'stem-foundation': {
                name: 'STEM Foundation Path',
                color: '#26de81',
                disciple: 'christopher',
                skills: this.skills.filter(s => s.type === 'stem'),
                description: 'Mathematical and scientific foundations'
            },
            'self-mastery': {
                name: 'Self-Mastery Path',
                color: '#ff6b6b',
                disciple: 'phoenix',
                skills: this.skills.filter(s => s.type === 'selfmastery'),
                description: 'Personal development and growth'
            }
        };

        // Update character paths to use new structure
        this.characterPaths = {
            'anthony': {
                color: '#e1ff00',
                paths: ['cyber-engineer', 'systems-engineer']
            },
            'janet': {
                color: '#3e0359', 
                paths: ['data-scientist', 'software-architect']
            },
            'christopher': {
                color: '#033f59',
                paths: ['stem-foundation']
            },
            'phoenix': {
                color: '#590303',
                paths: ['self-mastery']
            },
            'dr-g': {
                color: '#590328',
                paths: ['cyber-engineer', 'systems-engineer', 'data-scientist', 'software-architect', 'stem-foundation', 'self-mastery']
            }
        };
    }

    createVisualization() {
        this.drawFormationOutlines();
        this.drawConnections();
        this.drawCharacterPaths();
        this.drawSkillNodes();
        this.drawFormationLabels();
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
        // Draw connections with different styles for different types
        this.connections.forEach(connection => {
            const source = connection.source;
            const target = connection.target;
            
            if (connection.type === 'within-formation') {
                // Regular connections within formations
                this.g.append("line")
                    .attr("class", "connection-line within-formation")
                    .attr("x1", source.x)
                    .attr("y1", source.y)
                    .attr("x2", target.x)
                    .attr("y2", target.y);
            } else if (connection.type === 'disciple-connection') {
                // Connections between disciples
                this.g.append("line")
                    .attr("class", "connection-line disciple-connection")
                    .attr("x1", source.x)
                    .attr("y1", source.y)
                    .attr("x2", target.x)
                    .attr("y2", target.y)
                    .style("stroke", "#590328")
                    .style("stroke-width", 3)
                    .style("opacity", 0.6)
                    .style("stroke-dasharray", "5,5");
            } else if (connection.type === 'formation-to-disciple') {
                // Connections from formations to disciples
                this.g.append("line")
                    .attr("class", "connection-line formation-to-disciple")
                    .attr("x1", source.x)
                    .attr("y1", source.y)
                    .attr("x2", target.x)
                    .attr("y2", target.y)
                    .style("stroke", this.disciples[target.disciple]?.color || "#ffffff")
                    .style("stroke-width", 2)
                    .style("opacity", 0.4)
                    .style("stroke-dasharray", "3,3");
            }
        });
    }

    drawCharacterPaths() {
        // Initial path drawing - will be handled by switchCharacterPath
        this.switchCharacterPath(this.currentCharacter);
    }

    showSkillInfo(skill) {
        const infoPanel = document.getElementById("skill-info");
        
        if (skill.type === 'disciple') {
            const disciple = this.disciples[skill.disciple];
            document.getElementById("skill-title").textContent = disciple.name;
            document.getElementById("skill-description").textContent = disciple.description;
            
            // Show learning paths for this disciple
            const paths = this.characterPaths[skill.disciple]?.paths || [];
            const pathNames = paths.map(pathKey => this.learningPaths[pathKey]?.name).filter(Boolean);
            document.getElementById("skill-requirements").textContent = `Learning Paths: ${pathNames.join(", ")}`;
            document.getElementById("skill-resources").textContent = `Click to highlight all ${disciple.name} learning paths`;
        } else {
            document.getElementById("skill-title").textContent = skill.name;
            document.getElementById("skill-description").textContent = `${skill.formation} - ${skill.type} skill`;
            
            const prereqs = skill.prerequisites.length > 0 
                ? `Prerequisites: ${skill.prerequisites.map(id => this.skills.find(s => s.id === id)?.name).join(", ")}`
                : "No prerequisites";
            document.getElementById("skill-requirements").textContent = prereqs;
            
            // Show which disciple this skill belongs to
            const discipleName = skill.disciple ? this.disciples[skill.disciple]?.name : 'None';
            document.getElementById("skill-resources").textContent = `Disciple: ${discipleName} • Type: ${skill.type}`;
        }
        
        infoPanel.style.display = "block";
    }

    highlightAllPaths() {
        // Clear existing paths
        this.g.selectAll('.character-path').remove();
        
        // Draw all learning paths with different colors
        Object.entries(this.learningPaths).forEach(([pathKey, pathData]) => {
            this.drawPathForSkills(pathData.skills, pathData.color, `path-${pathKey}`);
        });
    }

    drawSkillNodes() {
        const nodeGroups = this.g.selectAll(".skill-node-group")
            .data(this.skills)
            .enter()
            .append("g")
            .attr("class", "skill-node-group")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        // Draw node circles with special handling for disciples
        nodeGroups.append("circle")
            .attr("class", d => `skill-node ${d.state} ${d.type}`)
            .attr("r", d => {
                if (d.type === 'disciple') return this.nodeRadius * 1.8;
                return this.nodeRadius;
            })
            .style("fill", d => {
                if (d.type === 'disciple') {
                    return this.disciples[d.disciple]?.color || '#ffffff';
                }
                if (d.state === 'locked') return '#2c2c2c';
                return this.getSkillColor(d.type);
            })
            .style("stroke", d => {
                if (d.type === 'disciple') {
                    return this.disciples[d.disciple]?.color || '#ffffff';
                }
                return d.state === 'locked' ? '#444' : '#fff';
            })
            .style("stroke-width", d => d.type === 'disciple' ? 4 : 2);

        // Add special symbols for disciple nodes
        nodeGroups.filter(d => d.type === 'disciple')
            .append("text")
            .attr("class", "disciple-symbol")
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("pointer-events", "none")
            .text(d => {
                const symbols = {
                    'dr-g': '♦',
                    'anthony': '⚡',
                    'janet': '◊',
                    'christopher': '♦',
                    'phoenix': '☥'
                };
                return symbols[d.disciple] || '●';
            });

        // Add skill labels (for non-disciple nodes)
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
            .style("fill", d => this.disciples[d.disciple]?.color || '#ffffff')
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("pointer-events", "none")
            .text(d => d.name);

        this.nodeGroups = nodeGroups;
    }

    getSkillColor(type) {
        const colors = {
            'cyber': '#ff4757',
            'systems': '#5352ed',
            'data': '#3742fa',
            'software': '#a55eea',
            'stem': '#26de81',
            'selfmastery': '#ff6b6b',
            'disciple': '#ffffff'
        };
        return colors[type] || '#4a9eff';
    }

    switchCharacterPath(character) {
        this.currentCharacter = character;
        
        document.querySelectorAll('.legend-item').forEach(item => {
            item.classList.toggle('active', item.dataset.character === character);
        });

        // Clear all path highlights
        this.g.selectAll('.character-path').remove();

        // Show paths for selected character
        if (this.characterPaths[character]) {
            const characterData = this.characterPaths[character];
            characterData.paths.forEach(pathKey => {
                const pathData = this.learningPaths[pathKey];
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

    setupInteractions() {
        // Node interactions
        this.nodeGroups
            .on("click", (event, d) => {
                event.stopPropagation();
                this.showSkillInfo(d);
                this.highlightSkillPath(d);
                
                // If clicking on a disciple, show their paths
                if (d.type === 'disciple') {
                    this.switchCharacterPath(d.disciple);
                }
            })
            .on("mouseenter", (event, d) => {
                const baseRadius = d.type === 'disciple' ? this.nodeRadius * 1.8 : this.nodeRadius;
                d3.select(event.currentTarget)
                    .select("circle")
                    .transition()
                    .duration(200)
                    .attr("r", baseRadius * 1.2);
            })
            .on("mouseleave", (event, d) => {
                const baseRadius = d.type === 'disciple' ? this.nodeRadius * 1.8 : this.nodeRadius;
                d3.select(event.currentTarget)
                    .select("circle")
                    .transition()
                    .duration(200)
                    .attr("r", baseRadius);
            });

        // Legend character switching
        document.querySelectorAll('.legend-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const character = e.currentTarget.dataset.character;
                this.switchCharacterPath(character);
            });
        });

        // Button controls
        document.getElementById('reset-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.resetView();
        });

        document.getElementById('simulate-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.simulateProgress();
        });

        document.getElementById('toggle-formations-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleFormations();
        });

        document.getElementById('highlight-paths-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.highlightAllPaths();
        });

        // Background click to close skill info
        this.svg.on("click", () => {
            document.getElementById("skill-info").style.display = "none";
            this.clearHighlights();
        });
    }

    highlightSkillPath(skill) {
        this.clearHighlights();
        
        // Find connections involving this skill
        this.connections.forEach((connection, index) => {
            if (connection.source.id === skill.id || connection.target.id === skill.id) {
                // Highlight the specific connection
                this.g.selectAll(".connection-line")
                    .filter((d, i) => i === index)
                    .classed("active", true);
            }
        });
        
        // Also highlight character path if this skill is part of current character's route
        const currentPath = this.characterPaths[this.currentCharacter];
        if (currentPath && currentPath.skills.some(s => s.id === skill.id)) {
            this.g.selectAll(`.character-${this.currentCharacter}`)
                .style("opacity", 1)
                .style("stroke-width", 5);
        }
    }

    clearHighlights() {
        this.g.selectAll(".connection-line").classed("active", false);
        
        // Reset character path highlighting
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
                    return this.disciples[d.disciple]?.color || '#ffffff';
                }
                if (d.state === 'locked') return '#2c2c2c';
                return this.getSkillColor(d.type);
            });
    }

    toggleFormations() {
        this.showFormations = !this.showFormations;
        this.g.selectAll('.formation-outline')
            .style("opacity", this.showFormations ? 0.8 : 0);
    }

    // Method for adding custom nodes (Flask integration point)
    addCustomNode(nodeData) {
        const newNode = {
            id: this.skills.length,
            name: nodeData.name,
            formation: 'Custom',
            x: nodeData.position.x,
            y: nodeData.position.y,
            state: 'available',
            type: 'custom',
            disciple: nodeData.disciple,
            prerequisites: nodeData.prerequisites || [],
            connections: []
        };
        
        this.skills.push(newNode);
        this.refreshVisualization();
        
        console.log('Custom node added:', newNode);
    }

    refreshVisualization() {
        // Clear and redraw
        this.g.selectAll("*").remove();
        this.createVisualization();
    }

    // Method to get all nodes (for Flask integration)
    getAllNodes() {
        return this.skills;
    }
}

// Global functions
let sphereGrid;
let legendVisible = true;

function toggleLegend() {
    const panel = document.getElementById('ui-panel');
    const toggleBtn = document.getElementById('toggle-panel');
    const icon = document.getElementById('toggle-icon');
    
    legendVisible = !legendVisible;
    
    if (legendVisible) {
        panel.classList.remove('hidden');
        toggleBtn.classList.add('panel-visible');
        icon.textContent = '✕';
    } else {
        panel.classList.add('hidden');
        toggleBtn.classList.remove('panel-visible');
        icon.textContent = '☰';
    }
}

// Initialize
window.addEventListener('load', () => {
    sphereGrid = new AuthenticFFXSphereGrid();
    // Make globally available for Flask integration
    window.sphereGrid = sphereGrid;
    window.AuthenticFFXSphereGrid = AuthenticFFXSphereGrid;
});

window.addEventListener('resize', () => {
    if (sphereGrid) {
        sphereGrid.width = window.innerWidth;
        sphereGrid.height = window.innerHeight;
        sphereGrid.svg
            .attr("width", sphereGrid.width)
            .attr("height", sphereGrid.height);
    }
});