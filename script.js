const display = document.querySelector("#display"); // Get the display element

const singleNumberOperations = ["square", "square-root", "reciprocal"]; // Single number operations
const clearButtons = ["clear-entry", "clear"]; // Clear buttons

const debugMode = true; // Enable or disable debug mode

let number1 = ""; // First number
let number2 = ""; // Second number
let operator = ""; // Operator for two-number operations
let singleOperator = ""; // Operator for single-number operations
let result = 0; // This will store the answer

let singleOperatorFlag = false; // Flag to indicate if a single operator is in use
let errorFlag = false; // Flag to indicate if there is an error
let decimalPointFlag = false; // Flag to indicate if a decimal point has been used
let number1FocusFlag = true; // Flag to indicate if the first number is in focus
let number2FocusFlag = false; // Flag to indicate if the second number is in focus
let shouldResetFlag = false; // Flag to determine if the next input should reset the calculator state

// Basic arithmetic functions
const add = (num1, num2) => parseFloat(num1) + parseFloat(num2);
const subtract = (num1, num2) => parseFloat(num1) - parseFloat(num2);
const multiply = (num1, num2) => parseFloat(num1) * parseFloat(num2);
const divide = (num1, num2) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    if (num2 == 0) {
        errorFlag = true;
        return "WTF you're trying to do?"; // Error message for division by zero
    }
    return num1 / num2;
};

// Single number operations
const square = (num) => parseFloat(num) * parseFloat(num);
const squareRoot = (num) => Math.sqrt(parseFloat(num));
const reciprocal = (num) => 1 / parseFloat(num);
const negative = (num) => -parseFloat(num);

// Utility functions
const isFloat = (value) => typeof value === "number";
const removeFromNumber = (number) => (number.length > 0 ? number.slice(0, -1) : "0");

// Display functions
const displayError = () => display.classList.add("error");
const clearError = () => {
    errorFlag = false;
    display.classList.remove("error");
};
const displayResult = () => {
    clearActiveOperators();
    if (!isFloat(result)) displayError();
    display.textContent = result;
    number1 = result == 0 ? "" : result;
    number2 = "";
    operator = "";
};
const refreshDisplay = (number) => display.textContent = number;

// Focus and flag management functions
const toggleFocus = () => {
    number1FocusFlag = !number1FocusFlag;
    number2FocusFlag = !number2FocusFlag;
    toggleDecimalPoint();
    toggleSingleOperators();
};
const resetFocus = () => {
    number1FocusFlag = true;
    number2FocusFlag = false;
};
const toggleSingleOperators = () => singleOperatorFlag = !singleOperatorFlag;
const resetSingleOperators = () => singleOperatorFlag = false;
const toggleDecimalPoint = () => decimalPointFlag = !decimalPointFlag;
const resetDecimalPoint = () => decimalPointFlag = false;

// Operation functions
const operate = (operator) => {
    if (number1 === "") number1 = 0;
    if (number2 === "") number2 = 0;

    switch (operator) {
        case "add": return add(number1, number2);
        case "subtract": return subtract(number1, number2);
        case "multiply": return multiply(number1, number2);
        case "divide": return divide(number1, number2);
        case "square": return square(number1);
        case "square-root": return squareRoot(number1);
        case "reciprocal": return reciprocal(number1);
        default:
            errorFlag = true;
            return "ERROR: Wrong operation";
    }
};

// Button click handlers
const appendToNumber = (number, button) => {
    if (number == 0) number = "";
    if (button.textContent === ".") {
        if (!decimalPointFlag) {
            number += button.textContent;
            display.textContent = number;
            toggleDecimalPoint();
        }
    } else {
        number += button.textContent;
        display.textContent = number;
    }
    return number;
};
const handleEqualsClick = () => {
    if ((number1FocusFlag && number1 === "") || (number1FocusFlag && number2 === "")) {
        display.textContent = number1 === "" ? 0 : number1;
    } else {
        result = operate(operator);
        displayResult();
        toggleFocus();
        shouldResetFlag = true;
    }
};
const handleOperatorClick = (operatorId) => {
    if (operator === "") {
        operator = operatorId;
    } else {
        result = operate(operator);
        displayResult();
    }
    toggleFocus();
    resetDecimalPoint();
    activateOperator(operator);
};
const handleDeleteClick = () => {
    if (number1FocusFlag) {
        number1 = removeFromNumber(number1);
        refreshDisplay(number1);
    } else if (number2FocusFlag) {
        number2 = removeFromNumber(number2);
        refreshDisplay(number2);
    }
};

// Initialization function
const init = () => {
    const numberButtons = document.querySelectorAll(".number");
    numberButtons.forEach((numberButton) => {
        numberButton.addEventListener("click", () => {
            if (!errorFlag) {
                if (number1FocusFlag) {
                    if (shouldResetFlag) {
                        clearDisplay();
                        shouldResetFlag = false;
                    }
                    number1 = appendToNumber(number1, numberButton);
                } else if (number2FocusFlag) {
                    number2 = appendToNumber(number2, numberButton);
                }
                helperDisplayVariables();
            }
        });
    });

    const operators = document.querySelectorAll(".operator");
    operators.forEach((operatorButton) => {
        operatorButton.addEventListener("click", () => {
            if (debugMode) console.log("operatorButton.id", operatorButton.id);
            if (clearButtons.includes(operatorButton.id)) {
                clearDisplay();
            } else if (operatorButton.id === "delete") {
                handleDeleteClick();
            } else if (!errorFlag) {
                if (operatorButton.id === "equals") {
                    handleEqualsClick();
                } else {
                    handleOperatorClick(operatorButton.id);
                }
                helperDisplayVariables();
            }
        });
    });

    const singleOperators = document.querySelectorAll(".single-operator");
    singleOperators.forEach((operatorButton) => {
        operatorButton.addEventListener("click", () => {
            if (debugMode) console.log("operatorButton.id", operatorButton.id);
            if (singleNumberOperations.includes(operatorButton.id) && number1FocusFlag) {
                singleOperator = operatorButton.id;
                result = operate(singleOperator);
                displayResult();
            }
        });
    });

    const negativeButton = document.getElementById("negative");
    negativeButton.addEventListener("click", () => {
        if (number1FocusFlag) {
            number1 = negative(number1);
            refreshDisplay(number1);
        }
        if (number2FocusFlag) {
            number2 = negative(number2);
            refreshDisplay(number2);
        }
        helperDisplayVariables();
    });
};

// Helper functions
const activateOperator = (operatorID) => {
    clearActiveOperators();
    const operatorButton = document.getElementById(operatorID);
    operatorButton.classList.add("active");
};
const clearActiveOperators = () => {
    const allOperators = document.querySelectorAll(".operator");
    allOperators.forEach((operator) => operator.classList.remove("active"));
};
const clearDisplay = () => {
    number1 = "";
    number2 = "";
    operator = "";
    singleOperator = "";
    result = 0;
    display.textContent = "0";
    display.classList = "";
    shouldResetFlag = false;
    clearError();
    clearActiveOperators();
    resetFocus();
    resetDecimalPoint();
    resetSingleOperators();
};
const helperDisplayVariables = () => {
    if (debugMode) {
        console.log("🚀 ~ number1:", number1);
        console.log("🚀 ~ number2:", number2);
        console.log("🚀 ~ operator:", operator);
        console.log("🚀 ~ result:", result);
    }
};

init(); // Initialize the calculator
