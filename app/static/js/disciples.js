// Disciple System and Character Management

class DiscipleSystem {
    constructor() {
        this.disciples = {
            'dr-g': { 
                name: 'Dr. G. (Theory)', 
                color: '#590328', 
                position: { x: 0, y: 0 },
                description: 'Master theorist and central figure',
                symbol: '♦'
            },
            'anthony': { 
                name: 'Anthony (Engineer)', 
                color: '#e1ff00', 
                position: { x: -200, y: 0 },
                description: 'Engineer & Practitioner',
                symbol: '⚡'
            },
            'janet': { 
                name: 'Janet (Architect)', 
                color: '#3e0359', 
                position: { x: 200, y: 0 },
                description: 'Architect & Design',
                symbol: '◊'
            },
            'christopher': { 
                name: 'Christopher (Admin)', 
                color: '#033f59', 
                position: { x: 0, y: 200 },
                description: 'Administration & STEM',
                symbol: '♦'
            },
            'phoenix': { 
                name: 'Phoenix (Self-Mastery)', 
                color: '#590303', 
                position: { x: 0, y: -200 },
                description: 'Self-Mastery and personal development',
                symbol: '☥'
            }
        };

        this.learningPaths = {
            'cyber-engineer': {
                name: 'Cyber Engineer Path',
                color: '#ff4757',
                disciple: 'anthony',
                description: 'Complete cybersecurity certification path',
                skills: [] // Will be populated by FormationSystem
            },
            'systems-engineer': {
                name: 'Systems Engineer Path', 
                color: '#5352ed',
                disciple: 'anthony',
                description: 'Infrastructure and systems administration',
                skills: []
            },
            'data-scientist': {
                name: 'Data Scientist Path',
                color: '#3742fa',
                disciple: 'janet',
                description: 'Machine learning and data analysis',
                skills: []
            },
            'software-architect': {
                name: 'Software Architect Path',
                color: '#a55eea',
                disciple: 'janet',
                description: 'Software design and architecture',
                skills: []
            },
            'stem-foundation': {
                name: 'STEM Foundation Path',
                color: '#26de81',
                disciple: 'christopher',
                description: 'Mathematical and scientific foundations',
                skills: []
            },
            'self-mastery': {
                name: 'Self-Mastery Path',
                color: '#ff6b6b',
                disciple: 'phoenix',
                description: 'Personal development and growth',
                skills: []
            }
        };

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

    getDiscipleInfo(discipleKey) {
        return this.disciples[discipleKey];
    }

    getLearningPath(pathKey) {
        return this.learningPaths[pathKey];
    }

    getCharacterPaths(character) {
        return this.characterPaths[character];
    }

    getAllDisciples() {
        return this.disciples;
    }

    getAllLearningPaths() {
        return this.learningPaths;
    }

    getAllCharacterPaths() {
        return this.characterPaths;
    }

    updateLearningPathSkills(pathKey, skills) {
        if (this.learningPaths[pathKey]) {
            this.learningPaths[pathKey].skills = skills;
        }
    }

    getPathsForDisciple(discipleKey) {
        const characterData = this.characterPaths[discipleKey];
        return characterData ? characterData.paths : [];
    }

    getDiscipleColor(discipleKey) {
        return this.disciples[discipleKey]?.color || '#ffffff';
    }

    getDiscipleSymbol(discipleKey) {
        return this.disciples[discipleKey]?.symbol || '●';
    }

    getDiscipleDescription(discipleKey) {
        return this.disciples[discipleKey]?.description || 'Unknown disciple';
    }

    createDiscipleNode(discipleKey, skillId) {
        const disciple = this.disciples[discipleKey];
        if (!disciple) return null;

        return {
            id: skillId,
            name: disciple.name.split('(')[0].trim(),
            formation: 'Disciples',
            x: disciple.position.x,
            y: disciple.position.y,
            state: 'available',
            type: 'disciple',
            disciple: discipleKey,
            prerequisites: [],
            connections: []
        };
    }

    // Check if a skill belongs to a specific disciple's domain
    isSkillInDiscipleDomain(skill, discipleKey) {
        const paths = this.getPathsForDisciple(discipleKey);
        return paths.some(pathKey => {
            const path = this.learningPaths[pathKey];
            return path && path.skills.some(pathSkill => pathSkill.id === skill.id);
        });
    }

    // Get the primary disciple for a specific skill type
    getPrimaryDiscipleForSkillType(skillType) {
        const typeToDisciple = {
            'cyber': 'anthony',
            'systems': 'anthony',
            'data': 'janet',
            'software': 'janet',
            'stem': 'christopher',
            'selfmastery': 'phoenix'
        };
        return typeToDisciple[skillType] || 'dr-g';
    }
}