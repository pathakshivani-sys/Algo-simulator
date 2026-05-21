// Extended Education data — complexity, code, pseudocode, use-cases
export const EDU_DATA = {
  sorting: [
    {
      name: 'Bubble Sort', icon: '🫧', color: '#ef4444',
      desc: 'Repeatedly compares adjacent elements and swaps them if they are in the wrong order. Each pass "bubbles" the largest unsorted element to its correct position.',
      best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
      stable: true, tags: ['Comparison', 'In-place', 'Simple'],
      usecase: 'Teaching purposes; nearly-sorted small datasets.',
      pseudocode: `for i from 0 to n-1:\n  for j from 0 to n-i-2:\n    if arr[j] > arr[j+1]:\n      swap(arr[j], arr[j+1])`,
      code: `function bubbleSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n; i++) {\n    let swapped = false;\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n        swapped = true;\n      }\n    }\n    if (!swapped) break; // Early exit\n  }\n  return arr;\n}`
    },
    {
      name: 'Selection Sort', icon: '🎯', color: '#f97316',
      desc: 'Divides the array into sorted and unsorted regions. Each pass finds the minimum of the unsorted region and places it at the front. Always performs O(n²) comparisons.',
      best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
      stable: false, tags: ['Comparison', 'In-place', 'Slow'],
      usecase: 'When write operations are expensive (minimises swaps).',
      pseudocode: `for i from 0 to n-1:\n  min = i\n  for j from i+1 to n-1:\n    if arr[j] < arr[min]: min = j\n  swap(arr[i], arr[min])`,
      code: `function selectionSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n; i++) {\n    let min = i;\n    for (let j = i + 1; j < n; j++)\n      if (arr[j] < arr[min]) min = j;\n    if (min !== i)\n      [arr[i], arr[min]] = [arr[min], arr[i]];\n  }\n  return arr;\n}`
    },
    {
      name: 'Insertion Sort', icon: '🃏', color: '#fbbf24',
      desc: 'Builds the sorted array one element at a time by inserting each new element into its correct position. Very efficient for small or nearly-sorted arrays.',
      best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
      stable: true, tags: ['Comparison', 'Adaptive', 'Online'],
      usecase: 'Small n, nearly-sorted data, real-time (online) sorting.',
      pseudocode: `for i from 1 to n-1:\n  key = arr[i]\n  j = i - 1\n  while j >= 0 and arr[j] > key:\n    arr[j+1] = arr[j]\n    j--\n  arr[j+1] = key`,
      code: `function insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    const key = arr[i];\n    let j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n      arr[j + 1] = arr[j];\n      j--;\n    }\n    arr[j + 1] = key;\n  }\n  return arr;\n}`
    },
    {
      name: 'Merge Sort', icon: '🧩', color: '#06b6d4',
      desc: 'Divide-and-conquer algorithm. Splits the array into halves recursively, sorts each half, then merges them. Guarantees O(n log n) in all cases and is stable.',
      best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',
      stable: true, tags: ['Divide & Conquer', 'Stable', 'Predictable'],
      usecase: 'Large datasets, linked lists, external sorting, stable order needed.',
      pseudocode: `mergeSort(arr):\n  if len(arr) <= 1: return arr\n  mid = len(arr)//2\n  L = mergeSort(arr[:mid])\n  R = mergeSort(arr[mid:])\n  return merge(L, R)`,
      code: `function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid  = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right= mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\nfunction merge(L, R) {\n  const res = []; let i = 0, j = 0;\n  while (i < L.length && j < R.length)\n    res.push(L[i] <= R[j] ? L[i++] : R[j++]);\n  return res.concat(L.slice(i), R.slice(j));\n}`
    },
    {
      name: 'Quick Sort', icon: '⚡', color: '#8b5cf6',
      desc: 'Picks a pivot and partitions the array into elements less-than and greater-than the pivot, then recursively sorts each part. Very cache-friendly in practice.',
      best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)',
      stable: false, tags: ['Divide & Conquer', 'Cache-friendly', 'Fast'],
      usecase: 'General purpose; fastest in practice for large random arrays.',
      pseudocode: `quickSort(arr, lo, hi):\n  if lo < hi:\n    p = partition(arr, lo, hi)\n    quickSort(arr, lo, p-1)\n    quickSort(arr, p+1, hi)`,
      code: `function quickSort(arr, lo = 0, hi = arr.length - 1) {\n  if (lo < hi) {\n    const p = partition(arr, lo, hi);\n    quickSort(arr, lo, p - 1);\n    quickSort(arr, p + 1, hi);\n  }\n  return arr;\n}\nfunction partition(arr, lo, hi) {\n  const pivot = arr[hi];\n  let i = lo - 1;\n  for (let j = lo; j < hi; j++)\n    if (arr[j] <= pivot)\n      [arr[++i], arr[j]] = [arr[j], arr[i]];\n  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];\n  return i + 1;\n}`
    },
    {
      name: 'Heap Sort', icon: '🏔️', color: '#10b981',
      desc: 'Builds a max-heap from the array, then repeatedly extracts the maximum element to sort it in-place. Guaranteed O(n log n) with O(1) extra space.',
      best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)',
      stable: false, tags: ['Heap', 'In-place', 'Consistent'],
      usecase: 'When O(n log n) guaranteed AND O(1) space are both required.',
      pseudocode: `heapSort(arr):\n  buildMaxHeap(arr)\n  for i from n-1 to 1:\n    swap(arr[0], arr[i])\n    heapify(arr, 0, i)`,
      code: `function heapSort(arr) {\n  const n = arr.length;\n  for (let i = Math.floor(n/2)-1; i >= 0; i--)\n    heapify(arr, n, i);\n  for (let i = n-1; i > 0; i--) {\n    [arr[0], arr[i]] = [arr[i], arr[0]];\n    heapify(arr, i, 0);\n  }\n  return arr;\n}\nfunction heapify(arr, n, i) {\n  let max = i, l = 2*i+1, r = 2*i+2;\n  if (l < n && arr[l] > arr[max]) max = l;\n  if (r < n && arr[r] > arr[max]) max = r;\n  if (max !== i) {\n    [arr[i], arr[max]] = [arr[max], arr[i]];\n    heapify(arr, n, max);\n  }\n}`
    },
    {
      name: 'Counting Sort', icon: '🧮', color: '#3b82f6',
      desc: 'An integer sorting algorithm that works by counting the number of objects that have distinct key values. Not a comparison-based sort. Extremely fast when the range of elements (k) is not significantly greater than the number of elements (n).',
      best: 'O(n + k)', avg: 'O(n + k)', worst: 'O(n + k)', space: 'O(n + k)',
      stable: true, tags: ['Non-Comparison', 'Linear Time', 'Integer'],
      usecase: 'Sorting small integers with a known, small range.',
      pseudocode: `max = max(arr)\ncount = array of zeros(max + 1)\nfor x in arr: count[x]++\nfor i from 1 to max: count[i] += count[i-1]\noutput = array of size n\nfor x in reverse(arr):\n  output[count[x]-1] = x\n  count[x]--\nreturn output`,
      code: `function countingSort(arr) {\n  if (arr.length === 0) return arr;\n  const max = Math.max(...arr);\n  const count = new Array(max + 1).fill(0);\n  const output = new Array(arr.length);\n  for (let i = 0; i < arr.length; i++) {\n    count[arr[i]]++;\n  }\n  for (let i = 1; i <= max; i++) {\n    count[i] += count[i - 1];\n  }\n  for (let i = arr.length - 1; i >= 0; i--) {\n    output[count[arr[i]] - 1] = arr[i];\n    count[arr[i]]--;\n  }\n  for (let i = 0; i < arr.length; i++) {\n    arr[i] = output[i];\n  }\n  return arr;\n}`
    },
    {
      name: 'Radix Sort', icon: '🎰', color: '#ec4899',
      desc: 'Sorts integers by processing individual digits. Processes digits from least significant to most significant using a stable subroutine (like Counting Sort). Reaches linear time performance for reasonable key sizes.',
      best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)', space: 'O(n + k)',
      stable: true, tags: ['Non-Comparison', 'Digit-based', 'Linear Time'],
      usecase: 'Sorting strings, IP addresses, or integers with large ranges where counting sort fails.',
      pseudocode: `max = max(arr)\nexp = 1\nwhile max / exp > 0:\n  countingSortByDigit(arr, exp)\n  exp *= 10`,
      code: `function radixSort(arr) {\n  if (arr.length === 0) return arr;\n  const max = Math.max(...arr);\n  let exp = 1;\n  while (Math.floor(max / exp) > 0) {\n    countingSortForRadix(arr, exp);\n    exp *= 10;\n  }\n  return arr;\n}\n\nfunction countingSortForRadix(arr, exp) {\n  const output = new Array(arr.length);\n  const count = new Array(10).fill(0);\n  for (let i = 0; i < arr.length; i++)\n    count[Math.floor(arr[i] / exp) % 10]++;\n  for (let i = 1; i < 10; i++)\n    count[i] += count[i - 1];\n  for (let i = arr.length - 1; i >= 0; i--) {\n    const digit = Math.floor(arr[i] / exp) % 10;\n    output[count[digit] - 1] = arr[i];\n    count[digit]--;\n  }\n  for (let i = 0; i < arr.length; i++) arr[i] = output[i];\n}`
    },
  ],
  searching: [
    {
      name: 'Linear Search', icon: '🔦', color: '#ef4444',
      desc: 'Scans every element from index 0 until the target is found or the array is exhausted. Works on any array regardless of order.',
      best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)',
      stable: true, tags: ['Sequential', 'Universal', 'Simple'],
      usecase: 'Unsorted data, tiny arrays, or when a single search justifies no preprocessing.',
      pseudocode: `for i from 0 to n-1:\n  if arr[i] == target:\n    return i\nreturn -1`,
      code: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++)\n    if (arr[i] === target) return i;\n  return -1;\n}`
    },
    {
      name: 'Binary Search', icon: '🎯', color: '#06b6d4',
      desc: 'Repeatedly halves the search space by comparing the target to the midpoint. Requires a sorted array. Logarithmic efficiency makes it ideal for large datasets.',
      best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)',
      stable: true, tags: ['Divide & Conquer', 'Sorted only', 'Fast'],
      usecase: 'Large sorted arrays (dictionaries, phone books, databases).',
      pseudocode: `lo=0, hi=n-1\nwhile lo <= hi:\n  mid = (lo+hi)//2\n  if arr[mid]==target: return mid\n  elif arr[mid]<target: lo=mid+1\n  else: hi=mid-1\nreturn -1`,
      code: `function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target)   lo = mid + 1;\n    else                     hi = mid - 1;\n  }\n  return -1;\n}`
    },
    {
      name: 'Jump Search', icon: '🦘', color: '#fbbf24',
      desc: 'Jumps ahead in blocks of √n, then does a linear scan in the identified block. Faster than linear but slower than binary for sorted arrays.',
      best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', space: 'O(1)',
      stable: true, tags: ['Block-based', 'Sorted only', 'Balanced'],
      usecase: 'Sorted arrays where backwards traversal is expensive (e.g., tapes).',
      pseudocode: `step = √n, prev = 0\nwhile arr[min(step,n)-1] < target:\n  prev = step; step += √n\n  if prev >= n: return -1\nlinear search from prev to min(step,n)`,
      code: `function jumpSearch(arr, target) {\n  const n = arr.length;\n  let step = Math.floor(Math.sqrt(n)), prev = 0;\n  while (arr[Math.min(step,n)-1] < target) {\n    prev = step; step += Math.floor(Math.sqrt(n));\n    if (prev >= n) return -1;\n  }\n  while (arr[prev] < target) {\n    prev++;\n    if (prev === Math.min(step, n)) return -1;\n  }\n  return arr[prev] === target ? prev : -1;\n}`
    },
    {
      name: 'Interpolation Search', icon: '📐', color: '#10b981',
      desc: 'Estimates the probable position of the target using the value distribution — like a smart guess. Near O(log log n) on uniform data.',
      best: 'O(1)', avg: 'O(log log n)', worst: 'O(n)', space: 'O(1)',
      stable: true, tags: ['Adaptive', 'Uniform data', 'Heuristic'],
      usecase: 'Uniformly distributed sorted numeric data (e.g., phone numbers).',
      pseudocode: `while lo<=hi and target in [arr[lo],arr[hi]]:\n  pos = lo + ((target-arr[lo])*(hi-lo))/(arr[hi]-arr[lo])\n  if arr[pos]==target: return pos\n  if arr[pos]<target: lo=pos+1 else hi=pos-1`,
      code: `function interpolationSearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo<=hi && target>=arr[lo] && target<=arr[hi]) {\n    const pos = lo + Math.floor(\n      ((target-arr[lo])*(hi-lo)) / (arr[hi]-arr[lo]));\n    if (arr[pos] === target) return pos;\n    if (arr[pos] < target)   lo = pos + 1;\n    else                     hi = pos - 1;\n  }\n  return -1;\n}`
    },
  ],
  graphs: [
    {
      name: 'BFS', icon: '🌊', color: '#06b6d4',
      desc: 'Breadth-First Search explores all neighbours at the current depth before moving deeper. Uses a queue. Guarantees shortest path (fewest edges) in unweighted graphs.',
      best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)',
      stable: true, tags: ['Level-order', 'Shortest path', 'Queue'],
      usecase: 'Shortest path (unweighted), social networks, level-order tree traversal.',
      pseudocode: `BFS(graph, start):\n  visited = {start}\n  queue = [start]\n  while queue:\n    node = queue.dequeue()\n    for n in graph[node]:\n      if n not in visited:\n        visited.add(n)\n        queue.enqueue(n)`,
      code: `function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue   = [start];\n  const order   = [];\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const nb of graph[node] || [])\n      if (!visited.has(nb)) {\n        visited.add(nb);\n        queue.push(nb);\n      }\n  }\n  return order;\n}`
    },
    {
      name: 'DFS', icon: '🌀', color: '#8b5cf6',
      desc: 'Depth-First Search dives as deep as possible along each branch before backtracking. Uses a stack (or recursion). Essential for cycle detection, topological sort, and connected components.',
      best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)',
      stable: true, tags: ['Recursive', 'Stack-based', 'Backtracking'],
      usecase: 'Cycle detection, topological sort, maze generation, connected components.',
      pseudocode: `DFS(graph, node, visited):\n  visited.add(node)\n  for n in graph[node]:\n    if n not in visited:\n      DFS(graph, n, visited)`,
      code: `function dfs(graph, start, visited = new Set()) {\n  visited.add(start);\n  const order = [start];\n  for (const nb of graph[start] || [])\n    if (!visited.has(nb))\n      order.push(...dfs(graph, nb, visited));\n  return order;\n}`
    },
    {
      name: "Kruskal's MST", icon: '🌲', color: '#10b981',
      desc: 'Greedy algorithm for Minimum Spanning Tree. Sorts all edges by weight, then adds the lightest edge that does not create a cycle (using Union-Find).',
      best: 'O(E log E)', avg: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)',
      stable: false, tags: ['Greedy', 'Union-Find', 'MST'],
      usecase: 'Network design, clustering, minimum cost connectivity.',
      pseudocode: `sort edges by weight\nfor each edge (u,v,w):\n  if find(u) != find(v):\n    add edge to MST\n    union(u, v)`,
      code: `function kruskal(edges, n) {\n  edges.sort((a,b) => a.w - b.w);\n  const parent = Array.from({length:n},(_,i)=>i);\n  const find = x => parent[x]===x ? x : (parent[x]=find(parent[x]));\n  const mst = [];\n  for (const {u,v,w} of edges)\n    if (find(u) !== find(v)) {\n      parent[find(u)] = find(v);\n      mst.push({u,v,w});\n    }\n  return mst;\n}`
    },
    {
      name: "Prim's MST", icon: '🌿', color: '#f97316',
      desc: 'Grows the MST one vertex at a time. Always adds the minimum weight edge connecting the current tree to an unvisited vertex. Uses a priority queue for efficiency.',
      best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(E log V)', space: 'O(V)',
      stable: false, tags: ['Greedy', 'Priority Queue', 'MST'],
      usecase: 'Dense graphs where Kruskal is slower; same applications as Kruskal.',
      pseudocode: `key[start]=0; parent[start]=-1\nwhile unvisited nodes exist:\n  u = node in unvisited with min key\n  mark u visited\n  for v in adj[u]:\n    if w(u,v) < key[v]: key[v]=w; parent[v]=u`,
      code: `// Simplified Prim's (adjacency matrix)\nfunction prim(graph, n) {\n  const key=[...Array(n)].fill(Infinity);\n  const inMST=Array(n).fill(false);\n  key[0]=0;\n  for(let c=0;c<n;c++){\n    let u=-1;\n    for(let v=0;v<n;v++)\n      if(!inMST[v]&&(u===-1||key[v]<key[u])) u=v;\n    inMST[u]=true;\n    for(let v=0;v<n;v++)\n      if(graph[u][v]&&!inMST[v]&&graph[u][v]<key[v])\n        key[v]=graph[u][v];\n  }\n}`
    },
  ],
  pathfinding: [
    {
      name: 'Dijkstra', icon: '🗺️', color: '#fbbf24',
      desc: "Greedy shortest-path algorithm. Uses a priority queue (min-heap) to always expand the node with the smallest known distance. Optimal for non-negative weighted graphs.",
      best: 'O(V²)', avg: 'O(E + V log V)', worst: 'O(E + V log V)', space: 'O(V)',
      stable: true, tags: ['Greedy', 'Weighted', 'No negatives'],
      usecase: 'GPS navigation, network routing, game AI pathfinding.',
      pseudocode: `dist[src]=0; all others=∞\nwhile PQ not empty:\n  u = extractMin(PQ)\n  for v in adj[u]:\n    if dist[u]+w(u,v) < dist[v]:\n      dist[v] = dist[u]+w(u,v)\n      update PQ`,
      code: `function dijkstra(graph, src) {\n  const dist = {}; const visited = new Set();\n  for (const n in graph) dist[n] = Infinity;\n  dist[src] = 0;\n  while (visited.size < Object.keys(graph).length) {\n    const u = Object.keys(dist)\n      .filter(n=>!visited.has(n))\n      .reduce((a,b)=>dist[a]<dist[b]?a:b);\n    visited.add(u);\n    for (const {node:v,weight:w} of graph[u]||[]) {\n      if (dist[u]+w < dist[v]) dist[v]=dist[u]+w;\n    }\n  }\n  return dist;\n}`
    },
    {
      name: 'Bellman-Ford', icon: '🔔', color: '#ef4444',
      desc: 'Relaxes all edges V-1 times. Handles negative edge weights and can detect negative-weight cycles. Slower than Dijkstra but more general.',
      best: 'O(VE)', avg: 'O(VE)', worst: 'O(VE)', space: 'O(V)',
      stable: true, tags: ['DP', 'Negative weights', 'Cycle detection'],
      usecase: 'Currency arbitrage detection, networks with negative costs.',
      pseudocode: `dist[src]=0; all others=∞\nrepeat V-1 times:\n  for each edge (u,v,w):\n    if dist[u]+w < dist[v]:\n      dist[v]=dist[u]+w\n// Check for negative cycles`,
      code: `function bellmanFord(graph, n, src) {\n  const dist = Array(n).fill(Infinity);\n  dist[src] = 0;\n  for (let i = 0; i < n-1; i++)\n    for (let u = 0; u < n; u++)\n      for (const {node:v,weight:w} of graph[u]||[])\n        if (dist[u]+w < dist[v]) dist[v]=dist[u]+w;\n  // Detect negative cycle\n  for (let u=0;u<n;u++)\n    for(const {node:v,weight:w} of graph[u]||[])\n      if(dist[u]+w < dist[v]) return null; // negative cycle\n  return dist;\n}`
    },
    {
      name: 'A* Search', icon: '⭐', color: '#8b5cf6',
      desc: "Uses a heuristic f(n) = g(n) + h(n) to guide the search toward the goal. When h is admissible, A* is optimal and complete. Dominates Dijkstra on grids/maps.",
      best: 'O(E)', avg: 'O(E log V)', worst: 'O(b^d)', space: 'O(V)',
      stable: true, tags: ['Heuristic', 'Informed', 'Grid-optimal'],
      usecase: 'Game maps, robotic navigation, real-world GPS with heuristics.',
      pseudocode: `open = {start}; g[start]=0; f[start]=h(start)\nwhile open not empty:\n  u = node in open with lowest f\n  if u==goal: return path\n  for v in neighbours(u):\n    tentG = g[u]+cost(u,v)\n    if tentG < g[v]: update g,f; add v to open`,
      code: `function aStar(grid, start, goal, h) {\n  const open = new Set([start]);\n  const g = {[start]: 0};\n  const f = {[start]: h(start)};\n  const came = {};\n  while (open.size) {\n    const u = [...open].reduce((a,b)=>f[a]<f[b]?a:b);\n    if (u===goal) return reconstruct(came,u);\n    open.delete(u);\n    for (const [v,w] of neighbours(grid,u)) {\n      const tg = g[u]+w;\n      if (tg < (g[v]??Infinity)) {\n        came[v]=u; g[v]=tg; f[v]=tg+h(v);\n        open.add(v);\n      }\n    }\n  }\n  return null;\n}`
    },
    {
      name: 'Floyd-Warshall', icon: '🌐', color: '#10b981',
      desc: 'Dynamic programming algorithm computing shortest paths between every pair of nodes in a weighted graph. Works with negative weights (no negative cycles).',
      best: 'O(V³)', avg: 'O(V³)', worst: 'O(V³)', space: 'O(V²)',
      stable: true, tags: ['DP', 'All-pairs', 'Dense graphs'],
      usecase: 'Dense graphs, routing tables, transitive closure.',
      pseudocode: `for k in nodes:\n  for i in nodes:\n    for j in nodes:\n      dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])`,
      code: `function floydWarshall(dist, n) {\n  for (let k=0;k<n;k++)\n    for (let i=0;i<n;i++)\n      for (let j=0;j<n;j++)\n        if (dist[i][k]+dist[k][j] < dist[i][j])\n          dist[i][j] = dist[i][k]+dist[k][j];\n  return dist; // dist[i][j] = shortest i→j\n}`
    },
  ]
};
