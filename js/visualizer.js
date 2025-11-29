// Visualizer class: owns array generation, persistent bar setup, resizing/redraw logic.


export class Visualizer {
  constructor({ barContainer, sizeSelect, speedSlider }) {
    if (!barContainer) throw new Error('Visualizer: barContainer is required');
    if (!sizeSelect) throw new Error('Visualizer: sizeSelect is required');
    this.barContainer = barContainer;
    this.sizeSelect = sizeSelect;
    this.speedSlider = speedSlider || null;

    // Public-ish state used by future animations
    this.currentArray = [];
    this._highlighted = new Set();
    this._special = new Set();
    this._partly = new Set();

    // cache of last layout metrics for quick swaps
    this._lastScale = 1;
    this._lastBarWidth = null;

  // Optional run controller for pause/cancel integration
  this._control = null; // { awaitIfPaused: async()=>void, isCancelled: ()=>boolean }

    // Bind methods if needed by event listeners
    this.reset = this.reset.bind(this);
    this.redraw = this.redraw.bind(this);

    // Initial setup: generate and draw
    this.reset();
  }

  // Create an array of heights: 1..size with ~10% duplicates, then shuffle (Fisher-Yates)
  createRandomArray(size) {
    const array = Array.from({ length: size }, (_, i) => i + 1);
    
    // Replace ~10% of elements with duplicates of other elements
    const numDuplicates = Math.max(1, Math.floor(size * 0.1));
    for (let d = 0; d < numDuplicates; d++) {
      const sourceIdx = Math.floor(Math.random() * size);
      let targetIdx = Math.floor(Math.random() * size);
      while (targetIdx === sourceIdx) {
        targetIdx = Math.floor(Math.random() * size);
      }
      array[targetIdx] = array[sourceIdx];
    }
    
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Prepare bars persistently: create the correct number of bar elements once,
  // then update their sizes on redraw. This is animation-friendly.
  setupBars(count) {
    // If count changed, rebuild children; else reuse existing nodes
    const existing = this.barContainer.children.length;
    if (existing !== count) {
      this.barContainer.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const bar = document.createElement('div');
        bar.classList.add('viz-bar');
        this.barContainer.appendChild(bar);
      }
    }
  }

  // Compute container target height/inner sizes and apply bar heights/widths
  updateBars() {
    const array = this.currentArray;
    if (!Array.isArray(array) || array.length === 0) return;

    // Determine container height so it's ~2x tallest bar plus padding
    const RATIO = 2.2; // keep identical behavior
    const targetBoxHeight = Math.min(1500, Math.max(300, Math.round(window.innerHeight * 0.7)));
    this.barContainer.style.height = `${targetBoxHeight}px`;

    // Compute padding and inner sizes
    const styles = getComputedStyle(this.barContainer);
    const padY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const innerHeight = this.barContainer.clientHeight - padY;
    const innerWidth = this.barContainer.clientWidth - padX;

    const maxVal = Math.max(...array);
    const tallestBarHeight = innerHeight / RATIO; // ensure 2.2x relation
    const scale = tallestBarHeight / maxVal;

    const gap = 4; // matches CSS gap
    const totalGap = gap * (array.length - 1);
    const barWidth = Math.max(3, Math.floor((innerWidth - totalGap) / array.length));

    // save for quick access (used by swap/overwrite)
    this._lastScale = scale;
    this._lastBarWidth = barWidth;
  this._tallestBarDrawn = tallestBarHeight; // store for raise calculation
  this._containerInnerHeight = innerHeight; // for boundary limiting

    // Apply sizes to existing bars
    const bars = this.barContainer.children;
    for (let i = 0; i < array.length; i++) {
      const value = array[i];
      const bar = bars[i];
      if (!bar) continue;
      const h = Math.max(1, Math.round(value * scale));
      bar.style.height = `${h}px`;
      bar.style.width = `${barWidth}px`;
      // Clear any stale transform if not comparing
      if (!bar.classList.contains('is-comparing')) {
        bar.style.transform = 'translateY(0)';
      }
    }
  }

