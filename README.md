# Algorithm Visual Tool

Welcome to the Algorithm Visual Tool project! This is an interactive web application designed to help visualize how different sorting algorithms work.

This document outlines the project's architecture and provides a clear guide for team members to contribute by implementing new sorting algorithms.

## 🚀 Getting Started

To get the project running on your local machine, follow these steps.

**Prerequisites:**
*   A modern web browser (Chrome, Firefox, Edge).
*   [Git](https://git-scm.com/) installed on your system.
*   A code editor like [Visual Studio Code](https://code.visualstudio.com/).

**Running the Project:**
1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd "Algorithm Visual Tool"
    ```
2.  **Open in your editor:**
    ```bash
    code .
    ```
3.  **Launch the application:**
    *   The easiest way is to use the **Live Server** extension in VS Code. Right-click on `index.html` and select "Open with Live Server".
    *   Alternatively, you can simply open the `index.html` file directly in your browser.

---

## 🏛️ Project Architecture

The project is designed with a strong separation of concerns to make development modular and prevent conflicts.

*   `index.html`: The main HTML file containing the structure of the application.
*   `css/styles.css`: Contains all the styling, including the visual states for the bars (colors, animations).
*   `js/main.js`: The **main controller**. It handles UI events (button clicks, dropdown changes), manages the application state (play/pause/reset), and wires everything together.
*   `js/visualizer.js`: The **"Toolbox" API**. This is the heart of the visualization. It handles all direct DOM manipulation, creating and animating the bars. **Algorithms should never touch the DOM directly; they only use this toolbox.**
*   `js/algorithms/`: This directory is where you will work. Each file here contains the pure logic for a single sorting algorithm.

---

## 🛠️ How to Add a New Sorting Algorithm

Your primary task is to implement a sorting algorithm in its own file. You will not need to worry about animation, colors, or timing—the "Toolbox" handles all of that for you.

Here is your complete workflow. We'll use "Insertion Sort" as an example.

### Step 1: Create Your Algorithm File

1.  In the `js/algorithms/` folder, create a new file for your algorithm (e.g., `insertionSort.js`).
2.  You can write your implementation from scratch, but we recommend looking at `js/algorithms/bubbleSort.js`. It serves as a golden example for how to structure the file and use the `visualizer` toolbox.

### Step 2: Implement the Sorting Logic

Your algorithm file must export an `async function`. This function will be called by the main controller and should contain your sorting logic.

Inside this function, you will use the `visualizer` object (the "Toolbox") that is passed in as an argument.

**The Toolbox API (`visualizer` methods):**

*   `await visualizer.highlight([i, j])`: Sets the "Comparing" state (purple, raised) on the bars at the given indices.
*   `await visualizer.markSpecial([i])`: Sets the "Special" state (red) on a bar (e.g., for a pivot).
*   `visualizer.markPartlySorted([i, j, k])`: Sets the "Partly Sorted" state (yellow).
*   `visualizer.markSorted(i)`: Sets the final "Sorted" state (green) on a single bar.
*   `await visualizer.swap(i, j)`: Visually swaps the heights of two bars and updates the underlying data array.
*   `await visualizer.overwrite(i, newValue)`: Changes the height of the bar at index `i` to `newValue`.
*   `visualizer.read(i)`: Instantly returns the numeric value of the bar at index `i`. Use this for comparisons (e.g., `if (visualizer.read(j) > visualizer.read(j + 1))`).
*   `await visualizer.sleep()`: Pauses the algorithm according to the speed slider. Call this between steps to make the animation watchable.

**Example Structure:**

```javascript
// js/algorithms/insertionSort.js

export async function insertionSort(visualizer) {
  const n = visualizer.currentArray.length;

  for (let i = 1; i < n; i++) {
    // Use visualizer methods here...
    await visualizer.highlight([i, i-1]);
    if (visualizer.read(i) < visualizer.read(i-1)) {
        // ...
    }
    await visualizer.sleep();
  }
  
  // ... final marking ...
}
```

### Step 3: Add the Algorithm to the UI

Open `index.html` and add your algorithm's name to the dropdown menu so users can select it.

```html
<!-- filepath: index.html -->
<select id="algorithm-select" class="form__select">
  <option>Bubble Sort</option>
  <option>Insertion Sort</option> <!-- Add your algorithm here -->
  <option>Selection Sort</option>
  <!-- ... -->
</select>
```

### Step 4: Register Your Algorithm in the Controller

Finally, tell `main.js` that your algorithm exists.

1.  **Import** your function at the top of `js/main.js`.
2.  **Add** it to the `RUNNERS` map.

```javascript
// filepath: js/main.js

// ... other imports ...
import { bubbleSort } from './algorithms/bubbleSort.js';
import { insertionSort } from './algorithms/insertionSort.js'; // 1. IMPORT your function

// ...

// Map algorithm names from the dropdown to their generator functions.
const RUNNERS = {
  'Bubble Sort': bubbleSort,
  'Insertion Sort': insertionSort, // 2. ADD your entry here
};
```

---

## 🤝 Team Collaboration Guide

To ensure a smooth workflow, please follow these guidelines.

### Git Workflow

1.  **Pull Before You Work:** Always run `git pull origin main` to get the latest changes before you start.
2.  **Create a Branch:** Create a new branch for your feature.
    ```bash
    git checkout -b feat/insertion-sort
    ```
3.  **Commit Your Changes:** Make your changes and commit them with a clear message.
4.  **Push Your Branch:**
    ```bash
    git push -u origin feat/insertion-sort
    ```
5.  **Open a Pull Request:** Go to the repository on GitHub and open a Pull Request to merge your branch into `main`.

### Handling Merge Conflicts

Since everyone will be editing `index.html` and `js/main.js`, **you should expect merge conflicts**. This is normal!

When a conflict happens in `js/main.js`, it will likely be in the `import` statements and the `RUNNERS` object. To resolve it, simply **accept both changes** so that your import and your teammate's import are both included.

### Requesting New Toolbox Functions

**Rule:** Do not modify `visualizer.js` or `styles.css` yourself.

If your algorithm requires a new visual state (e.g., a new color, a different animation) that the current toolbox doesn't provide:
1.  **Post a request in our Discord group chat.**
2.  Clearly describe the feature you need and why (e.g., "I need a `markPivot()` function for Quick Sort that turns the bar blue").
3.  The project lead will review the request and implement it to ensure consistency across the application. If the lead is unavailable, you may attempt the change yourself, but you **must** announce it in the chat first.

---

## 📝 Right Panel Content

The descriptive text, complexity analysis, and pseudocode that will appear in the right-hand panel will be handled centrally by the project lead. You do not need to worry about writing this content.


### Requesting New Toolbox Functions

**Rule:** Do not modify `visualizer.js` or `styles.css` yourself.

If your algorithm requires a new visual state (e.g., a new color, a different animation) that the current toolbox doesn't provide:
1.  **Post a request in our Discord group chat.**
2.  Clearly describe the feature you need and why (e.g., "I need a `markPivot()` function for Quick Sort that turns the bar blue").
3.  The project lead will review the request and implement it to ensure consistency across the application. If the lead is unavailable, you may attempt the change yourself, but you **must** announce it in the chat first.

---

## 📝 Right Panel Content

The descriptive text, complexity analysis, and pseudocode that will appear in the right-hand panel will be handled centrally by the project lead. You do not need to worry about writing this content.
