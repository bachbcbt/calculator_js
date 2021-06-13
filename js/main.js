// Start writing JavaScript here!
const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator__keys')
const display = calculator.querySelector('.calculator__display')
const operatorKeys = keys.querySelectorAll('[data-type="operator"]')

keys.addEventListener('click', event => {
  if (!event.target.closest('button')) return

  const key = event.target
  const keyValue = key.textContent
  const displayValue = display.textContent
  const { type } = key.dataset
  const { previousKeyType } = calculator.dataset

  if (type === 'number') {
    if (displayValue === '0' || displayValue === 'Error' || previousKeyType === 'operator') {
      display.textContent = keyValue
    } 
    else {
      display.textContent = displayValue + keyValue
    }
  }

  if (type === 'operator') {
    operatorKeys.forEach(el => { el.dataset.state = '' })
    key.dataset.state = 'selected'
    if (displayValue === 'Error') {
      calculator.dataset.firstNumber = '0'
      calculator.dataset.operator = key.dataset.key
      display.textContent = calculator.dataset.firstNumber + key.dataset.key
    }
    else {
      if (previousKeyType === 'operator') {
        calculator.dataset.firstNumber = parseFloat(displayValue)
        calculator.dataset.operator = key.dataset.key
        display.textContent = calculator.dataset.firstNumber + key.dataset.key
      } 
      else {
        calculator.dataset.firstNumber = displayValue
        calculator.dataset.operator = key.dataset.key
        display.textContent = displayValue + key.dataset.key
      }
    }
  }

  if (type === 'equal') {
    // Perform a calculation
    if (previousKeyType === 'equal') {
      display.textContent = 'Error'
    } 
    else {
      const firstNumber = calculator.dataset.firstNumber
      const operator = calculator.dataset.operator
      const secondNumber = displayValue
      display.textContent = calculate(firstNumber, operator, secondNumber)
    }
  }

  if (type === 'decimal') {
    if (previousKeyType === 'decimal') {
      display.textContent = 'Error'
    }
    else {
      display.textContent = displayValue + keyValue
    }
  }

  if (type === 'clear') {
    display.textContent = '0'
    delete calculator.dataset.firstNumber
    delete calculator.dataset.operator
  }

  calculator.dataset.previousKeyType = type
})

function calculate (firstNumber, operator, secondNumber) {
  firstNumber = parseFloat(firstNumber)
  secondNumber = parseFloat(secondNumber)

  if (operator === '+') return parseFloat(firstNumber + secondNumber)
  if (operator === '-') return parseFloat(firstNumber - secondNumber)
  if (operator === 'x') return parseFloat(firstNumber * secondNumber)
  if (operator === '÷') {
    if (secondNumber == 0) {
      return 'Error'
    }
    else {
      return parseFloat(firstNumber / secondNumber)
    }
  }
}

// ========================
// TESTING
// ========================
function clearCalculator () {
  // Press the clear key
  const clearKey = document.querySelector('[data-type="clear"]')
  clearKey.click()

  // Clear operator states
  operatorKeys.forEach(key => { key.dataset.state = '' })
}

function testClearKey () {
  clearCalculator()
  console.assert(display.textContent === '0', 'Clear key. Display should be 0')
  console.assert(!calculator.dataset.firstNumber, 'Clear key. No first number remains')
  console.assert(!calculator.dataset.operator, 'Clear key. No operator remains')
}

function testKeySequence (test) {
  // Press keys
  test.keys.forEach(key => {
    document.querySelector(`[data-key="${key}"]`).click()
  })

  // Assertion
  console.assert(display.textContent === test.value, test.message)

  // Clear calculator
  clearCalculator()
  testClearKey()
}

const tests = [{
  keys: ['1'],
  value: '1',
  message: 'Click 1'
}, {
  keys: ['1', '5'],
  value: '15',
  message: 'Click 15'
}, {
  keys: ['1', '5', '9'],
  value: '159',
  message: 'Click 159'
}, {
  keys: ['2', '4', '+', '7', 'equal'],
  value: '31',
  message: 'Calculation with plus'
}, {
  keys: ['3', '-', '7', '0', 'equal'],
  value: '-67',
  message: 'Calculation with minus'
}, {
  keys: ['1', '5', 'x', '9', 'equal'],
  value: '135',
  message: 'Calculation with times'
}, {
  keys: ['9', '÷', '3', 'equal'],
  value: '3',
  message: 'Calculation with divide'
}, {
  keys: ['9', '÷', '0', 'equal'],
  value: 'Error',
  message: 'Calculation. Divide by 0'
}]

tests.forEach(testKeySequence)
