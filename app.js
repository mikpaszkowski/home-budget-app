

var serviceController = (function () {

    var Expense = function(id, amount, category, date, time, description){
        
        this.id = id;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.time = time;
        this.description = description;
    }
    var Income = function(id, amount, category, date, time, description){

        this.id = id;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.time = time;
        this.description = description;
    }
})();


var viewController = (function () {

    var DOMelements = {
        inputCategory: '.input_category',
        inputAmount: '.input_amount',
        inputDate: '.input_date',
        inputTime: '.input_time',
        inputDescription: '.input_description',
        recordBtn: '.btn-record',
        recordTypeContainer: '.record-type',
        typeBtnExpense: '.expense-btn',
        typeBtnIncome: '.income-btn',
        closeIconBtn: '.close-icon',
    }

    var DOMStyleElements = {
        incomeTypeContainer: 'record-type-container-income',
        expenseTypeContainer: 'record-type-container-expenses',
        expenseBtnActive: 'active-record-type-red',
        incomeBtnActive: 'active-record-type-green',
        sectionMiddle: '.middle',
    }

    return {
        getInput: function () {
            var typeButton = document.querySelector('.income-btn');
            if (typeButton.classList.contains('active-record-type-green')) {
                typeButton = '+';
            } else {
                typeButton = '-';
            }

            return {
                typeOfInputAmount: typeButton,
                category: document.querySelector(DOMelements.inputCategory).value,
                amount: document.querySelector(DOMelements.inputAmount).value,
                date: document.querySelector(DOMelements.inputDate).value,
                time: document.querySelector(DOMelements.inputTime).value,
                description: document.querySelector(DOMelements.inputDescription).value
            };
        },
        getDOMelements: function () {
            return DOMelements;
        },
        getDOMStyleElements: function () {
            return DOMStyleElements;
        }
    }


})();


var appController = (function () {

    var setUpEventListeners = function () {

        var DOM = viewController.getDOMelements();
        var DOMStyle = viewController.getDOMStyleElements();

        document.querySelector(DOM.recordBtn).addEventListener('click', addItemController);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 && e.which === 13) {
                addItemController();
            }
        });

        document.querySelector(DOM.typeBtnExpense).addEventListener('click', function () {

            document.querySelector(DOM.typeBtnExpense).classList.add(DOMStyle.expenseBtnActive);
            document.querySelector(DOM.typeBtnIncome).classList.remove(DOMStyle.incomeBtnActive);
            var recordTypes = document.querySelector(DOM.recordTypeContainer);
            recordTypes.classList.add(DOMStyle.expenseTypeContainer);
            recordTypes.classList.remove(DOMStyle.incomeTypeContainer);
        });

        document.querySelector(DOM.typeBtnIncome).addEventListener('click', function () {

            document.querySelector(DOM.typeBtnExpense).classList.remove(DOMStyle.expenseBtnActive);
            document.querySelector(DOM.typeBtnIncome).classList.add(DOMStyle.incomeBtnActive);
            var recordTypes = document.querySelector(DOM.recordTypeContainer);
            recordTypes.classList.remove(DOMStyle.expenseTypeContainer);
            recordTypes.classList.add(DOMStyle.incomeTypeContainer);
        })

        document.querySelector(DOM.closeIconBtn).addEventListener('click', function () {

            document.querySelector(DOMStyle.sectionMiddle).style.display = 'none';
        })
    }



    var addItemController = function () {

        //getting input data from front
        var input = viewController.getInput();

        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
    }

    return{
        init: function() {
            console.log('Application has started.');
            setUpEventListeners();
        }
    }

})(serviceController, viewController);


//initializing of controllers

appController.init();