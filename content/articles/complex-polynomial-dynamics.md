# Introduction to Complex Polynomial Dynamics

The study of polynomial dynamics in the complex plane reveals extraordinary visual patterns that emerge from simple mathematical rules. This article explores how iterating polynomials creates intricate structures, combining rigorous mathematical analysis with computational visualization.

## Mathematical Foundations

Consider a polynomial $p(z)$ where $z \in \mathbb{C}$ is a complex number. The dynamics of iterating this polynomial—computing $z_0, z_1 = p(z_0), z_2 = p(z_1), \ldots$—reveals rich behavior depending on the initial value $z_0$ and the polynomial's coefficients.

### The Julia Set

For a polynomial $p(z) = z^2 + c$, the **Julia set** $J(p)$ is defined as the boundary between points that escape to infinity under iteration and those that remain bounded. Mathematically:

$$
J(p) = \partial \{z \in \mathbb{C} : \lim_{n \to \infty} |p^n(z)| = \infty\}
$$

where $p^n$ denotes $n$ iterations of $p$.

## Parametric Polynomial Families

My artistic work explores parametric families of higher-degree polynomials. For instance:

$$
p(z; t_1, t_2) = z^{12} + a_1(t_1, t_2) z^5 + a_2(t_1, t_2) z^2 + c
$$

where $t_1, t_2 \in S^1$ (the unit circle) and coefficients $a_i$ vary continuously with these parameters.

### Root Density Visualization

Instead of iterating the polynomial, I compute the density of roots as parameters vary. For each point $w$ in the complex plane, I determine how many parameter combinations $(t_1, t_2)$ yield $w$ as a root:

$$
\rho(w) = \left|\left\{(t_1, t_2) \in S^1 \times S^1 : \exists k \text{ such that } p(w; t_1, t_2) = 0\right\}\right|
$$

This density function $\rho(w)$ creates the flowing, organic structures visible in the artwork.

## Computational Methods

### Numerical Root Finding

Finding polynomial roots numerically requires sophisticated algorithms. For a polynomial of degree $n$:

```python
import numpy as np
from scipy.optimize import fsolve

def find_roots(coefficients):
    """Find all roots of a polynomial using eigenvalue decomposition."""
    # Construct companion matrix
    n = len(coefficients) - 1
    companion = np.zeros((n, n))
    companion[1:, :-1] = np.eye(n-1)
    companion[:, -1] = -coefficients[:-1] / coefficients[-1]

    # Roots are eigenvalues of companion matrix
    roots = np.linalg.eigvals(companion)
    return roots
```

### Parallelization

Computing the root density over a $2000 \times 2000$ grid with $360 \times 360$ parameter samples requires evaluating approximately $5.2 \times 10^{11}$ polynomials. This demands parallel computation:

- **GPU acceleration**: CUDA kernels evaluate polynomials in parallel
- **Vectorization**: NumPy operations process entire arrays simultaneously
- **Distributed computing**: Multiple machines handle different parameter ranges

The computational complexity is $O(n \cdot m^2 \cdot k^2)$ where:
- $n$ is polynomial degree
- $m \times m$ is spatial resolution
- $k \times k$ is parameter resolution

## Color Mapping

The density values $\rho(w)$ are mapped to colors using a carefully designed scheme. For the "Stellar flux" piece:

$$
\text{hue}(w) = \arg(w) \cdot \frac{180}{\pi} \pmod{360}
$$

$$
\text{saturation}(w) = \min\left(1, \frac{\rho(w)}{\rho_{\text{max}}} \right)
$$

$$
\text{lightness}(w) = 0.5 + 0.3 \cdot \sin\left(\frac{\rho(w)}{10}\right)
$$

This HSL representation creates the aurora-like gradients while encoding mathematical information in the visual structure.

## Example: Phase Portrait

Below is a phase portrait of $f(z) = z^3 - 1$, showing how complex numbers map under this transformation:

![Phase portrait example](../images/creature125_2__dimensioni_medie.jpeg)
*Figure 1: Phase portrait showing three basins of attraction for the cube roots of unity*

