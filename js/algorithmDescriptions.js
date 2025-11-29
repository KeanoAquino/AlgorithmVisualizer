// Algorithm descriptions for the right panel
// Content follows educational guidelines from rightpanel.md

export const ALGORITHM_DESCRIPTIONS = {
  'Bubble Sort': `
<h2>Short Overview</h2>
<p>Bubble Sort is one of the simplest sorting algorithms to understand and implement. It works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. The algorithm gets its name from the way smaller elements "bubble" up to the beginning of the list (or larger elements sink to the end) with each pass.</p>

<p>While Bubble Sort is conceptually simple and easy to code, it is generally too slow for practical use on large datasets. Think of it as the "training wheels" of sorting algorithms—great for learning, but you'll usually want something faster for real work.</p>

<h2>Intuition and Mental Model</h2>
<p>Imagine you have a row of people standing in line, and you want to sort them by height from shortest to tallest. You start at one end and compare each pair of neighbors. If the taller person is standing before the shorter one, they swap places. You keep walking down the line, making swaps as needed.</p>

<p>After one complete pass through the line, the tallest person will have "bubbled" all the way to the end. Now you repeat the process, but you can ignore the last position (since it's already correct). Each pass guarantees one more person ends up in their final spot, until eventually everyone is sorted.</p>

<h2>How the Algorithm Works</h2>
<p>The algorithm maintains a simple loop structure. In the outer loop, it tracks how many elements have been sorted so far. In the inner loop, it walks through the unsorted portion of the array, comparing each element with its neighbor to the right.</p>

<p>When two adjacent elements are out of order, they get swapped. After completing one full pass, the largest unsorted element will have moved to its correct position at the end of the unsorted region. The algorithm then shrinks the unsorted region by one and repeats until no unsorted elements remain.</p>

<p>A common optimization checks whether any swaps occurred during a pass. If no swaps happened, the array is already sorted and the algorithm can terminate early. This optimization makes Bubble Sort perform well on nearly-sorted data.</p>

<h2>Complexity and Key Properties</h2>
<p>In the worst case and average case, Bubble Sort runs in O(n²) time, where n is the number of elements. This happens because it may need to make roughly n passes through the array, and each pass examines up to n elements. In the best case—when the array is already sorted—the optimized version with early termination runs in O(n) time, since it only needs one pass to confirm everything is in order.</p>

<p>Bubble Sort uses O(1) extra space because it only needs a few variables for swapping and loop control, regardless of input size. This makes it an in-place sorting algorithm. Bubble Sort is also stable, meaning that elements with equal values maintain their original relative order after sorting.</p>

<h2>When It's a Good Choice (and When It Isn't)</h2>
<p>Bubble Sort can be a reasonable choice when you have a very small array (say, fewer than 20 elements) or when you know the data is already nearly sorted. In these cases, its simplicity and low overhead can make it competitive with more sophisticated algorithms.</p>

<p>However, for most practical purposes, Bubble Sort is too slow. On large or randomly-ordered datasets, algorithms like Merge Sort, Quick Sort, or even Insertion Sort will significantly outperform it. Bubble Sort is primarily valuable as a teaching tool for understanding sorting concepts and algorithm analysis.</p>

<h2>Real-World Uses</h2>
<p>Bubble Sort rarely appears in production code or standard libraries due to its poor performance. However, its simplicity makes it popular in educational settings for introducing sorting concepts. The algorithm also occasionally appears in embedded systems or specialized hardware where code simplicity and predictable memory usage are more important than raw speed.</p>

<p>The early-termination optimization makes Bubble Sort useful for detecting whether an array is already sorted, which can be a useful check before applying a more complex algorithm.</p>

<h2>Recap</h2>
<p>Bubble Sort repeatedly compares and swaps adjacent elements, causing larger values to "bubble" toward the end of the array. It's simple to understand and implement, stable, and works in-place with O(1) extra space. However, its O(n²) average performance makes it impractical for large datasets. Compared to Insertion Sort, which is also O(n²), Bubble Sort typically performs more swaps and is generally slower in practice.</p>
`,

  'Insertion Sort': `
<h2>Short Overview</h2>
<p>Insertion Sort builds a sorted array one element at a time by repeatedly picking the next unsorted element and inserting it into its correct position among the already-sorted elements. It's intuitive, efficient for small datasets, and performs exceptionally well on nearly-sorted data.</p>

<p>Think of Insertion Sort as the natural way most people sort things by hand—it's what you'd do instinctively when organizing a hand of playing cards.</p>

<h2>Intuition and Mental Model</h2>
<p>Imagine you're dealt a hand of cards one at a time. Each time you receive a new card, you slide it into the correct position among the cards you're already holding. You don't re-examine your whole hand; you just find where the new card belongs and insert it there.</p>

<p>At any moment, the cards in your hand are sorted, and the cards yet to be dealt are unsorted. Each insertion extends your sorted hand by one card until all cards have been dealt and inserted.</p>

<h2>How the Algorithm Works</h2>
<p>Starting from the second element, the algorithm considers each element as the "key" to be inserted. It compares the key with elements to its left, shifting larger elements one position to the right to make room. Once it finds an element smaller than or equal to the key (or reaches the beginning of the array), it inserts the key into that position.</p>

<p>For example, with array [4, 3, 1, 5, 2], the algorithm would first insert 3 before 4, giving [3, 4, 1, 5, 2]. Then it inserts 1 at the beginning: [1, 3, 4, 5, 2]. The 5 stays in place since it's already larger than 4. Finally, 2 gets inserted between 1 and 3: [1, 2, 3, 4, 5].</p>

<h2>Complexity and Key Properties</h2>
<p>Insertion Sort runs in O(n²) time in the worst case, which occurs when the array is sorted in reverse order. Each new element must travel all the way to the beginning, resulting in roughly n²/2 comparisons and shifts. The average case is also O(n²), though with a smaller constant factor than Bubble Sort.</p>

<p>The best case is O(n), which occurs when the array is already sorted. In this scenario, each element only needs one comparison to confirm it's already in the right place, making Insertion Sort excellent for nearly-sorted data.</p>

<p>Insertion Sort uses O(1) extra space, making it in-place. It's also stable—elements with equal values maintain their relative order because the algorithm only shifts elements that are strictly greater than the key.</p>

<h2>When It's a Good Choice (and When It Isn't)</h2>
<p>Insertion Sort shines on small arrays and nearly-sorted data. Many sophisticated sorting implementations (including those in standard libraries) switch to Insertion Sort for small subarrays because its low overhead beats the recursive overhead of algorithms like Merge Sort or Quick Sort when n is small—typically around 10 to 20 elements.</p>

<p>It's also ideal for online sorting scenarios where data arrives incrementally and must be kept sorted. Each new element can be inserted in O(n) time, maintaining a sorted collection.</p>

<p>For large, randomly-ordered datasets, Insertion Sort is too slow. Algorithms with O(n log n) average performance like Merge Sort, Quick Sort, or Heap Sort are much better choices in these situations.</p>

<h2>Real-World Uses</h2>
<p>Despite its quadratic worst case, Insertion Sort appears in many real-world systems. Python's built-in sort (Timsort) uses Insertion Sort for small runs and nearly-sorted sequences. Java's Arrays.sort switches to Insertion Sort for small subarrays. The algorithm is also used in shell sort as its inner sorting mechanism.</p>

<p>Insertion Sort's stability and in-place nature make it valuable when memory is constrained and stable sorting is required.</p>

<h2>Recap</h2>
<p>Insertion Sort builds a sorted array by inserting one element at a time into its correct position. It's intuitive, stable, in-place, and runs in O(n) time on nearly-sorted data. While its O(n²) worst-case makes it unsuitable for large random arrays, it excels on small datasets and is a key component of hybrid sorting algorithms used in practice.</p>
`,

  'Selection Sort': `
<h2>Short Overview</h2>
<p>Selection Sort divides the array into sorted and unsorted regions. It repeatedly finds the minimum element from the unsorted region and moves it to the end of the sorted region. The algorithm is notable for making the minimum possible number of swaps—exactly n-1 swaps for an array of n elements.</p>

<p>Selection Sort is straightforward to understand but generally slower than Insertion Sort in practice, despite having the same O(n²) time complexity.</p>

<h2>Intuition and Mental Model</h2>
<p>Imagine sorting a row of books by height on a shelf with limited space. You scan the entire unsorted section to find the shortest book, then swap it with whatever is currently in the first unsorted position. Now that book is in its final place. You repeat this process, each time finding the smallest remaining book and putting it next in line.</p>

<p>Unlike Insertion Sort, where you gradually shift elements to make room, Selection Sort commits to a position only after scanning all remaining options. It's like being very deliberate: look at everything first, then make your move.</p>

<h2>How the Algorithm Works</h2>
<p>The algorithm maintains a boundary between the sorted portion (at the beginning) and the unsorted portion (the rest). In each iteration, it scans through all unsorted elements to find the minimum value. Once found, it swaps that minimum with the first unsorted element, extending the sorted region by one.</p>

<p>For array [4, 3, 1, 5, 2]: First, scan all elements and find 1 is the minimum; swap it with 4 to get [1, 3, 4, 5, 2]. Next, scan positions 1-4 and find 2; swap with 3 to get [1, 2, 4, 5, 3]. Continue: swap 3 and 4 gives [1, 2, 3, 5, 4]. Finally, swap 4 and 5: [1, 2, 3, 4, 5].</p>

<h2>Complexity and Key Properties</h2>
<p>Selection Sort always runs in O(n²) time—best, average, and worst cases are all the same. This is because it must scan through all unsorted elements to find the minimum, regardless of the initial order. Even if the array is already sorted, Selection Sort doesn't know this without checking every element.</p>

<p>The algorithm uses O(1) extra space, making it in-place. However, Selection Sort is not stable: equal elements may have their relative order changed. This happens because swapping the minimum into position can jump over equal elements, disrupting their original order.</p>

<p>One advantage of Selection Sort is that it performs exactly n-1 swaps, which is optimal. This can matter when swapping elements is expensive (such as with large records where only keys are compared but entire records must be moved).</p>

<h2>When It's a Good Choice (and When It Isn't)</h2>
<p>Selection Sort is useful when memory writes are significantly more expensive than reads, since it minimizes swaps. This can occur with certain types of flash memory or when sorting large records by a small key.</p>

<p>For most purposes, Selection Sort is outperformed by Insertion Sort, which adapts to the input and runs faster on nearly-sorted data. Both have O(n²) complexity, but Insertion Sort typically does less work in practice. For larger datasets, O(n log n) algorithms like Merge Sort or Heap Sort are far better choices.</p>

<h2>Real-World Uses</h2>
<p>Selection Sort is rarely used in production software due to its inflexible O(n²) performance. However, it appears in educational contexts because of its simplicity and because it demonstrates the concept of finding extrema (minimum or maximum) iteratively.</p>

<p>The selection concept itself is important: the algorithm for finding the k-th smallest element (selection problem) is related, and understanding Selection Sort helps build intuition for more sophisticated selection algorithms.</p>

<h2>Recap</h2>
<p>Selection Sort repeatedly selects the minimum unsorted element and places it in position. It runs in O(n²) time regardless of input order, uses O(1) space, and is not stable. Its main advantage is minimizing swaps (exactly n-1), but this rarely outweighs its lack of adaptivity. Compared to Insertion Sort, Selection Sort is usually slower because it can't take advantage of existing order in the data.</p>
`,

  'Merge Sort': `
<h2>Short Overview</h2>
<p>Merge Sort is a divide-and-conquer algorithm that recursively splits an array in half, sorts each half, and then merges the sorted halves back together. It guarantees O(n log n) time complexity in all cases, making it reliable and predictable.</p>

<p>Merge Sort trades extra memory for consistent speed. It's the go-to choice when you need guaranteed performance and stability, especially for linked lists or external sorting scenarios.</p>

<h2>Intuition and Mental Model</h2>
<p>Imagine you have a deck of cards to sort. Instead of sorting the whole deck at once, you split it in half and give each half to a friend. Each friend does the same, splitting their portion until everyone has just one or two cards (which are trivially sorted). Then everyone merges their sorted portions back together.</p>

<p>Merging two sorted piles is easy: you just repeatedly take the smaller of the two top cards. By the time all the merging is done at every level, the whole deck is sorted. The key insight is that merging two sorted lists is fast (linear time), and the recursive splitting ensures we only do O(log n) levels of merging.</p>

<h2>How the Algorithm Works</h2>
<p>The algorithm has two phases: divide and merge. In the divide phase, the array is recursively split into halves until each subarray has one element (base case). In the merge phase, pairs of sorted subarrays are combined into larger sorted subarrays.</p>

<p>The merge operation uses a temporary array. Two pointers track positions in the two sorted subarrays being merged. At each step, the smaller element is copied to the result, and its pointer advances. When one subarray is exhausted, the remaining elements from the other are copied over.</p>

<p>For [4, 3, 1, 5, 2]: Split into [4, 3, 1] and [5, 2]. Further split to [4], [3, 1], [5], [2]. Merge [3] and [1] to [1, 3]. Merge [4] and [1, 3] to [1, 3, 4]. Merge [5] and [2] to [2, 5]. Finally merge [1, 3, 4] and [2, 5] to [1, 2, 3, 4, 5].</p>

<h2>Complexity and Key Properties</h2>
<p>Merge Sort runs in O(n log n) time in all cases—best, average, and worst. This consistency is its greatest strength. The log n factor comes from the depth of recursion (halving the array), and at each level, we do O(n) work to merge all subarrays.</p>

<p>The algorithm requires O(n) extra space for the temporary array used during merging. This is its main drawback compared to in-place algorithms. However, Merge Sort is stable: equal elements maintain their relative order because the merge step takes from the left subarray when elements are equal.</p>

<p>For linked lists, Merge Sort can be implemented with O(log n) extra space (for recursion) since nodes can be re-linked without copying, making it often the best choice for sorting linked structures.</p>

<h2>When It's a Good Choice (and When It Isn't)</h2>
<p>Merge Sort excels when you need guaranteed O(n log n) performance regardless of input. It's ideal for sorting linked lists (where it can work in-place), external sorting of large files that don't fit in memory, and any situation where stability is required.</p>

<p>The O(n) space requirement can be problematic for memory-constrained environments or very large arrays. Quick Sort, despite its O(n²) worst case, often runs faster in practice due to better cache behavior and lower constant factors. For small arrays, simpler algorithms like Insertion Sort have less overhead.</p>

<h2>Real-World Uses</h2>
<p>Merge Sort forms the basis of Timsort, used by Python and Java for their built-in sorts. It's also standard for sorting linked lists in many libraries. External sorting algorithms (for data that doesn't fit in RAM) typically use variants of Merge Sort because it accesses data sequentially, which is efficient for disk I/O.</p>

<p>The merge operation itself is useful beyond sorting—it's the key step in the merge step of MapReduce and in combining sorted results from parallel computations.</p>

<h2>Recap</h2>
<p>Merge Sort divides the array in half recursively, then merges sorted halves back together. It guarantees O(n log n) time and is stable, but requires O(n) extra space. Compared to Quick Sort, Merge Sort has worse average-case cache performance but offers consistent worst-case behavior and stability. It's the algorithm of choice for linked lists and external sorting.</p>
`,

  'Quick Sort': `
<h2>Short Overview</h2>
<p>Quick Sort is a divide-and-conquer algorithm that works by selecting a "pivot" element and partitioning the array so that elements smaller than the pivot come before it and elements larger come after. The subarrays on either side of the pivot are then sorted recursively.</p>

<p>Quick Sort is often the fastest sorting algorithm in practice due to excellent cache performance, despite having a worst-case O(n²) time complexity. It's the algorithm behind many standard library sort functions.</p>

<h2>Intuition and Mental Model</h2>
<p>Imagine organizing a group of people by height. You pick one person as a reference (the pivot). Everyone shorter moves to their left; everyone taller moves to their right. Now the pivot is in their final position. You repeat this process for the left group and the right group separately.</p>

<p>Unlike Merge Sort, which does its main work when combining, Quick Sort does its main work when partitioning. Once the array is fully partitioned at all levels, it's sorted—there's no separate merge step needed.</p>

<h2>How the Algorithm Works</h2>
<p>The algorithm picks a pivot element (various strategies exist: first element, last element, random, or median-of-three). It then partitions the array by maintaining two regions: elements known to be less than the pivot, and elements known to be greater. Elements are swapped to grow these regions until the entire array is partitioned.</p>

<p>After partitioning, the pivot is in its final sorted position. The algorithm then recursively sorts the left partition (elements less than pivot) and the right partition (elements greater than pivot). The base case is when a partition has zero or one elements.</p>

<p>For [4, 3, 1, 5, 2] with pivot 4: After partitioning, we might get [3, 1, 2, 4, 5]. The 4 is now in its final position. Recursively sort [3, 1, 2] and [5].</p>

<h2>Complexity and Key Properties</h2>
<p>Quick Sort's average-case time complexity is O(n log n), achieved when partitions are reasonably balanced. Its worst case is O(n²), which occurs when the pivot consistently divides the array into very unequal parts—such as when the array is already sorted and we always pick the first or last element as pivot.</p>

<p>Good pivot selection strategies (like random pivot or median-of-three) make the worst case extremely unlikely in practice. Some implementations switch to Heap Sort if recursion depth exceeds a threshold, guaranteeing O(n log n) worst-case—this hybrid is called Introsort.</p>

<p>Quick Sort uses O(log n) extra space on average for the recursion stack, making it nearly in-place. However, it is not stable: equal elements may be rearranged during partitioning.</p>

<h2>When It's a Good Choice (and When It Isn't)</h2>
<p>Quick Sort is excellent for general-purpose sorting of arrays that fit in memory. Its cache-friendly sequential access pattern and low overhead make it faster than Merge Sort for typical data, despite both being O(n log n) on average.</p>

<p>Avoid Quick Sort when you need guaranteed worst-case performance (use Merge Sort or Heap Sort instead), when stability is required, or when sorting linked lists (where Merge Sort is more natural). For small subarrays, switching to Insertion Sort reduces overhead.</p>

<h2>Real-World Uses</h2>
<p>Quick Sort (or variants like Introsort) is used by the C standard library's qsort, C++'s std::sort, and many other standard library implementations. Its practical speed advantage over other O(n log n) algorithms makes it the default choice for in-memory sorting.</p>

<p>The partitioning technique has applications beyond sorting, including the Quickselect algorithm for finding the k-th smallest element in expected O(n) time, and as a building block in some parallel sorting algorithms.</p>

<h2>Recap</h2>
<p>Quick Sort partitions the array around a pivot, placing smaller elements before it and larger elements after, then recursively sorts the partitions. It averages O(n log n) time with excellent practical performance but has O(n²) worst case with poor pivot choices. It's nearly in-place (O(log n) stack space) but not stable. Compared to Merge Sort, Quick Sort is typically faster in practice but lacks guaranteed worst-case performance and stability.</p>
`,

  'Heap Sort': `
<h2>Short Overview</h2>
<p>Heap Sort uses a binary heap data structure to sort an array. It first builds a max-heap from the input, then repeatedly extracts the maximum element and places it at the end of the array. This guarantees O(n log n) time complexity in all cases while sorting in-place.</p>

<p>Heap Sort combines the best of both worlds: guaranteed O(n log n) performance like Merge Sort, and in-place operation like Quick Sort. However, its cache behavior is less favorable than Quick Sort's, making it slower in practice for typical data.</p>

<h2>Intuition and Mental Model</h2>
<p>Imagine a tournament bracket where each match determines a winner who advances. In a max-heap, every "winner" (parent node) is larger than both "losers" (children). The overall champion (root) is the largest element.</p>

<p>To sort, you crown a champion, remove them from the tournament (put them at the end of the array), and hold a new mini-tournament to find the next champion. Repeat until everyone has been placed in order from largest to smallest working backward through the array.</p>

<h2>How the Algorithm Works</h2>
<p>The algorithm has two phases. First, it transforms the array into a max-heap using the "heapify" operation. Starting from the last non-leaf node and working up to the root, each subtree is made into a valid heap by pushing down elements that violate the heap property.</p>

<p>Second, it repeatedly extracts the maximum. The root (largest element) is swapped with the last element of the heap region. The heap region shrinks by one, and the new root is "pushed down" (heapified) to restore the heap property. This continues until the heap region has one element.</p>

<p>For [4, 3, 1, 5, 2]: Build max-heap to get [5, 4, 1, 3, 2]. Swap 5 with 2: [2, 4, 1, 3, 5]. Heapify: [4, 3, 1, 2, 5]. Swap 4 with 2: [2, 3, 1, 4, 5]. Continue until sorted: [1, 2, 3, 4, 5].</p>

<h2>Complexity and Key Properties</h2>
<p>Heap Sort runs in O(n log n) time in all cases. Building the initial heap takes O(n) time (a non-obvious result from amortized analysis). Each of the n extract-max operations involves heapifying from the root, which takes O(log n) time, giving O(n log n) for the extraction phase.</p>

<p>The algorithm uses O(1) extra space since the heap is built within the original array, making it truly in-place. However, Heap Sort is not stable—the heap operations can rearrange equal elements.</p>

<p>Unlike Quick Sort, Heap Sort has no bad cases that degrade to O(n²). Unlike Merge Sort, it doesn't need O(n) extra space. This makes it useful as a fallback when other algorithms might perform poorly.</p>

<h2>When It's a Good Choice (and When It Isn't)</h2>
<p>Heap Sort is ideal when you need guaranteed O(n log n) performance without extra memory allocation. It's used in hybrid sorting algorithms like Introsort as a fallback when Quick Sort's recursion depth suggests a degenerate case.</p>

<p>For typical data, Quick Sort outperforms Heap Sort due to better cache behavior—Heap Sort's comparisons jump around the array unpredictably, while Quick Sort accesses memory sequentially. Heap Sort also isn't stable, so it's unsuitable when preserving the order of equal elements matters.</p>

<h2>Real-World Uses</h2>
<p>Heap Sort is used as part of Introsort, which starts with Quick Sort and switches to Heap Sort if the recursion depth exceeds 2×log(n). This gives Introsort both Quick Sort's practical speed and Heap Sort's worst-case guarantee.</p>

<p>The heap data structure itself has many applications beyond sorting: priority queues, graph algorithms (Dijkstra's, Prim's), finding the k largest elements efficiently, and median maintenance in streaming data.</p>

<h2>Recap</h2>
<p>Heap Sort builds a max-heap and repeatedly extracts the maximum to sort an array. It guarantees O(n log n) time in all cases and uses O(1) extra space, but it's not stable and has poor cache locality. Compared to Quick Sort, Heap Sort is slower on average but can't degrade to O(n²). Compared to Merge Sort, it uses less memory but lacks stability. It's most valuable as a guaranteed-performance fallback in hybrid algorithms.</p>
`
};

// Function to get description HTML for an algorithm
export function getAlgorithmDescription(algorithmName) {
  return ALGORITHM_DESCRIPTIONS[algorithmName] || '<p>Select an algorithm from the control panel to learn about it here.</p>';
}
