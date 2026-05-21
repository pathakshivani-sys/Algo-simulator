// Canvas Renderer for Sorting bars

export class Renderer {
    constructor(canvasContainer, algoName) {
        this.container = canvasContainer;
        this.algoName = algoName;
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.colors = {
            default: '#38bdf8', // accent-color
            compare: '#fbbf24', // amber (warning)
            swap: '#f87171',    // coral (danger)
            sorted: '#4ade80',  // teal (success)
            background: 'rgba(0, 0, 0, 0)'
        };
    }

    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    /**
     * Draws the array as a bar chart.
     * @param {number[]} arr 
     * @param {Object} activeIndices { compare: [], swap: [], sorted: boolean }
     */
    draw(arr, activeIndices = { compare: [], swap: [], sorted: false }) {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);

        const n = arr.length;
        const barWidth = width / n;
        const maxVal = Math.max(...arr) || 1;

        for (let i = 0; i < n; i++) {
            let color = this.colors.default;
            let glow = false;

            if (activeIndices.sorted) {
                color = this.colors.sorted;
            } else if (activeIndices.found && activeIndices.found.includes(i)) {
                color = this.colors.sorted;
                glow = true;
            } else if (activeIndices.swap.includes(i)) {
                color = this.colors.swap;
                glow = true;
            } else if (activeIndices.compare.includes(i)) {
                color = this.colors.compare;
            }

            const barHeight = (arr[i] / maxVal) * (height * 0.9);
            const x = i * barWidth;
            const y = height - barHeight;

            // Gradient for bars
            const grad = this.ctx.createLinearGradient(x, y, x, height);
            grad.addColorStop(0, color);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');

            if (glow) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = color;
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fillStyle = grad;
            this.drawRoundedRect(x + 1, y, barWidth - 2, barHeight, 4);
        }
        this.ctx.shadowBlur = 0; // Reset shadow
    }

    drawRoundedRect(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.arcTo(x + w, y, x + w, y + h, r);
        this.ctx.arcTo(x + w, y + h, x, y + h, r);
        this.ctx.arcTo(x, y + h, x, y, r);
        this.ctx.arcTo(x, y, x + w, y, r);
        this.ctx.closePath();
        this.ctx.fill();
    }
}