> **Note**: In actual articles, you would include your own generated plots. This example reuses an existing image for demonstration purposes.

## Theoretical Connections

This approach connects several mathematical domains:

1. **Algebraic Geometry**: The root locus as parameters vary traces out algebraic curves
2. **Topology**: Bifurcations occur when roots collide, changing the topology of level sets
3. **Dynamical Systems**: Though not iterating, the parameter space exhibits similar complexity to dynamical systems

### Bifurcation Theory

Critical parameter values where polynomial behavior changes dramatically satisfy:

$$
\frac{\partial p}{\partial z}(z^*; t_1^*, t_2^*) = 0 \quad \text{and} \quad p(z^*; t_1^*, t_2^*) = 0
$$

These simultaneous conditions identify points where multiple roots coincide—visually, these appear as density concentrations in the artwork.

## Applications

Beyond aesthetic appeal, these visualizations have practical applications:

- **Engineering**: Root locus methods in control theory
- **Physics**: Wave function analysis in quantum mechanics
- **Data Science**: High-dimensional parameter space exploration

The techniques developed for artistic visualization transfer directly to scientific visualization of complex-valued functions.

## Video Demonstration

Here's how to embed a video showing the continuous variation of roots:

<video controls width="100%">
  <source src="../videos/example-animation.mp4" type="video/mp4">
  Your browser does not support video playback.
</video>

*Video 1: Animation showing roots evolving as parameters $(t_1, t_2)$ traverse the unit circle*

> **Note**: To include videos, place MP4 files in a `videos/` directory and reference them as shown above.

## Implementation Details

### Complete Algorithm

The full algorithm for generating these images:

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import hsv_to_rgb

def generate_root_density(polynomial_func, grid_size=2000, param_samples=360):
    # Create complex grid
    x = np.linspace(-2, 2, grid_size)
    y = np.linspace(-2, 2, grid_size)
    X, Y = np.meshgrid(x, y)
    W = X + 1j*Y

    # Initialize density array
    density = np.zeros((grid_size, grid_size))

    # Sample parameter space
    t1_values = np.linspace(0, 2*np.pi, param_samples)
    t2_values = np.linspace(0, 2*np.pi, param_samples)

    for t1 in t1_values:
        for t2 in t2_values:
            # Get polynomial coefficients for these parameters
            coeffs = polynomial_func(t1, t2)

            # Find roots
            roots = np.roots(coeffs)

            # Increment density near each root
            for root in roots:
                distances = np.abs(W - root)
                density += np.exp(-distances**2 / 0.01)

    return density, W

def color_map(density, W):
    # Map density to HSV
    hue = (np.angle(W) + np.pi) / (2*np.pi)
    saturation = np.clip(density / np.max(density), 0, 1)
    value = 0.5 + 0.3*np.sin(density/10)

    # Convert to RGB
    hsv = np.dstack([hue, saturation, value])
    rgb = hsv_to_rgb(hsv)

    return rgb
```

### Performance Optimization

For production-quality images at high resolution:

- **Adaptive sampling**: Increase resolution near high-density regions
- **Caching**: Store computed roots for reused parameter values
- **Progressive refinement**: Generate low-resolution preview, then refine iteratively

## Conclusion

The intersection of complex analysis, computational mathematics, and visual art creates a fertile ground for exploration. These techniques demonstrate that rigorous mathematics and aesthetic beauty are not opposing goals—they naturally reinforce each other.

The patterns that emerge are neither arbitrary artistic choices nor purely mathematical abstractions. They represent the visible manifestation of deep mathematical structures, made accessible through computation and color.

## Further Reading

- **Douady, A. & Hubbard, J.** (1984). *Étude dynamique des polynômes complexes*. Publications Mathématiques d'Orsay.
- **Peitgen, H.-O. & Richter, P.H.** (1986). *The Beauty of Fractals*. Springer-Verlag.
- **Milnor, J.** (2006). *Dynamics in One Complex Variable*. Princeton University Press.

---

*All visualizations and code examples in this article are original work by Simone Conradi, combining mathematical rigor with computational artistry.*
