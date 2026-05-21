import { generateDataset, generateGraph, generateWeightedGraph, wait } from './utils.js';
import * as Algos from './engine.js';
import { Renderer } from './renderer.js';
import { GraphRenderer } from './GraphRenderer.js';
import { PerformanceChart } from './charts.js';

class Sound {
  constructor() { this.ctx = null; this.on = true; }
  init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
  tone(f, t = 'sine', d = 0.08, v = 0.06) {
    if (!this.ctx || !this.on) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = t; o.frequency.setValueAtTime(f, this.ctx.currentTime);
    g.gain.setValueAtTime(v, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + d);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + d);
  }
}

const SORTING_ALGOS = [
  { id: 'bubble',    name: 'Bubble Sort',    gen: Algos.bubbleSort },
  { id: 'selection', name: 'Selection Sort', gen: Algos.selectionSort },
  { id: 'insertion', name: 'Insertion Sort', gen: Algos.insertionSort },
  { id: 'merge',     name: 'Merge Sort',     gen: Algos.mergeSort },
  { id: 'quick',     name: 'Quick Sort',     gen: Algos.quickSort },
  { id: 'heap',      name: 'Heap Sort',      gen: Algos.heapSort },
];

const SEARCHING_ALGOS = [
  { id: 'linear', name: 'Linear Search', gen: Algos.linearSearch },
  { id: 'binary', name: 'Binary Search', gen: Algos.binarySearch },
  { id: 'jump',   name: 'Jump Search',   gen: Algos.jumpSearch },
  { id: 'interpolation', name: 'Interpolation Search', gen: Algos.interpolationSearch },
];

class ArenaApp {
  constructor() {
    this.sound = new Sound();
    this.instances = [];
    this.isRunning = false;
    this.isPaused = false;
    this.currentData = null;
    this.selectedAlgos = new Set();
    this.prediction = null;
    this.chart = null;

    this.initDOM();
    this.handleRaceTypeChange();
    this.generateData();
  }

  initDOM() {
    this.$ = (id) => document.getElementById(id);
    this.arenaGrid = this.$('arena-grid');
    this.raceType = this.$('race-type');
    this.datasetType = this.$('dataset-type');
    this.sizeSlider = this.$('size-slider');
    this.sizeDisplay = this.$('size-display');
    this.nodesSlider = this.$('nodes-slider');
    this.nodesDisplay = this.$('nodes-display');
    this.speedSlider = this.$('speed-slider');
    this.speedDisplay = this.$('speed-display');
    this.insightText = this.$('insight-text');
    this.customRow = this.$('custom-input-row');
    this.customInput = this.$('custom-array-input');
    this.algoPicker = this.$('algo-picker');
    this.liveStats = this.$('live-stats-container');

    this.chart = new PerformanceChart(this.$('complexity-chart').getContext('2d'));

    this.$('btn-generate').onclick = () => this.generateData();
    this.$('btn-start').onclick = () => this.startRace();
    this.$('btn-pause').onclick = () => this.togglePause();
    this.$('btn-reset').onclick = () => this.resetRace();
    this.$('btn-step').onclick = () => this.doStep();
    this.$('btn-export').onclick = () => this.exportStats();
    this.$('btn-quiz').onclick = () => this.openQuiz();
    this.$('btn-apply-custom').onclick = () => this.applyCustom();
    this.$('btn-sound').onclick = () => this.toggleSound();

    this.sizeSlider.oninput = (e) => { this.sizeDisplay.textContent = e.target.value; };
    this.nodesSlider.oninput = (e) => { this.nodesDisplay.textContent = e.target.value; };
    this.speedSlider.oninput = (e) => { this.speedDisplay.textContent = e.target.value; };

    this.raceType.onchange = () => { this.handleRaceTypeChange(); this.generateData(); };
    this.datasetType.onchange = () => {
      this.customRow.classList.toggle('hidden', this.datasetType.value !== 'custom');
    };

    this.$('chart-line-btn').onclick = () => { this.chart.setType('line'); this.setActiveChartBtn('line'); };
    this.$('chart-bar-btn').onclick = () => { this.chart.setType('bar'); this.setActiveChartBtn('bar'); };
  }

