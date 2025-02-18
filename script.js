const display = document.querySelector('#display'); // Get the display element

const debugMode = true;

let number1 = ''; // First number
let number2 = ''; // Second number
let operator = ''; // Operator
let result = ''; // This will store the answer

let errorFlag = false;


// Function to add two numbers
const add = (num1, num2) => {
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    return num1 + num2;
}

// Function to subtract the second number from the first
const subtract = (num1, num2) => {
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    return num1 - num2;
}

// Function to multiply two numbers
const multiply = (num1, num2) => {
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    return num1 * num2;
}

// Function to divide the first number by the second
const divide = (num1, num2) => {
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    if (num2 == 0) {
        
        errorFlag = true;
        return "WTF you're trying to do?";
    }
    return num1 / num2;
}

const square = (num) => {
    num = parseInt(num);
    return num * num;
}

// Function to operate on two numbers with an operator
const operate = () => {
    // console.log("🚀 ~ operate ~ num1, num2, operator:", num1, num2, operator);
    if (operator == 'add') return add(number1, number2);
    else if (operator == 'subtract') return subtract(number1, number2);
    else if (operator == 'multiply') return multiply(number1, number2);
    else if (operator == 'divide') return divide(number1, number2);
    else if (operator == 'square') return square(number1);
    else {
        errorFlag = true;
        return "ERROR: Wrong operation";
    }
}

const isFloat = (value) => {
    return typeof value === "number";
}


const init = () => {
    // Initialize number buttons
    const numberButtons = document.querySelectorAll('.number');

    numberButtons.forEach(numberButton => {
        numberButton.addEventListener('click', () => {

            if (!errorFlag) {
                // Append number to the appropriate variable
                if (operator == '') {
                    number1 += numberButton.textContent;
                    display.textContent = number1;
                } else {
                    number2 += numberButton.textContent;
                    display.textContent = number2;
                }
                helperDisplayVariables();
            }
            else {
                clearDisplay();
            }
        });

        return numberButton;
    });

    // Initialize operator buttons
    const operators = document.querySelectorAll('.operator');

    operators.forEach(operatorButton => {
        operatorButton.addEventListener('click', () => {
            if (operatorButton.id === 'clear-entry' || 
                operatorButton.id === 'clear'){
                clearDisplay();
            }
            else if (!errorFlag) {
                // Perform operation if equals is clicked
                if (operatorButton.id === 'equals') {

                    result = operate();
                    activateOperator(operatorButton.id);
                    displayResult();
                    
                    // if was error
                    if (!isFloat(result)) displayError();

                    // set the app for next operation
                    number1 = result;
                    number2 = '';

                } else if(operatorButton.id === 'square') {

                    operator = operatorButton.id;
                    result = operate();
                    activateOperator(operator);
                    displayResult();

                    // set the app for next operation
                    number1 = result;
                    number2 = '';

                } else {
                    operator = operatorButton.id;
                    activateOperator(operator);
                }

                helperDisplayVariables();
            }
        });

        return operatorButton;
    });
}

// Display error message
const displayError = () => {
    display.classList.add('error');
}


const clearError = () => {
    number1 = '';
    number2 = '';
    operator = '';
    result = '';

    errorFlag = false;
    display.textContent = '0';
    display.classList = '';
}

const displayResult = () => {
    display.textContent = result;
}

const activateOperator = (operatorID) => {
    clearActiveOperators();
    const operatorButton = document.getElementById(operatorID);
    operatorButton.classList.toggle('active');
}

const clearActiveOperators = () => {
    const allOperators = document.querySelectorAll('.operator');
    allOperators.forEach(operator=>operator.classList.remove('active'));
}

// Clear the display and reset variables
const clearDisplay = () => {
    number1 = '';
    number2 = '';
    operator = '';
    result = '';

    display.textContent = '0';
    display.classList = '';
    clearError();
    clearActiveOperators();
}


// Clear the last entry
const clearEntry = () => {
    clearError();
}

// Helper function to log variables
const helperDisplayVariables = () => {
    if (debugMode) {
        console.log("🚀 ~ number1:", number1);
        console.log("🚀 ~ number2:", number2);
        console.log("🚀 ~ operator:", operator);
        console.log("🚀 ~ result:", result);
    }
}

init(); // Initialize the calculator
