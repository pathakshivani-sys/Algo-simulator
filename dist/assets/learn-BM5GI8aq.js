import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{i as m}from"./particles-VnPjRUFx.js";const v={sorting:[{name:"Bubble Sort",icon:"🫧",color:"#ef4444",desc:'Repeatedly compares adjacent elements and swaps them if they are in the wrong order. Each pass "bubbles" the largest unsorted element to its correct position.',best:"O(n)",avg:"O(n²)",worst:"O(n²)",space:"O(1)",stable:!0,tags:["Comparison","In-place","Simple"],usecase:"Teaching purposes; nearly-sorted small datasets.",pseudocode:`for i from 0 to n-1:
  for j from 0 to n-i-2:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])`,code:`function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Early exit
  }
  return arr;
}`},{name:"Selection Sort",icon:"🎯",color:"#f97316",desc:"Divides the array into sorted and unsorted regions. Each pass finds the minimum of the unsorted region and places it at the front. Always performs O(n²) comparisons.",best:"O(n²)",avg:"O(n²)",worst:"O(n²)",space:"O(1)",stable:!1,tags:["Comparison","In-place","Slow"],usecase:"When write operations are expensive (minimises swaps).",pseudocode:`for i from 0 to n-1:
  min = i
  for j from i+1 to n-1:
    if arr[j] < arr[min]: min = j
  swap(arr[i], arr[min])`,code:`function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++)
      if (arr[j] < arr[min]) min = j;
    if (min !== i)
      [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}`},{name:"Insertion Sort",icon:"🃏",color:"#fbbf24",desc:"Builds the sorted array one element at a time by inserting each new element into its correct position. Very efficient for small or nearly-sorted arrays.",best:"O(n)",avg:"O(n²)",worst:"O(n²)",space:"O(1)",stable:!0,tags:["Comparison","Adaptive","Online"],usecase:"Small n, nearly-sorted data, real-time (online) sorting.",pseudocode:`for i from 1 to n-1:
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j--
  arr[j+1] = key`,code:`function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`},{name:"Merge Sort",icon:"🧩",color:"#06b6d4",desc:"Divide-and-conquer algorithm. Splits the array into halves recursively, sorts each half, then merges them. Guarantees O(n log n) in all cases and is stable.",best:"O(n log n)",avg:"O(n log n)",worst:"O(n log n)",space:"O(n)",stable:!0,tags:["Divide & Conquer","Stable","Predictable"],usecase:"Large datasets, linked lists, external sorting, stable order needed.",pseudocode:`mergeSort(arr):
  if len(arr) <= 1: return arr
  mid = len(arr)//2
  L = mergeSort(arr[:mid])
  R = mergeSort(arr[mid:])
  return merge(L, R)`,code:`function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid  = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right= mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(L, R) {
  const res = []; let i = 0, j = 0;
  while (i < L.length && j < R.length)
    res.push(L[i] <= R[j] ? L[i++] : R[j++]);
  return res.concat(L.slice(i), R.slice(j));
}`},{name:"Quick Sort",icon:"⚡",color:"#8b5cf6",desc:"Picks a pivot and partitions the array into elements less-than and greater-than the pivot, then recursively sorts each part. Very cache-friendly in practice.",best:"O(n log n)",avg:"O(n log n)",worst:"O(n²)",space:"O(log n)",stable:!1,tags:["Divide & Conquer","Cache-friendly","Fast"],usecase:"General purpose; fastest in practice for large random arrays.",pseudocode:`quickSort(arr, lo, hi):
  if lo < hi:
    p = partition(arr, lo, hi)
    quickSort(arr, lo, p-1)
    quickSort(arr, p+1, hi)`,code:`function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
  return arr;
}
function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++)
    if (arr[j] <= pivot)
      [arr[++i], arr[j]] = [arr[j], arr[i]];
  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
  return i + 1;
}`},{name:"Heap Sort",icon:"🏔️",color:"#10b981",desc:"Builds a max-heap from the array, then repeatedly extracts the maximum element to sort it in-place. Guaranteed O(n log n) with O(1) extra space.",best:"O(n log n)",avg:"O(n log n)",worst:"O(n log n)",space:"O(1)",stable:!1,tags:["Heap","In-place","Consistent"],usecase:"When O(n log n) guaranteed AND O(1) space are both required.",pseudocode:`heapSort(arr):
  buildMaxHeap(arr)
  for i from n-1 to 1:
    swap(arr[0], arr[i])
    heapify(arr, 0, i)`,code:`function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n/2)-1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n-1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let max = i, l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[max]) max = l;
  if (r < n && arr[r] > arr[max]) max = r;
  if (max !== i) {
    [arr[i], arr[max]] = [arr[max], arr[i]];
    heapify(arr, n, max);
  }
}`}],searching:[{name:"Linear Search",icon:"🔦",color:"#ef4444",desc:"Scans every element from index 0 until the target is found or the array is exhausted. Works on any array regardless of order.",best:"O(1)",avg:"O(n)",worst:"O(n)",space:"O(1)",stable:!0,tags:["Sequential","Universal","Simple"],usecase:"Unsorted data, tiny arrays, or when a single search justifies no preprocessing.",pseudocode:`for i from 0 to n-1:
  if arr[i] == target:
    return i
return -1`,code:`function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++)
    if (arr[i] === target) return i;
  return -1;
}`},{name:"Binary Search",icon:"🎯",color:"#06b6d4",desc:"Repeatedly halves the search space by comparing the target to the midpoint. Requires a sorted array. Logarithmic efficiency makes it ideal for large datasets.",best:"O(1)",avg:"O(log n)",worst:"O(log n)",space:"O(1)",stable:!0,tags:["Divide & Conquer","Sorted only","Fast"],usecase:"Large sorted arrays (dictionaries, phone books, databases).",pseudocode:`lo=0, hi=n-1
while lo <= hi:
  mid = (lo+hi)//2
  if arr[mid]==target: return mid
  elif arr[mid]<target: lo=mid+1
  else: hi=mid-1
return -1`,code:`function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target)   lo = mid + 1;
    else                     hi = mid - 1;
  }
  return -1;
}`},{name:"Jump Search",icon:"🦘",color:"#fbbf24",desc:"Jumps ahead in blocks of √n, then does a linear scan in the identified block. Faster than linear but slower than binary for sorted arrays.",best:"O(1)",avg:"O(√n)",worst:"O(√n)",space:"O(1)",stable:!0,tags:["Block-based","Sorted only","Balanced"],usecase:"Sorted arrays where backwards traversal is expensive (e.g., tapes).",pseudocode:`step = √n, prev = 0
while arr[min(step,n)-1] < target:
  prev = step; step += √n
  if prev >= n: return -1
linear search from prev to min(step,n)`,code:`function jumpSearch(arr, target) {
  const n = arr.length;
  let step = Math.floor(Math.sqrt(n)), prev = 0;
  while (arr[Math.min(step,n)-1] < target) {
    prev = step; step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  return arr[prev] === target ? prev : -1;
}`},{name:"Interpolation Search",icon:"📐",color:"#10b981",desc:"Estimates the probable position of the target using the value distribution — like a smart guess. Near O(log log n) on uniform data.",best:"O(1)",avg:"O(log log n)",worst:"O(n)",space:"O(1)",stable:!0,tags:["Adaptive","Uniform data","Heuristic"],usecase:"Uniformly distributed sorted numeric data (e.g., phone numbers).",pseudocode:`while lo<=hi and target in [arr[lo],arr[hi]]:
  pos = lo + ((target-arr[lo])*(hi-lo))/(arr[hi]-arr[lo])
  if arr[pos]==target: return pos
  if arr[pos]<target: lo=pos+1 else hi=pos-1`,code:`function interpolationSearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo<=hi && target>=arr[lo] && target<=arr[hi]) {
    const pos = lo + Math.floor(
      ((target-arr[lo])*(hi-lo)) / (arr[hi]-arr[lo]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target)   lo = pos + 1;
    else                     hi = pos - 1;
  }
  return -1;
}`}],graphs:[{name:"BFS",icon:"🌊",color:"#06b6d4",desc:"Breadth-First Search explores all neighbours at the current depth before moving deeper. Uses a queue. Guarantees shortest path (fewest edges) in unweighted graphs.",best:"O(V+E)",avg:"O(V+E)",worst:"O(V+E)",space:"O(V)",stable:!0,tags:["Level-order","Shortest path","Queue"],usecase:"Shortest path (unweighted), social networks, level-order tree traversal.",pseudocode:`BFS(graph, start):
  visited = {start}
  queue = [start]
  while queue:
    node = queue.dequeue()
    for n in graph[node]:
      if n not in visited:
        visited.add(n)
        queue.enqueue(n)`,code:`function bfs(graph, start) {
  const visited = new Set([start]);
  const queue   = [start];
  const order   = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const nb of graph[node] || [])
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
      }
  }
  return order;
}`},{name:"DFS",icon:"🌀",color:"#8b5cf6",desc:"Depth-First Search dives as deep as possible along each branch before backtracking. Uses a stack (or recursion). Essential for cycle detection, topological sort, and connected components.",best:"O(V+E)",avg:"O(V+E)",worst:"O(V+E)",space:"O(V)",stable:!0,tags:["Recursive","Stack-based","Backtracking"],usecase:"Cycle detection, topological sort, maze generation, connected components.",pseudocode:`DFS(graph, node, visited):
  visited.add(node)
  for n in graph[node]:
    if n not in visited:
      DFS(graph, n, visited)`,code:`function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  const order = [start];
  for (const nb of graph[start] || [])
    if (!visited.has(nb))
      order.push(...dfs(graph, nb, visited));
  return order;
}`},{name:"Kruskal's MST",icon:"🌲",color:"#10b981",desc:"Greedy algorithm for Minimum Spanning Tree. Sorts all edges by weight, then adds the lightest edge that does not create a cycle (using Union-Find).",best:"O(E log E)",avg:"O(E log E)",worst:"O(E log E)",space:"O(V)",stable:!1,tags:["Greedy","Union-Find","MST"],usecase:"Network design, clustering, minimum cost connectivity.",pseudocode:`sort edges by weight
for each edge (u,v,w):
  if find(u) != find(v):
    add edge to MST
    union(u, v)`,code:`function kruskal(edges, n) {
  edges.sort((a,b) => a.w - b.w);
  const parent = Array.from({length:n},(_,i)=>i);
  const find = x => parent[x]===x ? x : (parent[x]=find(parent[x]));
  const mst = [];
  for (const {u,v,w} of edges)
    if (find(u) !== find(v)) {
      parent[find(u)] = find(v);
      mst.push({u,v,w});
    }
  return mst;
}`},{name:"Prim's MST",icon:"🌿",color:"#f97316",desc:"Grows the MST one vertex at a time. Always adds the minimum weight edge connecting the current tree to an unvisited vertex. Uses a priority queue for efficiency.",best:"O(E log V)",avg:"O(E log V)",worst:"O(E log V)",space:"O(V)",stable:!1,tags:["Greedy","Priority Queue","MST"],usecase:"Dense graphs where Kruskal is slower; same applications as Kruskal.",pseudocode:`key[start]=0; parent[start]=-1
while unvisited nodes exist:
  u = node in unvisited with min key
  mark u visited
  for v in adj[u]:
    if w(u,v) < key[v]: key[v]=w; parent[v]=u`,code:`// Simplified Prim's (adjacency matrix)
function prim(graph, n) {
  const key=[...Array(n)].fill(Infinity);
  const inMST=Array(n).fill(false);
  key[0]=0;
  for(let c=0;c<n;c++){
    let u=-1;
    for(let v=0;v<n;v++)
      if(!inMST[v]&&(u===-1||key[v]<key[u])) u=v;
    inMST[u]=true;
    for(let v=0;v<n;v++)
      if(graph[u][v]&&!inMST[v]&&graph[u][v]<key[v])
        key[v]=graph[u][v];
  }
}`}],pathfinding:[{name:"Dijkstra",icon:"🗺️",color:"#fbbf24",desc:"Greedy shortest-path algorithm. Uses a priority queue (min-heap) to always expand the node with the smallest known distance. Optimal for non-negative weighted graphs.",best:"O(V²)",avg:"O(E + V log V)",worst:"O(E + V log V)",space:"O(V)",stable:!0,tags:["Greedy","Weighted","No negatives"],usecase:"GPS navigation, network routing, game AI pathfinding.",pseudocode:`dist[src]=0; all others=∞
while PQ not empty:
  u = extractMin(PQ)
  for v in adj[u]:
    if dist[u]+w(u,v) < dist[v]:
      dist[v] = dist[u]+w(u,v)
      update PQ`,code:`function dijkstra(graph, src) {
  const dist = {}; const visited = new Set();
  for (const n in graph) dist[n] = Infinity;
  dist[src] = 0;
  while (visited.size < Object.keys(graph).length) {
    const u = Object.keys(dist)
      .filter(n=>!visited.has(n))
      .reduce((a,b)=>dist[a]<dist[b]?a:b);
    visited.add(u);
    for (const {node:v,weight:w} of graph[u]||[]) {
      if (dist[u]+w < dist[v]) dist[v]=dist[u]+w;
    }
  }
  return dist;
}`},{name:"Bellman-Ford",icon:"🔔",color:"#ef4444",desc:"Relaxes all edges V-1 times. Handles negative edge weights and can detect negative-weight cycles. Slower than Dijkstra but more general.",best:"O(VE)",avg:"O(VE)",worst:"O(VE)",space:"O(V)",stable:!0,tags:["DP","Negative weights","Cycle detection"],usecase:"Currency arbitrage detection, networks with negative costs.",pseudocode:`dist[src]=0; all others=∞
repeat V-1 times:
  for each edge (u,v,w):
    if dist[u]+w < dist[v]:
      dist[v]=dist[u]+w
// Check for negative cycles`,code:`function bellmanFord(graph, n, src) {
  const dist = Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i < n-1; i++)
    for (let u = 0; u < n; u++)
      for (const {node:v,weight:w} of graph[u]||[])
        if (dist[u]+w < dist[v]) dist[v]=dist[u]+w;
  // Detect negative cycle
  for (let u=0;u<n;u++)
    for(const {node:v,weight:w} of graph[u]||[])
      if(dist[u]+w < dist[v]) return null; // negative cycle
  return dist;
}`},{name:"A* Search",icon:"⭐",color:"#8b5cf6",desc:"Uses a heuristic f(n) = g(n) + h(n) to guide the search toward the goal. When h is admissible, A* is optimal and complete. Dominates Dijkstra on grids/maps.",best:"O(E)",avg:"O(E log V)",worst:"O(b^d)",space:"O(V)",stable:!0,tags:["Heuristic","Informed","Grid-optimal"],usecase:"Game maps, robotic navigation, real-world GPS with heuristics.",pseudocode:`open = {start}; g[start]=0; f[start]=h(start)
while open not empty:
  u = node in open with lowest f
  if u==goal: return path
  for v in neighbours(u):
    tentG = g[u]+cost(u,v)
    if tentG < g[v]: update g,f; add v to open`,code:`function aStar(grid, start, goal, h) {
  const open = new Set([start]);
  const g = {[start]: 0};
  const f = {[start]: h(start)};
  const came = {};
  while (open.size) {
    const u = [...open].reduce((a,b)=>f[a]<f[b]?a:b);
    if (u===goal) return reconstruct(came,u);
    open.delete(u);
    for (const [v,w] of neighbours(grid,u)) {
      const tg = g[u]+w;
      if (tg < (g[v]??Infinity)) {
        came[v]=u; g[v]=tg; f[v]=tg+h(v);
        open.add(v);
      }
    }
  }
  return null;
}`},{name:"Floyd-Warshall",icon:"🌐",color:"#10b981",desc:"Dynamic programming algorithm computing shortest paths between every pair of nodes in a weighted graph. Works with negative weights (no negative cycles).",best:"O(V³)",avg:"O(V³)",worst:"O(V³)",space:"O(V²)",stable:!0,tags:["DP","All-pairs","Dense graphs"],usecase:"Dense graphs, routing tables, transitive closure.",pseudocode:`for k in nodes:
  for i in nodes:
    for j in nodes:
      dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])`,code:`function floydWarshall(dist, n) {
  for (let k=0;k<n;k++)
    for (let i=0;i<n;i++)
      for (let j=0;j<n;j++)
        if (dist[i][k]+dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k]+dist[k][j];
  return dist; // dist[i][j] = shortest i→j
}`}]};function b(s,l){const e=[...l],a=[];if(s==="Bubble Sort"){const r=e.length;for(let n=0;n<r;n++)for(let t=0;t<r-n-1;t++)a.push({arr:[...e],compare:[t,t+1]}),e[t]>e[t+1]&&([e[t],e[t+1]]=[e[t+1],e[t]],a.push({arr:[...e],swap:[t,t+1]}))}else if(s==="Selection Sort"){const r=e.length;for(let n=0;n<r;n++){let t=n;for(let i=n+1;i<r;i++)a.push({arr:[...e],compare:[i,t]}),e[i]<e[t]&&(t=i);t!==n&&([e[n],e[t]]=[e[t],e[n]],a.push({arr:[...e],swap:[n,t]}))}}else if(s==="Insertion Sort")for(let r=1;r<e.length;r++){let n=e[r],t=r-1;for(;t>=0&&e[t]>n;)a.push({arr:[...e],compare:[t,t+1]}),e[t+1]=e[t],t--;e[t+1]=n,a.push({arr:[...e],swap:[t+1,r]})}else if(s==="Linear Search"){const r=e[Math.floor(e.length/2)];for(let n=0;n<e.length&&(a.push({arr:[...e],compare:[n],target:r,found:e[n]===r?[n]:[]}),e[n]!==r);n++);}else if(s==="Binary Search"){const r=[...e].sort((o,d)=>o-d),n=r[Math.floor(r.length/2)];let t=0,i=r.length-1;for(;t<=i;){const o=t+i>>1;if(a.push({arr:r,compare:[o],target:n,lo:t,hi:i,found:r[o]===n?[o]:[]}),r[o]===n)break;r[o]<n?t=o+1:i=o-1}}else a.push({arr:[...e],compare:[],swap:[]});return a}function y(s,l){const e=s.getContext("2d"),{arr:a,compare:r=[],swap:n=[],found:t=[]}=l,i=s.width,o=s.height;e.clearRect(0,0,i,o);const d=a.length,c=i/d,h=Math.max(...a)||1;a.forEach((f,u)=>{let p="#38bdf8";t.includes(u)?p="#10b981":n.includes(u)?p="#f87171":r.includes(u)&&(p="#fbbf24");const g=f/h*(o*.9);e.fillStyle=p,e.fillRect(u*c+1,o-g,c-2,g)})}function w(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\b(function|return|const|let|var|for|while|if|else|new|of|in|null)\b/g,'<span class="kw">$1</span>').replace(/\/\/.*/g,'<span class="cm">$&</span>').replace(/(\d+)/g,'<span class="nm">$1</span>').replace(/(".*?"|'.*?'|`.*?`)/g,'<span class="st">$&</span>')}function k(s){const l=document.getElementById("detail-body"),e=document.getElementById("edu-grid"),a=document.getElementById("detail-panel");e.classList.add("hidden"),a.classList.remove("hidden");const r=Array.from({length:16},()=>Math.floor(Math.random()*90)+10),n=b(s.name,r);let t=0,i=null;l.innerHTML=`
    <div class="detail-header">
      <span class="detail-icon">${s.icon}</span>
      <div>
        <h2 class="font-heading" style="color:${s.color}">${s.name}</h2>
        <div class="edu-tags" style="margin-top:.5rem">
          ${s.tags.map(h=>`<span class="edu-tag">${h}</span>`).join("")}
          <span class="edu-tag" style="color:${s.stable?"#10b981":"#ef4444"}">${s.stable?"✓ Stable":"✗ Unstable"}</span>
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
            <tr><td>Best</td><td style="color:var(--success)">${s.best}</td></tr>
            <tr><td>Average</td><td style="color:var(--secondary)">${s.avg}</td></tr>
            <tr><td>Worst</td><td style="color:var(--danger)">${s.worst}</td></tr>
            <tr><td>Space</td><td style="color:var(--primary)">${s.space}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Description & Use-case -->
      <div class="detail-block">
        <h3 class="block-title">📖 How It Works</h3>
        <p class="block-text">${s.desc}</p>
        <h3 class="block-title" style="margin-top:1rem">✅ Best Used When</h3>
        <p class="block-text">${s.usecase}</p>
      </div>
    </div>

    <!-- Mini Simulation -->
    <div class="detail-block" id="sim-block">
      <h3 class="block-title">🎬 Live Mini-Simulation</h3>
      <canvas id="mini-canvas" width="600" height="140" style="width:100%;border-radius:10px;background:rgba(0,0,0,.25)"></canvas>
      <div class="sim-controls">
        <button id="sim-play"  class="btn btn-primary btn-sm">▶ Play</button>
        <button id="sim-step"  class="btn btn-outline btn-sm">→ Step</button>
        <button id="sim-reset" class="btn btn-outline btn-sm">↺ Reset</button>
        <span id="sim-info" style="color:var(--muted);font-size:.8rem">Step 0 / ${n.length}</span>
      </div>
    </div>

    <!-- Pseudocode -->
    <div class="detail-block">
      <h3 class="block-title">📝 Pseudocode</h3>
      <pre class="code-block pseudo-block">${s.pseudocode}</pre>
    </div>

    <!-- Code -->
    <div class="detail-block">
      <div class="code-header">
        <h3 class="block-title">💻 JavaScript Implementation</h3>
        <button class="btn btn-sm btn-outline" id="btn-copy">Copy</button>
      </div>
      <pre class="code-block"><code class="lang-js">${w(s.code)}</code></pre>
    </div>
  `;const o=document.getElementById("mini-canvas"),d=document.getElementById("sim-info"),c=()=>{n[t]&&y(o,n[t]),d.textContent=`Step ${t} / ${n.length}`};c(),document.getElementById("sim-step").onclick=()=>{t<n.length-1&&(t++,c())},document.getElementById("sim-reset").onclick=()=>{clearInterval(i),i=null,t=0,c(),document.getElementById("sim-play").textContent="▶ Play"},document.getElementById("sim-play").onclick=function(){i?(clearInterval(i),i=null,this.textContent="▶ Play"):(this.textContent="⏸ Pause",i=setInterval(()=>{t<n.length-1?(t++,c()):(clearInterval(i),i=null,this.textContent="▶ Play")},80))},document.getElementById("btn-copy").onclick=function(){navigator.clipboard.writeText(s.code).then(()=>{this.textContent="✓ Copied!",setTimeout(()=>this.textContent="Copy",1500)})}}class S{constructor(){this.currentCat="sorting",this.initDOM(),this.renderCards("sorting")}initDOM(){this.grid=document.getElementById("edu-grid"),this.panel=document.getElementById("detail-panel"),document.getElementById("detail-close").onclick=()=>{this.panel.classList.add("hidden"),this.grid.classList.remove("hidden")},document.querySelectorAll(".edu-tab").forEach(l=>{l.onclick=()=>{document.querySelectorAll(".edu-tab").forEach(e=>e.classList.remove("active")),l.classList.add("active"),this.panel.classList.add("hidden"),this.grid.classList.remove("hidden"),this.renderCards(l.dataset.cat)}})}renderCards(l){this.currentCat=l,this.grid.innerHTML="",(v[l]||[]).forEach(e=>{const a=document.createElement("div");a.className="edu-card",a.style.setProperty("--card-color",e.color+"33"),a.innerHTML=`
        <div class="edu-card-icon">${e.icon}</div>
        <h4 class="font-heading" style="color:${e.color}">${e.name}</h4>
        <p>${e.desc.substring(0,120)}…</p>
        <div class="edu-complexities">
          <div class="edu-complexity-row"><span>Best</span><span>${e.best}</span></div>
          <div class="edu-complexity-row"><span>Avg</span><span>${e.avg}</span></div>
          <div class="edu-complexity-row"><span>Worst</span><span>${e.worst}</span></div>
        </div>
        <div class="edu-tags">
          ${e.tags.map(r=>`<span class="edu-tag">${r}</span>`).join("")}
        </div>
        <button class="btn btn-sm btn-outline edu-explore-btn" style="margin-top:1rem;width:100%">Explore + Simulate →</button>`,a.querySelector(".edu-explore-btn").onclick=r=>{r.stopPropagation(),k(e)},this.grid.appendChild(a)})}}window.addEventListener("DOMContentLoaded",()=>new S);window.addEventListener("DOMContentLoaded",()=>m("particles"));
