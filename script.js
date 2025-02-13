
let number1;
let number2;
let operator;

// Function to add two numbers
const add = (num1, num2) => {
    return num1 + num2;
}

// Function to subtract the second number from the first
const subtract = (num1, num2) => {
    return num1 - num2;
}

// Function to multiply two numbers
const multiply = (num1, num2) => {
    return num1 * num2;
}

// Function to divide the first number by the second
const divide = (num1, num2) => {
    return num1 / num2;
}

// Function to operate on two numbers with an operator
const operate = (num1, num2, operator) => {
    if (operator == '+') return add(num1, num2);
    else if (operator == '-') return subtract (num1, num2);
    else if (operator == '*') return multiply (num1, num2);
    else if (operator == '/') return divide (num1, num2);
    else return "ERROR: Wrong operation";
}


