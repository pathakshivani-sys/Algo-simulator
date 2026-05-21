// Chart.js integration for performance analysis

export class PerformanceChart {
    constructor(ctx) {
        this.ctx = ctx;
        this.colors = ['#06b6d4', '#10b981', '#fbbf24', '#ef4444', '#8b5cf6', '#f472b6', '#f97316', '#a3e635'];
        this.colorIdx = 0;
        this.initChart('line');
    }

    initChart(type) {
        if (this.chart) this.chart.destroy();
        this.type = type;
        this.chart = new Chart(this.ctx, {
            type: type,
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { 
                        grid: { color: 'rgba(255,255,255,0.04)' }, 
                        ticks: { color: '#94a3b8', maxTicksLimit: 8 } 
                    },
                    y: { 
                        grid: { color: 'rgba(255,255,255,0.04)' }, 
                        ticks: { color: '#94a3b8' } 
                    }
                },
                plugins: {
                    legend: { labels: { color: '#f8fafc', font: { family: 'Inter', size: 11 } } }
                },
                elements: { 
                    line: { tension: 0.4 }, 
                    point: { radius: 0 } 
                },
                animation: false,
            }
        });
        
        // Re-add existing datasets if they exist
        if (this._datasets) {
            this._datasets.forEach(d => {
                // Adjust fill based on type
                d.fill = this.type === 'bar';
                this.chart.data.datasets.push(d);
            });
            this.chart.update();
        }
    }

    setType(type) {
        if (type === this.type) return;
        this._datasets = [...this.chart.data.datasets];
        this.colorIdx = 0; // Reset color index for fresh assignment if needed, or keep it
        this.initChart(type);
    }

    addAlgorithm(name) {
        const color = this.colors[this.colorIdx % this.colors.length];
        this.colorIdx++;
        
        const newDataset = {
            label: name,
            data: [],
            borderColor: color,
            backgroundColor: color + '44',
            fill: this.type === 'bar'
        };
        
        this.chart.data.datasets.push(newDataset);
        this.chart.update();
    }

    addDataPoint(name, x, y) {
        const ds = this.chart.data.datasets.find(d => d.label === name);
        if (!ds) return;
        
        ds.data.push({ x, y });
        
        // Ensure labels are updated for the X-axis
        if (!this.chart.data.labels.includes(x)) {
            this.chart.data.labels.push(x);
            // Sort labels for correct axis rendering
            this.chart.data.labels.sort((a, b) => a - b);
        }
        
        this.chart.update('none');
    }

    reset() {
        this._datasets = null;
        this.chart.data.datasets = [];
        this.chart.data.labels = [];
        this.colorIdx = 0;
        this.chart.update();
    }
}
