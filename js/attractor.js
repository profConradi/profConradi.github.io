// 3D Attractor Animation for Hero Section
// Inspired by the Simone 3D attractor dynamics

class AttractorAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.numParticles = 50000;
        this.particles = [];
        this.time = 0;
        this.cameraAngle = Math.PI / 4;
        this.cameraRadius = 3;

        // Attractor parameters (from the notebook)
        this.a = 2.51;
        this.b = 0.01;
        this.scale = 2.5;
        this.dt = 0.015;

        this.initParticles();
        this.setupCanvas();
        this.animate = this.animate.bind(this);
    }

    initParticles() {
        // Initialize particles randomly in a cube
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2,
                size: Math.random() * 0.3 + 0.1
            });
        }

        // Let the attractor settle for a bit
        for (let i = 0; i < 500; i++) {
            this.updateParticles();
        }
    }

    setupCanvas() {
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
    }

    updateParticles() {
        // Apply attractor dynamics
        const { a, b, scale, dt } = this;

        for (let p of this.particles) {
            // Calculate derivatives (from the notebook's step function)
            const dx = Math.sin(a * p.y + Math.cos(b * p.z));
            const dy = Math.sin(a * p.z + Math.cos(b * p.x));
            const dz = Math.sin(a * p.x + Math.cos(b * p.y));

            // Update positions using the attractor dynamics
            p.x += (scale * dx - p.x) * dt;
            p.y += (scale * dy - p.y) * dt;
            p.z += (scale * dz - p.z) * dt;
        }
    }

    project3D(x, y, z) {
        // Simple perspective projection with orbiting camera
        const theta = this.cameraAngle;
        const phi = Math.PI / 4;
        const r = this.cameraRadius;

        // Camera position
        const camX = r * Math.sin(theta) * Math.cos(phi);
        const camY = r * Math.sin(theta) * Math.sin(phi);
        const camZ = r * Math.cos(theta);

        // Translate to camera space
        const dx = x - camX;
        const dy = y - camY;
        const dz = z - camZ;

        // Rotate to align with camera
        const cosTheta = Math.cos(-theta);
        const sinTheta = Math.sin(-theta);
        const cosPhi = Math.cos(-phi);
        const sinPhi = Math.sin(-phi);

        // Apply rotations
        const x1 = dx * cosTheta - dy * sinTheta;
        const y1 = dx * sinTheta + dy * cosTheta;
        const z1 = dz;

        const x2 = x1;
        const y2 = y1 * cosPhi - z1 * sinPhi;
        const z2 = y1 * sinPhi + z1 * cosPhi;

        // Perspective projection
        const fov = 500;
        const scale = fov / (fov + z2);

        return {
            x: this.width / 2 + x2 * scale * 100,
            y: this.height / 2 + y2 * scale * 100,
            scale: scale,
            depth: z2
        };
    }

    draw() {
        // Clear canvas with background color (matches page background)
        this.ctx.fillStyle = '#fafaf8';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Sort particles by depth for proper rendering
        const projected = this.particles.map(p => ({
            ...this.project3D(p.x, p.y, p.z),
            size: p.size
        })).sort((a, b) => a.depth - b.depth);

        // Draw particles
        for (let p of projected) {
            if (p.scale > 0 && p.x >= 0 && p.x <= this.width && p.y >= 0 && p.y <= this.height) {
                // Color based on depth - subtle slate blue to warm copper gradient
                const t = (p.depth + 2) / 4; // Normalize depth
                const hue = 200 + t * 30; // Blue to cyan range
                const saturation = 40 + t * 20;
                const lightness = 50 + t * 20;

                // Use muted colors that match the site palette
                const alpha = 0.4 + p.scale * 0.4;
                this.ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

                const size = p.size * p.scale * 2;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    animate() {
        this.updateParticles();
        this.draw();

        // Slowly rotate camera
        this.cameraAngle += 0.002;
        this.time += 0.01;

        requestAnimationFrame(this.animate);
    }

    start() {
        this.animate();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('attractor-canvas');
    if (canvas) {
        const animation = new AttractorAnimation(canvas);
        animation.start();
    }
});
