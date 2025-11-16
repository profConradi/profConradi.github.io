# Blog System Documentation

## Overview

The blog system allows you to publish scientific articles written in Markdown with full support for:
- **LaTeX equations** (inline and display mode)
- **Images and plots** (PNG, JPEG, SVG)
- **Videos** (MP4, WebM)
- **Code blocks** with syntax highlighting
- **Professional typesetting** with the same editorial design as the rest of the site

## Quick Start: Publishing a New Article

### 1. Write Your Article

Create a new Markdown file in `content/articles/` with a descriptive filename (e.g., `my-article-title.md`):

```markdown
# Your Article Title

Introduction paragraph with inline equation $E = mc^2$ and text.

## Section Heading

Display equation:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

More content here...
```

### 2. Add Metadata

Edit `content/articles.json` and add your article's metadata:

```json
{
  "items": [
    {
      "title": "Your Article Title",
      "slug": "my-article-title",
      "date": "2025-01-20",
      "summary": "A brief summary that appears on the articles listing page.",
      "tags": ["mathematics", "physics", "visualization"],
      "readTime": "15 min"
    }
  ]
}
```

**Important**: The `slug` field must match your filename (without the `.md` extension).

### 3. View Your Article

- **Article listing**: Navigate to the "Articles" section on the homepage
- **Individual article**: Visit `article.html?id=my-article-title`

## Writing Articles

### Markdown Basics

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

[Link text](https://example.com)

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2

> Blockquote for important notes or citations
```

### Math Equations

**Inline equations** (within text):
```markdown
The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$.
```

**Display equations** (centered, on their own line):
```markdown
$$
\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}
$$
```

**Multi-line equations**:
```markdown
$$
\begin{align}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0\epsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{align}
$$
```

**Common LaTeX commands**:
- Greek letters: `\alpha`, `\beta`, `\gamma`, `\Delta`, `\Omega`
- Operators: `\int`, `\sum`, `\prod`, `\lim`, `\nabla`
- Relations: `\leq`, `\geq`, `\approx`, `\equiv`, `\in`, `\subset`
- Symbols: `\infty`, `\partial`, `\pm`, `\times`, `\cdot`
- Fonts: `\mathbb{R}`, `\mathcal{L}`, `\mathbf{v}`, `\mathrm{d}x`

### Images and Plots

**Basic image**:
```markdown
![Alt text description](../images/my-plot.png)
```

**Image with caption**:
```markdown
<figure>
  <img src="../images/phase-portrait.png" alt="Phase portrait">
  <figcaption>Figure 1: Phase portrait of the system showing stable and unstable manifolds</figcaption>
</figure>
```

**Image placement**:
- Place images in the `images/` folder
- Reference them with relative path: `../images/filename.png`
- Supported formats: PNG, JPEG, SVG, GIF
- Recommended size: max width 1200px for optimal loading

### Videos

**Embedded video**:
```markdown
<video controls width="100%">
  <source src="../videos/simulation.mp4" type="video/mp4">
  Your browser does not support video playback.
</video>

*Video 1: Simulation showing particle trajectories over time*
```

**Video placement**:
- Create a `videos/` folder in the root directory
- Place MP4 or WebM files there
- Reference with: `../videos/filename.mp4`
- Keep file sizes reasonable (< 50MB for web delivery)
- Consider hosting large videos on YouTube/Vimeo and embedding:

```markdown
<iframe width="100%" height="450" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

### Code Blocks

**Inline code**:
```markdown
Use the `numpy.array()` function to create arrays.
```

**Code blocks with syntax highlighting**:
````markdown
```python
import numpy as np
import matplotlib.pyplot as plt

def mandelbrot(c, max_iter=100):
    z = 0
    for n in range(max_iter):
        if abs(z) > 2:
            return n
        z = z*z + c
    return max_iter
```
````

Supported languages: `python`, `javascript`, `bash`, `matlab`, `julia`, `cpp`, `java`

### Blockquotes

```markdown
> **Note**: This is an important observation that deserves special attention.
> It can span multiple lines.

> **Theorem** (Fermat's Last Theorem): There are no three positive integers $a$, $b$, and $c$ that satisfy the equation $a^n + b^n = c^n$ for any integer value of $n$ greater than 2.
```

### Lists

**Unordered lists**:
```markdown
- First item
- Second item
  - Nested item
  - Another nested item
- Third item
```

**Ordered lists**:
```markdown
1. First step
2. Second step
3. Third step
```

**Mixed lists**:
```markdown
1. Theoretical background
   - Previous work
   - Motivating examples
2. Methodology
   - Data collection
   - Analysis techniques
3. Results
```

## Article Metadata Fields

Edit `content/articles.json` to manage article metadata:

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | Yes | Article title (displayed in listing and article page) | `"Introduction to Complex Analysis"` |
| `slug` | Yes | URL-friendly identifier (must match `.md` filename) | `"complex-analysis-intro"` |
| `date` | Yes | Publication date (ISO format: YYYY-MM-DD) | `"2025-01-15"` |
| `summary` | Yes | Brief description for article cards | `"An introduction to complex functions and their properties"` |
| `tags` | No | Array of topic tags | `["mathematics", "complex analysis"]` |
| `readTime` | No | Estimated reading time | `"12 min"` |

**Example entry**:
```json
{
  "title": "Fourier Analysis in Quantum Mechanics",
  "slug": "fourier-quantum-mechanics",
  "date": "2025-01-20",
  "summary": "Exploring how Fourier transforms enable the transition between position and momentum representations in quantum mechanics.",
  "tags": ["physics", "quantum mechanics", "mathematics"],
  "readTime": "18 min"
}
```

## File Structure