  // Public: regenerate data and redraw (used by Reset and size changes)
  reset() {
    // Clear any visual states/classes and internal sets
    this._clearStates();
    const size = parseInt(this.sizeSelect.value, 10);
    this.currentArray = this.createRandomArray(size);
    this.setupBars(size);
    this.updateBars();
  }

  // Public: redraw with existing data (used on window resize)
  redraw() {
    // Ensure bar count matches current array
    this.setupBars(this.currentArray.length);
    this.updateBars();
  }

  /* ============== Toolbox API ============== */
  // Internal helpers
  _bars() { return this.barContainer.children; }
  _inSet(set, i) { return set.has(i); }
  _addClass(i, cls) { const el = this._bars()[i]; if (el) el.classList.add(cls); }
  _removeClass(i, cls) { const el = this._bars()[i]; if (el) el.classList.remove(cls); }
  _diffUpdate(set, nextArr, addFn, removeFn) {
    const next = new Set(nextArr);
    // remove ones not present
    for (const i of Array.from(set)) { if (!next.has(i)) { removeFn(i); set.delete(i); } }
    // add new ones
    for (const i of next) { if (!set.has(i)) { addFn(i); set.add(i); } }
  }

  // Attach/detach a controller to enable pause/cancel behavior during animations
  setController(control) {
    this._control = control || null;
  }

  async _awaitIfPaused() {
    if (this._control && typeof this._control.awaitIfPaused === 'function') {
      await this._control.awaitIfPaused();
    }
    if (this._control && typeof this._control.isCancelled === 'function' && this._control.isCancelled()) {
      // Throw to unwind the current algorithm run cleanly
      throw new Error('AlgorithmCancelled');
    }
  }

  _clearStates() {
    // Remove state classes from all bars and clear tracking sets
    const bars = this._bars();
    if (bars && bars.length) {
      for (let i = 0; i < bars.length; i++) {
        const el = bars[i];
        el.classList.remove('is-comparing', 'is-special', 'is-sorted', 'is-partly');
      }
    }
    this._highlighted.clear();
    this._special.clear();
    this._partly.clear();
  }

  _speedFactor() {
    if (!this.speedSlider) return 1;
    const v = parseFloat(this.speedSlider.value);
    if (!(Number.isFinite(v) && v > 0)) return 1;
    // Apply softened quadratic curve: effective = 0.3 + 0.85 * v^2
    // This reduces speed at low values while still giving a big boost near max.
    return 0.3 + 0.85 * v * v;
  }

  async sleep(ms = 250) {
    const factor = this._speedFactor();
    // Increase base duration slightly for smoother pacing (base ms + additive slowdown)
    const base = ms + 80; // stronger additive component to slow default
    const effective = Math.max(24, base / factor);
    await this._awaitIfPaused();
    await new Promise(r => setTimeout(r, effective));
    await this._awaitIfPaused();
  }

  // highlight: set comparing state for indices, remove from others; awaits transition
  async highlight(indices) {
    await this._awaitIfPaused();
    const add = (i) => this._addClass(i, 'is-comparing');
    const rem = (i) => this._removeClass(i, 'is-comparing');
    this._diffUpdate(this._highlighted, indices || [], add, rem);
    // Apply dynamic raise: each highlighted bar's BOTTOM sits just above tallest bar's height.
    const tallest = this._tallestBarDrawn || 0; // px
    const gap = 8; // px above tallest bar
    const bars = this._bars();
    const containerCap = (this._containerInnerHeight || 0) - 2; // leave tiny margin
    for (let i = 0; i < bars.length; i++) {
      const barEl = bars[i];
      if (!barEl) continue;
      if (this._highlighted.has(i)) {
        const barH = barEl.getBoundingClientRect().height; // includes border
        // Raise bottom to (tallest + gap): bottom position after translate equals 'raise'
        let raise = tallest + gap;
        // Do not let bar exit container: top must stay inside => raise <= containerInnerHeight - barH
        const maxRaise = containerCap - barH;
        if (raise > maxRaise) raise = Math.max(gap, maxRaise);
        barEl.style.transform = `translateY(-${Math.round(raise)}px)`;
      } else {
        barEl.style.transform = 'translateY(0)';
      }
    }
    await this.sleep(240);
  }

