// Bubble Sort visualization implemented with the Visualizer "toolbox" API.
// ---------------------------------------------------------------------------
// This file shows HOW we drive the animation without ever touching DOM nodes.
// The Visualizer instance exposes high-level async methods that wrap the UI:
//   - highlight(indices): visually mark bars as the current comparison (purple + raise)
//   - read(i): fetch the current numeric value at index i without any side-effects
//   - swap(i,j): animate heights swapping (with timing), then update the array data
//   - markSorted(i): permanently color a bar green (final position achieved)
//   - sleep(ms): time pacing helper that respects user speed slider & pause/cancel
//
// Key principles of our implementation:
// 1. Pure logic loop structure: we write Bubble Sort exactly like the textbook version.
// 2. Each visual step is explicit: BEFORE comparing we call highlight([...]); AFTER we clear it.
// 3. We never calculate pixel heights or apply CSS classes directly; toolbox handles that.
// 4. Timing is centralized: every "await" yields to the Visualizer's scaled sleep (speed slider).
// 5. Early exit optimization: if a pass makes no swaps, remaining prefix is already sorted.
// 6. Marking progress: after each outer pass we call markSorted(last) to lock the tail element.
//
// Why highlight BEFORE read/swap?
//   highlight() triggers the compare visuals (color + raise) so the user sees WHICH pair is being
//   examined before we decide to swap. The async nature (await) gives a brief visual pause.
//
// Why markSorted after a pass instead of during the loop?
//   Bubble Sort guarantees the largest element encountered during the pass has bubbled to 'last'.
//   Marking once per pass avoids flickering and communicates finalization clearly.
//
// Extending to other algorithms:
//   - Use markSpecial(indices) for pivots or current minimum selections.
//   - Use markPartlySorted(indices) to show a growing sorted prefix (Insertion Sort).
//   - Always treat Visualizer as immutable UI surface: call toolbox methods, never manipulate DOM.
//
// Cancellation & pause:
//   All toolbox awaits internally check a cancellation token + pause gate. If a user hits Reset or
//   switches algorithm mid-run, the internal methods throw or short-circuit safely.
//
// Usage example (controller):
//   import { bubbleSort } from './algorithms/bubbleSort.js';
//   await bubbleSort(visualizer);
//
// NOTE: bubbleSort returns after marking all sorted elements; caller is responsible for guarding
//       against running it when an unimplemented algorithm is selected.

export async function bubbleSort(visualizer) {
	const n = visualizer.currentArray.length;
	if (n <= 1) {
		if (n === 1) visualizer.markSorted(0);
		return;
	}

	// OUTER LOOP: after each pass, index 'last' is guaranteed sorted (largest of unsorted tail).
	for (let pass = 0; pass < n - 1; pass++) {
		let swapped = false;
		const last = n - pass - 1; // final index to lock this pass

		// INNER LOOP: pairwise comparisons from 0 .. last-1
		for (let j = 0; j < last; j++) {
			// 1. Visual emphasize current pair BEFORE reading values.
			await visualizer.highlight([j, j + 1]);

			// 2. Read their numeric values (no visual side-effect).
			const a = visualizer.read(j);
			const b = visualizer.read(j + 1);
			if (a > b) {
				// 3. Swap animates the bar heights and then mutates the underlying array.
				await visualizer.swap(j, j + 1);
				swapped = true;
			}
			// 4. Optional extra pacing: quick sleep keeps rhythm distinct from highlight delay.
			await visualizer.sleep(120);
		}

		// 5. Remove any compare visuals before marking sorted element.
		await visualizer.highlight([]);

		// 6. Mark 'last' as sorted (green) to signal its final position.
		visualizer.markSorted(last);
		await visualizer.sleep(100);

		// 7. Early exit: if no swaps happened this pass, prefix [0..last-1] is already sorted.
		if (!swapped) {
			// Bulk mark remaining prefix to finalize quickly.
			for (let k = 0; k < last; k++) {
				visualizer.markSorted(k);
			}
			break;
		}
	}

	// Final touch: first element might remain unmarked if the loop ended early.
	visualizer.markSorted(0);
}

