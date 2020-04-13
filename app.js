// /////////////////////////////////////////////////////////////////////
// BUDGET CONTROLLER
////////////////////////////////////////////////////////////////////////
var budgetController = (() => {
  // some code
  var Expense = (id, description, value) => {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = (id, description, value) => {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = (type) => {
    var sum = 0;

    data.allItems[type].forEach((cur) => {
      sum += cur.value;
    });

    data.totals[type] = sum;
  };

  var calculateBudget = () => {
    // calculate total income and expenses
    calculateTotal("exp");
    calculateTotal("inc");
    // calculate the budget income - expenes
    data.budget = data.totals.inc - data.totals.exp;
    // calculate the percentage of income that we spent
    if (data.totals.inc > 0) {
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
      data.percentage = -1;
    }
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  var addItem = (type, des, val) => {
    var newItem, ID;

    // create new ID
    ID =
      data.allItems[type].length > 0
        ? (ID = data.allItems[type][data.allItems[type].length - 1].id + 1)
        : 0;

    // create new item based on 'inc' or 'exp' type
    if (type === "exp") {
      newItem = new Expense(ID, des, val);
    } else if (type === "inc") {
      newItem = new Income(ID, des, val);
    }

    // push it into our data structure
    data.allItems[type].push(newItem);

    //return the new element
    return newItem;
  };

  var getBudget = () => {
    return {
      budget: data.budget,
      totalInc: data.totals.inc,
      totalExp: data.totals.exp,
      percentage: data.percentage,
    };
  };

  // just for debbuging
  var testing = () => {
    console.log(data);
  };

  return {
    addItem,
    testing,
    calculateBudget,
    getBudget,
  };
})();

///////////////////////////////////////////////////////////////////////
// UI CONTROLLER'
///////////////////////////////////////////////////////////////////////
var UIController = (() => {
  // SETTING A PRIVATE DATA

  // centralize your DOM data's input for an easier future's changes
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
  };

  // SETTING A PRIVATE'S METHODS

  // return an objet with DOM's inputs
  var getInput = () => {
    return {
      type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
      description: document.querySelector(DOMstrings.inputDescription).value,
      value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
    };
  };

  var addListItem = (obj, type) => {
    var html, element;
    // create hmtl string with placeholder text
    if (type === "inc") {
      element = DOMstrings.incomeContainer;

      html = `<div class="item clearfix" id="income-${obj.id}">
              <div class="item__description">${obj.description}</div>
              <div class="right clearfix">
                <div class="item__value">+ ${obj.value}</div>
                <div class="item__delete">
                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
              </div>
            </div>`;
    } else if (type === "exp") {
      element = DOMstrings.expensesContainer;

      html = `<div class="item clearfix" id="expense-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                  <div class="item__value">- ${obj.value}</div>
                  <div class="item__percentage">21%</div>
                    <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
              </div>`;
    }

    // replace the placeholder text with some actual data
    // i don't use this, because i use javascript template to avoid it

    // insert the html into the dom
    document.querySelector(element).insertAdjacentHTML("beforeend", html);
  };

  // return centralize DOM's Strings
  var getDOMstrings = () => {
    return DOMstrings;
  };

  var clearFields = () => {
    var fields, fieldArr;
    const { inputDescription, inputValue } = DOMstrings;

    fields = document.querySelectorAll(`${inputDescription}, ${inputValue}`);

    // this convert fields's list into array
    fieldArr = Array.prototype.slice.call(fields);

    fieldArr.forEach((element) => (element.value = ""));
    fieldArr[0].focus();
  };

  var displayBudget = (obj) => {
    document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
    document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
    document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

    if (obj.percentage > 0) {
      document.querySelector(DOMstrings.percentageLabel).textContent =
        obj.percentage + "%";
    } else {
      document.querySelector(DOMstrings.percentageLabel).textContent = "---";
    }
  };

  // RETURNS DATA'S EXPOSES
  return {
    getInput,
    addListItem,
    getDOMstrings,
    clearFields,
    displayBudget,
  };
})();

///////////////////////////////////////////////////////////////////////
// GLOBAL APP CONTROLLER
//////////////////////////////////////////////////////////////////////
var controller = ((budgetCtrl, UICtrl) => {
  // setup to handle EventListeners actions
  var setupEventListeners = () => {
    //select centralize DOM
    var DOM = UICtrl.getDOMstrings();

    // execute something when the button was clicked
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    // execute something when the Enter was pressed
    document.addEventListener("keypress", (e) => {
      //   wich property is for the browser that don't have keyCode
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var updateBudget = () => {
    var budget;

    // 1. calcular el budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    budget = budgetCtrl.getBudget();
    // 3. mostrar el budget on the ui
    UICtrl.displayBudget(budget);
  };

  // setup to handle DOM's data
  var ctrlAddItem = () => {
    var input, newItem;

    // 1. agarrar los datos del dom
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. agregar el item a budgetController
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. agregar el item a UIController
      UICtrl.addListItem(newItem, input.type);

      // 4. clear fields
      UICtrl.clearFields();

      // 5. calculate and update de budget
      updateBudget();
    }
  };

  return {
    init: () => {
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });

      setupEventListeners();

      console.log("Application has started...");
    },
  };
})(budgetController, UIController);

// Start the app
controller.init();