  // markSpecial: red state independent of highlight; optional short pause
  async markSpecial(indices) {
    await this._awaitIfPaused();
    const add = (i) => this._addClass(i, 'is-special');
    const rem = (i) => this._removeClass(i, 'is-special');
    this._diffUpdate(this._special, indices || [], add, rem);
    await this.sleep(160);
  }

  // markPartlySorted: yellow persistent state; union-add only
  markPartlySorted(indices) {
    // No await here, but respect cancellation/paused at next awaited op
    if (!Array.isArray(indices)) return;
    for (const i of indices) {
      this._partly.add(i);
      this._addClass(i, 'is-partly');
    }
  }

  // markSorted: green final state; remove lower-priority states
  markSorted(index) {
    if (index == null) return;
    this._addClass(index, 'is-sorted');
    this._removeClass(index, 'is-partly');
    this._removeClass(index, 'is-special');
    this._partly.delete(index);
    this._special.delete(index);
  }

  // read current value quickly
  read(index) {
    return this.currentArray[index];
  }

  // swap two values visually and then in data; await height morph
  // Also swaps state classes (is-special, is-partly) so colors follow values
  async swap(i, j) {
    await this._awaitIfPaused();
    if (i === j) return;
    const a = this.currentArray[i];
    const b = this.currentArray[j];
    const scale = this._lastScale || 1;
    const bars = this._bars();

    // Swap heights (triggers CSS transition animation)
    if (bars[i]) bars[i].style.height = `${Math.max(1, Math.round(b * scale))}px`;
    if (bars[j]) bars[j].style.height = `${Math.max(1, Math.round(a * scale))}px`;

    // Swap state classes so colors follow the values during the animation
    this._swapStates(i, j);

    await this.sleep(300);
    // sync data after visual completes
    [this.currentArray[i], this.currentArray[j]] = [b, a];
  }

  // Helper: swap visual state classes between two indices
  _swapStates(i, j) {
    const bars = this._bars();
    const barI = bars[i];
    const barJ = bars[j];
    if (!barI || !barJ) return;

    // State classes to swap (excluding is-comparing which is position-based, and is-sorted which is final)
    const states = ['is-special', 'is-partly'];

    for (const cls of states) {
      const iHas = barI.classList.contains(cls);
      const jHas = barJ.classList.contains(cls);

      // Swap class presence
      if (iHas && !jHas) {
        barI.classList.remove(cls);
        barJ.classList.add(cls);
      } else if (jHas && !iHas) {
        barJ.classList.remove(cls);
        barI.classList.add(cls);
      }
      // If both have it or neither has it, no change needed
    }

    // Also update internal tracking sets
    const swapInSet = (set, a, b) => {
      const aIn = set.has(a);
      const bIn = set.has(b);
      if (aIn && !bIn) { set.delete(a); set.add(b); }
      else if (bIn && !aIn) { set.delete(b); set.add(a); }
    };
    swapInSet(this._special, i, j);
    swapInSet(this._partly, i, j);
  }

  // overwrite a single index with new value; animate then finalize
  async overwrite(index, value) {
    await this._awaitIfPaused();
    this.currentArray[index] = value;
    // Recompute layout since scale might change
    this.updateBars();
    await this.highlight([index]);
    await this.sleep(260);
    await this.highlight([]);
    this.markSorted(index);
  }

  // blink: flash a bar with a specified color to draw attention
  // Options:
  //   color: CSS color string (e.g., 'var(--bar-red)', '#ff0000')
  //   times: number of blink cycles (default 3)
  //   interval: ms between on/off toggles (default 150)
  async blink(index, { color = 'var(--bar-red)', times = 3, interval = 150 } = {}) {
    await this._awaitIfPaused();
    const bar = this._bars()[index];
    if (!bar) return;

    for (let i = 0; i < times; i++) {
      await this._awaitIfPaused();
      // Apply blink color via inline style (overrides CSS classes)
      bar.style.backgroundColor = color;
      await new Promise(r => setTimeout(r, interval));

      await this._awaitIfPaused();
      // Remove inline style to revert to CSS-controlled color
      bar.style.backgroundColor = '';
      await new Promise(r => setTimeout(r, interval));
    }
  }

