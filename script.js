const display = document.querySelector("#display"); // Get the display element

const singleNumberOperations = ["square", "square-root", "reciprocal"]; // Single number operations
const clearButtons = ["clear-entry", "clear"]; // Clear buttons

const debugMode = true; // Enable or disable debug mode

let number1 = ""; // First number
let number2 = ""; // Second number
let operator = ""; // Operator for two-number operations
let singleOperator = ""; // Operator for single-number operations
let result = ""; // This will store the answer

let singleOperatorFlag = false; // Flag to indicate if a single operator is in use
let errorFlag = false; // Flag to indicate if there is an error
let decimalPointFlag = false; // Flag to indicate if a decimal point has been used
let number1FocusFlag = true; // Flag to indicate if the first number is in focus
let number2FocusFlag = false; // Flag to indicate if the second number is in focus

// Function to add two numbers
const add = (num1, num2) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    return num1 + num2;
};

// Function to subtract the second number from the first
const subtract = (num1, num2) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    return num1 - num2;
};

// Function to multiply two numbers
const multiply = (num1, num2) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    return num1 * num2;
};

// Function to divide the first number by the second
const divide = (num1, num2) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    if (num2 == 0) {
        errorFlag = true;
        return "WTF you're trying to do?"; // Error message for division by zero
    }
    return num1 / num2;
};

// Function to square a number
const square = (num) => {
    num = parseFloat(num);
    return num * num;
};

// Function to calculate the square root of a number
const squareRoot = (num) => {
    num = parseFloat(num);
    return Math.sqrt(num);
};

// Function to calculate the reciprocal of a number
const reciprocal = (num) => {
    num = parseFloat(num);
    return 1 / num;
};

// Function to negate a number
const negative = (num) => {
    num = parseFloat(num);
    return -num;
};

// Function to operate on two numbers with an operator
const operate = (operator) => {
    if (number1 === "") number1 = 0; // If the first number is empty, set it to 0
    if (number2 === "") number2 = 0; // If the second number is empty, set it to 0

    if (operator == "add") return add(number1, number2);
    else if (operator == "subtract") return subtract(number1, number2);
    else if (operator == "multiply") return multiply(number1, number2);
    else if (operator == "divide") return divide(number1, number2);
    else if (operator == "square") return square(number1);
    else if (operator == "square-root") return squareRoot(number1);
    else if (operator == "reciprocal") return reciprocal(number1);
    else {
        errorFlag = true;
        return "ERROR: Wrong operation"; // Error message for invalid operation
    }
};

// Function to toggle focus between number1 and number2
const toggleFocus = () => {
    number1FocusFlag = !number1FocusFlag;
    number2FocusFlag = !number2FocusFlag;
    toggledecimalPoint(); // Toggle decimal point
    toggleSingleOperators(); // Toggle single number operators
};

// Function to reset focus to number1
const resetFocus = () => {
    number1FocusFlag = true;
    number2FocusFlag = false;
};

// Function to toggle single number operators
const toggleSingleOperators = () => {
    singleOperatorFlag = !singleOperatorFlag;
};

// Function to toggle single number operators
const resetSingleOperators = () => {
    singleOperatorFlag = false;
};

// Function to toggle decimal point button
const toggledecimalPoint = () => {
    decimalPointFlag = !decimalPointFlag;
};

// Function to toggle decimal point button
const resetdecimalPoint = () => {
    decimalPointFlag = false;
};

// Function to check if a value is a float
const isFloat = (value) => {
    return typeof value === "number";
};

// Function to append a number or decimal point to the current number
const appendToNumber = (number, button) => {
    if (button.textContent === ".") {
        if (!decimalPointFlag) {
            // Check if a decimal point has been used
            number += button.textContent;
            toggledecimalPoint(); // Toggle decimal point
        }
    } else {
        // Append number to the first number
        number += button.textContent;
        display.textContent = number;
    }
    return number;
};

// Function to handle the equals button click
const handleEquals = () => {
    if (
        (number1FocusFlag && number1 === "") ||
        (number1FocusFlag && number2 === "")
    ) {
        if (number1 === "") display.textContent = 0;
        else display.textContent = number1;
    } else {
        result = operate(operator);
        displayResult(); // Display the result
        toggleFocus(); // Switch focus to the second number
    }
};

