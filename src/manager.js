import { generateDataset, wait } from './utils.js';
import { ALGORITHMS, bubbleSort, selectionSort, insertionSort, quickSort, mergeSort, heapSort, linearSearch, binarySearch } from './engine.js';
import { Renderer } from './renderer.js';
import { PerformanceChart } from './charts.js';

class SoundPlayer {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playTone(frequency, type = 'sine', duration = 0.05) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}

class RaceManager {
    constructor() {
        this.arena = document.getElementById('race-arena');
        this.statsContainer = document.getElementById('stats-container');
        this.insightPanel = document.getElementById('insight-text');
        this.speedSlider = document.getElementById('speed-slider');
        
        this.dataset = [];
        this.instances = [];
        this.isRunning = false;
        this.isPaused = false;
        this.speed = 50;
        this.prediction = null;
        
        this.chart = new PerformanceChart(document.getElementById('complexity-chart').getContext('2d'));
        this.sound = new SoundPlayer();
        
        this.initEventListeners();
        this.generateNewDataset();
    }

    initEventListeners() {
        document.getElementById('btn-generate').onclick = () => this.generateNewDataset();
        document.getElementById('btn-start').onclick = () => this.startRace();
        document.getElementById('btn-pause').onclick = () => this.togglePause();
        document.getElementById('btn-reset').onclick = () => this.resetRace();
        document.getElementById('btn-quiz-mode').onclick = () => this.openQuiz();
        document.getElementById('btn-close-leaderboard').onclick = () => {
            document.getElementById('leaderboard-overlay').classList.add('hidden');
        };
        this.speedSlider.oninput = (e) => {
            this.speed = parseInt(e.target.value);
        };
    }

    generateNewDataset() {
        const type = document.getElementById('select-dataset').value;
        this.dataset = generateDataset(50, type);
        this.resetRace();
    }

    resetRace() {
        this.isRunning = false;
        this.isPaused = false;
        this.arena.innerHTML = '';
        this.statsContainer.innerHTML = '';
        this.instances = [];
        this.chart.reset();
        
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-pause').disabled = true;
        document.getElementById('btn-pause').textContent = 'Pause';

        const datasetType = document.getElementById('select-dataset').value;
        const isSearch = datasetType === 'search-demo';

        if (isSearch) {
            this.dataset = [...this.dataset].sort((a, b) => a - b); // Binary search needs sorted data
            const target = this.dataset[Math.floor(Math.random() * this.dataset.length)];
            this.addAlgorithmInstance('Linear Search', (arr) => linearSearch(arr, target));
            this.addAlgorithmInstance('Binary Search', (arr) => binarySearch(arr, target));
        } else {
            const selectedAlgos = [
                { name: ALGORITHMS.BUBBLE, gen: bubbleSort },
                { name: ALGORITHMS.QUICK, gen: quickSort },
                { name: ALGORITHMS.MERGE, gen: mergeSort },
                { name: ALGORITHMS.HEAP, gen: heapSort }
            ];
            selectedAlgos.forEach(algo => {
                this.addAlgorithmInstance(algo.name, algo.gen);
            });
        }
    }

    addAlgorithmInstance(name, generatorFunc) {
        const slot = document.createElement('div');
        slot.className = 'algo-slot glass-card';
        slot.innerHTML = `
            <div class="algo-header">
                <h3>${name}</h3>
                <span class="status-badge" id="badge-${name.replace(/\s/g, '')}">Waiting</span>
            </div>
            <div class="algo-canvas-container" id="canvas-${name.replace(/\s/g, '')}"></div>
        `;
        this.arena.appendChild(slot);

        const canvasContainer = slot.querySelector('.algo-canvas-container');
        const renderer = new Renderer(canvasContainer, name);
        
        const statsEl = document.createElement('div');
        statsEl.className = 'stat-item';
        statsEl.innerHTML = `
            <strong>${name}</strong>
            <div class="stat-grid">
                <span>Swaps: <span id="swaps-${name.replace(/\s/g, '')}">0</span></span>
                <span>Compares: <span id="compares-${name.replace(/\s/g, '')}">0</span></span>
            </div>
        `;
        this.statsContainer.appendChild(statsEl);

        const instance = {
            name,
            array: [...this.dataset],
            generator: generatorFunc([...this.dataset]),
            renderer,
            stats: { swaps: 0, compares: 0, steps: 0 },
            finished: false,
            badge: slot.querySelector('.status-badge'),
            swapsEl: statsEl.querySelector(`#swaps-${name.replace(/\s/g, '')}`),
            comparesEl: statsEl.querySelector(`#compares-${name.replace(/\s/g, '')}`)
        };

        instance.renderer.draw(instance.array);
        this.instances.push(instance);
        this.chart.addAlgorithm(name);
    }

