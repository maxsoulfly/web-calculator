const display = document.querySelector("#display"); // Get the display element

const singleNumberOperations = ["square", "square-root", "reciprocal"]; // Single number operations
const clearButtons = ["clear-entry", "clear"]; // Clear buttons

const debugMode = true; // Enable or disable debug mode

let number1 = ""; // First number
let number2 = ""; // Second number
let operator = ""; // Operator
let result = ""; // This will store the answer

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

const reciprocal = (num) => {
    num = parseFloat(num);
    return 1 / num;
};

const negative = (num) => {
    num = parseFloat(num);
    return -num;
};

// Function to operate on two numbers with an operator
const operate = () => {
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

const switchNumberFocus = () => {
    number1FocusFlag = !number1FocusFlag;
    number2FocusFlag = !number2FocusFlag;
    decimalPointFlag = false;
};

const resetFocus = () => {
    number1FocusFlag = true;
    number2FocusFlag = false;
};

// Function to check if a value is a float
const isFloat = (value) => {
    return typeof value === "number";
};

const appendToNumber = (number, value) => {
    if (value === ".") {
        if (!decimalPointFlag) {
            // Check if a decimal point has been used
            number += value;
            decimalPointFlag = true;
        }
    } else {
        // Append number to the first number
        number += value;
        display.textContent = number;
    }
    return number;
};

const handleEquals = () => {
    if (
        (number1FocusFlag && number1 === "") ||
        (number1FocusFlag && number2 === "")
    ) {
        if (number1 === "") display.textContent = 0;
        else display.textContent = number1;
    } else {
        result = operate();
        displayResult(); // Display the result
        switchNumberFocus(); // Switch focus to the second number
    }
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
                    number1 = appendToNumber(number1, numberButton.textContent);
                } else if (number2FocusFlag) {
                    number2 = appendToNumber(number2, numberButton.textContent);
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
                } else if (
                    singleNumberOperations.includes(operatorButton.id) &&
                    number1FocusFlag
                ) {
                    // Handle single number operations
                    operator = operatorButton.id;
                    result = operate();
                    activateOperator(operator); // Highlight the operator button
                    displayResult(); // Display the result
                } else {
                    if (operator === "") {
                        operator = operatorButton.id;
                    } else {
                        result = operate();
                        displayResult(); // Display the result
                    }
                    switchNumberFocus(); // Switch focus to the second number
                    activateOperator(operator); // Highlight the operator button
                }
                helperDisplayVariables(); // Log variables for debugging
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

        helperDisplayVariables(); // Log variables for debugging
    });
};

// Function to display error message
const displayError = () => {
    display.classList.add("error");
};

// Function to clear error and reset variables
const clearError = () => {
    number1 = "";
    number2 = "";
    operator = "";
    result = "";

    resetFocus(); // Reset focus to the first number

    errorFlag = false; // Reset error flag
    decimalPointFlag = false; // Reset decimal point flag

    display.textContent = "0";
    display.classList = "";
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
    result = "";
    display.textContent = "0";
    display.classList = "";
    clearError(); // Clear error
    clearActiveOperators(); // Clear active operator buttons
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
