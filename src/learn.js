import { EDU_DATA } from './eduData.js';
import * as Algos from './engine.js';
import { Renderer } from './renderer.js';
import { GraphRenderer } from './GraphRenderer.js';
import { generateDataset, generateGraph, generateWeightedGraph } from './utils.js';

/* ── Syntax highlight (simple) ─────────────────────── */
function highlight(code) {
  return code
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\b(function|return|const|let|var|for|while|if|else|new|of|in|null)\b/g,'<span class="kw">$1</span>')
    .replace(/\/\/.*/g, '<span class="cm">$&</span>')
    .replace(/(\d+)/g,'<span class="nm">$1</span>')
    .replace(/(".*?"|'.*?'|`.*?`)/g,'<span class="st">$&</span>');
}

function getAlgoCategory(name) {
  for (let cat in EDU_DATA) {
    if (EDU_DATA[cat].find(a => a.name === name)) return cat;
  }
  return 'sorting';
}

function getCommentary(value) {
  if (!value || value.type === 'done') return "Algorithm Complete!";
  switch (value.type) {
    case 'compare': return `Comparing elements at index ${value.indices.join(' and ')}`;
    case 'swap': return `Swapping elements at index ${value.indices.join(' and ')}`;
    case 'access': return `Accessing element at index ${value.indices[0]}`;
    case 'set': return `Setting element at index ${value.indices[0]} to new value`;
    case 'found': return `Target successfully found at index ${value.indices[0]}`;
    case 'visit_node': return `Visiting node ${value.node}`;
    case 'visit_edge': return `Traversing edge between node ${value.edge[0]} and ${value.edge[1]}`;
    case 'compare_edge': return `Evaluating edge distance from ${value.edge[0]} to ${value.edge[1]}`;
    case 'relax_edge': return `Relaxing edge ${value.edge[0]} -> ${value.edge[1]}: Found shorter path!`;
    case 'found_path': return `Shortest path found!`;
    default: return `Processing algorithm step...`;
  }
}

