'strict mode';

// *** MAIN CODE ***
const currentOperandEl = document.querySelector('[data-current]');
const previousOperandEl = document.querySelector('[data-previous]');
const buttonsContainer = document.querySelector('[data-buttons]');
const clearButton = document.querySelector('[data-action="clear"]');
const operatorButtons = document.querySelectorAll('[data-operator]');

class Calculator {
  constructor(previousOperandEl, currentOperandEl) {
    this.previousOperandEl = previousOperandEl;
    this.currentOperandEl = currentOperandEl;
    this.maxDigits = 9;
    this.activeOperator = null;
    this.resetState();
  }

  // ---------- RESET ----------

  resetState() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.overwrite = false;
    this.expression = '';
  }

  // ---------- DISPLAY ----------

  updateDisplay() {
    this.currentOperandEl.textContent = this.formatNumber(this.currentOperand);

    if (this.operation) {
      this.previousOperandEl.textContent = `${this.formatNumber(this.previousOperand)} ${this.operation}`;
    } else if (this.expression) {
      this.previousOperandEl.textContent = this.expression;
    } else {
      this.previousOperandEl.textContent = '';
    }

    const isClean =
      this.currentOperand === '0' &&
      this.previousOperand === '' &&
      this.operation === undefined;

    clearButton.textContent = isClean ? 'AC' : 'C';

    if (this.formatNumber(this.currentOperand).length > 7) {
      this.currentOperandEl.style.fontSize = '2.2rem';
    } else {
      this.currentOperandEl.style.fontSize = '2.8rem';
    }
  }

  // ---------- NUMBER INPUT ----------

  inputNumber(number) {
    // Clear previous expression when starting a new number
    if (this.expression) {
      this.expression = '';
    }

    // Overwrite mode (after operator or equals)
    if (this.overwrite) {
      this.currentOperand = number;
      this.overwrite = false;
      this.updateHighlight(null);
      return;
    }

    // Prevent multiple decimals
    if (number === '.' && this.currentOperand.includes('.')) return;

    // Max display length
    if (this.currentOperand.length >= 9) return;

    // Replace initial zero
    if (this.currentOperand === '0') {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }

    this.updateHighlight(null);
  }

  // ---------- OPERATOR INPUT ----------

  inputOperator(operator) {
    // Case: user presses operators repeatedly (2 + - ×) to compute again
    if (this.overwrite) {
      if (this.previousOperand === '') {
        this.previousOperand = this.currentOperand;
      }
      this.operation = operator;
      this.updateHighlight(operator);
      return;
    }

    // Compute if previous number exists
    if (this.previousOperand !== '') {
      this.compute();
    }

    this.previousOperand = this.currentOperand;
    this.operation = operator;
    this.overwrite = true;

    this.updateHighlight(operator);
  }

  // ---------- CALCULATION ----------

  compute() {
    if (!this.operation) return;

    const prev = Number(this.previousOperand);
    const curr = Number(this.currentOperand);

    let result;

    // Computing
    switch (this.operation) {
      case '+':
        result = prev + curr;
        break;

      case '-':
        result = prev - curr;
        break;

      case '*':
        result = prev * curr;
        break;

      case '/':
        if (curr === 0) {
          this.currentOperand = 'Error';
          this.previousOperand = '';
          this.operation = undefined;
          this.overwrite = true;
          return;
        }
        result = prev / curr;
        break;
    }
    // Fixing Floating-point errors (0.1 + 0.2 = 0.30000000000000004 => 0.3)
    result = Number(result.toPrecision(12));

    this.expression = `${this.formatNumber(this.previousOperand)} ${this.operation} ${this.formatNumber(this.currentOperand)} =`;

    this.currentOperand = this.handleOverflow(result);
    this.previousOperand = '';
    this.operation = undefined;
    this.overwrite = true;

    this.updateHighlight(null);
  }

  // ---------- PERCENT ----------

  percent() {
    if (this.currentOperand === 'Error') return;

    const current = Number(this.currentOperand);
    const previous = Number(this.previousOperand);

    let value;

    if (this.previousOperand !== '' && this.operation) {
      value = (previous * current) / 100;
    } else {
      value = current / 100;
    }

    this.currentOperand = this.handleOverflow(value);
    this.overwrite = false;
  }

  // ---------- TOGGLE SIGN ----------

  toggleSign() {
    if (this.currentOperand === '' || this.currentOperand === 'Error') return;

    const value = Number(this.currentOperand) * -1;
    this.currentOperand = this.handleOverflow(value);
    this.overwrite = false;
  }

  // ---------- CLEAR ----------

  clear() {
    // C => clear current
    if (this.currentOperand !== '0') {
      this.currentOperand = '0';
      this.overwrite = false;
      this.expression = '';
    } else {
      // AC => reset calculator
      this.resetState();
    }

    this.updateHighlight(null);
  }

  // ---------- HANDLE OVERFLOW ----------

  handleOverflow(value) {
    const num = Number(value);

    if (!Number.isFinite(num)) return 'Error';

    const limit = 10 ** this.maxDigits;
    if (Math.abs(num) >= limit) {
      // means: if the number reaches the first value that requires more than 9 digits, switch to exponential notation.
      return num.toExponential(4);
    }

    return num.toString();
  }

  // ---------- FORMAT NUMBER ----------

  formatNumber(number) {
    if (number === 'Error') return number;

    // skip scientific notation
    if (number.includes('e')) return number;

    const [integerPart, decimalPart] = number.split('.');
    const integerDisplay = Number(integerPart).toLocaleString('fr-FR');

    if (decimalPart != null) {
      return `${integerDisplay}.${decimalPart}`;
    }

    return integerDisplay;
  }

  // ---------- OPERATOR HIGHLIGHT ----------

  // Before highlighting a new operator, we must clear the previous highlight.
  updateHighlight(operator) {
    operatorButtons.forEach((btn) => {
      btn.classList.remove('active');
    });

    if (!operator) return;

    const activeBtn = [...operatorButtons].find(
      (btn) => btn.dataset.operator === operator,
    );

    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }
}

// ---------- INITIALIZE ----------

const calculator = new Calculator(previousOperandEl, currentOperandEl);

// ---------- EVENT DELEGATION ----------

buttonsContainer.addEventListener('click', (e) => {
  const button = e.target.closest('button');

  // Safety check
  if (!button) return;

  // Accessing the dataset
  const { number, operator, action } = button.dataset;

  // NUMBER
  if (number) {
    calculator.inputNumber(number);
    calculator.updateDisplay();
    return;
  }

  // OPERATOR
  if (operator) {
    calculator.inputOperator(operator);
    calculator.updateDisplay();
    return;
  }

  // ACTION
  if (action === 'equals') calculator.compute();
  else if (action === 'percent') calculator.percent();
  else if (action === 'toggle-sign') calculator.toggleSign();
  else if (action === 'clear') calculator.clear();

  calculator.updateDisplay();
});

// THE END
