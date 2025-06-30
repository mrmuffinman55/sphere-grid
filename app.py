"""
Sphere Grid Flask Application
Serves your beautiful sphere grid with minimal Flask integration
"""

from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json
import sqlite3
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'sphere-grid-dev-key')
    DATABASE_URL = 'sqlite:///data/sphere_grid.db'
    DEBUG = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'

app.config.from_object(Config)

# Simple database initialization
def init_db():
    """Initialize SQLite database for basic functionality"""
    os.makedirs('data', exist_ok=True)
    conn = sqlite3.connect('data/sphere_grid.db')
    cursor = conn.cursor()
    
    # Simple custom nodes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS custom_nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id TEXT UNIQUE,
            name TEXT NOT NULL,
            description TEXT,
            disciple TEXT,
            position_x REAL,
            position_y REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    logger.info("Database initialized successfully")

# Routes
@app.route('/')
def index():
    """Serve your beautiful sphere grid interface"""
    return render_template('index.html')

@app.route('/health')
def health_check():
    """Health check for the application"""
    return jsonify({
        "status": "healthy",
        "service": "sphere-grid-flask",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/disciples')
def get_disciples():
    """Get your disciple system data"""
    disciples = {
        'dr-g': {
            'name': 'Dr. G. (Theory)',
            'color': '#590328',
            'symbol': '♦',
            'domain': 'Central Theory Hub',
            'position': {'x': 0, 'y': 0}
        },
        'anthony': {
            'name': 'Anthony (Engineer)',
            'color': '#e1ff00', 
            'symbol': '⚡',
            'domain': 'Engineering Domain',
            'position': {'x': -200, 'y': 0}
        },
        'janet': {
            'name': 'Janet (Architect)',
            'color': '#3e0359',
            'symbol': '◊', 
            'domain': 'Architecture Domain',
            'position': {'x': 200, 'y': 0}
        },
        'christopher': {
            'name': 'Christopher (Admin)',
            'color': '#033f59',
            'symbol': '♦',
            'domain': 'STEM Foundations',
            'position': {'x': 0, 'y': 200}
        },
        'phoenix': {
            'name': 'Phoenix (Self-Mastery)',
            'color': '#590303',
            'symbol': '☥',
            'domain': 'Self-Mastery',
            'position': {'x': 0, 'y': -200}
        }
    }
    return jsonify(disciples)

@app.route('/api/create-custom-node', methods=['POST'])
def create_custom_node():
    """Create custom node from enhanced creation system"""
    try:
        data = request.json
        
        conn = sqlite3.connect('data/sphere_grid.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO custom_nodes 
            (node_id, name, description, disciple, position_x, position_y)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data.get('id', f"custom_{int(datetime.now().timestamp())}"),
            data.get('name'),
            data.get('description'),
            data.get('disciple'),
            data.get('position', {}).get('x', 0),
            data.get('position', {}).get('y', 0)
        ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Custom node created: {data.get('name')}")
        return jsonify({'success': True, 'node_id': data.get('id')})
        
    except Exception as e:
        logger.error(f"Failed to create custom node: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# Static file serving
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('static/css', filename)

@app.route('/js/<path:filename>')  
def serve_js(filename):
    return send_from_directory('static/js', filename)

if __name__ == '__main__':
    init_db()
    
    logger.info("🌟 Sphere Grid Flask Application Starting...")
    logger.info("🎮 Your beautiful sphere grid preserved with Flask power!")
    logger.info("🌐 Access at: http://localhost:5000")
    
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000)