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

			reset: () => {
				number1 = "";
				number2 = "";
				operator = "";
				singleOperator = "";
				result = 0;
				flags = {
					singleOperator: false,
					error: false,
					decimalPoint: false,
					number1Focus: true,
					number2Focus: false,
					shouldReset: false,
				};
			},
		};
	};

	const state = createCalculatorState();

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
		const result = state.getResult();
		clearActiveOperators();
		if (!isFloat(result)) displayError();
		display.textContent = result;

		state.setNumber1(result == 0 ? "" : result);
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
		state.reset();
		display.textContent = "0";
		display.classList = "";
		clearActiveOperators();
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
			if (!state.getFlag("decimalPoint")) {
				number += button.textContent;
				display.textContent = number;
				toggleFlag("decimalPoint");
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
			const result = operate(state.getOperator());
			state.setResult(result);
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
		const { get, set } = getActiveNumberHandlers();

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

	const getActiveNumberHandlers = () => {
		const isNumber1 = state.getFlag("number1Focus");
		return {
			get: isNumber1 ? state.getNumber1 : state.getNumber2,
			set: isNumber1 ? state.setNumber1 : state.setNumber2,
		};
	};

	// Initialization function
	const init = () => {
		const numberButtons = document.querySelectorAll(".number");
		numberButtons.forEach((numberButton) => {
			numberButton.addEventListener("click", () => {
				if (state.getFlag("error")) return;

				const { get, set } = getActiveNumberHandlers();

				if (
					state.getFlag("number1Focus") &&
					state.getFlag("shouldReset")
				) {
					clearDisplay();
					state.setFlag("shouldReset", false);
				}

				const updatedValue = appendToNumber(get(), numberButton);
				set(updatedValue);

				helperDisplayVariables();
			});
		});
		const operators = document.querySelectorAll(".operator");
		operators.forEach((operatorButton) => {
			operatorButton.addEventListener("click", () => {
				if (debugMode)
					console.log("operatorButton.id", operatorButton.id);
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
			const { get, set } = getActiveNumberHandlers();
			const current = get();

			set(!isNumberEmpty(current) ? negative(current) : 0);

			refreshDisplay(get());

			helperDisplayVariables();
		});
	};

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
