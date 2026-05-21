// Canvas Renderer for Graph Visualizations

export class GraphRenderer {
    constructor(canvasContainer, algoName) {
        this.container = canvasContainer;
        this.algoName = algoName;
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.nodes = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.colors = {
            node: '#1e293b',
            nodeText: '#f8fafc',
            edge: 'rgba(148, 163, 184, 0.2)',
            visit: '#38bdf8',
            edgeVisit: '#fbbf24',
            path: '#4ade80'
        };
    }

    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    setNodes(count) {
        this.nodes = [];
        const padding = 40;
        for (let i = 0; i < count; i++) {
            this.nodes.push({
                x: padding + Math.random() * (this.canvas.width - 2 * padding),
                y: padding + Math.random() * (this.canvas.height - 2 * padding),
                id: i
            });
        }
    }

    draw(graph, state = { visitedNodes: [], visitedEdges: [], path: [] }) {
        const { ctx, canvas, nodes } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw edges
        ctx.lineWidth = 1;
        for (let u in graph) {
            const uIdx = parseInt(u);
            const neighbors = graph[u];
            neighbors.forEach(neighbor => {
                const vIdx = typeof neighbor === 'object' ? neighbor.node : neighbor;
                const weight = neighbor.weight;
                
                const uNode = nodes[uIdx];
                const vNode = nodes[vIdx];
                
                let color = this.colors.edge;
                let lineWidth = 1;
                
                if (state.path.some((node, i) => i > 0 && ((state.path[i-1] === uIdx && node === vIdx) || (state.path[i-1] === vIdx && node === uIdx)))) {
                    color = this.colors.path;
                    lineWidth = 3;
                } else if (state.visitedEdges.some(e => (e[0] === uIdx && e[1] === vIdx) || (e[0] === vIdx && e[1] === uIdx))) {
                    color = this.colors.edgeVisit;
                    lineWidth = 2;
                }

                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.moveTo(uNode.x, uNode.y);
                ctx.lineTo(vNode.x, vNode.y);
                ctx.stroke();

                if (weight !== undefined) {
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '10px Inter';
                    ctx.fillText(weight, (uNode.x + vNode.x) / 2, (uNode.y + vNode.y) / 2);
                }
            });
        }

        // Draw nodes
        nodes.forEach(node => {
            let color = this.colors.node;
            let stroke = 'rgba(255, 255, 255, 0.1)';
            
            if (state.path.includes(node.id)) {
                color = this.colors.path;
            } else if (state.visitedNodes.includes(node.id)) {
                color = this.colors.visit;
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.stroke();

            ctx.fillStyle = this.colors.nodeText;
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.id, node.x, node.y);
        });
    }
}
