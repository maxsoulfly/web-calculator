const display = document.querySelector('#display'); // Get the display element

const debugMode = true;

let number1 = ''; // First number
let number2 = ''; // Second number
let operator = ''; // Operator
let result = ''; // This will store the answer


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
    if (num2 == 0) return "ERROR: Cannot divide by zero";
    return num1 / num2;
}

const square = (num) => {
    num = parseInt(num);
    return num * num;
}

// Function to operate on two numbers with an operator
const operate = (num1, num2='', operator='') => {
    if (operator == 'add') return add(num1, num2);
    else if (operator == 'square') {
        console.log("Trying square");
        return square(num1);
    }
    else if (operator == 'subtract') return subtract(num1, num2);
    else if (operator == 'multiply') return multiply(num1, num2);
    else if (operator == 'divide') return divide(num1, num2);
    else return "ERROR: Wrong operation";
}

const init = () => {
    // Initialize number buttons
    const numberButtons = document.querySelectorAll('.number');

    numberButtons.forEach(numberButton => {
        numberButton.addEventListener('click', () => {

            // Clear display if there's an error
            if (    (typeof number1 === "string") && (number1.includes('ERROR')) 
                ||  (typeof number2 === "string") && (number2.includes('ERROR')) 
                ||  (typeof result === "string") && (result.includes('NaN')) 
                ||  (typeof result === "string") && (result.includes('ERROR'))) {
                console.log("Clearing Error");
                clearDisplay();
            };

            // Append number to the appropriate variable
            if (operator == '') {
                number1 += numberButton.textContent;
                display.textContent = number1;
            } else {
                number2 += numberButton.textContent;
                display.textContent = number2;
            }
            helperDisplayVariables();
        });

        return numberButton;
    });

    // Initialize operator buttons
    const operators = document.querySelectorAll('.operator');

    operators.forEach(operatorButton => {
        operatorButton.addEventListener('click', () => {
            // Perform operation if equals is clicked
            if (operatorButton.id === 'equals') {
                result = operate(number1, number2, operator);
                displayOperator(operatorButton.id);
                if ((typeof value === "string") && (result.includes('ERROR'))) displayError();
                // set the app for next operation
                number1 = result;
                number2 = '';
            } else if(operatorButton.id === 'square') {
                operator = operatorButton.id;
                result = operate(number1, number2, operator);
                displayOperator(operatorButton.id);
                // set the app for next operation
                number1 = result;
                number2 = '';
            } else {
                operator = operatorButton.id;
                displayOperator(operator);
            }

            helperDisplayVariables();
        });

        return operatorButton;
    });
}

// Display error message
const displayError = () => {
    display.classList.add('error');
}

// Display the operator or result
const displayOperator = (operatorID) => {
    switch (operatorID) {
        case 'equals':
            display.textContent = result;
            break;
            
        case 'divide':
        case 'multiply':
        case 'subtract':
        case 'add':
            display.textContent = document.getElementById(operatorID).textContent;
            break;
        case 'square':

            display.textContent = result;
            break;
        case 'clear':
            clearDisplay();
            break;
        default:
            break;
    }
}

// Clear the display and reset variables
const clearDisplay = () => {
    number1 = '';
    number2 = '';
    operator = '';
    result = '';

    display.textContent = '0';
    display.classList = '';
}

// Clear the last entry
const clearEntry = () => {
    if (number1 != '' && number2 == '') {
        number1 = '';
    } else {
        number2 = '';
    }

    display.textContent = '0';
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