/* ── Build detail panel ────────────────────────────── */
function buildDetailPanel(algo) {
  const body = document.getElementById('detail-body');
  const grid = document.getElementById('edu-grid');
  const panel = document.getElementById('detail-panel');

  grid.classList.add('hidden');
  panel.classList.remove('hidden');

  body.innerHTML = `
    <div class="detail-header">
      <span class="detail-icon">${algo.icon}</span>
      <div>
        <h2 class="font-heading" style="color:${algo.color}">${algo.name}</h2>
        <div class="edu-tags" style="margin-top:.5rem">
          ${algo.tags.map(t=>`<span class="edu-tag">${t}</span>`).join('')}
          <span class="edu-tag" style="color:${algo.stable?'#10b981':'#ef4444'}">${algo.stable?'✓ Stable':'✗ Unstable'}</span>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      <!-- Complexity -->
      <div class="detail-block">
        <h3 class="block-title">⏱ Time & Space Complexity</h3>
        <table class="cplx-table">
          <thead><tr><th>Case</th><th>Time</th></tr></thead>
          <tbody>
            <tr><td>Best</td><td style="color:var(--success)">${algo.best}</td></tr>
            <tr><td>Average</td><td style="color:var(--secondary)">${algo.avg}</td></tr>
            <tr><td>Worst</td><td style="color:var(--danger)">${algo.worst}</td></tr>
            <tr><td>Space</td><td style="color:var(--primary)">${algo.space}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Description & Use-case -->
      <div class="detail-block">
        <h3 class="block-title">📖 How It Works</h3>
        <p class="block-text">${algo.desc}</p>
        <h3 class="block-title" style="margin-top:1rem">✅ Best Used When</h3>
        <p class="block-text">${algo.usecase}</p>
      </div>
    </div>

    <!-- Mini Simulation -->
    <div class="detail-block" id="sim-block">
      <h3 class="block-title">🎬 Live Mini-Simulation</h3>
      <div id="mini-sim-container" style="width:100%;height:220px;background: rgba(0,0,0,.25) linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px); background-size: 20px 20px; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); border: 1px solid rgba(6,182,212,0.2); border-radius:10px;position:relative;overflow:hidden;"></div>
      <div id="sim-commentary" style="margin-top:0.75rem;padding:0.75rem;background:rgba(255,255,255,0.05);border-radius:8px;font-size:0.85rem;color:var(--primary);min-height:45px;display:flex;align-items:center;border-left:3px solid var(--primary);">
        Press Play to begin...
      </div>
      <div class="sim-controls">
        <button id="sim-play"  class="btn btn-primary btn-sm">▶ Play</button>
        <button id="sim-step"  class="btn btn-outline btn-sm">→ Step</button>
        <button id="sim-reset" class="btn btn-outline btn-sm">↺ Reset</button>
        <span id="sim-info" style="color:var(--muted);font-size:.8rem">Step 0</span>
      </div>
    </div>

    <!-- Pseudocode -->
    <div class="detail-block">
      <h3 class="block-title">📝 Pseudocode</h3>
      <pre class="code-block pseudo-block">${algo.pseudocode}</pre>
    </div>

    <!-- Code -->
    <div class="detail-block">
      <div class="code-header">
        <h3 class="block-title">💻 JavaScript Implementation</h3>
        <button class="btn btn-sm btn-outline" id="btn-copy">Copy</button>
      </div>
      <pre class="code-block"><code class="lang-js">${highlight(algo.code)}</code></pre>
    </div>
  `;

  // Wire up simulation engine
  const simContainer = document.getElementById('mini-sim-container');
  const infoEl = document.getElementById('sim-info');
  const commentaryEl = document.getElementById('sim-commentary');
  
  const cat = getAlgoCategory(algo.name);
  let renderer;
  let data;
  let isGraph = false;

  // Initialize Data & Renderer
  if (cat === 'sorting' || cat === 'searching') {
    data = generateDataset(20, 'random');
    if (cat === 'searching') data.sort((a,b)=>a-b);
    renderer = new Renderer(simContainer, algo.name);
    renderer.draw(data);
  } else {
    isGraph = true;
    const isWeighted = cat === 'pathfinding';
    data = isWeighted ? generateWeightedGraph(8, 0.4) : generateGraph(8, 0.4);
    renderer = new GraphRenderer(simContainer, algo.name);
    renderer.setNodes(8);
    renderer.draw(data);
  }

  // Get Generator
  let genFn;
  const target = data && data.length ? data[Math.floor(data.length/2)] : null;
  const nodesCount = Object.keys(data).length;
  const targetNode = nodesCount - 1;

  switch (algo.name) {
    case 'Bubble Sort': genFn = Algos.bubbleSort; break;
    case 'Selection Sort': genFn = Algos.selectionSort; break;
    case 'Insertion Sort': genFn = Algos.insertionSort; break;
    case 'Merge Sort': genFn = Algos.mergeSort; break;
    case 'Quick Sort': genFn = Algos.quickSort; break;
    case 'Heap Sort': genFn = Algos.heapSort; break;
    case 'Counting Sort': genFn = Algos.countingSort; break;
    case 'Radix Sort': genFn = Algos.radixSort; break;
    case 'Linear Search': genFn = arr => Algos.linearSearch(arr, target); break;
    case 'Binary Search': genFn = arr => Algos.binarySearch(arr, target); break;
    case 'Jump Search': genFn = arr => Algos.jumpSearch(arr, target); break;
    case 'Interpolation Search': genFn = arr => Algos.interpolationSearch(arr, target); break;
    case 'BFS': genFn = g => Algos.bfs(g, 0); break;
    case 'DFS': genFn = g => Algos.dfs(g, 0); break;
    case 'Dijkstra': genFn = g => Algos.dijkstra(g, 0, targetNode); break;
    case 'Bellman-Ford': genFn = g => Algos.bellmanFord(g, 0, targetNode, nodesCount); break;
    case "Kruskal's MST": genFn = g => Algos.kruskal(g); break;
    case "Prim's MST": genFn = g => Algos.prim(g); break;
    case 'A* Search': genFn = g => Algos.aStar(g, 0, targetNode); break;
    case 'Floyd-Warshall': genFn = g => Algos.floydWarshall(g, nodesCount); break;
    default: 
      genFn = function*() { yield { type: 'done' }; }; // dummy
  }

  // Pre-compute steps
  let dataCopy = isGraph ? JSON.parse(JSON.stringify(data)) : [...data];
  let gen = genFn(dataCopy);
  const steps = [];
  let currentArr = isGraph ? JSON.parse(JSON.stringify(dataCopy)) : [...dataCopy];
  
  // Store initial state
  steps.push({ data: currentArr, value: null });

  let result = gen.next();
  while (!result.done && steps.length < 5000) {
    currentArr = isGraph ? JSON.parse(JSON.stringify(dataCopy)) : [...dataCopy];
    steps.push({ data: currentArr, value: result.value });
    result = gen.next();
  }
  
  // Push final state as completed
  steps.push({ data: currentArr, value: { type: 'done' } });

  let simIdx = 0;
  let simTimer = null;

  const render = () => { 
    if (steps[simIdx]) {
      const step = steps[simIdx];
      const val = step.value || {};
      
      if (!isGraph) {
        renderer.draw(step.data, {
          compare: val.type === 'compare' ? (val.indices || []) : [],
          swap: val.type === 'swap' ? (val.indices || []) : [],
          found: val.type === 'found' ? (val.indices || []) : [],
          sorted: simIdx === steps.length - 1
        });
      } else {
        renderer.draw(step.data, {
          visitedNodes: val.type === 'visit_node' ? [val.node] : [],
          visitedEdges: (val.type === 'visit_edge' || val.type === 'compare_edge' || val.type === 'relax_edge') ? [val.edge] : [],
          path: val.type === 'found_path' ? val.path : []
        });
      }
      
      infoEl.textContent = `Step ${simIdx} / ${steps.length - 1}`;
      if (simIdx === 0) commentaryEl.textContent = "Press Play to begin...";
      else commentaryEl.textContent = getCommentary(val);
    }
  };
  
  // Need to give container a tiny bit of time to render size before drawing
  setTimeout(() => {
    renderer.resize();
    if (isGraph) renderer.setNodes(nodesCount);
    render();
  }, 50);

  document.getElementById('sim-step').onclick = () => {
    if (simIdx < steps.length - 1) { simIdx++; render(); }
  };
  document.getElementById('sim-reset').onclick = () => {
    clearInterval(simTimer); simTimer = null;
    simIdx = 0; render();
    document.getElementById('sim-play').textContent = '▶ Play';
  };
  document.getElementById('sim-play').onclick = function() {
    if (simTimer) {
      clearInterval(simTimer); simTimer = null;
      this.textContent = '▶ Play';
    } else {
      this.textContent = '⏸ Pause';
      simTimer = setInterval(() => {
        if (simIdx < steps.length - 1) { simIdx++; render(); }
        else { clearInterval(simTimer); simTimer = null; this.textContent = '▶ Play'; }
      }, isGraph ? 350 : 80);
    }
  };
  document.getElementById('btn-copy').onclick = function() {
    navigator.clipboard.writeText(algo.code).then(() => { this.textContent = '✓ Copied!'; setTimeout(()=>this.textContent='Copy',1500); });
  };
}

