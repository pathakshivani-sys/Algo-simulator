// Dataset generation utilities

export const DATASET_TYPES = {
    RANDOM: 'random',
    NEARLY_SORTED: 'nearly-sorted',
    REVERSED: 'reversed',
    DUPLICATES: 'duplicates'
};

/**
 * Generates an array of numbers based on the type.
 * @param {number} size 
 * @param {string} type 
 * @returns {number[]}
 */
export function generateDataset(size, type) {
    let arr = Array.from({ length: size }, (_, i) => i + 1);
    
    switch (type) {
        case DATASET_TYPES.RANDOM:
            return shuffle(arr);
        case DATASET_TYPES.NEARLY_SORTED:
            // Swap a few elements
            for (let i = 0; i < size / 10; i++) {
                const idx1 = Math.floor(Math.random() * size);
                const idx2 = Math.floor(Math.random() * size);
                [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
            }
            return arr;
        case DATASET_TYPES.REVERSED:
            return arr.reverse();
        case DATASET_TYPES.DUPLICATES:
            // Fill with a few unique values
            const uniqueValues = [Math.floor(size * 0.2), Math.floor(size * 0.5), Math.floor(size * 0.8)];
            return arr.map(() => uniqueValues[Math.floor(Math.random() * uniqueValues.length)]);
        default:
            return shuffle(arr);
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a random graph as an adjacency list.
 */
export function generateGraph(nodesCount, edgesProbability = 0.2) {
    const graph = {};
    for (let i = 0; i < nodesCount; i++) {
        graph[i] = [];
    }
    
    for (let i = 0; i < nodesCount; i++) {
        for (let j = i + 1; j < nodesCount; j++) {
            if (Math.random() < edgesProbability) {
                graph[i].push(j);
                graph[j].push(i);
            }
        }
    }
    return graph;
}

/**
 * Generates a random weighted graph.
 */
export function generateWeightedGraph(nodesCount, edgesProbability = 0.3) {
    const graph = {};
    for (let i = 0; i < nodesCount; i++) {
        graph[i] = [];
    }
    
    for (let i = 0; i < nodesCount; i++) {
        for (let j = i + 1; j < nodesCount; j++) {
            if (Math.random() < edgesProbability) {
                const weight = Math.floor(Math.random() * 10) + 1;
                graph[i].push({ node: j, weight });
                graph[j].push({ node: i, weight });
            }
        }
    }
    return graph;
}

export function spawnParticles(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;
      background:rgba(6,182,212,${Math.random() * 0.3 + 0.05});
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation:float-p ${8+Math.random()*12}s ease-in-out infinite;
      animation-delay:${Math.random()*8}s;`;
    container.appendChild(p);
  }
  
  if (!document.getElementById('particle-style')) {
    const s = document.createElement('style');
    s.id = 'particle-style';
    s.textContent = `@keyframes float-p{0%,100%{transform:translateY(0) scale(1);opacity:.4;}50%{transform:translateY(-40px) scale(1.2);opacity:.8;}}`;
    document.head.appendChild(s);
  }
}
