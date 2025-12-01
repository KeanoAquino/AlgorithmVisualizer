// Main app orchestration: panel toggles, algorithm label badges, controls wiring, and Visualizer instantiation.
// Future: import algorithm step generators dynamically (e.g. import('./algorithms/bubbleSort.js')) and feed them to the Visualizer for animation.

import { Visualizer } from './visualizer.js';
import { bubbleSort } from './algorithms/bubbleSort.js';
import { insertionSort } from './algorithms/insertionSort.js';
import { mergeSort } from './algorithms/mergeSort.js';
import { heapSort } from './algorithms/heapSort.js';
import { selectionSort } from './algorithms/selectionSort.js';
import { quickSort } from './algorithms/quickSort.js';
import { getAlgorithmDescription } from './algorithmDescriptions.js';


document.addEventListener('DOMContentLoaded', () => {
  // Panels and shared elements
  const leftPanel = document.getElementById('left-panel');
  const rightPanel = document.getElementById('right-panel');
  const vizContainer = document.getElementById('viz-container');
  const leftToggleBtn = document.getElementById('toggle-left-panel');
  const rightToggleBtn = document.getElementById('toggle-right-panel');
  const leftPanelContent = document.getElementById('left-panel-content');
  const rightPanelContent = document.getElementById('right-panel-content');
  const leftToggleIcon = document.getElementById('left-toggle-icon');
  const rightToggleIcon = document.getElementById('right-toggle-icon');
  const algorithmSelect = document.getElementById('algorithm-select');
  const vizTitle = document.getElementById('viz-title');
  const vizBadges = document.getElementById('viz-badges');

  // Icons
  const menuIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>`;
  const closeIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`;
  
  // Helper to embed an external SVG/PNG inside the existing <svg> via an <image> tag
  const inlineImg = (path) => `<image href="${path}" x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet" />`;
  
  // State
  let isLeftPanelOpen = true;
  let isRightPanelOpen = false;

  // Panel logic (vanilla CSS classes)
  function toggleLeftPanel(forceOpen) {
    const shouldBeOpen = forceOpen !== undefined ? forceOpen : !isLeftPanelOpen;
    if (shouldBeOpen) {
      isLeftPanelOpen = true;
      leftPanel.classList.add('is-open');
      vizContainer.classList.add('shift-left');
      leftPanelContent.classList.remove('is-hidden');
      leftToggleIcon.innerHTML = closeIcon;
      if (isRightPanelOpen) toggleRightPanel(false);
    } else {
      isLeftPanelOpen = false;
      leftPanel.classList.remove('is-open');
      vizContainer.classList.remove('shift-left');
      leftPanelContent.classList.add('is-hidden');
      leftToggleIcon.innerHTML = inlineImg('./assets/icons/settings.svg');
    }
  }

  function toggleRightPanel(forceOpen) {
    const shouldBeOpen = forceOpen !== undefined ? forceOpen : !isRightPanelOpen;
    if (shouldBeOpen) {
      isRightPanelOpen = true;
      rightPanel.classList.add('is-open');
      vizContainer.classList.add('shift-right');
      rightPanelContent.classList.remove('is-hidden');
      rightToggleIcon.innerHTML = closeIcon;
      if (isLeftPanelOpen) toggleLeftPanel(false);
    } else {
      isRightPanelOpen = false;
      rightPanel.classList.remove('is-open');
      vizContainer.classList.remove('shift-right');
      rightPanelContent.classList.add('is-hidden');
      rightToggleIcon.innerHTML = inlineImg('./assets/icons/bulb.svg');
    }
  }

  // Algorithm info mapping for labels
  const ALGO_INFO = {
    'Bubble Sort': { title: 'Bubble Sort', best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
    'Insertion Sort': { title: 'Insertion Sort', best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
    'Selection Sort': { title: 'Selection Sort', best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)' },
    'Merge Sort': { title: 'Merge Sort', best: 'O(nlogn)', average: 'O(nlogn)', worst: 'O(nlogn)' },
    'Quick Sort': { title: 'Quick Sort', best: 'O(nlogn)', average: 'O(nlogn)', worst: 'O(n^2)' },
    'Heap Sort': { title: 'Heap Sort', best: 'O(nlogn)', average: 'O(nlogn)', worst: 'O(nlogn)' }
  };

  // Right panel content updater
  const learnContent = document.getElementById('learn-content');
  function updateRightPanelContent(algoName) {
    if (!learnContent) return;
    learnContent.innerHTML = getAlgorithmDescription(algoName);
  }

  function formatComplexity(str) {
    // Replace n^k with n<sup>k</sup> and normalize unicode superscript ²
    let out = str.replace(/n\^(\d+)/g, 'n<sup>$1</sup>');
    out = out.replace(/n²/g, 'n<sup>2</sup>');
    return out;
  }

  function updateLabel(algoName) {
    const info = ALGO_INFO[algoName];
    if (!info) {
      vizTitle.textContent = '';
      if (vizBadges) vizBadges.innerHTML = '';
      return;
    }
    vizTitle.textContent = info.title;
    if (vizBadges) {
      const bestHTML = `Best: ${formatComplexity(info.best)}`;
      const avgHTML = `Average: ${formatComplexity(info.average)}`;
      const worstHTML = `Worst: ${formatComplexity(info.worst)}`;
      vizBadges.innerHTML = `
        <button type="button" class="badge badge--static" disabled aria-disabled="true">${bestHTML}</button>
        <button type="button" class="badge badge--static" disabled aria-disabled="true">${avgHTML}</button>
        <button type="button" class="badge badge--static" disabled aria-disabled="true">${worstHTML}</button>
      `;
    }
  }

  // Events
  leftToggleBtn.addEventListener('click', () => toggleLeftPanel());
  rightToggleBtn.addEventListener('click', () => toggleRightPanel());
  // We'll attach the algorithm change handler after the controller is set up

  // Initialize panel state
  toggleLeftPanel(true);
  toggleRightPanel(false);

  // Default algorithm selection: Bubble Sort
  let currentAlgorithmName = null;
  if (algorithmSelect) {
    // Try to select 'Bubble Sort' by value/text
    const desired = 'Bubble Sort';
    let matched = false;
    for (const opt of algorithmSelect.options) {
      if (opt.text.trim() === desired || (opt.value && opt.value.trim() === desired)) {
        algorithmSelect.value = opt.value || opt.text;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Fallback to the first option (no placeholder exists)
      algorithmSelect.selectedIndex = 0;
    }
    currentAlgorithmName = algorithmSelect.options[algorithmSelect.selectedIndex].text;
    updateLabel(currentAlgorithmName);
    updateRightPanelContent(currentAlgorithmName);
  }

  // Visualization basics via Visualizer class
  const barContainer = document.getElementById('bar-container');
  const sizeSelect = document.getElementById('size-select');
  const resetBtn = document.getElementById('reset-btn');
  const speedSlider = document.getElementById('speed-slider');
  const playPauseBtn = document.getElementById('play-pause-btn');

  // Range fill update for speed slider (fills left side with accent color)
  function updateRangeFill(el) {
    if (!el) return;
    const min = parseFloat(el.min || '0');
    const max = parseFloat(el.max || '100');
    const val = parseFloat(el.value || String(min));
    const percent = ((val - min) * 100) / (max - min);
    el.style.setProperty('--range-progress', `${percent}%`);
  }

  if (speedSlider) {
    updateRangeFill(speedSlider);
    speedSlider.addEventListener('input', (e) => updateRangeFill(e.target));
    speedSlider.addEventListener('change', (e) => updateRangeFill(e.target));
  }

  // ========== Algorithm Controller (run/pause/cancel) ==========
  const visualizer = new Visualizer({ barContainer, sizeSelect, speedSlider });
  // Redraw bars on resize so they continue to fit the box width/height
  window.addEventListener('resize', visualizer.redraw);

  // Map algorithm names to runner functions
  const RUNNERS = {
    'Bubble Sort': bubbleSort,
    'Insertion Sort': insertionSort,
    'Selection Sort': selectionSort,
    'Merge Sort': mergeSort,
    'Quick Sort': quickSort,
    'Heap Sort': heapSort,
    // All algorithms implemented!
  };

  // UI helpers for Play/Pause button label
  const playLabel = () => 'Play';
  const pauseLabel = () => 'Pause';
  const resumeLabel = () => 'Resume';
  function setPlayButton(label) {
    const span = playPauseBtn?.querySelector('span');
    if (span) span.textContent = label;
  }

  // Disable/enable controls while running
  function setControlsDisabled(disabled) {
    if (algorithmSelect) algorithmSelect.disabled = disabled;
    if (sizeSelect) sizeSelect.disabled = disabled;
  }

  // Controller state and pause/cancel gate
  let state = 'idle'; // 'idle' | 'running' | 'paused'
  let currentRunPromise = null;
  let cancelled = false;
  let pauseResolver = null; // function to resume

  const control = {
    awaitIfPaused: async () => {
      if (cancelled) return; // fast path; visualizer will throw after this
      if (state !== 'paused') return;
      // Wait until resumed
      await new Promise((resolve) => { pauseResolver = resolve; });
      pauseResolver = null;
    },
    isCancelled: () => cancelled,
  };

  visualizer.setController(control);

  function getSelectedRunner() {
    const name = algorithmSelect?.options[algorithmSelect.selectedIndex]?.text || '';
    return RUNNERS[name]; // no fallback; unimplemented algorithms return undefined
  }

  function isAlgorithmImplemented(name) {
    return !!RUNNERS[name];
  }

  function updatePlayAvailability() {
    const name = algorithmSelect?.options[algorithmSelect.selectedIndex]?.text || '';
    const implemented = isAlgorithmImplemented(name);
    // Disable Play button if not implemented and when not in a running/paused state
    const shouldDisable = !implemented && state === 'idle';
    if (playPauseBtn) {
      playPauseBtn.disabled = shouldDisable;
      playPauseBtn.title = shouldDisable ? `${name} not implemented yet` : '';
    }
  }

  async function startRun() {
    if (state !== 'idle') return;
    const runner = getSelectedRunner();
    if (!runner) return; // guard against unimplemented algorithms
    // Ensure fresh visual states and consistent bars
    visualizer.redraw();
    cancelled = false;
    state = 'running';
    updatePlayAvailability();
    setControlsDisabled(true);
    setPlayButton(pauseLabel());
    currentRunPromise = (async () => {
      try {
        await runner(visualizer);
      } catch (err) {
        // Swallow cancellation; log others
        if (!(err && String(err.message || err) === 'AlgorithmCancelled')) {
          console.warn('Algorithm run ended with error:', err);
        }
      } finally {
        // Only reset UI if we are not paused (pause keeps state)
        if (!cancelled && state !== 'paused') {
          state = 'idle';
          setPlayButton(playLabel());
          setControlsDisabled(false);
          updatePlayAvailability();
        }
      }
    })();
  }

  function pauseRun() {
    if (state !== 'running') return;
    state = 'paused';
    setPlayButton(resumeLabel());
  }

  function resumeRun() {
    if (state !== 'paused') return;
    state = 'running';
    setPlayButton(pauseLabel());
    if (pauseResolver) pauseResolver();
  }

  async function cancelRun() {
    if (state === 'idle') return;
    cancelled = true;
    // If paused, resume gate to let it unwind
    if (pauseResolver) pauseResolver();
    try {
      await currentRunPromise;
    } catch (_) { /* ignore */ }
    finally {
      state = 'idle';
      setPlayButton(playLabel());
      setControlsDisabled(false);
      cancelled = false; // reset flag for next run
      updatePlayAvailability();
    }
  }

  // Wire UI events
  sizeSelect.addEventListener('change', async () => {
    // Changing size during a run cancels it
    await cancelRun();
    visualizer.reset();
  });
  resetBtn.addEventListener('click', async () => {
    await cancelRun();
    visualizer.reset();
  });
  playPauseBtn.addEventListener('click', async () => {
    if (state === 'idle') return startRun();
    if (state === 'running') return pauseRun();
    if (state === 'paused') return resumeRun();
  });

  // Algorithm selection: reset array on change; disallow running if not implemented
  if (algorithmSelect) {
    algorithmSelect.addEventListener('change', async (e) => {
      const name = e.target.options[e.target.selectedIndex].text;
      const changed = name !== currentAlgorithmName;
      await cancelRun();
      currentAlgorithmName = name;
      updateLabel(name);
      updateRightPanelContent(name);
      if (changed) {
        visualizer.reset(); // regenerate array when switching algorithms
      }
      updatePlayAvailability();
    });
    // Initial state of play button based on default selection
    updatePlayAvailability();
  }
});
