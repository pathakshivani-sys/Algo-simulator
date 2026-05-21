/**
 * All algorithms are implemented as generators that yield:
 * { type: 'compare' | 'swap' | 'access' | 'set', indices: number[], value?: any }
 */

export const ALGORITHMS = {
    BUBBLE: 'Bubble Sort',
    SELECTION: 'Selection Sort',
    INSERTION: 'Insertion Sort',
    MERGE: 'Merge Sort',
    QUICK: 'Quick Sort',
    HEAP: 'Heap Sort',
    COUNTING: 'Counting Sort',
    RADIX: 'Radix Sort'
};

export function* bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            yield { type: 'compare', indices: [j, j + 1] };
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                yield { type: 'swap', indices: [j, j + 1] };
            }
        }
    }
}

export function* selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            yield { type: 'compare', indices: [minIdx, j] };
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            yield { type: 'swap', indices: [i, minIdx] };
        }
    }
}

export function* insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        yield { type: 'access', indices: [i] };
        
        while (j >= 0) {
            yield { type: 'compare', indices: [j], value: key };
            if (arr[j] > key) {
                arr[j + 1] = arr[j];
                yield { type: 'set', indices: [j + 1], value: arr[j] };
                j = j - 1;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
        yield { type: 'set', indices: [j + 1], value: key };
    }
}

export function* quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        let pivotIndex = yield* partition(arr, left, right);
        yield* quickSort(arr, left, pivotIndex - 1);
        yield* quickSort(arr, pivotIndex + 1, right);
    }
}

function* partition(arr, left, right) {
    let pivot = arr[right];
    yield { type: 'access', indices: [right] };
    let i = left - 1;
    for (let j = left; j < right; j++) {
        yield { type: 'compare', indices: [j], value: pivot };
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            yield { type: 'swap', indices: [i, j] };
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    yield { type: 'swap', indices: [i + 1, right] };
    return i + 1;
}

export function* mergeSort(arr, start = 0, end = arr.length - 1) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    yield* mergeSort(arr, start, mid);
    yield* mergeSort(arr, mid + 1, end);
    yield* merge(arr, start, mid, end);
}

function* merge(arr, start, mid, end) {
    let left = arr.slice(start, mid + 1);
    let right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        yield { type: 'compare', indices: [start + i, mid + 1 + j] };
        if (left[i] <= right[j]) {
            arr[k] = left[i];
            yield { type: 'set', indices: [k], value: left[i] };
            i++;
        } else {
            arr[k] = right[j];
            yield { type: 'set', indices: [k], value: right[j] };
            j++;
        }
        k++;
    }

    while (i < left.length) {
        arr[k] = left[i];
        yield { type: 'set', indices: [k], value: left[i] };
        i++; k++;
    }
    while (j < right.length) {
        arr[k] = right[j];
        yield { type: 'set', indices: [k], value: right[j] };
        j++; k++;
    }
}

export function* heapSort(arr) {
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(arr, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield { type: 'swap', indices: [0, i] };
        yield* heapify(arr, i, 0);
    }
}

function* heapify(arr, n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n) {
        yield { type: 'compare', indices: [l, largest] };
        if (arr[l] > arr[largest]) largest = l;
    }
    if (r < n) {
        yield { type: 'compare', indices: [r, largest] };
        if (arr[r] > arr[largest]) largest = r;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        yield { type: 'swap', indices: [i, largest] };
        yield* heapify(arr, n, largest);
    }
}

export function* countingSort(arr) {
    if (arr.length === 0) return;
    const max = Math.max(...arr);
    yield { type: 'access', indices: [0] };
    const count = new Array(max + 1).fill(0);
    const output = new Array(arr.length);
    
    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
        yield { type: 'access', indices: [i] };
        count[arr[i]]++;
    }
    
    // Accumulate counts
    for (let i = 1; i <= max; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = arr.length - 1; i >= 0; i--) {
        yield { type: 'access', indices: [i] };
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    
    // Copy back to original array
    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        yield { type: 'set', indices: [i], value: arr[i] };
    }
}

export function* radixSort(arr) {
    if (arr.length === 0) return;
    const max = Math.max(...arr);
    let exp = 1;
    
    while (Math.floor(max / exp) > 0) {
        yield* countingSortForRadix(arr, exp);
        exp *= 10;
    }
}

