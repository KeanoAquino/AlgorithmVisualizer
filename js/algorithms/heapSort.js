// js/algorithms/heapSort.js
export async function heapSort(visualizer) {
    const arr = visualizer.currentArray;
    const n = arr.length;
  
    async function heapify(n, i) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
  
      // Highlight the current node and its children
      const toHighlight = [i];
      if (left < n) toHighlight.push(left);
      if (right < n) toHighlight.push(right);
      await visualizer.highlight(toHighlight);
  
      // Compare children
      if (left < n && visualizer.read(left) > visualizer.read(largest)) {
        largest = left;
        await visualizer.markSpecial([largest]); // mark current largest
      }
      if (right < n && visualizer.read(right) > visualizer.read(largest)) {
        largest = right;
        await visualizer.markSpecial([largest]);
      }
  
      // Swap if needed
      if (largest !== i) {
        await visualizer.swap(i, largest);
        await heapify(n, largest);
      }
    }
  
    // Step 1: Build the max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(n, i);
    }
  
    // Step 2: Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      await visualizer.swap(0, i);
      visualizer.markSorted(i);
      await heapify(i, 0); // Heapify reduced heap
    }
  
    // Mark the last element as sorted
    visualizer.markSorted(0);
    await visualizer.highlight([]);
  }
  