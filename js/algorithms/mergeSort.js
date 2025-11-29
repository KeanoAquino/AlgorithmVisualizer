// Merge Sort visualization implemented with the Visualizer "toolbox" API.
// ---------------------------------------------------------------------------
// Merge Sort is a divide-and-conquer algorithm that recursively splits the array
// into halves, sorts them, and then merges them back together.
//
// Visual Design:
// 1. When comparing a group of bars, they rise together (purple/raised).
// 2. While raised, bars are rearranged into sorted order using a "shift" animation:
//    - Find the minimum among the raised bars.
//    - Shift it to the leftmost position (multiple simultaneous swaps).
//    - Lower that bar (turns yellow = partly sorted).
//    - Repeat until all raised bars are lowered.
// 3. Brief pause to show the yellow sorted subarray.
// 4. Yellow bars turn back to grey before the next comparison.
// 5. Final merge lowers bars to green (fully sorted) instead of yellow.

export async function mergeSort(visualizer) {
  const n = visualizer.currentArray.length;
  if (n <= 1) {
    if (n === 1) visualizer.markSorted(0);
    return;
  }

  // Start the recursive merge sort
  await mergeSortHelper(visualizer, 0, n - 1, true);
}

// Recursive helper: sorts the subarray from left to right
// isFinalLevel is true only for the top-level call (the final merge)
async function mergeSortHelper(visualizer, left, right, isFinalLevel = false) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);

  // Recursively sort left and right halves (not final level)
  await mergeSortHelper(visualizer, left, mid, false);
  await mergeSortHelper(visualizer, mid + 1, right, false);

  // Merge the sorted halves
  await merge(visualizer, left, mid, right, isFinalLevel);
}

// Merge two sorted subarrays [left..mid] and [mid+1..right]
// If isFinalMerge is true, bars turn green instead of yellow when lowered
async function merge(visualizer, left, mid, right, isFinalMerge) {
  const count = right - left + 1;
  if (count <= 1) return;

  // 1. Raise all bars in the merge range (purple/raised)
  const indices = Array.from({ length: count }, (_, i) => left + i);
  await visualizer.highlight(indices);
  await visualizer.sleep(200);

  // 2. Sort the raised bars using selection sort with "shift" animation
  //    We work with positions left..right, lowering one bar at a time
  for (let sortedPos = left; sortedPos <= right; sortedPos++) {
    // Find the minimum value among the remaining raised bars [sortedPos..right]
    let minIndex = sortedPos;
    let minValue = visualizer.read(sortedPos);

    for (let j = sortedPos + 1; j <= right; j++) {
      const val = visualizer.read(j);
      if (val < minValue) {
        minValue = val;
        minIndex = j;
      }
    }

    // If the minimum is not already at sortedPos, shift it there
    if (minIndex !== sortedPos) {
      // Shift the minimum bar to the front of the remaining raised bars
      // This creates the illusion of the min sliding left while others shift right
      await visualizer.shiftToPosition(minIndex, sortedPos);
    }

    // 3. Lower the bar at sortedPos (now the minimum)
    //    - Yellow (partly sorted) for intermediate merges
    //    - Green (sorted) for the final merge
    const state = isFinalMerge ? 'sorted' : 'partly';
    await visualizer.lowerBar(sortedPos, state);
  }

  // 4. Brief pause to show the sorted subarray (yellow or green)
  await visualizer.sleep(200);

  // 5. If not the final merge, clear the yellow (partly sorted) state
  //    so bars return to grey before the next comparison
  if (!isFinalMerge) {
    visualizer.clearPartlySorted(indices);
    await visualizer.sleep(100);
  }
}