// /////////////////////////////////////////////////////////////////////
// BUDGET CONTROLLER
////////////////////////////////////////////////////////////////////////
var budgetController = (function () {
  // some code
})();

///////////////////////////////////////////////////////////////////////
// UI CONTROLLER'
///////////////////////////////////////////////////////////////////////
var UIController = (function () {
  // SETTING A PRIVATE DATA

  // centralize your DOM data's input for an easier future's changes
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
  };

  // SETTING A PRIVATE'S METHODS

  // return an objet with DOM's inputs
  var getInput = function () {
    return {
      type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
      description: document.querySelector(DOMstrings.inputDescription).value,
      value: document.querySelector(DOMstrings.inputValue).value,
    };
  };

  // return centralize DOM's Strings
  var getDOMstrings = function () {
    return DOMstrings;
  };

  // RETURNS DATA'S EXPOSES
  return {
    getInput,
    getDOMstrings,
  };
})();

///////////////////////////////////////////////////////////////////////
// GLOBAL APP CONTROLLER
//////////////////////////////////////////////////////////////////////
var controller = (function (budgetCtrl, UICtrl) {
  // setup to handle EventListeners actions
  var setupEventListeners = function () {
    //select centralize DOM
    var DOM = UICtrl.getDOMstrings();

    // execute something when the button was clicked
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    // execute something when the Enter was pressed
    document.addEventListener("keypress", function (e) {
      //   wich property is for the browser that don't have keyCode
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  // setup to handle DOM's data
  var ctrlAddItem = function () {
    // 1. agarrar los datos del dom
    var input = UICtrl.getInput();
    console.log(input);
    // 2. agregar el item a budgetController
    // 3. agregar el item a UIController
    // 4. calcular el budget
    // 5. mostrar el budget on the ui
  };

  return {
    init: function () {
      console.log("Application has started...");
      setupEventListeners();
    },
  };
})(budgetController, UIController);

// Start the app
controller.init();
