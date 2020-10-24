

var serviceController = (function () {

    var Expense = function (id, amount, category, date, time, description) {

        this.id = id;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.time = time;
        this.description = description;
    }
    var Income = function (id, amount, category, date, time, description) {

        this.id = id;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.time = time;
        this.description = description;
    }

    var data = {
        allRecords: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
    }

    return {
        addItem: function (type, amount, cat, date, time, des) {
            var newRecord, id;

            if (data.allRecords[type].length > 0) {
                id = data.allRecords[type][data.allRecords[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            if (type === 'inc') {
                newRecord = new Income(id, amount, cat, date, time, des);
            } else if (type === 'exp') {
                newRecord = new Expense(id, amount, cat, date, time, des);
            }
            data.allRecords[type].push(newRecord);
            return newRecord;
        },
        displayData: function () {
            console.log(data.allRecords);
        }
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
        recordContainerList: '.record-list',
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
                typeButton = 'inc';
            } else {
                typeButton = 'exp';
            }

            return {
                type: typeButton,
                category: document.querySelector(DOMelements.inputCategory).value,
                amount: document.querySelector(DOMelements.inputAmount).value,
                date: document.querySelector(DOMelements.inputDate).value,
                time: document.querySelector(DOMelements.inputTime).value,
                description: document.querySelector(DOMelements.inputDescription).value
            };
        },
        addListRecord: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                html = '<div class="record-income-item" id="income-record-%id%"><div class="head-of-record"><input type="checkbox" name="select"><div class="record-name">%des%</div></div><div class="amount-container"><div class="amount-value">+%amount%</div><div class="delete-icon"><i class="ion-ios-close-outline hidden"></i></div></div></div>';
            } else if (type === 'exp') {
                html = '<div class="record-expense-item" id="expense-record-%id%"><div class="head-of-record"><input type = "checkbox" name = "select"><div class="record-name">%des%</div></div><div class="amount-container"><div class="amount-value">-%amount%</div><div class="delete-icon"><i class="ion-ios-close-outline hidden"></i></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%des%', obj.description);
            newHtml = newHtml.replace('%amount%', obj.amount);

            document.querySelector(DOMelements.recordContainerList).insertAdjacentHTML('beforeend', newHtml);

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

        var input, newRecord;

        //getting input data from front
        input = viewController.getInput();
        console.log(input);

        // 2. Add the item to the budget controller
        newRecord = serviceController.addItem(input.type, input.amount,
            input.category, input.date, input.time, input.description);
        serviceController.displayData();

        // 3. Add the item to the UI
        viewController.addListRecord(newRecord, input.type);

        // 4. Calculate the budget
        // 5. Display the budget on the UI
    }

    return {
        init: function () {
            console.log('Application has started.');
            setUpEventListeners();
        }
    }

})(serviceController, viewController);


//initializing of controllers

appController.init();