  // shiftToPosition: "slide" a bar from fromIndex to toIndex by animating all bars
  // between them simultaneously. Creates the illusion of one bar sliding left
  // while others shift right (or vice versa).
  //
  // Example: shiftToPosition(3, 0) on [6, 4, 1, 5]
  //   - Bar at index 3 (value 5) slides to index 0
  //   - Bars at indices 0, 1, 2 shift right to indices 1, 2, 3
  //   - Result: [5, 6, 4, 1]
  //
  // Only affects heights; does not change color states (caller handles that).
  async shiftToPosition(fromIndex, toIndex) {
    await this._awaitIfPaused();
    if (fromIndex === toIndex) return;

    const bars = this._bars();
    const arr = this.currentArray;
    const scale = this._lastScale || 1;

    // Determine direction: shifting left (from > to) or right (from < to)
    const shiftingLeft = fromIndex > toIndex;

    // Save the value being moved
    const movingValue = arr[fromIndex];

    // Calculate and apply all new heights simultaneously (before any await)
    if (shiftingLeft) {
      // Value at fromIndex moves to toIndex; everything in between shifts right
      // Example: [A, B, C, D] with from=3, to=0 → [D, A, B, C]
      const movingHeight = Math.max(1, Math.round(movingValue * scale));
      
      // Apply heights: position toIndex gets movingValue, others shift right
      for (let i = fromIndex; i >= toIndex; i--) {
        if (i === toIndex) {
          bars[i].style.height = `${movingHeight}px`;
        } else {
          // This position gets the value from its left neighbor
          const neighborValue = arr[i - 1];
          const neighborHeight = Math.max(1, Math.round(neighborValue * scale));
          bars[i].style.height = `${neighborHeight}px`;
        }
      }

      // Update the data array to match
      for (let i = fromIndex; i > toIndex; i--) {
        arr[i] = arr[i - 1];
      }
      arr[toIndex] = movingValue;

    } else {
      // Value at fromIndex moves to toIndex; everything in between shifts left
      // Example: [A, B, C, D] with from=0, to=3 → [B, C, D, A]
      const movingHeight = Math.max(1, Math.round(movingValue * scale));

      // Apply heights: position toIndex gets movingValue, others shift left
      for (let i = fromIndex; i <= toIndex; i++) {
        if (i === toIndex) {
          bars[i].style.height = `${movingHeight}px`;
        } else {
          // This position gets the value from its right neighbor
          const neighborValue = arr[i + 1];
          const neighborHeight = Math.max(1, Math.round(neighborValue * scale));
          bars[i].style.height = `${neighborHeight}px`;
        }
      }

      // Update the data array to match
      for (let i = fromIndex; i < toIndex; i++) {
        arr[i] = arr[i + 1];
      }
      arr[toIndex] = movingValue;
    }

    // Wait for CSS transition to animate all height changes
    await this.sleep(250);
  }

  // lowerBar: lower a single bar from its raised state back to the array
  // and apply a color state (e.g., 'partly' for yellow, 'sorted' for green)
  async lowerBar(index, state = 'partly') {
    await this._awaitIfPaused();
    const bar = this._bars()[index];
    if (!bar) return;

    // Remove comparing state (this triggers the CSS transition to lower)
    bar.classList.remove('is-comparing');
    this._highlighted.delete(index);
    bar.style.transform = 'translateY(0)';

    // Apply the target state
    if (state === 'sorted') {
      this.markSorted(index);
    } else if (state === 'partly') {
      this._partly.add(index);
      bar.classList.add('is-partly');
    }

    // Brief pause to let the lowering animation complete
    await this.sleep(150);
  }

  // clearPartlySorted: remove the partly sorted (yellow) state from specified indices
  clearPartlySorted(indices) {
    const bars = this._bars();
    for (const i of indices) {
      if (bars[i]) {
        bars[i].classList.remove('is-partly');
        this._partly.delete(i);
      }
    }
  }
}