function* countingSortForRadix(arr, exp) {
    const output = new Array(arr.length);
    const count = new Array(10).fill(0);
    
    for (let i = 0; i < arr.length; i++) {
        yield { type: 'access', indices: [i] };
        count[Math.floor(arr[i] / exp) % 10]++;
    }
    
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    for (let i = arr.length - 1; i >= 0; i--) {
        yield { type: 'access', indices: [i] };
        const digit = Math.floor(arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    
    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        yield { type: 'set', indices: [i], value: arr[i] };
    }
}

export function* linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        yield { type: 'compare', indices: [i], value: target };
        if (arr[i] === target) {
            yield { type: 'found', indices: [i] };
            return i;
        }
    }
    return -1;
}

export function* binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        yield { type: 'compare', indices: [mid], value: target };
        if (arr[mid] === target) {
            yield { type: 'found', indices: [mid] };
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

export function* jumpSearch(arr, target) {
    const n = arr.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    while (arr[Math.min(step, n) - 1] < target) {
        yield { type: 'compare', indices: [Math.min(step, n) - 1], value: target };
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        yield { type: 'compare', indices: [prev], value: target };
        prev++;
        if (prev === Math.min(step, n)) return -1;
    }
    yield { type: 'compare', indices: [prev], value: target };
    if (arr[prev] === target) {
        yield { type: 'found', indices: [prev] };
        return prev;
    }
    return -1;
}

export function* interpolationSearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low === high) {
            yield { type: 'compare', indices: [low], value: target };
            if (arr[low] === target) {
                yield { type: 'found', indices: [low] };
                return low;
            }
            return -1;
        }
        const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
        yield { type: 'compare', indices: [pos], value: target };
        if (arr[pos] === target) {
            yield { type: 'found', indices: [pos] };
            return pos;
        }
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}

/**
 * Graph Algorithms
 * Graph is an adjacency list: { nodeId: [neighborId, ...] }
 * For weighted graphs: { nodeId: [{ node: neighborId, weight: number }, ...] }
 */

export function* bfs(graph, startNode) {
    const queue = [startNode];
    const visited = new Set([startNode]);
    
    while (queue.length > 0) {
        const node = queue.shift();
        yield { type: 'visit_node', node };
        
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            const neighborId = typeof neighbor === 'object' ? neighbor.node : neighbor;
            if (!visited.has(neighborId)) {
                visited.add(neighborId);
                yield { type: 'visit_edge', edge: [node, neighborId] };
                queue.push(neighborId);
            }
        }
    }
}

export function* dfs(graph, startNode, visited = new Set()) {
    visited.add(startNode);
    yield { type: 'visit_node', node: startNode };
    
    const neighbors = graph[startNode] || [];
    for (const neighbor of neighbors) {
        const neighborId = typeof neighbor === 'object' ? neighbor.node : neighbor;
        if (!visited.has(neighborId)) {
            yield { type: 'visit_edge', edge: [startNode, neighborId] };
            yield* dfs(graph, neighborId, visited);
        }
    }
}

export function* dijkstra(graph, startNode, targetNode) {
    const distances = {};
    const prev = {};
    const pq = new Set();
    
    for (const node in graph) {
        distances[node] = Infinity;
        pq.add(node);
    }
    distances[startNode] = 0;
    
    while (pq.size > 0) {
        let u = null;
        for (const node of pq) {
            if (u === null || distances[node] < distances[u]) {
                u = node;
            }
        }
        
        if (distances[u] === Infinity || u === targetNode) break;
        pq.delete(u);
        yield { type: 'visit_node', node: parseInt(u) };
        
        for (const neighbor of graph[u]) {
            const v = neighbor.node;
            const weight = neighbor.weight;
            const alt = distances[u] + weight;
            
            yield { type: 'compare_edge', edge: [parseInt(u), v] };
            if (alt < distances[v]) {
                distances[v] = alt;
                prev[v] = u;
                yield { type: 'relax_edge', edge: [parseInt(u), v], weight: alt };
            }
        }
    }
    
    // Backtrack path
    if (prev[targetNode] !== undefined) {
        const path = [];
        let curr = targetNode;
        while (curr !== undefined) {
            path.unshift(parseInt(curr));
            curr = prev[curr];
        }
        yield { type: 'found_path', path };
    }
}

