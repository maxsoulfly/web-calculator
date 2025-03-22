const Calculator = (function () {
    const display = document.querySelector("#display"); // Get the display element

    const singleNumberOperations = [
        "square",
        "square-root",
        "reciprocal",
        "percent",
    ]; // Single number operations
    const clearButtons = ["clear-entry", "clear"]; // Clear buttons

    const debugMode = false; // Enable or disable debug mode

    const createCalculatorState = () => {
        let number1 = ""; // First number
        let number2 = ""; // Second number
        let operator = ""; // Operator for two-number operations
        let singleOperator = ""; // Operator for single-number operations
        let result = 0; // This will store the answer

        let flags = {
            singleOperator: false, // Flag to indicate if a single operator is in use
            error: false, // Flag to indicate if there is an error
            decimalPoint: false, // Flag to indicate if a decimal point has been used
            number1Focus: true, // Flag to indicate if the first number is in focus
            number2Focus: false, // Flag to indicate if the second number is in focus
            shouldReset: false, // Flag to determine if the next input should reset the calculator state
        };

        return {
            // operators
            getNumber1: () => number1,
            setNumber1: (value) => (number1 = value),

            getNumber2: () => number2,
            setNumber2: (value) => (number2 = value),

            getOperator: () => operator,
            setOperator: (value) => (operator = value),

            getSingleOperator: () => singleOperator,
            setSingleOperator: (value) => (singleOperator = value),

            getResult: () => result,
            setResult: (value) => (result = value),

            // flags
            getFlag: (key) => flags[key],
            setFlag: (key, value) => (flags[key] = value),
        };
    };

    const state = createCalculatorState();
    /*
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
    */

    // Basic arithmetic functions
    const add = (num1, num2) => parseFloat(num1) + parseFloat(num2);
    const subtract = (num1, num2) => parseFloat(num1) - parseFloat(num2);
    const multiply = (num1, num2) => parseFloat(num1) * parseFloat(num2);
    const divide = (num1, num2) => {
        num1 = parseFloat(num1);
        num2 = parseFloat(num2);
        if (num2 == 0) {
            state.setFlag("error", true);
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
    const removeFromNumber = (number) => {
        if (!isNumberEmpty(number)) {
            number = number.slice(0, -1);
            return isNumberEmpty(number) ? "0" : number;
        } else {
            return "0";
        }
    };
    const isNumberEmpty = (number) => {
        return (
            number === "" ||
            number === null ||
            number === undefined ||
            number === "0"
        );
    };

    // Display functions
    const displayError = () => display.classList.add("error");
    const clearError = () => {
        state.setFlag("error", false);
        display.classList.remove("error");
    };
    const displayResult = () => {
        clearActiveOperators();
        if (!isFloat(result)) displayError();
        display.textContent = state.getResult();

        state.setNumber1(state.getResult() == 0 ? "" : state.getResult());
        state.setNumber2("");
        state.setOperator("");
    };
    const refreshDisplay = (number) => (display.textContent = number);
    const clearEntry = () => {
        if (state.getFlag("number1Focus")) {
            state.setNumber1(0);
            refreshDisplay(state.getNumber1());
        } else {
            state.setNumber2(0);
            refreshDisplay(state.getNumber2());
        }

        helperDisplayVariables();
    };

    const clearDisplay = () => {
        state.setNumber1("");
        state.setNumber2("");
        state.setOperator("");
        state.setSingleOperator("");
        state.setResult(0);

        display.textContent = "0";
        display.classList = "";

        state.setFlag("shouldReset", false);
        clearError();
        clearActiveOperators();
        resetFocus();
        resetDecimalPoint();
        resetSingleOperators();
        helperDisplayVariables();
    };

    // Focus and flag management functions
    const toggleFlag = (key) => state.setFlag(key, !state.getFlag(key));
    const toggleFocus = () => {
        toggleFlag("number1Focus");
        toggleFlag("number2Focus");
        toggleFlag("decimalPoint");
        toggleFlag("singleOperator");
    };
    const resetFocus = () => {
        state.setFlag("number1Focus", true);
        state.setFlag("number2Focus", false);
    };
    const resetSingleOperators = () => state.setFlag("singleOperator", false);
    const resetDecimalPoint = () => state.setFlag("decimalPoint", false);

    // Operation functions
    const operate = (operator) => {
        let num1 = state.getNumber1();
        let num2 = state.getNumber2();
        if (isNumberEmpty(num1)) {
            state.setNumber1(0); // updates the state
            num1 = 0; // updates the local copy
        }
        if (isNumberEmpty(num2)) {
            state.setNumber2(0);
            num2 = 0;
        }

        switch (operator) {
            case "add":
                return add(num1, num2);
            case "subtract":
                return subtract(num1, num2);
            case "multiply":
                return multiply(num1, num2);
            case "divide":
                return divide(num1, num2);
            case "square":
                return square(num1);
            case "square-root":
                return squareRoot(num1);
            case "reciprocal":
                return reciprocal(num1);
            default:
                state.setFlag("error", true);
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

    const handleEqualsButton = () => {
        let num1 = state.getNumber1();
        let num2 = state.getNumber2();

        if (
            state.getFlag("number1Focus") &&
            (isNumberEmpty(num1) || isNumberEmpty(num2))
        ) {
            display.textContent = isNumberEmpty(num1) ? 0 : num1;
        } else {
            result = operate(state.getOperator());
            displayResult();
            toggleFocus();
            state.setFlag("shouldReset", true);
        }
    };

    const handleOperatorButton = (operatorId) => {
        const currentOperator = state.getOperator();
        const number2Focus = state.getFlag("number2Focus");
        const number2 = state.getNumber2();

        if (currentOperator !== "" && number2Focus && !isNumberEmpty(number2)) {
            state.setResult(operate(currentOperator));
            displayResult();
            state.setFlag("shouldReset", true);
        }

        state.setOperator(operatorId);
        activateOperator(operatorId);
        toggleFocus();
        resetDecimalPoint();
    };

    const handleDeleteButton = () => {
        const isNumber1 = state.getFlag("number1Focus");

        const get = isNumber1 ? state.getNumber1 : state.getNumber2;
        const set = isNumber1 ? state.setNumber1 : state.setNumber2;

        const updated = removeFromNumber(get());
        set(updated);
        refreshDisplay(updated);
    };

    const handleClearButtons = (operatorID) => {
        if (operatorID === "clear") {
            clearDisplay();
        } else if (operatorID === "clear-entry") {
            clearEntry();
        }
    };

    const activateOperator = (operatorID) => {
        clearActiveOperators();
        const operatorButton = document.getElementById(operatorID);
        operatorButton.classList.add("active");
    };
    const clearActiveOperators = () => {
        const allOperators = document.querySelectorAll(".operator");
        allOperators.forEach((operator) => operator.classList.remove("active"));
    };

    // Initialization function
    const init = () => {
        const numberButtons = document.querySelectorAll(".number");
        numberButtons.forEach((numberButton) => {
            numberButton.addEventListener("click", () => {
                if (!state.getFlag("error")) {
                    const isNumber1 = state.getFlag("number1Focus");
                    const get = isNumber1 ? state.getNumber1 : state.getNumber2;
                    const set = isNumber1 ? state.setNumber1 : state.setNumber2;

                    if (isNumber1 && state.getFlag("shouldReset")) {
                        clearDisplay();
                        state.setFlag("shouldReset", false);
                    }

                    const updatedValue = appendToNumber(get(), numberButton);
                    set(updatedValue);

                    helperDisplayVariables();
                }
            });

        const operators = document.querySelectorAll(".operator");
        operators.forEach((operatorButton) => {
            operatorButton.addEventListener("click", () => {
            if (debugMode) console.log("operatorButton.id", operatorButton.id);
            if (clearButtons.includes(operatorButton.id)) {
                handleClearButtons(operatorButton.id);
            } else if (operatorButton.id === "delete") {
                handleDeleteButton();
            } else if (!state.getFlag("error")) {
                if (operatorButton.id === "equals") {
                handleEqualsButton();
                } else {
                handleOperatorButton(operatorButton.id);
                }
                helperDisplayVariables();
            }
            });
        });

        const singleOperators = document.querySelectorAll(".single-operator");
        singleOperators.forEach((operatorButton) => {
            operatorButton.addEventListener("click", () => {
            if (debugMode)
                console.log("operatorButton.id", operatorButton.id);
            if (singleNumberOperations.includes(operatorButton.id)) {
                
                state.setSingleOperator(operatorButton.id);
                let result = operate(state.getSingleOperator());
                state.setResult(result);
                displayResult();
            }
            helperDisplayVariables();
            });
        });

        const negativeButton = document.getElementById("negative");
        negativeButton.addEventListener("click", () => {

            const isNumber1 = state.getFlag("number1Focus");
            const get = isNumber1 ? state.getNumber1 : state.getNumber2;
            const set = isNumber1 ? state.setNumber1 : state.setNumber2;
            const current = get();

            set(!isNumberEmpty(current) ? negative(current) : 0);

            refreshDisplay(get());

            helperDisplayVariables();
        });
    }); 

    // Helper functions
    const helperDisplayVariables = () => {
        if (debugMode) {
            console.log("🚀 ~ number1:", state.getNumber1());
            console.log("🚀 ~ number2:", state.getNumber2());
            console.log("🚀 ~ operator:", state.getOperator());
            console.log("🚀 ~ result:", state.getResult());
        }
    };

    return {
        init, // expose only init()
    };
})();

Calculator.init(); // Initialize the calculator
