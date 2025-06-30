# 🌐 Sphere Grid - Dr. G.'s Learning Ecosystem

An authentic FFX-style interactive learning path visualization inspired by Final Fantasy X's Sphere Grid system. This project maps out comprehensive skill development tracks across multiple disciplines, organized around five core learning personas.

![Sphere Grid Preview](assets/preview.png)

## ✨ Features

### 🎯 **Learning Path System**
- **Dr. G. (Theory)** - Central hub connecting all learning domains
- **Anthony (Engineer)** - Cybersecurity, Systems, and Network engineering
- **Janet (Architect)** - Data Science, Software Architecture, and Design
- **Christopher (Admin)** - STEM foundations and Administration
- **Phoenix (Self-Mastery)** - Personal development and growth mindset

### 🎮 **Interactive Elements**
- **Zoom & Pan** - Navigate through the learning landscape
- **Path Highlighting** - Click disciples to see their learning tracks
- **Skill Progression** - Visual states: locked → available → completed → mastered
- **Formation Outlines** - Toggle skill area boundaries
- **Responsive Design** - Works on desktop and mobile devices

### 🎨 **Visual Design**
- **Authentic FFX Aesthetics** - Mystical background patterns and energy effects
- **Animated Connections** - Flowing energy between related skills
- **Glowing Formations** - Breathing formation boundaries
- **Character-Specific Colors** - Each disciple has a unique color scheme

## 🚀 Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- Local web server (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sphere-grid.git
   cd sphere-grid
   ```

2. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using VS Code Live Server extension
   # Right-click index.html > "Open with Live Server"
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
sphere-grid/
├── index.html              # Main entry point
├── css/
│   ├── styles.css          # Base layout and UI styling
│   ├── animations.css      # All animations and transitions
│   └── formations.css      # Node and formation specific styles
├── js/
│   ├── main.js            # Core application logic
│   ├── disciples.js       # Disciple/character system
│   ├── formations.js      # Learning path generation
│   └── interactions.js    # User interaction handlers
├── data/
│   └── learning-paths.json # Learning path configuration
├── assets/
│   └── preview.png        # Preview images
└── README.md              # This file
```

## 🎮 Controls

### Mouse/Touch
- **Click & Drag** - Pan around the sphere grid
- **Mouse Wheel** - Zoom in/out
- **Click Node** - View skill/disciple information
- **Click Disciple** - Highlight their learning paths

### Keyboard Shortcuts
- **R** - Reset view to center
- **S** - Simulate learning progress
- **F** - Toggle formation outlines
- **H** - Highlight all learning paths
- **L** - Toggle legend panel
- **ESC** - Close skill info panel

### UI Controls
- **☰ Toggle** - Show/hide legend panel
- **Legend Items** - Click to switch between disciples
- **Reset View** - Return to default zoom/position
- **Simulate Progress** - Randomly advance skill states
- **Toggle Outlines** - Show/hide formation boundaries
- **Highlight All Paths** - Display all learning tracks

## 🛠️ Customization

### Adding New Learning Paths

1. **Update `data/learning-paths.json`**
   ```json
   {
     "learningPaths": {
       "your-new-path": {
         "name": "Your New Learning Path",
         "disciple": "anthony",
         "color": "#ff6b6b",
         "type": "linear",
         "skills": [
           { "name": "Skill 1", "resources": ["Resource 1"] },
           { "name": "Skill 2", "resources": ["Resource 2"] }
         ]
       }
     }
   }
   ```

2. **Add formation logic in `js/formations.js`**
   ```javascript
   createYourNewFormation(startId) {
     // Implementation details
   }
   ```

### Modifying Disciples

Update the disciples section in `data/learning-paths.json`:
```json
{
  "disciples": {
    "your-disciple": {
      "name": "Your Disciple Name",
      "color": "#custom-color",
      "position": { "x": 0, "y": 300 },
      "description": "Disciple description",
      "symbol": "★"
    }
  }
}
```

### Styling Customization

- **Colors**: Modify CSS custom properties in `css/styles.css`
- **Animations**: Adjust timing and effects in `css/animations.css`
- **Node Styles**: Update formation styles in `css/formations.css`

## 🔧 Development

### Architecture

The application follows a modular architecture:

- **Main Application** (`main.js`) - Core sphere grid functionality
- **Disciple System** (`disciples.js`) - Character and path management
- **Formation System** (`formations.js`) - Learning path generation
- **Interaction System** (`interactions.js`) - User event handling

### Data Flow

1. **Initialization** - Load learning path data and create formations
2. **Rendering** - Draw SVG elements for nodes, connections, and formations
3. **Interaction** - Handle user input and update visual state
4. **State Management** - Track skill progression and active paths

### Performance Considerations

- **SVG Optimization** - Efficient node and connection rendering
- **Event Delegation** - Minimal event listener overhead
- **Smooth Animations** - Hardware-accelerated CSS transforms
- **Responsive Design** - Adaptive layouts for different screen sizes

## 📚 Learning Path Sources

The learning paths are based on real educational resources and certification tracks:

### Anthony's Engineering Domain
- **CompTIA Certifications** - Security+, Server+, Linux+, Network+
- **Cisco Networking** - CCNA, CCIE tracks
- **Cybersecurity** - Penetration testing, security analysis

### Janet's Architecture Domain
- **Data Science** - Python, Machine Learning, Algorithms
- **Software Architecture** - Design patterns, microservices, cloud design
- **System Design** - Scalable architecture principles

### Christopher's STEM Domain
- **Mathematics** - Algebra through Calculus
- **Sciences** - Physics, Chemistry, Biology
- **Engineering** - Circuit analysis, systems thinking

### Phoenix's Self-Mastery Domain
- **Philosophy** - Critical thinking, ethics
- **Psychology** - Growth mindset, emotional intelligence
- **Leadership** - Communication, team management

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Contribution Guidelines
- Follow existing code style and structure
- Add appropriate documentation for new features
- Test on multiple browsers and devices
- Update learning path data thoughtfully

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Final Fantasy X** - Inspiration for the Sphere Grid system
- **D3.js** - Powerful data visualization library
- **Educational Resources** - All the books, courses, and certifications that make up these learning paths
- **Canvas Learning Systems** - Inspiration for interconnected knowledge maps

## 🔮 Future Enhancements

- **Progress Tracking** - Local storage for skill completion
- **Resource Integration** - Direct links to learning materials
- **Achievement System** - Badges and milestones
- **Collaborative Features** - Shared learning progress
- **Mobile App** - Native mobile experience
- **VR/AR Mode** - Immersive 3D learning environment

---

*"The sphere grid represents the infinite potential for growth and learning. Each node is a stepping stone to mastery." - Dr. G.*