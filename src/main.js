import { generateDataset, generateGraph, generateWeightedGraph, wait } from './utils.js';
import * as Algos from './engine.js';
import { Renderer } from './renderer.js';
import { GraphRenderer } from './GraphRenderer.js';
import { PerformanceChart } from './charts.js';
import { EDU_DATA } from './eduData.js';

/* ─── SOUND ─────────────────────────────────────── */
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

/* ─── ALGORITHM REGISTRY ─────────────────────────── */
const SORTING_ALGOS = [
  { id: 'bubble',    name: 'Bubble Sort',    gen: Algos.bubbleSort },
  { id: 'selection', name: 'Selection Sort', gen: Algos.selectionSort },
  { id: 'insertion', name: 'Insertion Sort', gen: Algos.insertionSort },
  { id: 'merge',     name: 'Merge Sort',     gen: Algos.mergeSort },
  { id: 'quick',     name: 'Quick Sort',     gen: Algos.quickSort },
  { id: 'heap',      name: 'Heap Sort',      gen: Algos.heapSort },
];

/* ─── APP ────────────────────────────────────────── */
class App {
  constructor() {
    this.sound    = new Sound();
    this.instances = [];
    this.isRunning = false;
    this.isPaused  = false;
    this.stepMode  = false;
    this.prediction = null;
    this.currentData = null;
    this.selectedAlgos = new Set(['bubble','quick','merge','heap']);
    this.chart = null;

    this.initDOM();
    this.buildAlgoPicker();
    this.buildEduSection();
    this.spawnParticles();
    this.generateData();
  }