// Function to handle operator button click
const handleOperatorClick = (operatorId) => {
    if (operator === "") {
        operator = operatorId;
    } else {
        result = operate(operator);
        displayResult(); // Display the result
    }
    toggleFocus(); // Switch focus to the second number
    resetdecimalPoint();
    activateOperator(operator); // Highlight the operator button
};

// Function to initialize the calculator
const init = () => {
    // Initialize number buttons
    const numberButtons = document.querySelectorAll(".number");

    numberButtons.forEach((numberButton) => {
        numberButton.addEventListener("click", () => {
            if (!errorFlag) {
                // Append number to the appropriate variable
                if (number1FocusFlag) {
                    number1 = appendToNumber(number1, numberButton);
                } else if (number2FocusFlag) {
                    number2 = appendToNumber(number2, numberButton);
                }

                helperDisplayVariables(); // Log variables for debugging
            }
        });

        return numberButton;
    });

    // Initialize operator buttons
    const operators = document.querySelectorAll(".operator");
    operators.forEach((operatorButton) => {
        operatorButton.addEventListener("click", () => {
            if (debugMode) console.log("operatorButton.id", operatorButton.id); // debug mode

            if (clearButtons.includes(operatorButton.id)) {
                clearDisplay(); // Clear the display
            } else if (!errorFlag) {
                if (operatorButton.id === "equals") {
                    handleEquals();
                } else {
                    handleOperatorClick(operatorButton.id);
                }
                helperDisplayVariables(); // Log variables for debugging
            }
        });
    });

    // Initialize single operator buttons
    const singleOperators = document.querySelectorAll(".single-operator");
    singleOperators.forEach((operatorButton) => {
        operatorButton.addEventListener("click", () => {
            if (debugMode) console.log("operatorButton.id", operatorButton.id); // debug mode

            if (
                singleNumberOperations.includes(operatorButton.id) &&
                number1FocusFlag
            ) {
                // Handle single number operations
                singleOperator = operatorButton.id;
                result = operate(singleOperator);
                displayResult(); // Display the result
            }
        });
    });

    // Initialize negative button
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

        helperDisplayVariables(); // Log variables for debugging
    });
};

// Function to display error message
const displayError = () => {
    display.classList.add("error");
};

// Function to clear error and reset variables
const clearError = () => {
    errorFlag = false; // Reset error flag
    display.classList.remove("error");
};

// Function to display the result
const displayResult = () => {
    clearActiveOperators(); // Clear active operator buttons
    if (!isFloat(result)) displayError(); // Display error if result is not a float
    display.textContent = result;
    if (result == 0) number1 = ""; // Set the first number to empty
    else number1 = result; // Set the result as the first number for the next operation
    number2 = "";
    operator = "";
};

// Function to refresh the display with the current number
const refreshDisplay = (number) => {
    display.textContent = number;
};

// Function to highlight the active operator button
const activateOperator = (operatorID) => {
    clearActiveOperators(); // Clear active operator buttons
    const operatorButton = document.getElementById(operatorID);
    operatorButton.classList.toggle("active");
};

// Function to clear active operator buttons
const clearActiveOperators = () => {
    const allOperators = document.querySelectorAll(".operator");
    allOperators.forEach((operator) => operator.classList.remove("active"));
};

// Function to clear the display and reset variables
const clearDisplay = () => {
    number1 = "";
    number2 = "";
    operator = "";
    singleOperator = "";
    result = "";
    display.textContent = "0";
    display.classList = "";

    clearError(); // Clear error
    clearActiveOperators(); // Clear active operator buttons

    resetFocus(); // Reset focus to the first number
    resetdecimalPoint(); // Reset decimal point
    resetSingleOperators(); // Reset single number operators
};

// Function to clear the last entry
const clearEntry = () => {
    clearError(); // Clear error
};

// Helper function to log variables for debugging
const helperDisplayVariables = () => {
    if (debugMode) {
        console.log("🚀 ~ number1:", number1);
        console.log("🚀 ~ number2:", number2);
        console.log("🚀 ~ operator:", operator);
        console.log("🚀 ~ result:", result);
    }
};

init(); // Initialize the calculator
