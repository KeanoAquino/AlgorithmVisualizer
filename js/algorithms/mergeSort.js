// Merge Sort visualization implemented with the Visualizer "toolbox" API.
// ---------------------------------------------------------------------------
// Merge Sort is a divide-and-conquer algorithm that recursively splits the array
// into halves, sorts them, and then merges them back together.

export async function mergeSort(visualizer) {
  const array = visualizer.currentArray;
  await mergeSortHelper(visualizer, 0, array.length - 1);
  
  // Final highlight to show completion
  await visualizer.highlight(Array.from({length: array.length}, (_, i) => i));
  await visualizer.sleep(500);
  await visualizer.highlight([]);
}

async function mergeSortHelper(visualizer, left, right) {
  if (left >= right) return;
  
  const mid = Math.floor((left + right) / 2);
  
  // Recursively sort left and right halves
  await mergeSortHelper(visualizer, left, mid);
  await mergeSortHelper(visualizer, mid + 1, right);
  
  // Merge the sorted halves
  await merge(visualizer, left, mid, right);
}

async function merge(visualizer, left, mid, right) {
  const array = visualizer.currentArray;
  const leftArray = array.slice(left, mid + 1);
  const rightArray = array.slice(mid + 1, right + 1);
  
  let i = 0, j = 0, k = left;
  
  // Highlight the current merge section
  await visualizer.highlight(Array.from({length: right - left + 1}, (_, idx) => left + idx));
  await visualizer.sleep(200);
  
  while (i < leftArray.length && j < rightArray.length) {
    // Highlight the two elements being compared
    await visualizer.highlight([left + i, mid + 1 + j]);
    
    if (leftArray[i] <= rightArray[j]) {
      // Take from left array
      await visualizer.overwrite(k, leftArray[i]);
      i++;
    } else {
      // Take from right array
      await visualizer.overwrite(k, rightArray[j]);
      j++;
    }
    k++;
    
    await visualizer.sleep(150);
  }
  
  // Copy remaining elements from left array
  while (i < leftArray.length) {
    await visualizer.highlight([k]);
    await visualizer.overwrite(k, leftArray[i]);
    i++;
    k++;
    await visualizer.sleep(150);
  }
  
  // Copy remaining elements from right array
  while (j < rightArray.length) {
    await visualizer.highlight([k]);
    await visualizer.overwrite(k, rightArray[j]);
    j++;
    k++;
    await visualizer.sleep(150);
  }
  
  // Clear highlights
  await visualizer.highlight([]);
  
  // Mark the merged section as partly sorted
  visualizer.markPartlySorted(Array.from({length: right - left + 1}, (_, idx) => left + idx));
}