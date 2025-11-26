// js/algorithms/heapSort.js
// Heap Sort visualization using the Visualizer toolbox API.
// Uses a MAX HEAP: the largest element is always at the root.
// 
// Visual states used:
//   - highlight (purple, raised): The subtree being compared (parent + children)
//   - markSpecial (red): The largest node in the subtree (will be swapped with parent)
//   - markSorted (green): Element is in its final sorted position

export async function heapSort(visualizer) {
  const n = visualizer.currentArray.length;

  // Heapify ensures the subtree rooted at index i satisfies the max heap property.
  async function heapify(heapSize, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    // 1. Highlight the subtree being compared (parent and its children)
    const toHighlight = [i];
    if (left < heapSize) toHighlight.push(left);
    if (right < heapSize) toHighlight.push(right);
    await visualizer.highlight(toHighlight);

    // 2. Determine the largest among parent, left child, and right child
    if (left < heapSize && visualizer.read(left) > visualizer.read(largest)) {
      largest = left;
    }
    if (right < heapSize && visualizer.read(right) > visualizer.read(largest)) {
      largest = right;
    }

    // 3. If largest is not the parent, mark it red, swap, then recurse
    if (largest !== i) {
      // Mark the largest child (the "winner") in red
      await visualizer.markSpecial([largest]);
      await visualizer.sleep(100);

      // Swap parent with largest child (colors swap automatically with heights)
      await visualizer.swap(i, largest);

      // Clear highlights first (lower the bars while still red), then clear red
      await visualizer.highlight([]);
      await visualizer.markSpecial([]);

      // Recursively heapify the affected subtree
      await heapify(heapSize, largest);
    } else {
      // No swap needed; clear highlights
      await visualizer.highlight([]);
    }
  }

  // Phase 1: Build the max heap (start from last non-leaf node)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  // Clear any remaining highlights after heap is built
  await visualizer.highlight([]);
  await visualizer.markSpecial([]);

  // Phase 2: Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    // Blink the root (max element) to emphasize it's being extracted
    await visualizer.blink(0, { color: 'var(--bar-red)', times: 3, interval: 120 });

    // Highlight root (max) and the last unsorted element
    await visualizer.highlight([0, i]);
    await visualizer.sleep(100);

    // Swap root with last unsorted element
    await visualizer.swap(0, i);

    // Mark the extracted element as sorted (now in final position)
    visualizer.markSorted(i);

    // Clear highlights before re-heapifying
    await visualizer.highlight([]);

    // Re-heapify the reduced heap
    await heapify(i, 0);
  }

  // Mark the last remaining element as sorted
  visualizer.markSorted(0);
  await visualizer.highlight([]);
  await visualizer.markSpecial([]);
}
  