// Formation System and Learning Path Generation

class FormationSystem {
    constructor(discipleSystem) {
        this.discipleSystem = discipleSystem;
        this.skills = [];
        this.formations = [];
        this.connections = [];
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

    generateAllFormations() {
        this.skills = [];
        this.formations = [];
        let skillId = 0;

        // Create Dr. G. central node
        const drGNode = this.discipleSystem.createDiscipleNode('dr-g', skillId++);
        this.skills.push(drGNode);

        // Cyber Security Path (Anthony's domain)
        const cyberFormation = this.createCyberFormation(skillId);
        skillId += cyberFormation.skills.length;
        this.formations.push(cyberFormation);

        // Systems Engineering Path (Anthony's domain)
        const systemsFormation = this.createSystemsFormation(skillId);
        skillId += systemsFormation.skills.length;
        this.formations.push(systemsFormation);

        // Data Science Path (Janet's domain)
        const dataFormation = this.createDataFormation(skillId);
        skillId += dataFormation.skills.length;
        this.formations.push(dataFormation);

        // Software Architecture Path (Janet's domain)
        const softwareFormation = this.createSoftwareFormation(skillId);
        skillId += softwareFormation.skills.length;
        this.formations.push(softwareFormation);

        // STEM Foundation Path (Christopher's domain)
        const stemFormation = this.createSTEMFormation(skillId);
        skillId += stemFormation.skills.length;
        this.formations.push(stemFormation);

        // Self-Mastery Path (Phoenix's domain)
        const selfMasteryFormation = this.createSelfMasteryFormation(skillId);
        skillId += selfMasteryFormation.skills.length;
        this.formations.push(selfMasteryFormation);

        // Create other disciple nodes
        Object.keys(this.discipleSystem.getAllDisciples()).forEach(key => {
            if (key !== 'dr-g') {
                const discipleNode = this.discipleSystem.createDiscipleNode(key, skillId++);
                this.skills.push(discipleNode);
            }
        });

        // Update learning path skills in disciple system
        this.updateDiscipleSystemPaths();

        // Create connections
        this.createAllConnections();

        return {
            skills: this.skills,
            formations: this.formations,
            connections: this.connections
        };
    }

    createCyberFormation(startId) {
        const formation = {
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
                id: startId + i,
                name: skill.name,
                formation: 'Cyber Security Mastery',
                x: x,
                y: y,
                state: skill.state,
                type: 'cyber',
                disciple: 'anthony',
                prerequisites: i === 0 ? [] : [startId + i - 1],
                connections: []
            };
            formation.skills.push(cyberSkill);
            this.skills.push(cyberSkill);
        });

        return formation;
    }

    createSystemsFormation(startId) {
        const formation = {
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
                id: startId + i,
                name: skill.name,
                formation: 'Systems Engineering',
                x: x,
                y: y,
                state: skill.state,
                type: 'systems',
                disciple: 'anthony',
                prerequisites: i === 0 ? [] : [startId + i - 1],
                connections: []
            };
            formation.skills.push(systemSkill);
            this.skills.push(systemSkill);
        });

        return formation;
    }

    createDataFormation(startId) {
        const formation = {
            type: 'semicircle',
            name: 'Data Science & ML',
            center: { x: 200, y: -100 },
            radius: 60,
            nodes: this.generateSemiCircularFormation(200, -100, 60, 5, -Math.PI/3, Math.PI/3),
            disciple: 'janet',
            skills: []
        };

        const dataSkills = ['Data Science', 'Machine Learning', 'Algorithms', 'Python ML', 'Deep Learning'];
        formation.nodes.forEach((node, i) => {
            const skill = {
                id: startId + i,
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
            formation.skills.push(skill);
            this.skills.push(skill);
        });

        return formation;
    }

    createSoftwareFormation(startId) {
        const formation = {
            type: 'circle',
            name: 'Software Architecture',
            center: { x: 200, y: 100 },
            radius: 50,
            nodes: this.generateCircularFormation(200, 100, 50, 6),
            disciple: 'janet',
            skills: []
        };

        const softwareSkills = ['Design Patterns', 'Architecture', 'Microservices', 'Cloud Design', 'System Design', 'DevOps'];
        formation.nodes.forEach((node, i) => {
            const skill = {
                id: startId + i,
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
            formation.skills.push(skill);
            this.skills.push(skill);
        });

        return formation;
    }

    createSTEMFormation(startId) {
        const formation = {
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
                id: startId + i,
                name: skill.name,
                formation: 'STEM Foundations',
                x: x,
                y: y,
                state: skill.state,
                type: 'stem',
                disciple: 'christopher',
                prerequisites: i === 0 ? [] : [startId + i - 1],
                connections: []
            };
            formation.skills.push(stemSkill);
            this.skills.push(stemSkill);
        });

        return formation;
    }

    createSelfMasteryFormation(startId) {
        const formation = {
            type: 'circle',
            name: 'Self-Mastery',
            center: { x: 0, y: -200 },
            radius: 60,
            nodes: this.generateCircularFormation(0, -200, 60, 8),
            disciple: 'phoenix',
            skills: []
        };

        const selfMasterySkills = ['Philosophy', 'Psychology', 'Leadership', 'Communication', 'Critical Thinking', 'Creativity', 'Discipline', 'Growth Mindset'];
        formation.nodes.forEach((node, i) => {
            const skill = {
                id: startId + i,
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
            formation.skills.push(skill);
            this.skills.push(skill);
        });

        return formation;
    }

    updateDiscipleSystemPaths() {
        // Update learning paths with actual skills
        this.discipleSystem.updateLearningPathSkills('cyber-engineer', 
            this.skills.filter(s => s.type === 'cyber'));
        this.discipleSystem.updateLearningPathSkills('systems-engineer', 
            this.skills.filter(s => s.type === 'systems'));
        this.discipleSystem.updateLearningPathSkills('data-scientist', 
            this.skills.filter(s => s.type === 'data'));
        this.discipleSystem.updateLearningPathSkills('software-architect', 
            this.skills.filter(s => s.type === 'software'));
        this.discipleSystem.updateLearningPathSkills('stem-foundation', 
            this.skills.filter(s => s.type === 'stem'));
        this.discipleSystem.updateLearningPathSkills('self-mastery', 
            this.skills.filter(s => s.type === 'selfmastery'));
    }

    createAllConnections() {
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

        // Connect formations internally and to disciples
        this.formations.forEach(formation => {
            this.createFormationConnections(formation);
        });
    }

    createFormationConnections(formation) {
        // Connect adjacent nodes within formation
        formation.skills.forEach((skill, i) => {
            if (formation.type === 'circle') {
                const nextIndex = (i + 1) % formation.skills.length;
                this.connections.push({
                    source: skill,
                    target: formation.skills[nextIndex],
                    type: 'within-formation',
                    formation: formation.name
                });
            } else if (formation.type === 'semicircle' || formation.type === 'linear') {
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

        // Connect formation to its disciple
        if (formation.disciple && formation.skills.length > 0) {
            const disciple = this.skills.find(s => s.type === 'disciple' && s.disciple === formation.disciple);
            if (disciple) {
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
}