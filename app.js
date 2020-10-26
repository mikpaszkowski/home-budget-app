

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
        budgetBalance: 0,
    };

    var calculateTotal = function(type){
        var sum = 0;
        
        data.allRecords[type].forEach(function(curr) {
            sum += curr.amount;
            console.log("sum : " + sum);
        })
        data.totals[type] = sum;
    };

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

        deleteItem: function(type, id){
            var index;
            console.log(id);
            var ids = data.allRecords[type].map(function(curr) {
                return curr.id;
            });
            console.log(ids);
            console.log(typeof(id));
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allRecords[type].splice(index, 1);
            }
        },


        calcualteBudget: function() {

            //income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //balance: income - expense
            data.budgetBalance = data.totals.inc - data.totals.exp;
        },

        getBudgetData: function() {
            return {
                budgetBalance: data.budgetBalance,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
            };
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
        totalIncomeLabel: '.total-income-value',
        totalExpensesLabel: '.total-expenses-value',
        totalBudgetBalanceLabel: '.balance-total-value',
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
                amount: parseFloat(document.querySelector(DOMelements.inputAmount).value),
                date: document.querySelector(DOMelements.inputDate).value,
                time: document.querySelector(DOMelements.inputTime).value,
                description: document.querySelector(DOMelements.inputDescription).value
            };
        },
        addListRecord: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                html = '<div class="record-inc-item" id="inc-record-%id%"><div class="head-of-record"><input type="checkbox" name="select"><div class="record-name">%des%</div></div><div class="date">%date%</div><div class="amount-container"><div class="amount-value">+%amount%</div><div class="delete-icon"><i class="ion-ios-close-outline hidden"></i></div></div></div>';
            } else if (type === 'exp') {
                html = '<div class="record-exp-item" id="exp-record-%id%"><div class="head-of-record"><input type = "checkbox" name = "select"><div class="record-name">%des%</div></div><div class="amount-container"><div class="amount-value">-%amount%</div><div class="delete-icon"><i class="ion-ios-close-outline hidden"></i></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%des%', obj.description);
            newHtml = newHtml.replace('%amount%', obj.amount);
            newHtml = newHtml.replace('%date%', obj.date);

            document.querySelector(DOMelements.recordContainerList).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteRecordListItem: function(id) {
            var itemToBeDeleted, parentElem;

            itemToBeDeleted = document.getElementById(id);
            itemToBeDeleted.parentNode.removeChild(itemToBeDeleted);
        },

        clearFields: function () {
            var fields;

            fields = document.querySelectorAll(
                DOMelements.inputAmount + ', '
                + DOMelements.inputAmount + ', '
                + DOMelements.inputDate + ', '
                + DOMelements.inputTime + ', '
                + DOMelements.inputDescription);

            //creating a copy of a list as a array
            var fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (cur) {
                cur.value = "";
            })
        },

        isFormValid: function (obj) {
            var isValid = true;

            if (obj.amount <= 0 || isNaN(obj.amount)) { isValid = false; }
            if (obj.category === "") { isValid = false; }
            if (obj.date === "") { isValid = false; }
            if (obj.time === "") { isValid = false; }
            if (obj.description === "") { isValid = false; }

            return isValid;
        },

        updateBudgetView: function(obj, type) {
            var beforeExpContent = '';

            if(obj.totalExpenses !== 0){
                beforeExpContent = '-  ';
            }

            document.querySelector(DOMelements.totalIncomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMelements.totalExpensesLabel).textContent = beforeExpContent + obj.totalExpenses;
            document.querySelector(DOMelements.totalBudgetBalanceLabel).textContent = obj.budgetBalance;

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
                e.preventDefault();
            }
        });

        document.querySelector(DOM.recordContainerList).addEventListener('click', deleteRecordItem);

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

            document.querySelector(DOMStyle.sectionMiddle).classList.add('animation-class');
            setTimeout(() => {
                document.querySelector(DOMStyle.sectionMiddle).style.display = 'none';
            }, 1000);
        })
    };

    var updateBudget = function (type) {

        //calculate te budget balance
        serviceController.calcualteBudget();

        //return the budget
        var budget = serviceController.getBudgetData();
        //displaying the budget on the front
        viewController.updateBudgetView(budget, type);
    }



    var addItemController = function () {

        var input, newRecord;

        //getting input data from front
        input = viewController.getInput();
        console.log(input);

        if (viewController.isFormValid(input)) {
            // 2. Add the item to the budget controller
            newRecord = serviceController.addItem(input.type, input.amount,
                input.category, input.date, input.time, input.description);
            serviceController.displayData();

            // 3. Add the item to the UI
            viewController.addListRecord(newRecord, input.type);

            // 4. Clear fields after adding record to the list 
            viewController.clearFields();

            serviceController.calcualteBudget();
            //Calculate and update budget
            updateBudget(input.type);
        }
    };

    var deleteRecordItem = function(e) {
        var recordId, derivedId, type, ID;

        recordId = e.target.parentNode.parentNode.parentNode.id;

        if(recordId){
            derivedId = recordId.split('-');
            type = derivedId[0];
            ID = parseInt(derivedId[2]);

            //function deleteing record from data structure
            serviceController.deleteItem(type, ID);

            //delete item from template
            viewController.deleteRecordListItem(recordId);

            //budget updated after deleting
            updateBudget(type);
        }
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