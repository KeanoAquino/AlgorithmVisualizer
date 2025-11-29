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
        minIndex = j;
        // Mark new minimum (automatically removes red from old minimum)
        await visualizer.markSpecial([minIndex]);
      }
      
      await visualizer.sleep(120);
    }
    
    // Swap the found minimum element with the first element
    // Red mark stays on the minimum value and follows it during swap
    if (minIndex !== i) {
      await visualizer.swap(i, minIndex);
      // After swap, red is now at position i (via _swapStates)
    }
    
    // Lower the bars (red bar lowers with its value)
    await visualizer.highlight([]);
    
    // Pause to clearly show where the red (minimum) bar landed
    await visualizer.sleep(250);
    
    // Red → Green directly (markSorted removes is-special internally)
    visualizer.markSorted(i);
    
    await visualizer.sleep(100);
  }
  
  // Mark the last element as sorted
  visualizer.markSorted(n - 1);
  
}