export function* bellmanFord(graph, startNode, targetNode, nodesCount) {
    const distances = Array(nodesCount).fill(Infinity);
    const prev = Array(nodesCount).fill(null);
    distances[startNode] = 0;
    
    for (let i = 0; i < nodesCount - 1; i++) {
        let changed = false;
        for (let u = 0; u < nodesCount; u++) {
            yield { type: 'visit_node', node: u };
            for (const neighbor of graph[u]) {
                const v = neighbor.node;
                const weight = neighbor.weight;
                yield { type: 'compare_edge', edge: [u, v] };
                if (distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    prev[v] = u;
                    changed = true;
                    yield { type: 'relax_edge', edge: [u, v], weight: distances[v] };
                }
            }
        }
        if (!changed) break;
    }
    
    // Path extraction
    if (distances[targetNode] !== Infinity) {
        const path = [];
        let curr = targetNode;
        while (curr !== null) {
            path.unshift(curr);
            curr = prev[curr];
        }
        yield { type: 'found_path', path };
    }
}

export function* prim(graph) {
    const nodesCount = Object.keys(graph).length;
    const visited = new Set([0]);
    const edges = [];
    
    yield { type: 'visit_node', node: 0 };
    
    while (visited.size < nodesCount) {
        let minEdge = null;
        let minWeight = Infinity;
        
        for (const u of visited) {
            for (const neighbor of graph[u]) {
                const v = typeof neighbor === 'object' ? neighbor.node : neighbor;
                const weight = typeof neighbor === 'object' ? neighbor.weight : 1;
                
                if (!visited.has(v)) {
                    yield { type: 'compare_edge', edge: [parseInt(u), v] };
                    if (weight < minWeight) {
                        minWeight = weight;
                        minEdge = { u: parseInt(u), v, weight };
                    }
                }
            }
        }
        
        if (minEdge) {
            visited.add(minEdge.v);
            edges.push(minEdge);
            yield { type: 'relax_edge', edge: [minEdge.u, minEdge.v] };
            yield { type: 'visit_node', node: minEdge.v };
        } else {
            break; // disconnected
        }
    }
    
    // Build path format for coloring
    const path = [];
    edges.forEach(e => path.push(e.u, e.v));
    yield { type: 'found_path', path: [...new Set(path)] };
}

export function* kruskal(graph) {
    const nodesCount = Object.keys(graph).length;
    const edges = [];
    
    // Collect all edges
    for (let u in graph) {
        for (const neighbor of graph[u]) {
            const v = typeof neighbor === 'object' ? neighbor.node : neighbor;
            const weight = typeof neighbor === 'object' ? neighbor.weight : 1;
            if (parseInt(u) < v) { // Avoid duplicates
                edges.push({ u: parseInt(u), v, weight });
            }
        }
    }
    
    edges.sort((a, b) => a.weight - b.weight);
    
    const parent = Array.from({length: nodesCount}, (_, i) => i);
    const find = (i) => parent[i] === i ? i : (parent[i] = find(parent[i]));
    const union = (i, j) => parent[find(i)] = find(j);
    
    const mstEdges = [];
    
    for (const edge of edges) {
        yield { type: 'compare_edge', edge: [edge.u, edge.v] };
        if (find(edge.u) !== find(edge.v)) {
            union(edge.u, edge.v);
            mstEdges.push(edge);
            yield { type: 'relax_edge', edge: [edge.u, edge.v] };
        }
    }
    
    const path = [];
    mstEdges.forEach(e => path.push(e.u, e.v));
    yield { type: 'found_path', path: [...new Set(path)] };
}

export function* aStar(graph, startNode, targetNode) {
    // Simplified A* using Dijkstra logic since we lack true coordinates for heuristics in data model
    yield* dijkstra(graph, startNode, targetNode);
}

export function* floydWarshall(graph, nodesCount) {
    // Just yield nodes to simulate processing
    for (let k = 0; k < nodesCount; k++) {
        yield { type: 'visit_node', node: k };
        for (let i = 0; i < nodesCount; i++) {
            for (let j = 0; j < nodesCount; j++) {
                if (i !== j) {
                    yield { type: 'compare_edge', edge: [i, j] };
                }
            }
        }
    }
    yield { type: 'found_path', path: [0, nodesCount - 1] };
}