  /* ── DOM REFS ─── */
  initDOM() {
    this.$ = (id) => document.getElementById(id);
    this.arenaGrid      = this.$('arena-grid');
    this.raceType       = this.$('race-type');
    this.datasetType    = this.$('dataset-type');
    this.sizeSlider     = this.$('size-slider');
    this.sizeDisplay    = this.$('size-display');
    this.nodesSlider    = this.$('nodes-slider');
    this.nodesDisplay   = this.$('nodes-display');
    this.speedSlider    = this.$('speed-slider');
    this.speedDisplay   = this.$('speed-display');
    this.insightText    = this.$('insight-text');
    this.customRow      = this.$('custom-input-row');
    this.customInput    = this.$('custom-array-input');
    this.algoPicker     = this.$('algo-picker');
    this.liveStats      = this.$('live-stats-container');

    this.chart = new PerformanceChart(this.$('complexity-chart').getContext('2d'));

    // Buttons
    this.$('btn-generate').onclick = () => this.generateData();
    this.$('btn-start').onclick    = () => this.startRace();
    this.$('btn-pause').onclick    = () => this.togglePause();
    this.$('btn-reset').onclick    = () => this.resetRace();
    this.$('btn-step').onclick     = () => this.doStep();
    this.$('btn-export').onclick   = () => this.exportStats();
    this.$('btn-quiz').onclick     = () => this.openQuiz();
    this.$('btn-apply-custom').onclick = () => this.applyCustom();
    this.$('btn-sound').onclick    = () => this.toggleSound();

    // Range sliders live update
    this.sizeSlider.oninput  = (e) => { this.sizeDisplay.textContent  = e.target.value; };
    this.nodesSlider.oninput = (e) => { this.nodesDisplay.textContent = e.target.value; };
    this.speedSlider.oninput = (e) => { this.speedDisplay.textContent = e.target.value; };

    // Race type changes
    this.raceType.onchange = () => { this.handleRaceTypeChange(); this.generateData(); };
    this.datasetType.onchange = () => {
      const isCustom = this.datasetType.value === 'custom';
      this.customRow.classList.toggle('hidden', !isCustom);
    };

    // Chart toggle
    this.$('chart-line-btn').onclick = () => { this.chart.setType('line'); this.setActiveChartBtn('line'); };
    this.$('chart-bar-btn').onclick  = () => { this.chart.setType('bar');  this.setActiveChartBtn('bar'); };

    // Edu tabs
    document.querySelectorAll('.edu-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.edu-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderEduCards(tab.dataset.cat);
      };
    });
  }

  setActiveChartBtn(type) {
    this.$('chart-line-btn').classList.toggle('active', type === 'line');
    this.$('chart-bar-btn').classList.toggle('active',  type === 'bar');
  }

  handleRaceTypeChange() {
    const t = this.raceType.value;
    const isSortSearch = t === 'sorting' || t === 'searching';
    this.$('group-size').classList.toggle('hidden',  !isSortSearch);
    this.$('group-nodes').classList.toggle('hidden', isSortSearch);
    this.$('group-dataset-type').classList.toggle('hidden', !isSortSearch);
    this.algoPicker.classList.toggle('hidden', t !== 'sorting');
  }

  /* ── ALGO PICKER ─── */
  buildAlgoPicker() {
    const grid = this.$('algo-checkbox-grid');
    SORTING_ALGOS.forEach(a => {
      const lbl = document.createElement('label');
      lbl.className = 'algo-checkbox' + (this.selectedAlgos.has(a.id) ? ' checked' : '');
      lbl.innerHTML = `<input type="checkbox" value="${a.id}" ${this.selectedAlgos.has(a.id) ? 'checked' : ''}> ${a.name}`;
      lbl.querySelector('input').onchange = (e) => {
        e.target.checked ? this.selectedAlgos.add(a.id) : this.selectedAlgos.delete(a.id);
        lbl.classList.toggle('checked', e.target.checked);
      };
      grid.appendChild(lbl);
    });
  }

  /* ── EDU SECTION ─── */
  buildEduSection() { this.renderEduCards('sorting'); }

  renderEduCards(cat) {
    const grid = this.$('edu-grid');
    grid.innerHTML = '';
    (EDU_DATA[cat] || []).forEach(algo => {
      const card = document.createElement('div');
      card.className = 'edu-card';
      card.style.setProperty('--card-color', algo.color + '33');
      card.innerHTML = `
        <div class="edu-card-icon">${algo.icon}</div>
        <h4 class="font-heading" style="color:${algo.color}">${algo.name}</h4>
        <p>${algo.desc}</p>
        <div class="edu-complexities">
          <div class="edu-complexity-row"><span>Best</span><span>${algo.best}</span></div>
          <div class="edu-complexity-row"><span>Average</span><span>${algo.avg}</span></div>
          <div class="edu-complexity-row"><span>Worst</span><span>${algo.worst}</span></div>
          <div class="edu-complexity-row"><span>Space</span><span>${algo.space}</span></div>
        </div>
        <div class="edu-tags">${algo.tags.map(t => `<span class="edu-tag">${t}</span>`).join('')}
          <span class="edu-tag" style="color:${algo.stable ? '#10b981':'#ef4444'}">${algo.stable ? '✓ Stable':'✗ Unstable'}</span>
        </div>`;
      grid.appendChild(card);
    });
  }

  /* ── DATA GENERATION ─── */
  generateData() {
    const t    = this.raceType.value;
    const dt   = this.datasetType.value;
    const size = parseInt(this.sizeSlider.value);
    const nodes = parseInt(this.nodesSlider.value);
    if (dt === 'custom') { this.currentData = this.currentData || generateDataset(size, 'random'); }
    else if (t === 'sorting' || t === 'searching') this.currentData = generateDataset(size, dt);
    else this.currentData = t === 'graphs' ? generateGraph(nodes, 0.28) : generateWeightedGraph(nodes, 0.32);
    this.resetRace();
  }

  applyCustom() {
    const raw = this.customInput.value;
    const parsed = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (parsed.length < 2) { alert('Enter at least 2 valid numbers.'); return; }
    this.currentData = parsed;
    this.resetRace();
  }

  /* ── RESET ─── */
  resetRace() {
    this.isRunning = false; this.isPaused = false; this.stepMode = false;
    this.instances = []; this.arenaGrid.innerHTML = '';
    this.liveStats.innerHTML = ''; this.chart.reset();
    this.$('btn-start').disabled  = false;
    this.$('btn-pause').disabled  = true;
    this.$('btn-step').disabled   = true;
    this.$('complexity-table').classList.add('hidden');

    if (!this.currentData) this.generateData();
    const t = this.raceType.value;
    if      (t === 'sorting')     this.initSortingRace();
    else if (t === 'searching')   this.initSearchRace();
    else if (t === 'graphs')      this.initGraphRace();
    else if (t === 'pathfinding') this.initPathRace();
  }

  initSortingRace() {
    const algos = SORTING_ALGOS.filter(a => this.selectedAlgos.has(a.id));
    if (!algos.length) { SORTING_ALGOS.slice(0,4).forEach(a => this.selectedAlgos.add(a.id)); this.initSortingRace(); return; }
    algos.forEach(a => this.addInstance(a.name, a.gen, [...this.currentData], 'bar'));
  }

  initSearchRace() {
    const sorted = [...this.currentData].sort((a, b) => a - b);
    const target = sorted[Math.floor(Math.random() * sorted.length)];
    this.addInstance('Linear Search', arr => Algos.linearSearch(arr, target), [...sorted], 'bar');
    this.addInstance('Binary Search', arr => Algos.binarySearch(arr, target), [...sorted], 'bar');
  }

  initGraphRace() {
    this.addInstance('BFS', g => Algos.bfs(g, 0), this.currentData, 'graph');
    this.addInstance('DFS', g => Algos.dfs(g, 0), this.currentData, 'graph');
  }

  initPathRace() {
    const n = Object.keys(this.currentData).length;
    const target = n - 1;
    this.addInstance('Dijkstra',     g => Algos.dijkstra(g, 0, target), this.currentData, 'graph');
    this.addInstance('Bellman-Ford', g => Algos.bellmanFord(g, 0, target, n), this.currentData, 'graph');
  }

  /* ── ADD INSTANCE ─── */
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
        <span id="swaps-${id}">Swaps: 0</span>
        <span id="time-${id}">0ms</span>
      </div>`;
    this.arenaGrid.appendChild(card);

    const container = card.querySelector('.algo-canvas-wrap');
    let renderer;
    if (type === 'bar') { renderer = new Renderer(container, name); renderer.draw(data); }
    else { renderer = new GraphRenderer(container, name); renderer.setNodes(Object.keys(data).length); renderer.draw(data); }

    // Live stat row
    const statRow = document.createElement('div');
    statRow.className = 'live-stat-item';
    statRow.id = `lsi-${id}`;
    statRow.innerHTML = `<div class="lsi-name">${name}</div><div class="lsi-nums"><span class="lsi-ops" id="lsi-ops-${id}">0 ops</span><span id="lsi-swaps-${id}">0 swaps</span><span id="lsi-time-${id}">–</span></div>`;
    this.liveStats.appendChild(statRow);

    this.instances.push({
      name, id, data, type,
      gen: genFn(data),
      renderer,
      finished: false,
      stats: { ops: 0, swaps: 0, compares: 0, startTime: null, endTime: null },
      els: {
        badge: card.querySelector(`#badge-${id}`),
        ops:   card.querySelector(`#ops-${id}`),
        swaps: card.querySelector(`#swaps-${id}`),
        time:  card.querySelector(`#time-${id}`),
        prog:  card.querySelector(`#prog-${id}`),
        lsiOps:   statRow.querySelector(`#lsi-ops-${id}`),
        lsiSwaps: statRow.querySelector(`#lsi-swaps-${id}`),
        lsiTime:  statRow.querySelector(`#lsi-time-${id}`),
      }
    });
    this.chart.addAlgorithm(name);
  }

  /* ── RACE LOOP ─── */
  async startRace() {
    if (this.isRunning) return;
    this.sound.init();
    this.isRunning = true;
    this.$('btn-start').disabled = true;
    this.$('btn-pause').disabled = false;
    this.$('btn-step').disabled  = false;
    const t0 = performance.now();
    this.instances.forEach(i => i.stats.startTime = t0);
    this.instances.forEach(i => { i.els.badge.textContent = 'Running'; i.els.badge.className = 'status-badge running'; });
    const maxOps = this.currentData?.length ? this.currentData.length * this.currentData.length * 2 : 10000;

    while (this.isRunning && this.instances.some(i => !i.finished)) {
      if (this.isPaused) { await wait(80); continue; }
      this.tick(maxOps);
      await wait(Math.max(1, 101 - parseInt(this.speedSlider.value)));
    }
    if (this.instances.every(i => i.finished)) { this.onRaceEnd(); }
  }

  tick(maxOps) {
    for (const inst of this.instances) {
      if (inst.finished) continue;
      const { value, done } = inst.gen.next();
      if (done) {
        inst.finished = true; inst.stats.endTime = performance.now();
        inst.els.badge.textContent = 'Done'; inst.els.badge.className = 'status-badge done';
        inst.els.prog.style.width = '100%';
        if (inst.type === 'bar') inst.renderer.draw(inst.data, { compare:[], swap:[], sorted:true });
        this.sound.tone(880, 'triangle', 0.25, 0.08);
        continue;
      }
      inst.stats.ops++;
      if (value.type === 'swap') { inst.stats.swaps++; this.sound.tone(200 + inst.stats.ops % 500, 'sine', 0.04, 0.04); }
      if (value.type === 'compare') { inst.stats.compares++; this.sound.tone(400 + inst.stats.ops % 300, 'triangle', 0.015, 0.02); }

      const elapsed = Math.floor(performance.now() - inst.stats.startTime);
      inst.els.ops.textContent   = `Ops: ${inst.stats.ops}`;
      inst.els.swaps.textContent = `Swaps: ${inst.stats.swaps}`;
      inst.els.time.textContent  = `${elapsed}ms`;
      inst.els.lsiOps.textContent   = `${inst.stats.ops} ops`;
      inst.els.lsiSwaps.textContent = `${inst.stats.swaps} sw`;
      inst.els.lsiTime.textContent  = `${elapsed}ms`;
      inst.els.prog.style.width = `${Math.min(100, (inst.stats.ops / maxOps) * 100)}%`;

      if (inst.type === 'bar') {
        inst.renderer.draw(inst.data, {
          compare: value.type === 'compare' ? (value.indices||[]) : [],
          swap:    value.type === 'swap'    ? (value.indices||[]) : [],
          sorted: false
        });
      } else {
        inst.renderer.draw(inst.data, {
          visitedNodes: value.type === 'visit_node'   ? [value.node] : [],
          visitedEdges: (value.type === 'visit_edge' || value.type === 'compare_edge') ? [value.edge] : [],
          path:         value.type === 'found_path'   ? value.path : []
        });
      }
      if (inst.stats.ops % 8 === 0) this.chart.addDataPoint(inst.name, inst.stats.ops, inst.stats.ops);
    }
  }

  doStep() {
    if (!this.isRunning) { this.isRunning = true; this.instances.forEach(i => { if (!i.stats.startTime) i.stats.startTime = performance.now(); }); }
    const maxOps = 99999;
    this.tick(maxOps);
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
    this.showComplexityTable();
  }

  showLeaderboard() {
    const sorted = [...this.instances].sort((a, b) => a.stats.ops - b.stats.ops);
    const content = this.$('leaderboard-content');
    content.innerHTML = '';
    sorted.forEach((inst, idx) => {
      const div = document.createElement('div');
      div.className = 'lb-item' + (idx === 0 ? ' first' : '');
      const elapsed = inst.stats.endTime ? Math.floor(inst.stats.endTime - inst.stats.startTime) : '–';
      div.innerHTML = `<span><span class="lb-rank">#${idx+1}</span><span class="lb-name">${inst.name}</span></span>
        <span><span class="lb-ops">${inst.stats.ops} ops</span> &nbsp;<span class="lb-time">${elapsed}ms</span></span>`;
      content.appendChild(div);
    });

    const banner = this.$('quiz-result-banner');
    if (this.prediction) {
      const correct = this.prediction === sorted[0].name;
      banner.className = 'quiz-result ' + (correct ? 'correct' : 'wrong');
      banner.textContent = correct ? `✓ Correct! You predicted ${this.prediction}.` : `✗ Wrong — you picked ${this.prediction}, but ${sorted[0].name} won.`;
      banner.classList.remove('hidden');
      this.prediction = null;
    } else { banner.classList.add('hidden'); }

    this.$('leaderboard-overlay').classList.add('active');
  }

  showInsights() {
    const sorted = [...this.instances].sort((a, b) => a.stats.ops - b.stats.ops);
    const winner = sorted[0];
    const t  = this.raceType.value;
    const dt = this.datasetType.value;
    const insights = {
      'nearly-sorted': `<strong>${winner.name}</strong> won on nearly-sorted data. Insertion Sort excels here (almost O(n)), while O(n²) sorts gain too — the data is already 90% ordered.`,
      'reversed':      `<strong>${winner.name}</strong> dominated reversed data. This is the pathological worst case for naive sorts — O(n log n) algorithms show their resilience here.`,
      'duplicates':    `<strong>${winner.name}</strong> handled duplicates best. Algorithms with three-way partitioning (like 3-way Quick Sort) are optimal for high-duplicate data.`,
      'random':        `<strong>${winner.name}</strong> was fastest on random data. This is the "average case" for most algorithms — O(n log n) strategies typically win here.`,
      'custom':        `<strong>${winner.name}</strong> performed best on your custom dataset with ${this.currentData.length} elements.`,
    };
    const graphInsights = {
      'graphs':      `<strong>${winner.name}</strong> finished first. BFS is optimal for shortest-path in unweighted graphs; DFS excels at topological sorting and cycle detection.`,
      'pathfinding': `<strong>${winner.name}</strong> found the shortest path faster. Dijkstra is optimal for non-negative weights; Bellman-Ford handles negatives at higher cost.`,
    };
    this.insightText.innerHTML = (t === 'sorting' || t === 'searching')
      ? (insights[dt] || `<strong>${winner.name}</strong> completed with the fewest operations (${winner.stats.ops}).`)
      : (graphInsights[t] || `<strong>${winner.name}</strong> was most efficient.`);
  }

  showComplexityTable() {
    const sorted = [...this.instances].sort((a, b) => a.stats.ops - b.stats.ops);
    const tbody = this.$('complexity-tbody');
    tbody.innerHTML = '';
    sorted.forEach((inst, idx) => {
      const tr = document.createElement('tr');
      const stars = ['⭐⭐⭐', '⭐⭐', '⭐', ''][Math.min(idx, 3)];
      tr.innerHTML = `<td>${inst.name}</td><td style="color:var(--primary)">${inst.stats.ops}</td><td>${inst.stats.endTime ? Math.floor(inst.stats.endTime-inst.stats.startTime)+'ms' : '–'}</td><td>${stars}</td>`;
      tbody.appendChild(tr);
    });
    this.$('complexity-table').classList.remove('hidden');
  }

  openQuiz() {
    const opts = this.$('quiz-options');
    opts.innerHTML = '';
    this.instances.forEach(inst => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn'; btn.textContent = inst.name;
      btn.onclick = () => {
        this.prediction = inst.name;
        this.$('quiz-overlay').classList.remove('active');
        this.startRace();
      };
      opts.appendChild(btn);
    });
    this.$('quiz-overlay').classList.add('active');
  }

  exportStats() {
    const data = {
      timestamp: new Date().toISOString(),
      raceType: this.raceType.value,
      datasetType: this.datasetType.value,
      datasetSize: this.currentData?.length || 0,
      results: this.instances.map(i => ({
        name: i.name,
        ops: i.stats.ops,
        swaps: i.stats.swaps,
        compares: i.stats.compares,
        timeMs: i.stats.endTime ? Math.floor(i.stats.endTime - i.stats.startTime) : null
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `algorace-${Date.now()}.json`; a.click();
  }

  toggleSound() {
    this.sound.on = !this.sound.on;
    this.$('btn-sound').textContent = this.sound.on ? '🔊' : '🔇';
  }

  spawnParticles() {
    const c = this.$('particles');
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 3 + 1;
      p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;
        background:rgba(6,182,212,${Math.random() * 0.3 + 0.05});
        left:${Math.random()*100}%;top:${Math.random()*100}%;
        animation:float-p ${8+Math.random()*12}s ease-in-out infinite;
        animation-delay:${Math.random()*8}s;`;
      c.appendChild(p);
    }
    if (!document.querySelector('#particle-style')) {
      const s = document.createElement('style');
      s.id = 'particle-style';
      s.textContent = `@keyframes float-p{0%,100%{transform:translateY(0) scale(1);opacity:.4;}50%{transform:translateY(-40px) scale(1.2);opacity:.8;}}`;
      document.head.appendChild(s);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => new App());
