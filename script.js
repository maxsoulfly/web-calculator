const display = document.querySelector('#display');

let number1='';
let number2='';
let operator='';
let result; // This will store the answer

// Function to add two numbers
const add = (num1, num2) => {
    num1=parseInt(num1);
    num2=parseInt(num2);
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
    if (num2 == 0) return "ERROR: Cannot divide by zero";
    return num1 / num2;
}

// Function to operate on two numbers with an operator
const operate = (num1, num2, operator) => {
    if (operator == 'add') return add(num1, num2);
    else if (operator == 'subtract') return subtract (num1, num2);
    else if (operator == 'multiply') return multiply (num1, num2);
    else if (operator == 'divide') return divide (num1, num2);
    else return "ERROR: Wrong operation";
}

const init = () => {
    // initialize number buttons
    const numberButtons = document.querySelectorAll('.number');

    numberButtons.forEach(numberButton=>{
        numberButton.addEventListener('click', ()=>{
            if (operator == '') {
                number1 += numberButton.textContent;
                display.textContent = number1;

            }
            else {
                number2 += numberButton.textContent;
                display.textContent = number2;
            }
            helperDisplayVariables();
        });

        return numberButton;
    });

    // initialize operators
    const operators = document.querySelectorAll('.operator');

    operators.forEach(operatorButton =>{
        operatorButton.addEventListener('click', ()=>{
            // operate
            if (operatorButton.id === 'equals') {
                result = operate(number1,number2, operator);
                displayOperator(operatorButton.id);
                if (result.includes('ERROR')) displayError();
                number1 = result;
            }
            else{
                operator = operatorButton.id;
                displayOperator(operator);
            }
            helperDisplayVariables();
        });
        
        return operatorButton;
    });


}

const displayError = () =>{
    console.error("error");
    display.classList.add('error');
}

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
        case 'clear':
            clearDisplay();
            break;
        default:
            break;
    }
}

const clearDisplay = () => {
    number1='';
    number2='';
    operator='';
    result='';
    
    display.textContent = '0';
    display.classList = '';
}
const clearEntry = () => {
    if (number1 != '' && number2 =='') {
        number1='';
    } else {
        number2='';
    }
    
    display.textContent = '0';
}

const helperDisplayVariables = () => {
    
    console.log("🚀 ~ number1:", number1);
    console.log("🚀 ~ number2:", number2);
    console.log("🚀 ~ operator:", operator);
}

init();
