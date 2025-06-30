/**
 * Enhanced Node Creation System for FFX Sphere Grid
 * Containerized version with Flask integration
 */

class EnhancedNodeCreator {
    constructor(sphereGridInstance) {
        this.sphereGrid = sphereGridInstance;
        this.isCreationMode = false;
        this.creationForm = null;
        
        this.initializeCreationInterface();
        this.bindEvents();
        
        console.log("📝 Enhanced Node Creator initialized (Containerized)");
    }
    
    initializeCreationInterface() {
        this.createFloatingAddButton();
        this.createSimpleNodeModal();
        this.createAdvancedNodeModal();
        this.createCreationModeIndicators();
        this.addEnhancedStyles();
    }
    
    createFloatingAddButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'enhanced-add-container';
        buttonContainer.innerHTML = `
            <div class="add-button-group">
                <button id="main-add-btn" class="floating-add-btn main-add" title="Add Node">
                    <span>⊕</span>
                </button>
                <div class="add-options" id="addOptions" style="display: none;">
                    <button class="add-option simple-add" onclick="nodeCreator.startSimpleCreation()" title="Quick Test Node">
                        <span>⚡</span> Simple
                    </button>
                    <button class="add-option advanced-add" onclick="nodeCreator.startAdvancedCreation()" title="Full Feature Node">
                        <span>🌟</span> Advanced
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(buttonContainer);
        
        document.getElementById('main-add-btn').addEventListener('click', () => {
            const options = document.getElementById('addOptions');
            const isVisible = options.style.display !== 'none';
            options.style.display = isVisible ? 'none' : 'block';
        });
    }
    
    createSimpleNodeModal() {
        const simpleModal = document.createElement('div');
        simpleModal.id = 'simple-node-modal';
        simpleModal.className = 'node-creation-modal simple-modal';
        simpleModal.innerHTML = `
            <div class="modal-content simple-content">
                <div class="modal-header">
                    <h3>⚡ Quick Test Node</h3>
                    <button class="close-btn" onclick="nodeCreator.cancelCreation()">×</button>
                </div>
                
                <form id="simple-node-form" class="simple-node-form">
                    <div class="form-row">
                        <input type="text" id="simple-node-name" placeholder="Node Name" required>
                        <select id="simple-node-disciple" required>
                            <option value="">Select Disciple</option>
                            <option value="dr-g">Dr. G (Theory)</option>
                            <option value="anthony">Anthony (Engineering)</option>
                            <option value="janet">Janet (Architecture)</option>
                            <option value="christopher">Christopher (STEM)</option>
                            <option value="phoenix">Phoenix (Self-Mastery)</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <textarea id="simple-node-description" placeholder="Brief description (optional)" rows="2"></textarea>
                    </div>
                    