/* ── Main Learn App ────────────────────────────────── */
class LearnApp {
  constructor() {
    this.currentCat = 'sorting';
    this.initDOM();
    this.renderCards('sorting');
  }

  initDOM() {
    this.grid  = document.getElementById('edu-grid');
    this.panel = document.getElementById('detail-panel');
    document.getElementById('detail-close').onclick = () => {
      this.panel.classList.add('hidden');
      this.grid.classList.remove('hidden');
    };
    document.querySelectorAll('.edu-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.edu-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.panel.classList.add('hidden');
        this.grid.classList.remove('hidden');
        this.renderCards(tab.dataset.cat);
      };
    });
  }

  renderCards(cat) {
    this.currentCat = cat;
    this.grid.innerHTML = '';
    (EDU_DATA[cat] || []).forEach(algo => {
      const card = document.createElement('div');
      card.className = 'edu-card';
      card.style.setProperty('--card-color', algo.color + '33');
      card.innerHTML = `
        <div class="edu-card-icon">${algo.icon}</div>
        <h4 class="font-heading" style="color:${algo.color}">${algo.name}</h4>
        <p>${algo.desc.substring(0, 120)}…</p>
        <div class="edu-complexities">
          <div class="edu-complexity-row"><span>Best</span><span>${algo.best}</span></div>
          <div class="edu-complexity-row"><span>Avg</span><span>${algo.avg}</span></div>
          <div class="edu-complexity-row"><span>Worst</span><span>${algo.worst}</span></div>
        </div>
        <div class="edu-tags">
          ${algo.tags.map(t=>`<span class="edu-tag">${t}</span>`).join('')}
        </div>
        <button class="btn btn-sm edu-explore-btn" style="margin-top:1.25rem;width:100%;justify-content:center;background: ${algo.color}; color: #020617; font-weight: 700; border: none; box-shadow: 0 0 15px ${algo.color}60, inset 0 0 5px rgba(255,255,255,0.5); font-size: 0.95rem; padding: 0.6rem; transition: transform 0.2s, box-shadow 0.2s;">▶ Explore + Simulate</button>`;
      
      // Make both the button AND the entire card clickable
      const clickHandler = (e) => { e.stopPropagation(); buildDetailPanel(algo); };
      card.querySelector('.edu-explore-btn').onclick = clickHandler;
      card.style.cursor = 'pointer';
      card.onclick = clickHandler;
      
      // Add hover effect to the card's button
      card.onmouseenter = () => { card.querySelector('.edu-explore-btn').style.transform = 'scale(1.02)'; card.querySelector('.edu-explore-btn').style.boxShadow = `0 0 25px ${algo.color}90`; };
      card.onmouseleave = () => { card.querySelector('.edu-explore-btn').style.transform = 'scale(1)'; card.querySelector('.edu-explore-btn').style.boxShadow = `0 0 15px ${algo.color}60, inset 0 0 5px rgba(255,255,255,0.5)`; };
      
      this.grid.appendChild(card);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => new LearnApp());