  setActiveChartBtn(type) {
    this.$('chart-line-btn').classList.toggle('active', type === 'line');
    this.$('chart-bar-btn').classList.toggle('active', type === 'bar');
  }

  handleRaceTypeChange() {
    const t = this.raceType.value;
    const isSortSearch = t === 'sorting' || t === 'searching';
    this.$('group-size').classList.toggle('hidden', !isSortSearch);
    this.$('group-nodes').classList.toggle('hidden', isSortSearch);
    this.$('group-dataset-type').classList.toggle('hidden', !isSortSearch);
    this.buildAlgoPicker();
  }

  buildAlgoPicker() {
    const t = this.raceType.value;
    const grid = this.$('algo-checkbox-grid');
    grid.innerHTML = '';
    this.selectedAlgos.clear();

    const algos = t === 'sorting' ? SORTING_ALGOS : t === 'searching' ? SEARCHING_ALGOS : [];
    if (algos.length === 0) {
      this.algoPicker.classList.add('hidden');
      return;
    }
    this.algoPicker.classList.remove('hidden');

    algos.forEach(a => {
      this.selectedAlgos.add(a.id);
      const lbl = document.createElement('label');
      lbl.className = 'algo-checkbox checked';
      lbl.innerHTML = `<input type="checkbox" value="${a.id}" checked> ${a.name}`;
      lbl.querySelector('input').onchange = (e) => {
        if (e.target.checked) this.selectedAlgos.add(a.id);
        else this.selectedAlgos.delete(a.id);
        lbl.classList.toggle('checked', e.target.checked);
      };
      grid.appendChild(lbl);
    });
  }

  generateData() {
    const t = this.raceType.value;
    const dt = this.datasetType.value;
    const size = parseInt(this.sizeSlider.value);
    const nodes = parseInt(this.nodesSlider.value);

    if (dt === 'custom' && this.currentData) {
        // Keep custom data if it exists
    } else if (t === 'sorting' || t === 'searching') {
      this.currentData = generateDataset(size, dt);
    } else {
      this.currentData = t === 'graphs' ? generateGraph(nodes, 0.28) : generateWeightedGraph(nodes, 0.32);
    }
    this.resetRace();
  }

  applyCustom() {
    const raw = this.customInput.value;
    const parsed = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (parsed.length < 2) return;
    this.currentData = parsed;
    this.resetRace();
  }

  resetRace() {
    this.isRunning = false;
    this.isPaused = false;
    this.instances = [];
    this.arenaGrid.innerHTML = '';
    this.liveStats.innerHTML = '';
    this.chart.reset();
    this.$('btn-start').disabled = false;
    this.$('btn-pause').disabled = true;
    this.$('btn-step').disabled = true;
    this.$('complexity-table').classList.add('hidden');

    const t = this.raceType.value;
    if (t === 'sorting') {
      SORTING_ALGOS.filter(a => this.selectedAlgos.has(a.id)).forEach(a => {
        this.addInstance(a.name, a.gen, [...this.currentData], 'bar');
      });
    } else if (t === 'searching') {
      const sorted = [...this.currentData].sort((a, b) => a - b);
      const target = sorted[Math.floor(Math.random() * sorted.length)];
      SEARCHING_ALGOS.filter(a => this.selectedAlgos.has(a.id)).forEach(a => {
        this.addInstance(a.name, arr => a.gen(arr, target), [...sorted], 'bar');
      });
    } else if (t === 'graphs') {
      this.addInstance('BFS', g => Algos.bfs(g, 0), this.currentData, 'graph');
      this.addInstance('DFS', g => Algos.dfs(g, 0), this.currentData, 'graph');
    } else if (t === 'pathfinding') {
      const n = Object.keys(this.currentData).length;
      this.addInstance('Dijkstra', g => Algos.dijkstra(g, 0, n - 1), this.currentData, 'graph');
      this.addInstance('Bellman-Ford', g => Algos.bellmanFord(g, 0, n - 1, n), this.currentData, 'graph');
    }
  }

