from flask import Flask, render_template, request, jsonify
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, IntegerField
from wtforms.validators import DataRequired, NumberRange
import json
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production

# In-memory storage for nodes (replace with database later)
disciples_data = []

# Sample initial data - you can replace this with your actual data
if not disciples_data:
    disciples_data = [
        {
            "id": 1,
            "name": "⚔️ Warrior", 
            "description": "Master of combat",
            "type": "combat",
            "skills": ["Attack", "Defense", "Stamina"]
        },
        {
            "id": 2, 
            "name": "🧙 Mage",
            "description": "Wielder of magic", 
            "type": "magic",
            "skills": ["Fire", "Ice", "Lightning"]
        },
        {
            "id": 3,
            "name": "🏹 Archer", 
            "description": "Master of ranged combat",
            "type": "ranged", 
            "skills": ["Precision", "Speed", "Eagle Eye"]
        }
    ]

class CustomNodeForm(FlaskForm):
    name = StringField('Node Name', validators=[DataRequired()])
    description = TextAreaField('Description')
    node_type = SelectField('Type', choices=[
        ('combat', '⚔️ Combat'),
        ('magic', '🧙 Magic'), 
        ('ranged', '🏹 Ranged'),
        ('support', '🛡️ Support'),
        ('stealth', '🗡️ Stealth'),
        ('custom', '⭐ Custom')
    ])
    icon = StringField('Icon/Prefix', default='⭐')

# Main route - render the sphere grid
@app.route('/')
def index():
    return render_template('index.html')

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "sphere-grid-api"
    })

# Get all disciples/nodes
@app.route('/api/disciples')
def get_disciples():
    return jsonify({
        "disciples": disciples_data,
        "count": len(disciples_data),
        "timestamp": datetime.now().isoformat()
    })

# Get specific disciple by ID
@app.route('/api/disciples/<int:disciple_id>')
def get_disciple(disciple_id):
    disciple = next((d for d in disciples_data if d["id"] == disciple_id), None)
    if disciple:
        return jsonify(disciple)
    return jsonify({"error": "Disciple not found"}), 404

# Create new custom node
@app.route('/api/create-custom-node', methods=['POST'])
def create_custom_node():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'name' not in data:
            return jsonify({"error": "Missing required field: name"}), 400
        
        # Generate new ID
        new_id = max([d["id"] for d in disciples_data], default=0) + 1
        
        # Create new node with icon/prefix support
        new_node = {
            "id": new_id,
            "name": data.get('name', 'New Node'),
            "description": data.get('description', ''),
            "type": data.get('type', 'custom'),
            "icon": data.get('icon', '⭐'),
            "skills": data.get('skills', []),
            "created_at": datetime.now().isoformat()
        }
        
        # Add icon prefix if not already present
        if not new_node['name'].startswith(new_node['icon']):
            new_node['name'] = f"{new_node['icon']} {new_node['name']}"
        
        disciples_data.append(new_node)
        
        return jsonify({
            "success": True,
            "node": new_node,
            "message": "Custom node created successfully"
        }), 201
        
    except Exception as e:
        return jsonify({
            "error": "Failed to create custom node",
            "details": str(e)
        }), 500

# Update existing node
@app.route('/api/disciples/<int:disciple_id>', methods=['PUT'])
def update_disciple(disciple_id):
    try:
        data = request.get_json()
        disciple = next((d for d in disciples_data if d["id"] == disciple_id), None)
        
        if not disciple:
            return jsonify({"error": "Disciple not found"}), 404
        
        # Update fields
        if 'name' in data:
            disciple['name'] = data['name']
        if 'description' in data:
            disciple['description'] = data['description']
        if 'type' in data:
            disciple['type'] = data['type']
        if 'icon' in data:
            disciple['icon'] = data['icon']
        if 'skills' in data:
            disciple['skills'] = data['skills']
            
        disciple['updated_at'] = datetime.now().isoformat()
        
        return jsonify({
            "success": True,
            "node": disciple,
            "message": "Node updated successfully"
        })
        
    except Exception as e:
        return jsonify({
            "error": "Failed to update node",
            "details": str(e)
        }), 500

# Delete node
@app.route('/api/disciples/<int:disciple_id>', methods=['DELETE'])
def delete_disciple(disciple_id):
    global disciples_data
    original_count = len(disciples_data)
    disciples_data = [d for d in disciples_data if d["id"] != disciple_id]
    
    if len(disciples_data) < original_count:
        return jsonify({
            "success": True,
            "message": "Node deleted successfully"
        })
    else:
        return jsonify({"error": "Node not found"}), 404

# Admin page for node management
@app.route('/admin')
def admin_panel():
    return render_template('admin.html', disciples=disciples_data)

# API endpoint for admin operations
@app.route('/api/admin/nodes', methods=['GET'])
def admin_get_nodes():
    return jsonify({
        "nodes": disciples_data,
        "total": len(disciples_data),
        "types": list(set(d.get('type', 'custom') for d in disciples_data))
    })

# Bulk operations for admin
@app.route('/api/admin/bulk-update', methods=['POST'])
def admin_bulk_update():
    try:
        data = request.get_json()
        operations = data.get('operations', [])
        results = []
        
        for op in operations:
            if op['action'] == 'delete':
                # Delete operation
                global disciples_data
                original_count = len(disciples_data)
                disciples_data = [d for d in disciples_data if d["id"] != op['id']]
                if len(disciples_data) < original_count:
                    results.append(f"Deleted node {op['id']}")
                    
            elif op['action'] == 'update':
                # Update operation
                disciple = next((d for d in disciples_data if d["id"] == op['id']), None)
                if disciple:
                    disciple.update(op['data'])
                    disciple['updated_at'] = datetime.now().isoformat()
                    results.append(f"Updated node {op['id']}")
        
        return jsonify({
            "success": True,
            "results": results,
            "processed": len(operations)
        })
        
    except Exception as e:
        return jsonify({
            "error": "Bulk operation failed",
            "details": str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    if request.path.startswith('/api/'):
        return jsonify({"error": "API endpoint not found"}), 404
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    if request.path.startswith('/api/'):
        return jsonify({"error": "Internal server error"}), 500
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)