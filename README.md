# iOS-Style Calculator

A calculator inspired by the `iOS calculator`, built with `HTML, CSS, and Vanilla JavaScript`.  
The project focuses on clean architecture, correct calculator behavior, and handling common edge cases found in real calculator applications.

---

## Features

- Class-based calculator architecture
- Event delegation for efficient button handling
- Operator chaining (`2 + 3 + 4`)
- Percent behavior similar to the iOS calculator
- Floating-point error correction (`0.1 + 0.2 → 0.3`)
- Division by zero handling (`Error`)
- AC / C button behavior
- Operator highlighting
- Overflow handling using scientific notation
- Digit grouping in the display
- Dynamic font resizing for long numbers

---

## Technologies

- `HTML`
- `CSS`
- `Vanilla JavaScript (ES6)`

No frameworks or external libraries were used.

---

## Architecture

The calculator logic is encapsulated inside a `Calculator` class.

The class manages the internal state of the calculator:

- `currentOperand`
- `previousOperand`
- `operation`
- `overwrite`
- `expression`

### Main responsibilities

**Input handling**

- `inputNumber()`
- `inputOperator()`

**Calculation**

- `compute()`
- `percent()`
- `toggleSign()`

**State management**

- `clear()`
- `resetState()`

**UI updates**

- `updateDisplay()`
- `updateHighlight()`

User interaction is handled using `event delegation`, which attaches a single event listener to the buttons container instead of individual buttons.

---

## Floating-Point Precision Handling

JavaScript uses floating-point arithmetic, which can cause errors such as:
`0.1 + 0.2 = 0.30000000000000004`

To normalize results, the calculator applies:
`Number(result.toPrecision(12))`

This keeps results accurate while preventing floating-point artifacts.

---

## Overflow Handling

If a result exceeds the maximum display length (9 digits), the calculator automatically switches to `scientific notation` using:
`num.toExponential(4)`

Example:
`1234567890 → 1.2346e+9`

---

## Event Delegation

Instead of attaching event listeners to each button, the calculator uses `event delegation`:
buttonsContainer.addEventListener('click', ...)

This approach:

- reduces the number of event listeners
- improves performance
- simplifies event handling

Button types are detected using `HTML data attributes`:
`data-number`
`data-operator`
`data-action`

---

## How to Run

1. Clone the repository
   git clone <your-repository-url>

2. Open `index.html` in your browser.
   No build tools or dependencies are required.

---

## Project Goal

This project was created as a `JavaScript practice project` to demonstrate:

- clean state management
- DOM manipulation
- event delegation
- handling real-world calculator edge cases