  addInstance(name, genFn, data, type) {
    const id = name.replace(/\s+/g, '');
    const card = document.createElement('div');
    card.className = 'algo-card';
    card.innerHTML = `
      <div class="algo-header">
        <h3 class="font-heading">${name}</h3>
        <span class="status-badge" id="badge-${id}">Idle</span>
      </div>
      <div class="algo-canvas-wrap" id="canvas-${id}"></div>
      <div class="algo-progress"><div class="algo-progress-bar" id="prog-${id}"></div></div>
      <div class="algo-mini-stats">
        <span id="ops-${id}">Ops: 0</span>
        <span id="time-${id}">0ms</span>
      </div>`;
    this.arenaGrid.appendChild(card);

    const container = card.querySelector('.algo-canvas-wrap');
    let renderer;
    if (type === 'bar') {
      renderer = new Renderer(container, name);
      renderer.draw(data);
    } else {
      renderer = new GraphRenderer(container, name);
      renderer.setNodes(Object.keys(data).length);
      renderer.draw(data);
    }

    const statRow = document.createElement('div');
    statRow.className = 'live-stat-item';
    statRow.innerHTML = `<div class="lsi-name">${name}</div><div class="lsi-nums"><span class="lsi-ops" id="lsi-ops-${id}">0 ops</span><span id="lsi-time-${id}">–</span></div>`;
    this.liveStats.appendChild(statRow);

    this.instances.push({
      name, id, data, type, renderer,
      gen: genFn(data),
      finished: false,
      stats: { ops: 0, startTime: null, endTime: null },
      els: {
        badge: card.querySelector(`#badge-${id}`),
        ops: card.querySelector(`#ops-${id}`),
        time: card.querySelector(`#time-${id}`),
        prog: card.querySelector(`#prog-${id}`),
        lsiOps: statRow.querySelector(`#lsi-ops-${id}`),
        lsiTime: statRow.querySelector(`#lsi-time-${id}`),
      }
    });
    this.chart.addAlgorithm(name);
  }

  async startRace() {
    if (this.isRunning) return;
    this.sound.init();
    this.isRunning = true;
    this.$('btn-start').disabled = true;
    this.$('btn-pause').disabled = false;
    this.$('btn-step').disabled = false;
    const t0 = performance.now();
    this.instances.forEach(i => {
      i.stats.startTime = t0;
      i.els.badge.textContent = 'Running';
      i.els.badge.className = 'status-badge running';
    });

    while (this.isRunning && this.instances.some(i => !i.finished)) {
      if (this.isPaused) { await wait(50); continue; }
      this.tick();
      await wait(Math.max(1, 101 - parseInt(this.speedSlider.value)));
    }
    if (this.instances.every(i => i.finished)) this.onRaceEnd();
  }

