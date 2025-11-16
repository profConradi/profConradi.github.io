// 3D Attractor Animation for Hero Section
// Based on custom strange attractor with equations:
// x' = sin(a*y + cos(b*z))
// y' = sin(a*z + cos(b*x))
// z' = sin(a*x + cos(b*y))

class AttractorAnimation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // Attractor parameters (from notebook)
        this.params = {
            a: 2.51,
            b: 0.01,
            scale: 2.0,
            dt: 0.003
        };

        // Particle system
        this.particleCount = 80000;
        this.particles = null;
        this.velocities = null;

        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.points = null;

        // Animation state
        this.time = 0;
        this.isInitialized = false;

        this.init();
    }

    init() {
        // Check for WebGL support
        if (!this.checkWebGLSupport()) {
            console.log('WebGL not supported, skipping attractor animation');
            return;
        }

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.createParticles();
        this.setupEventListeners();
        this.animate();

        this.isInitialized = true;
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        // Match homepage background color
        this.scene.background = new THREE.Color(0xfafaf8);
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);

        // Position camera for good view of attractor
        const radius = 6;
        const theta = Math.PI / 4;
        const phi = Math.PI / 4;

        this.camera.position.x = radius * Math.sin(theta) * Math.cos(phi);
        this.camera.position.y = radius * Math.sin(theta) * Math.sin(phi);
        this.camera.position.z = radius * Math.cos(theta);

        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 0, 1);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
    }

    createParticles() {
        // Initialize particle positions randomly
        this.particles = new Float32Array(this.particleCount * 3);
        const spread = 1.0;

        for (let i = 0; i < this.particleCount * 3; i++) {
            this.particles[i] = (Math.random() - 0.5) * spread * 2;
        }

        // Let particles settle on attractor
        for (let i = 0; i < 1000; i++) {
            this.updateParticles();
        }

        // Create geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(this.particles, 3));

        // Create colors - use accent colors from the site
        const colors = new Float32Array(this.particleCount * 3);
        for (let i = 0; i < this.particleCount; i++) {
            const idx = i * 3;
            const x = this.particles[idx];

            // Color based on position: blues and warm coppers
            if (x < -0.3) {
                // Warm copper/gold (matching --color-highlight: #d4a574)
                colors[idx] = 0.83;     // R
                colors[idx + 1] = 0.65; // G
                colors[idx + 2] = 0.45; // B
            } else {
                // Muted slate blue (matching --color-accent: #2d4a5e)
                colors[idx] = 0.18;     // R
                colors[idx + 1] = 0.29; // G
                colors[idx + 2] = 0.37; // B
            }
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create material
        const material = new THREE.PointsMaterial({
            size: 0.015,
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Create points mesh
        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
    }

    updateParticles() {
        const { a, b, scale, dt } = this.params;
        const positions = this.particles;

        for (let i = 0; i < this.particleCount; i++) {
            const idx = i * 3;
            const x = positions[idx];
            const y = positions[idx + 1];
            const z = positions[idx + 2];

            // Attractor equations
            const dx = Math.sin(a * y + Math.cos(b * z));
            const dy = Math.sin(a * z + Math.cos(b * x));
            const dz = Math.sin(a * x + Math.cos(b * y));

            // Update positions
            positions[idx] += (scale * dx - x) * dt;
            positions[idx + 1] += (scale * dy - y) * dt;
            positions[idx + 2] += (scale * dz - z) * dt;
        }
    }

    animate() {
        if (!this.isInitialized) return;

        requestAnimationFrame(() => this.animate());

        // Update particles
        this.updateParticles();
        this.points.geometry.attributes.position.needsUpdate = true;

        // Slowly rotate camera
        this.time += 0.0002;
        const radius = 6;
        const theta = Math.PI / 4;
        const phi = Math.PI / 4 + this.time;

        this.camera.position.x = radius * Math.sin(theta) * Math.cos(phi);
        this.camera.position.y = radius * Math.sin(theta) * Math.sin(phi);
        this.camera.position.z = radius * Math.cos(theta);

        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 0, 1);

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onWindowResize() {
        if (!this.isInitialized) return;

        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    dispose() {
        if (!this.isInitialized) return;

        window.removeEventListener('resize', this.onWindowResize);
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        if (this.points) {
            this.points.geometry.dispose();
            this.points.material.dispose();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure container is properly sized
    setTimeout(() => {
        window.attractorAnimation = new AttractorAnimation('attractor-canvas');
    }, 100);
});
