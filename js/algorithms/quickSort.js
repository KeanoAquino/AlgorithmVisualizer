// Quick Sort visualization
// ---------------------------------------------------------------------------
// Quick Sort is a divide-and-conquer algorithm that selects a pivot element
// and partitions the array so elements ≤ pivot are on the left, elements > pivot
// are on the right. The pivot ends up in its final sorted position.
//
// Visual Design:
// 1. Pivot element is raised and marked red throughout partitioning
// 2. Current element being compared is raised purple
// 3. Elements in the "smaller" partition (left side) are marked yellow
// 4. When pivot is placed in final position, it turns green (sorted)
// 5. Recursively sort left and right partitions
// 6. Uses Lomuto partition scheme with last element as pivot
//
// Handles duplicates: elements equal to pivot go to the left partition (≤)

export async function quickSort(visualizer) {
  const array = visualizer.currentArray;
  const n = array.length;

  if (n <= 1) {
    if (n === 1) visualizer.markSorted(0);
    return;
  }

  // Start the recursive quick sort
  await quickSortRecursive(visualizer, 0, n - 1);
}

// Recursive Quick Sort on subarray [low, high]
async function quickSortRecursive(visualizer, low, high) {
  if (low >= high) {
    // Base case: 0 or 1 element - mark as sorted if single element
    if (low === high) {
      visualizer.markSorted(low);
      await visualizer.sleep(100);
    }
    return;
  }

  // Partition and get pivot's final position
  const pivotIndex = await partition(visualizer, low, high);

  // Pivot is now in its final position - mark green
  // (This is done inside partition after lowering)

  // Recursively sort left partition (elements < pivot)
  await quickSortRecursive(visualizer, low, pivotIndex - 1);

  // Recursively sort right partition (elements > pivot)
  await quickSortRecursive(visualizer, pivotIndex + 1, high);
}

// Lomuto partition scheme
// - Pivot is the last element (high)
// - Returns the final index of the pivot
async function partition(visualizer, low, high) {
  const pivotValue = visualizer.read(high);
  
  // Raise pivot (last element) as red - it stays raised throughout
  await visualizer.raiseBarSpecial(high);
  await visualizer.sleep(150);

  // i tracks the boundary of the "smaller than pivot" region
  // Everything at indices [low, i-1] is ≤ pivot
  let i = low;

  // Scan through elements from low to high-1
  for (let j = low; j < high; j++) {
    // Raise current element purple for comparison
    await visualizer.highlightCompareWithPivot(j, high);
    
    const currentValue = visualizer.read(j);

    if (currentValue <= pivotValue) {
      // Element belongs in the left partition
      // Clear the comparison highlight first
      await visualizer.clearCompareHighlight();
      
      if (i !== j) {
        // Swap element at j with element at i
        await visualizer.swap(i, j);
      }
      
      // Mark this position as part of the smaller partition (yellow)
      visualizer.markPartlySorted([i]);
      
      i++; // Expand the smaller region
    } else {
      // Element is larger than pivot - just clear highlight and move on
      await visualizer.clearCompareHighlight();
    }
  }

  // Now place pivot in its final position (index i)
  // First, lower the pivot from its raised position
  await visualizer.lowerBarSpecial(high, false);
  
  if (i !== high) {
    // Swap pivot with element at i
    await visualizer.swap(i, high);
  }

  // Clear yellow from the pivot's position and mark it green (sorted)
  visualizer.clearPartlySorted([i]);
  visualizer.markSorted(i);
  await visualizer.sleep(150);

  // Clear yellow markings from this partition's left side
  // (They will be properly marked when recursion handles them)
  const leftPartition = [];
  for (let k = low; k < i; k++) {
    leftPartition.push(k);
  }
  visualizer.clearPartlySorted(leftPartition);

  return i;
}
