// 3D Attractor WebGPU Background Animation
// Based on custom attractor: sin(a*y + cos(b*z)), etc.

class AttractorBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.numParticles = 50000; // Reduced for web performance
        this.time = 0;
        this.cameraAngle = Math.PI / 4;

        // Attractor parameters
        this.params = {
            a: 2.51,
            b: 0.01,
            scale: 2.0,
            dt: 0.015
        };

        this.init();
    }

    async init() {
        if (!navigator.gpu) {
            console.warn('WebGPU not supported');
            return;
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            console.warn('No GPU adapter found');
            return;
        }

        this.device = await adapter.requestDevice();

        const context = this.canvas.getContext('webgpu');
        const format = navigator.gpu.getPreferredCanvasFormat();

        context.configure({
            device: this.device,
            format: format,
            alphaMode: 'premultiplied'
        });

        this.context = context;
        this.format = format;

        await this.createBuffers();
        await this.createPipelines();

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.animate();
    }

    async createBuffers() {
        // Initialize particle positions randomly
        const positions = new Float32Array(this.numParticles * 4); // x, y, z, padding
        for (let i = 0; i < this.numParticles; i++) {
            positions[i * 4 + 0] = (Math.random() - 0.5) * 2;
            positions[i * 4 + 1] = (Math.random() - 0.5) * 2;
            positions[i * 4 + 2] = (Math.random() - 0.5) * 2;
            positions[i * 4 + 3] = 0;
        }

        // "Settle" the attractor for better initial state
        for (let iter = 0; iter < 100; iter++) {
            for (let i = 0; i < this.numParticles; i++) {
                const idx = i * 4;
                const x = positions[idx];
                const y = positions[idx + 1];
                const z = positions[idx + 2];

                const dx = Math.sin(this.params.a * y + Math.cos(this.params.b * z));
                const dy = Math.sin(this.params.a * z + Math.cos(this.params.b * x));
                const dz = Math.sin(this.params.a * x + Math.cos(this.params.b * y));

                positions[idx] += (this.params.scale * dx - x) * this.params.dt;
                positions[idx + 1] += (this.params.scale * dy - y) * this.params.dt;
                positions[idx + 2] += (this.params.scale * dz - z) * this.params.dt;
            }
        }

        this.positionBuffer = this.device.createBuffer({
            size: positions.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
        new Float32Array(this.positionBuffer.getMappedRange()).set(positions);
        this.positionBuffer.unmap();

        // Uniform buffer for parameters
        this.uniformBuffer = this.device.createBuffer({
            size: 64, // 4 floats padding to 64 bytes
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }

    async createPipelines() {
        // Compute shader for particle update
        const computeShader = this.device.createShaderModule({
            code: `
                struct Params {
                    a: f32,
                    b: f32,
                    scale: f32,
                    dt: f32
                }

                @group(0) @binding(0) var<storage, read_write> positions: array<vec4<f32>>;
                @group(0) @binding(1) var<uniform> params: Params;

                @compute @workgroup_size(64)
                fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
                    let index = global_id.x;
                    if (index >= arrayLength(&positions)) {
                        return;
                    }

                    let pos = positions[index].xyz;
                    let x = pos.x;
                    let y = pos.y;
                    let z = pos.z;

                    // Attractor equations
                    let dx = sin(params.a * y + cos(params.b * z));
                    let dy = sin(params.a * z + cos(params.b * x));
                    let dz = sin(params.a * x + cos(params.b * y));

                    let new_pos = pos + (params.scale * vec3(dx, dy, dz) - pos) * params.dt;
                    positions[index] = vec4(new_pos, 0.0);
                }
            `
        });

        const computeBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } }
            ]
        });

        this.computePipeline = this.device.createComputePipeline({
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [computeBindGroupLayout]
            }),
            compute: {
                module: computeShader,
                entryPoint: 'main'
            }
        });

        this.computeBindGroup = this.device.createBindGroup({
            layout: computeBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: this.positionBuffer } },
                { binding: 1, resource: { buffer: this.uniformBuffer } }
            ]
        });

        // Render shader for particles
        const renderShader = this.device.createShaderModule({
            code: `
                struct VertexOutput {
                    @builtin(position) position: vec4<f32>,
                    @location(0) color: vec4<f32>
                }

                struct Uniforms {
                    viewProj: mat4x4<f32>,
                    time: f32
                }

                @group(0) @binding(0) var<uniform> uniforms: Uniforms;

                @vertex
                fn vs_main(@location(0) pos: vec3<f32>) -> VertexOutput {
                    var output: VertexOutput;
                    output.position = uniforms.viewProj * vec4(pos, 1.0);

                    // Color based on position - muted tones matching the site
                    let colorFactor = (pos.x + 1.0) * 0.5;
                    // Muted slate blue to warm copper gradient
                    output.color = vec4(
                        mix(0.18, 0.83, colorFactor),  // R: slate to copper
                        mix(0.29, 0.65, colorFactor),  // G: slate to copper
                        mix(0.37, 0.45, colorFactor),  // B: slate to copper
                        0.4  // Semi-transparent
                    );

                    return output;
                }

                @fragment
                fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
                    return input.color;
                }
            `
        });

        this.renderPipeline = this.device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: renderShader,
                entryPoint: 'vs_main',
                buffers: [{
                    arrayStride: 16,
                    attributes: [{
                        shaderLocation: 0,
                        offset: 0,
                        format: 'float32x3'
                    }]
                }]
            },
            fragment: {
                module: renderShader,
                entryPoint: 'fs_main',
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: 'src-alpha',
                            dstFactor: 'one-minus-src-alpha'
                        },
                        alpha: {
                            srcFactor: 'one',
                            dstFactor: 'one-minus-src-alpha'
                        }
                    }
                }]
            },
            primitive: {
                topology: 'point-list'
            }
        });

        // Create uniform buffer for render pass
        this.renderUniformBuffer = this.device.createBuffer({
            size: 80, // mat4x4 (64) + float (4) + padding
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.renderBindGroup = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.renderUniformBuffer }
            }]
        });
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;
    }

    updateCamera() {
        const aspect = this.canvas.width / this.canvas.height;

        // Slowly rotating camera
        this.cameraAngle += 0.002;
        const radius = 6;
        const theta = Math.PI / 4;
        const phi = this.cameraAngle;

        const camX = radius * Math.sin(theta) * Math.cos(phi);
        const camY = radius * Math.sin(theta) * Math.sin(phi);
        const camZ = radius * Math.cos(theta);

        // View matrix (lookAt)
        const eye = [camX, camY, camZ];
        const center = [0, 0, 0];
        const up = [0, 0, 1];

        const view = this.lookAt(eye, center, up);

        // Perspective projection
        const fov = 50 * Math.PI / 180;
        const near = 0.1;
        const far = 100;
        const proj = this.perspective(fov, aspect, near, far);

        // Combine
        const viewProj = this.multiplyMatrices(proj, view);

        return viewProj;
    }

    lookAt(eye, center, up) {
        const z = this.normalize(this.subtract(eye, center));
        const x = this.normalize(this.cross(up, z));
        const y = this.cross(z, x);

        return [
            x[0], x[1], x[2], 0,
            y[0], y[1], y[2], 0,
            z[0], z[1], z[2], 0,
            -this.dot(x, eye), -this.dot(y, eye), -this.dot(z, eye), 1
        ];
    }

    perspective(fov, aspect, near, far) {
        const f = 1 / Math.tan(fov / 2);
        const nf = 1 / (near - far);

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ];
    }

    multiplyMatrices(a, b) {
        const result = new Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i * 4 + j] =
                    a[i * 4 + 0] * b[0 * 4 + j] +
                    a[i * 4 + 1] * b[1 * 4 + j] +
                    a[i * 4 + 2] * b[2 * 4 + j] +
                    a[i * 4 + 3] * b[3 * 4 + j];
            }
        }
        return result;
    }

    normalize(v) {
        const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return [v[0] / len, v[1] / len, v[2] / len];
    }

    subtract(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    animate() {
        if (!this.device) return;

        this.time += 0.016;

        // Update uniforms
        const params = new Float32Array([
            this.params.a, this.params.b, this.params.scale, this.params.dt
        ]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, params);

        // Compute pass - update particles
        const commandEncoder = this.device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(this.computePipeline);
        computePass.setBindGroup(0, this.computeBindGroup);
        computePass.dispatchWorkgroups(Math.ceil(this.numParticles / 64));
        computePass.end();

        // Update camera
        const viewProj = this.updateCamera();
        const renderUniforms = new Float32Array([...viewProj, this.time, 0, 0, 0]);
        this.device.queue.writeBuffer(this.renderUniformBuffer, 0, renderUniforms);

        // Render pass
        const textureView = this.context.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 250/255, g: 250/255, b: 248/255, a: 1 }, // Background color
                loadOp: 'clear',
                storeOp: 'store'
            }]
        });

        renderPass.setPipeline(this.renderPipeline);
        renderPass.setBindGroup(0, this.renderBindGroup);
        renderPass.setVertexBuffer(0, this.positionBuffer);
        renderPass.draw(this.numParticles);
        renderPass.end();

        this.device.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('attractor-canvas');
    if (canvas) {
        new AttractorBackground(canvas);
    }
});
