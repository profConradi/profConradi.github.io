// 3D Attractor Background Animation
// Based on custom attractor from notebook
// Using Canvas 2D with 3D projection

class AttractorBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.numParticles = 8000;
        this.time = 0;
        this.cameraAngle = Math.PI / 4;

        // Attractor parameters
        this.params = {
            a: 2.51,
            b: 0.01,
            scale: 2.0,
            dt: 0.015
        };

        this.particles = [];
        this.initParticles();
        this.resize();

        window.addEventListener('resize', () => this.resize());

        this.animate();
    }

    initParticles() {
        // Initialize random positions
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2,
                color: Math.random() // For color variation
            });
        }

        // Settle the attractor
        for (let iter = 0; iter < 100; iter++) {
            this.updateParticles();
        }
    }

    updateParticles() {
        const { a, b, scale, dt } = this.params;

        for (let p of this.particles) {
            const { x, y, z } = p;

            // Attractor equations
            const dx = Math.sin(a * y + Math.cos(b * z));
            const dy = Math.sin(a * z + Math.cos(b * x));
            const dz = Math.sin(a * x + Math.cos(b * y));

            p.x += (scale * dx - x) * dt;
            p.y += (scale * dy - y) * dt;
            p.z += (scale * dz - z) * dt;
        }
    }

    project3D(x, y, z) {
        // Rotating camera
        const radius = 6;
        const theta = Math.PI / 4;
        const phi = this.cameraAngle;

        const camX = radius * Math.sin(theta) * Math.cos(phi);
        const camY = radius * Math.sin(theta) * Math.sin(phi);
        const camZ = radius * Math.cos(theta);

        // Translate to camera space
        const dx = x - camX;
        const dy = y - camY;
        const dz = z - camZ;

        // Simple perspective projection
        const fov = 500;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < 0.1) return null;

        const scale = fov / (distance + 5);

        // Rotate around camera
        const cosP = Math.cos(-phi);
        const sinP = Math.sin(-phi);
        const cosT = Math.cos(-theta);
        const sinT = Math.sin(-theta);

        // Simplified rotation
        const x1 = dx * cosP - dy * sinP;
        const y1 = dx * sinP + dy * cosP;
        const z1 = dz;

        return {
            x: this.canvas.width / 2 + x1 * scale,
            y: this.canvas.height / 2 + (y1 * cosT - z1 * sinT) * scale,
            depth: distance,
            scale: scale
        };
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    animate() {
        this.time += 0.016;
        this.cameraAngle += 0.002;

        // Update particle positions
        this.updateParticles();

        // Clear canvas with background color
        this.ctx.fillStyle = '#fafaf8';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Project and sort particles by depth
        const projected = [];
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const proj = this.project3D(p.x, p.y, p.z);

            if (proj && proj.x >= 0 && proj.x <= this.canvas.width &&
                proj.y >= 0 && proj.y <= this.canvas.height) {
                projected.push({
                    ...proj,
                    colorFactor: p.color,
                    originalX: p.x
                });
            }
        }

        // Sort by depth (back to front)
        projected.sort((a, b) => b.depth - a.depth);

        // Draw particles
        for (let p of projected) {
            // Color gradient from slate blue to warm copper
            const t = (p.originalX + 2) / 4; // Normalize position to 0-1

            const r = Math.floor(46 + (212 - 46) * t);
            const g = Math.floor(74 + (165 - 74) * t);
            const b = Math.floor(94 + (116 - 94) * t);

            // Size based on depth (closer = larger)
            const size = Math.max(0.5, Math.min(3, p.scale * 0.4));

            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('attractor-canvas');
    if (canvas) {
        console.log('Initializing attractor animation...');
        new AttractorBackground(canvas);
    } else {
        console.warn('Attractor canvas not found');
    }
});
