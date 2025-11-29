// Selection Sort visualization
// ---------------------------------------------------------------------------
// Selection Sort works by repeatedly finding the minimum element from the
// unsorted part and putting it at the beginning.

export async function selectionSort(visualizer) {
  const array = visualizer.currentArray;
  const n = array.length;
  
  if (n <= 1) {
    if (n === 1) visualizer.markSorted(0);
    return;
  }

  for (let i = 0; i < n - 1; i++) {
    // Mark current position as the selection boundary
    await visualizer.highlight([i]);
    await visualizer.markSpecial([i]);
    
    let minIndex = i;
    
    // Find the minimum element in the remaining unsorted array
    for (let j = i + 1; j < n; j++) {
      // Highlight current candidate vs current minimum
      await visualizer.highlight([minIndex, j]);
      
      if (visualizer.read(j) < visualizer.read(minIndex)) {
        // Remove special mark from old minimum
        await visualizer.markSpecial([]);
        minIndex = j;
        // Mark new minimum
        await visualizer.markSpecial([minIndex]);
      }
      
      await visualizer.sleep(120);
    }
    
    // Clear highlights before swap
    await visualizer.highlight([]);
    
    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      await visualizer.swap(i, minIndex);
    }
    
    // Mark the current position as sorted
    visualizer.markSorted(i);
    await visualizer.markSpecial([]);
    
    // Mark the remaining section as active (yellow)
    if (i < n - 1) {
      visualizer.markPartlySorted(Array.from({length: n - i - 1}, (_, idx) => i + 1 + idx));
    }
    
    await visualizer.sleep(100);
  }
  
  // Mark the last element as sorted
  visualizer.markSorted(n - 1);
  
  // Final highlight to show completion
  await visualizer.highlight(Array.from({length: n}, (_, i) => i));
  await visualizer.sleep(500);
  await visualizer.highlight([]);
}