                    <div class="creation-instructions">
                        <p>💡 <strong>Quick Creation Mode</strong></p>
                        <p>Click anywhere on the grid to place your test node</p>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="nodeCreator.cancelCreation()" class="secondary-btn">Cancel</button>
                        <button type="submit" class="primary-btn">Ready to Place</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(simpleModal);
    }
    
    createAdvancedNodeModal() {
        const advancedModal = document.createElement('div');
        advancedModal.id = 'advanced-node-modal';
        advancedModal.className = 'node-creation-modal advanced-modal';
        advancedModal.innerHTML = `
            <div class="modal-content advanced-content">
                <div class="modal-header">
                    <h3>🌟 Advanced Node Creation</h3>
                    <button class="close-btn" onclick="nodeCreator.cancelCreation()">×</button>
                </div>
                
                <form id="advanced-node-form" class="advanced-node-form">
                    <div class="form-section">
                        <h4>📝 Basic Information</h4>
                        <div class="form-row">
                            <input type="text" id="advanced-node-name" placeholder="Node Name" required>
                            <select id="advanced-node-disciple" required>
                                <option value="">Select Disciple</option>
                                <option value="dr-g">Dr. G (Central Theory)</option>
                                <option value="anthony">Anthony (Engineering)</option>
                                <option value="janet">Janet (Architecture)</option>
                                <option value="christopher">Christopher (STEM)</option>
                                <option value="phoenix">Phoenix (Self-Mastery)</option>
                            </select>
                        </div>
                        <textarea id="advanced-node-description" placeholder="Detailed description" rows="3"></textarea>
                    </div>
                    
                    <div class="form-section">
                        <h4>📚 Course Integration</h4>
                        <div class="form-row">
                            <label class="checkbox-label">
                                <input type="checkbox" id="link-to-course"> 
                                Link to existing course from keystone
                            </label>
                        </div>
                        <select id="existing-courses" style="display: none;">
                            <option value="">Select Course</option>
                        </select>
                    </div>
                    
                    <div class="form-section">
                        <h4>📖 Resources</h4>
                        <div class="resources-builder" id="resourcesBuilder">
                            <div class="resource-item">
                                <input type="text" placeholder="Resource Name" class="resource-name">
                                <input type="url" placeholder="Resource URL" class="resource-url">
                                <button type="button" onclick="nodeCreator.addResourceField()" class="add-resource-btn">+</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="creation-instructions">
                        <p>🎯 <strong>Advanced Creation Mode</strong></p>
                        <p>Complete the form, then click anywhere on the grid to place your node</p>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="nodeCreator.cancelCreation()" class="secondary-btn">Cancel</button>
                        <button type="submit" class="primary-btn">Ready to Place</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(advancedModal);
    }
    
    createCreationModeIndicators() {
        const creationIndicator = document.createElement('div');
        creationIndicator.id = 'creation-mode-indicator';
        creationIndicator.className = 'creation-mode-indicator';
        creationIndicator.style.display = 'none';
        creationIndicator.innerHTML = `
            <div class="indicator-content">
                <h3 id="creation-mode-title">🎯 Node Creation Mode</h3>
                <p id="creation-mode-instructions">Click anywhere on the grid to place your node</p>
                <button onclick="nodeCreator.cancelCreation()" class="cancel-creation-btn">Cancel (ESC)</button>
            </div>
        `;
        
        document.body.appendChild(creationIndicator);
    }
    
    bindEvents() {
        // Form submissions
        document.getElementById('simple-node-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.prepareSimpleNodeCreation();
        });
        
        document.getElementById('advanced-node-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.prepareAdvancedNodeCreation();
        });
        
        // Course linking
        document.getElementById('link-to-course').addEventListener('change', (e) => {
            const coursesSelect = document.getElementById('existing-courses');
            if (e.target.checked) {
                coursesSelect.style.display = 'block';
                this.loadExistingCourses();
            } else {
                coursesSelect.style.display = 'none';
            }
        });
        
        // ESC key and click handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isCreationMode) {
                this.cancelCreation();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (this.isCreationMode && this.creationForm && 
                e.target.closest('#sphere-grid-svg')) {
                this.placeNodeAtClick(e);
            }
        });
    }
    
    // Creation methods
    startSimpleCreation() {
        this.hideAddOptions();
        document.getElementById('simple-node-modal').style.display = 'block';
        document.getElementById('simple-node-name').focus();
    }
    
    startAdvancedCreation() {
        this.hideAddOptions();
        document.getElementById('advanced-node-modal').style.display = 'block';
        document.getElementById('advanced-node-name').focus();
    }
    
    prepareSimpleNodeCreation() {
        const name = document.getElementById('simple-node-name').value.trim();
        const disciple = document.getElementById('simple-node-disciple').value;
        const description = document.getElementById('simple-node-description').value.trim();
        
        if (!name || !disciple) {
            alert('Please fill in the name and select a disciple');
            return;
        }
        
        this.creationForm = {
            type: 'simple',
            name: name,
            disciple: disciple,
            description: description || `Quick test node: ${name}`,
            resources: [],
            prerequisites: [],
            isCustom: true
        };
        
        this.enterCreationMode('simple');
    }
    
    prepareAdvancedNodeCreation() {
        const name = document.getElementById('advanced-node-name').value.trim();
        const disciple = document.getElementById('advanced-node-disciple').value;
        const description = document.getElementById('advanced-node-description').value.trim();
        
        if (!name || !disciple) {
            alert('Please fill in the name and select a disciple');
            return;
        }
        
        this.creationForm = {
            type: 'advanced',
            name: name,
            disciple: disciple,
            description: description,
            resources: this.collectResources(),
            linkedCourse: document.getElementById('link-to-course').checked ? 
                document.getElementById('existing-courses').value : null,
            isCustom: true
        };
        
        this.enterCreationMode('advanced');
    }
    
    enterCreationMode(type) {
        this.isCreationMode = true;
        document.getElementById(`${type}-node-modal`).style.display = 'none';
        
        const indicator = document.getElementById('creation-mode-indicator');
        const title = document.getElementById('creation-mode-title');
        const instructions = document.getElementById('creation-mode-instructions');
        
        title.textContent = type === 'simple' ? '⚡ Simple Node Placement' : '🌟 Advanced Node Placement';
        instructions.textContent = 'Click anywhere on the grid to place your node';
        
        indicator.style.display = 'block';
        document.body.style.cursor = 'crosshair';
    }
    
    placeNodeAtClick(event) {
        if (!this.creationForm) return;
        
        const svg = document.getElementById('sphere-grid-svg');
        const rect = svg.getBoundingClientRect();
        const viewBox = svg.viewBox.baseVal;
        
        const x = ((event.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
        const y = ((event.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;
        
        this.creationForm.position = { x: x, y: y };
        this.creationForm.id = `custom_node_${Date.now()}`;
        
        this.createNodeFromForm();
        this.exitCreationMode();
        
        console.log(`✅ ${this.creationForm.type} node placed at (${x.toFixed(0)}, ${y.toFixed(0)})`);
    }
    
    async createNodeFromForm() {
        // Save to Flask container API
        if (window.flaskAPI) {
            try {
                const result = await window.flaskAPI.post('/api/create-custom-node', this.creationForm);
                console.log('✅ Node saved to Flask container:', result);
                this.showSuccessNotification(this.creationForm);
            } catch (error) {
                console.error('❌ Failed to save to Flask container:', error);
                this.showErrorNotification(error);
            }
        }
        
        // Integrate with your sphere grid
        if (this.sphereGrid && this.sphereGrid.addCustomNode) {
            this.sphereGrid.addCustomNode(this.creationForm);
        }
    }
    
    // Helper methods
    collectResources() {
        const resources = [];
        const resourceItems = document.querySelectorAll('#resourcesBuilder .resource-item');
        
        resourceItems.forEach(item => {
            const name = item.querySelector('.resource-name').value.trim();
            const url = item.querySelector('.resource-url').value.trim();
            
            if (name && url) {
                resources.push({ name, url });
            }
        });
        
        return resources;
    }
    
    addResourceField() {
        const builder = document.getElementById('resourcesBuilder');
        const newItem = document.createElement('div');
        newItem.className = 'resource-item';
        newItem.innerHTML = `
            <input type="text" placeholder="Resource Name" class="resource-name">
            <input type="url" placeholder="Resource URL" class="resource-url">
            <button type="button" onclick="this.parentElement.remove()" class="remove-resource-btn">−</button>
        `;
        builder.appendChild(newItem);
    }
    
    async loadExistingCourses() {
        if (window.flaskAPI) {
            try {
                const courses = await window.flaskAPI.get('/courses');
                const select = document.getElementById('existing-courses');
                select.innerHTML = '<option value="">Select Course</option>';
                
                courses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.id;
                    option.textContent = `${course.title} (${course.instructor})`;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Failed to load courses:', error);
            }
        }
    }
    
    showSuccessNotification(nodeData) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>✅ Node Created Successfully!</h4>
                <p><strong>${nodeData.name}</strong> added to ${nodeData.disciple}'s domain</p>
                <p>Type: ${nodeData.type === 'simple' ? 'Quick Test' : 'Advanced'} Node</p>
                <p>🐳 Saved to container database</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    showErrorNotification(error) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>❌ Error Creating Node</h4>
                <p>${error.message || 'Unknown error occurred'}</p>
                <p>Node may still appear locally</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    cancelCreation() {
        this.exitCreationMode();
        this.hideAllModals();
        this.hideAddOptions();
        this.creationForm = null;
    }
    
    exitCreationMode() {
        this.isCreationMode = false;
        document.body.style.cursor = 'default';
        document.getElementById('creation-mode-indicator').style.display = 'none';
    }
    
    hideAllModals() {
        document.getElementById('simple-node-modal').style.display = 'none';
        document.getElementById('advanced-node-modal').style.display = 'none';
    }
    
    hideAddOptions() {
        document.getElementById('addOptions').style.display = 'none';
    }
    
    addEnhancedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Enhanced creation styles for containers */
            #enhanced-add-container {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 1000;
            }
            
            .floating-add-btn.main-add {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #590328, #3e0359);
                color: #e1ff00;
                border: 2px solid #e1ff00;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(89, 3, 40, 0.4);
                transition: all 0.3s ease;
            }
            
            .add-options {
                position: absolute;
                bottom: 70px;
                right: 0;
                background: rgba(3, 63, 89, 0.95);
                border: 1px solid #e1ff00;
                border-radius: 8px;
                padding: 10px;
                min-width: 120px;
                backdrop-filter: blur(10px);
            }
            
            .add-option {
                display: block;
                width: 100%;
                padding: 8px 12px;
                margin-bottom: 5px;
                background: transparent;
                color: #e1ff00;
                border: 1px solid transparent;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }
            
            .node-creation-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .modal-content {
                background: linear-gradient(135deg, rgba(89, 3, 40, 0.95), rgba(62, 3, 89, 0.95));
                border: 2px solid #e1ff00;
                border-radius: 12px;
                padding: 30px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                color: #e1ff00;
            }
            
            .form-row {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .form-row input, .form-row select, .form-row textarea {
                flex: 1;
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid #3e0359;
                border-radius: 4px;
                color: #e1ff00;
                font-size: 14px;
            }
            
            .form-section {
                margin-bottom: 25px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                border-left: 3px solid #e1ff00;
            }
            
            .creation-mode-indicator {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(89, 3, 40, 0.95);
                border: 2px solid #e1ff00;
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            }
            
            .success-notification, .error-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 20px;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                animation: slideInFromRight 0.3s ease-out;
            }
            
            .success-notification {
                background: linear-gradient(135deg, #28a745, #20c997);
            }
            
            .error-notification {
                background: linear-gradient(135deg, #dc3545, #c82333);
            }
            
            @keyframes slideInFromRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.sphereGrid || window.AuthenticFFXSphereGrid) {
            const sphereGridInstance = window.sphereGrid || window.AuthenticFFXSphereGrid;
            window.nodeCreator = new EnhancedNodeCreator(sphereGridInstance);
            console.log("🐳 Enhanced Node Creator ready in container!");
        }
    }, 1000);
});