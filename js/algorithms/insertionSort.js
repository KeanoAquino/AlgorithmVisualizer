// Insertion Sort visualization
// ---------------------------------------------------------------------------
// Insertion Sort builds a sorted portion one element at a time by taking each
// unsorted element and inserting it into its correct position in the sorted part.
//
// Visual Design:
// 1. The sorted portion (left side) is marked yellow (partly sorted).
// 2. Always compare 2 bars at a time (both raised):
//    - The anchor element in the sorted portion (index j) - purple
//    - The current element to insert (index i) - red (bigger value)
// 3. Stop comparing when a smaller bar is found on the left.
// 4. Insert right after the smaller bar:
//    - The anchor bar (smaller one at j) lowers and turns yellow
//    - The inserting bar (red) moves to position j+1, stays raised
//    - Yellow bars between j+1 and i-1 shift right simultaneously
//    - Result: only the inserted bar is raised (red)
// 5. Lower the inserted bar and mark it yellow.
// 6. At the very end, all bars turn green (fully sorted).

export async function insertionSort(visualizer) {
  const array = visualizer.currentArray;
  const n = array.length;
  
  if (n <= 1) {
    if (n === 1) visualizer.markSorted(0);
    return;
  }

  // No initial yellow marking - comparison happens first

  for (let i = 1; i < n; i++) {
    const currentValue = visualizer.read(i);
    let insertPos = 0; // Default: insert at the very beginning
    let anchorIndex = -1; // The smaller bar we found (-1 means none found)
    
    // Compare the current element with each element in the sorted portion
    // scanning from right to left (from i-1 down to 0)
    for (let j = i - 1; j >= 0; j--) {
      // Raise both bars: anchor (j) purple, current element (i) red (bigger value)
      await visualizer.highlightWithSpecial([j], [i]);
      await visualizer.sleep(200);
      
      if (visualizer.read(j) <= currentValue) {
        // Found a smaller (or equal) bar - insert right after it
        insertPos = j + 1;
        anchorIndex = j;
        break;
      }
      // j is larger, continue scanning left
    }

    // If we need to move the element (it's not already in the right spot)
    if (insertPos < i) {
      if (i === 1 && insertPos === 0) {
        // Edge case: first and second bars, need to swap
        // Bar at 0 is purple (anchor), bar at 1 is red (bigger, being inserted)
        // Swap while raised - swap method preserves is-special state
        await visualizer.swap(0, 1);
        
        // Brief pause to show them swapped while still raised
        await visualizer.sleep(150);
        
        // Lower both bars, clear special state, and mark [0, 1] as yellow (sorted portion)
        await visualizer.highlightWithSpecial([], []);
        visualizer.markPartlySorted([0, 1]);
      } else if (anchorIndex >= 0) {
        // We found an anchor bar - use the special shift
        // insertShiftWithAnchor will:
        // - Lower anchor and mark yellow
        // - Shift bars right and mark yellow
        // - Keep only the inserted bar raised red at insertPos
        await visualizer.insertShiftWithAnchor(i, insertPos, anchorIndex);
        // Now only insertPos is red/raised
        
        // Brief pause to show the inserted bar raised alone
        await visualizer.sleep(150);
        
        // Lower the inserted bar, clear special state, and mark it yellow
        await visualizer.highlightWithSpecial([], []);
        visualizer.markPartlySorted([insertPos]);
      } else {
        // No anchor found (inserting at position 0)
        // First, lower the bar at index 0 (it was being compared but is larger)
        // This is handled inside insertShiftToZero which:
        // - Lowers and marks yellow all bars from 0 to i
        // - Shifts bar from i to position 0, keeping it raised red
        await visualizer.insertShiftToZero(i);
        // Now only position 0 is red/raised
        
        // Brief pause to show the inserted bar at position 0
        await visualizer.sleep(150);
        
        // Lower the bar at position 0, clear special state, and mark it yellow
        await visualizer.highlightWithSpecial([], []);
        visualizer.markPartlySorted([0]);
      }
    } else {
      // Element is already in the right spot, just lower and clear special state
      await visualizer.highlightWithSpecial([], []);
      
      // Mark all sorted elements (0 to i) as yellow
      const sortedIndices = Array.from({ length: i + 1 }, (_, idx) => idx);
      visualizer.markPartlySorted(sortedIndices);
    }
    
    await visualizer.sleep(100);
  }

  // Final step: turn all yellow bars green
  await visualizer.sleep(200);
  
  // Clear yellow and mark all as sorted (green)
  const allIndices = Array.from({ length: n }, (_, idx) => idx);
  visualizer.clearPartlySorted(allIndices);
  
  for (let i = 0; i < n; i++) {
    visualizer.markSorted(i);
  }
}