```
portfolio-site/
├── content/
│   ├── articles/                 # Article markdown files
│   │   ├── article-one.md
│   │   ├── article-two.md
│   │   └── ...
│   └── articles.json             # Article metadata
├── images/                       # Images and plots
│   ├── plot1.png
│   ├── diagram.svg
│   └── ...
├── videos/                       # Video files (create if needed)
│   ├── simulation.mp4
│   └── ...
├── index.html                    # Homepage with article listing
├── article.html                  # Article display template
└── css/style.css                 # Styling (includes article styles)
```

## Best Practices

### Writing

1. **Start with an outline**: Plan your sections before writing
2. **Clear structure**: Use headings to organize content logically
3. **Equations**: Introduce notation before using it; explain all symbols
4. **Figures**: Reference all figures in the text ("as shown in Figure 1...")
5. **Consistency**: Use consistent notation throughout the article

### Equations

1. **Inline vs Display**: Use inline (`$...$`) for simple expressions in text, display (`$$...$$`) for important equations
2. **Numbering**: While MathJax supports equation numbering, keep it simple for web articles
3. **Alignment**: Use `align` environment for multi-line equations that should align at `=` or other operators
4. **Readability**: Break long equations across multiple lines

### Images

1. **Optimization**: Compress images before adding (aim for < 500KB per image)
2. **Resolution**: 72-96 DPI for web, max width 1200px
3. **Format**: PNG for diagrams/plots with transparency, JPEG for photographs
4. **Alt text**: Always provide descriptive alt text for accessibility
5. **Captions**: Use `<figure>` and `<figcaption>` for important images

### Videos

1. **Length**: Keep videos under 2-3 minutes for web delivery
2. **Compression**: Use H.264 codec for best compatibility
3. **Hosting**: For videos > 50MB, consider YouTube/Vimeo embedding
4. **Fallback**: Always provide a text description of video content

## Styling Notes

Articles automatically inherit the site's editorial design:

- **Typography**: Crimson Text serif for headings, system fonts for body
- **Colors**: Muted academic palette (slate blue accents)
- **Spacing**: Generous whitespace for readability
- **Responsive**: Automatically adjusts for mobile devices
- **Reading width**: Content limited to ~800px for optimal reading

**Do not** add custom CSS or inline styles—the existing styles are carefully designed for readability and consistency.

## Example Template

Here's a complete article template to get started:

```markdown
# Article Title: Subtitle if Needed

Brief introduction establishing context and main ideas. Use inline math $x^2 + y^2 = r^2$ naturally in sentences.

## Background

Establish necessary background knowledge. Reference existing work:

> As noted by Einstein (1905), the relationship between energy and mass is fundamental to modern physics.

## Mathematical Formulation

Introduce key equations with clear notation:

$$
\frac{\partial u}{\partial t} = \alpha \nabla^2 u
$$

where $u(x,t)$ is the temperature field, $t$ is time, and $\alpha$ is thermal diffusivity.

## Computational Implementation

Show relevant code:

```python
def heat_equation_step(u, alpha, dx, dt):
    """Compute one time step of the heat equation."""
    laplacian = (np.roll(u, 1) + np.roll(u, -1) - 2*u) / dx**2
    return u + alpha * dt * laplacian
```

## Results

Present findings with figures:

![Temperature evolution](../images/heat-eq-results.png)
*Figure 1: Temperature field evolution showing diffusion over time*

## Conclusion

Summarize key points and potential extensions.

## References

- Author, A. (Year). *Title*. Publisher.
- Author, B. (Year). "Article Title". *Journal Name*, vol(issue), pages.

---

*Article by Simone Conradi, [date]*
```

## Troubleshooting

### Equations not rendering

- Check that MathJax script is loaded (view page source, look for `mathjax@3` CDN)
- Verify equation syntax with a [LaTeX equation editor](https://www.codecogs.com/latex/eqneditor.php)
- Ensure proper delimiters: `$...$` for inline, `$$...$$` for display
- Escape special characters if needed

### Images not displaying

- Verify file path is correct (relative to article, e.g., `../images/file.png`)
- Check file exists in `images/` folder
- Ensure filename matches exactly (case-sensitive)
- Try absolute path for debugging: `/images/file.png`

### Article not appearing in listing

- Check `articles.json` syntax is valid JSON
- Ensure `slug` matches `.md` filename exactly
- Verify date format is `YYYY-MM-DD`
- Clear browser cache and reload

### Styling issues

- Don't add custom CSS—use existing markdown features
- For special formatting needs, use semantic HTML: `<figure>`, `<blockquote>`, etc.
- Contact developer if new styling requirements emerge

## Advanced Features

### Custom HTML

You can include custom HTML when needed:

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
  <div>
    <img src="../images/plot1.png" alt="Plot 1">
    <p>Left: Initial conditions</p>
  </div>
  <div>
    <img src="../images/plot2.png" alt="Plot 2">
    <p>Right: Final state</p>
  </div>
</div>
```

### Interactive Content

For interactive visualizations, you can embed:

```html
<iframe src="interactive-simulation.html" width="100%" height="600px" frameborder="0"></iframe>
```

Create the interactive content in a separate HTML file and embed it.

### Mathematical Environments

Advanced LaTeX environments are supported:

```latex
$$
\begin{cases}
x = r\cos\theta \\
y = r\sin\theta
\end{cases}
$$
```

```latex
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$
```

## Publishing Workflow

1. **Write** article in Markdown: `content/articles/my-article.md`
2. **Add metadata** to `content/articles.json`
3. **Add media** (images/videos) to respective folders
4. **Test locally** by opening `article.html?id=my-article` in browser
5. **Commit and push** to GitHub
6. **Verify** on live site (GitHub Pages auto-deploys)

---

**Questions or issues?** Consult the main project documentation or contact the developer.