    async startRace() {
        if (this.isRunning) return;
        this.sound.init(); // Initialize audio context on user gesture
        this.isRunning = true;
        document.getElementById('btn-start').disabled = true;
        document.getElementById('btn-pause').disabled = false;

        while (this.isRunning && this.instances.some(inst => !inst.finished)) {
            if (this.isPaused) {
                await wait(100);
                continue;
            }

            for (const instance of this.instances) {
                if (instance.finished) continue;

                const { value, done } = instance.generator.next();
                if (done) {
                    instance.finished = true;
                    instance.badge.textContent = 'Finished';
                    instance.badge.classList.add('finished');
                    instance.renderer.draw(instance.array, { compare: [], swap: [], sorted: true });
                    this.sound.playTone(880, 'triangle', 0.2); // Success tone
                    continue;
                }

                // Update stats
                instance.stats.steps++;
                if (value.type === 'swap') {
                    instance.stats.swaps++;
                    this.sound.playTone(200 + (instance.array[value.indices[0]] * 5), 'sine', 0.03);
                }
                if (value.type === 'compare') {
                    instance.stats.compares++;
                    this.sound.playTone(400 + (instance.array[value.indices[0]] * 2), 'square', 0.01);
                }
                
                instance.swapsEl.textContent = instance.stats.swaps;
                instance.comparesEl.textContent = instance.stats.compares;

                // Render
                instance.renderer.draw(instance.array, {
                    compare: value.type === 'compare' ? value.indices : [],
                    swap: value.type === 'swap' ? value.indices : [],
                    sorted: false
                });

                // Update Graph every 5 steps to avoid lag
                if (instance.stats.steps % 5 === 0) {
                    this.chart.addDataPoint(instance.name, instance.stats.steps, instance.stats.swaps + instance.stats.compares);
                }
            }

            const delay = Math.max(1, 101 - this.speed);
            await wait(delay);
        }

        if (this.instances.every(inst => inst.finished)) {
            this.showLeaderboard();
            this.generateInsight();
            this.checkQuizResult();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('btn-pause').textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    // Quiz Mode Logic
    openQuiz() {
        const overlay = document.getElementById('quiz-overlay');
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        
        overlay.classList.remove('hidden');

        this.instances.forEach(inst => {
            const btn = document.createElement('div');
            btn.className = 'quiz-option';
            btn.textContent = inst.name;
            btn.onclick = () => {
                this.prediction = inst.name;
                overlay.classList.add('hidden');
                this.startRace();
            };
            optionsContainer.appendChild(btn);
        });
    }

    checkQuizResult() {
        if (!this.prediction) return;

        const winner = [...this.instances].sort((a, b) => 
            (a.stats.swaps + a.stats.compares) - (b.stats.swaps + b.stats.compares)
        )[0];

        const isCorrect = this.prediction === winner.name;
        
        const content = document.getElementById('leaderboard-content');
        const quizFeedback = document.createElement('div');
        quizFeedback.className = isCorrect ? 'quiz-success' : 'quiz-failure';
        quizFeedback.style.margin = '1rem 0';
        quizFeedback.style.padding = '1rem';
        quizFeedback.style.borderRadius = '8px';
        quizFeedback.style.background = isCorrect ? 'var(--success)' : 'var(--danger)';
        quizFeedback.style.color = isCorrect ? '#000' : '#fff';
        quizFeedback.innerHTML = `
            <strong>${isCorrect ? 'Correct Prediction!' : 'Incorrect Prediction.'}</strong><br>
            You picked ${this.prediction}. The actual winner was ${winner.name}.
        `;
        content.insertBefore(quizFeedback, content.firstChild);
        
        this.prediction = null; // Reset
    }

    showLeaderboard() {
        const sorted = [...this.instances].sort((a, b) => 
            (a.stats.swaps + a.stats.compares) - (b.stats.swaps + b.stats.compares)
        );

        const content = document.getElementById('leaderboard-content');
        content.innerHTML = sorted.map((inst, i) => `
            <div class="leaderboard-item">
                <span>#${i + 1} ${inst.name}</span>
                <span>${inst.stats.swaps + inst.stats.compares} ops</span>
            </div>
        `).join('');

        document.getElementById('leaderboard-overlay').classList.remove('hidden');
    }

    generateInsight() {
        const type = document.getElementById('select-dataset').value;
        const winner = [...this.instances].sort((a, b) => 
            (a.stats.swaps + a.stats.compares) - (b.stats.swaps + b.stats.compares)
        )[0];

        let text = `On a <strong>${type}</strong> dataset, <strong>${winner.name}</strong> performed best. `;
        
        if (type === 'random' && winner.name.includes('Quick')) {
            text += "Quick Sort's recursive partitioning handles random data extremely efficiently (O(n log n)).";
        } else if (type === 'nearly-sorted' && winner.name.includes('Insertion')) {
            text += "Insertion Sort is nearly O(n) for already sorted data, beating even O(n log n) algorithms because it barely moves elements.";
        } else if (type === 'reversed' && winner.name.includes('Merge')) {
            text += "Merge Sort's performance is stable regardless of input order, making it reliable even in worst-case scenarios.";
        } else {
            text += "Hierarchical algorithms (O(n log n)) typically outperform simple ones (O(n²)) as dataset size grows.";
        }

        this.insightPanel.innerHTML = text;
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    new RaceManager();
});