  tick() {
    for (const inst of this.instances) {
      if (inst.finished) continue;
      const { value, done } = inst.gen.next();
      if (done) {
        inst.finished = true;
        inst.stats.endTime = performance.now();
        inst.els.badge.textContent = 'Done';
        inst.els.badge.className = 'status-badge done';
        inst.els.prog.style.width = '100%';
        this.sound.tone(880, 'triangle', 0.1);
        continue;
      }

      inst.stats.ops++;
      const elapsed = Math.floor(performance.now() - inst.stats.startTime);
      inst.els.ops.textContent = `Ops: ${inst.stats.ops}`;
      inst.els.time.textContent = `${elapsed}ms`;
      inst.els.lsiOps.textContent = `${inst.stats.ops} ops`;
      inst.els.lsiTime.textContent = `${elapsed}ms`;
      
      // Rough progress estimate
      const maxEst = inst.type === 'bar' ? inst.data.length * inst.data.length : 100;
      inst.els.prog.style.width = `${Math.min(95, (inst.stats.ops / maxEst) * 100)}%`;

      if (inst.type === 'bar') {
        inst.renderer.draw(inst.data, {
          compare: value.type === 'compare' ? value.indices : [],
          swap: value.type === 'swap' ? value.indices : [],
          found: value.type === 'found' ? value.indices : [],
          sorted: false
        });
        if (value.type === 'swap') this.sound.tone(300 + (inst.stats.ops % 400));
        else if (value.type === 'compare') this.sound.tone(600 + (inst.stats.ops % 200), 'triangle', 0.02);
      } else {
        inst.renderer.draw(inst.data, {
          visitedNodes: value.type === 'visit_node' ? [value.node] : [],
          visitedEdges: (value.type === 'visit_edge' || value.type === 'compare_edge') ? [value.edge] : [],
          path: value.type === 'found_path' ? value.path : []
        });
        this.sound.tone(200 + (inst.stats.ops % 300));
      }
      
      if (inst.stats.ops % 5 === 0) this.chart.addDataPoint(inst.name, inst.stats.ops, inst.stats.ops);
    }
  }

  doStep() {
    if (!this.isRunning) {
      this.isRunning = true;
      const t0 = performance.now();
      this.instances.forEach(i => i.stats.startTime = t0);
    }
    this.tick();
    if (this.instances.every(i => i.finished)) this.onRaceEnd();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.$('btn-pause').textContent = this.isPaused ? '▶ Resume' : '⏸ Pause';
  }

  onRaceEnd() {
    this.isRunning = false;
    this.showLeaderboard();
    this.showInsights();
  }

  showLeaderboard() {
    const sorted = [...this.instances].sort((a, b) => a.stats.ops - b.stats.ops);
    const content = this.$('leaderboard-content');
    content.innerHTML = sorted.map((inst, idx) => `
      <div class="lb-item ${idx === 0 ? 'first' : ''}">
        <span><span class="lb-rank">#${idx+1}</span><span class="lb-name">${inst.name}</span></span>
        <span><span class="lb-ops">${inst.stats.ops} ops</span></span>
      </div>`).join('');

    const banner = this.$('quiz-result-banner');
    if (this.prediction) {
      const correct = this.prediction === sorted[0].name;
      banner.className = `quiz-result ${correct ? 'correct' : 'wrong'}`;
      banner.textContent = correct ? `✓ Correct prediction!` : `✗ Wrong prediction. ${sorted[0].name} won.`;
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
    this.$('leaderboard-overlay').classList.add('active');
  }

  showInsights() {
    const winner = [...this.instances].sort((a, b) => a.stats.ops - b.stats.ops)[0];
    this.insightText.innerHTML = `<strong>${winner.name}</strong> was the most efficient in this race. Try different datasets to see how performance shifts!`;
  }

  openQuiz() {
    const opts = this.$('quiz-options');
    opts.innerHTML = '';
    this.instances.forEach(inst => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn';
      btn.textContent = inst.name;
      btn.onclick = () => {
        this.prediction = inst.name;
        this.$('quiz-overlay').classList.remove('active');
        this.startRace();
      };
      opts.appendChild(btn);
    });
    this.$('quiz-overlay').classList.add('active');
  }

  toggleSound() {
    this.sound.on = !this.sound.on;
    this.$('btn-sound').textContent = this.sound.on ? '🔊' : '🔇';
  }

  exportStats() {
    const data = this.instances.map(i => ({ name: i.name, ops: i.stats.ops }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `race-stats-${Date.now()}.json`; a.click();
  }
}

window.addEventListener('DOMContentLoaded', () => new ArenaApp());
