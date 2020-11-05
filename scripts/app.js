

var serviceController = (function () {

    class Expense {

        constructor(id, amount, category, date, time, description) {
            this.id = id;
            this.amount = amount;
            this.category = category;
            this.date = date;
            this.time = time;
            this.description = description;
            this.percentage = -1;
        }

        calculatePercentage(totalIncomeValue) {
            if (totalIncomeValue > 0) {
                this.percentage = Math.round((this.amount / totalIncomeValue) * 100);
            }
        }
        getPercentage() { return this.percentage; }
    }

    class Income {
        constructor(id, amount, category, date, time, description) {
            this.id = id;
            this.amount = amount;
            this.category = category;
            this.date = date;
            this.time = time;
            this.description = description;
        }
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
        percentageOfExp: 0,
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allRecords[type].forEach(curr => sum += curr.amount);
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

        deleteItem: function (type, id) {

            var index;
            var ids = data.allRecords[type].map(function (curr) {
                return curr.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allRecords[type].splice(index, 1);
            }
        },

        calcualteBudget: function () {

            //income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //balance: income - expense
            data.budgetBalance = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentageOfExp = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentageOfExp = -1;
            }
        },

        calculatePercentages: function () {

            data.allRecords.exp.forEach(function (curr) {
                curr.calculatePercentage(data.totals.inc);
            })
        },

        getPercentages: function () {

            var allPercentages = data.allRecords.exp.map(function (curr) {

                return curr.getPercentage();
            });
            return allPercentages;
        },

        getBudgetData: function () {
            return {
                percentage: data.percentageOfExp,
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
        percentageTotal: '.percentage-value',
        dateHeadlineContent: '.date-headline-month',
    }

    var DOMStyleElements = {
        incomeTypeContainer: 'record-type-container-income',
        expenseTypeContainer: 'record-type-container-expenses',
        expenseBtnActive: 'active-record-type-red',
        incomeBtnActive: 'active-record-type-green',
        sectionMiddle: '.middle',
    }


    var formatNumber = function (num, type) {
        var numSplit, int, dec, sign;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

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
                html = '<div class="record-inc-item" id="inc-record-%id%"><div class="head-of-record"><input type="checkbox" name="select"><div class="record-name">%des%</div></div><div class="date">%date%</div><div class="amount-container"><div class="amount-value">%amount%</div><div class="delete-icon"><i class="ion-ios-close-outline hidden"></i></div></div></div>';
            } else if (type === 'exp') {
                html = '<div class="record-exp-item" id="exp-record-%id%"><div class="head-of-record"><input type = "checkbox" name = "select"><div class="record-name">%des%</div></div><div class="date">%date%</div><div class="amount-container"><div class="amount-value">%amount%</div><div class="delete-icon"><i class="ion-ios-close-outline hidden"></i></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%des%', obj.description);
            newHtml = newHtml.replace('%amount%', formatNumber(obj.amount, type));
            newHtml = newHtml.replace('%date%', obj.date);

            document.querySelector(DOMelements.recordContainerList).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteRecordListItem: function (id) {
            var itemToBeDeleted, parentElem;

            itemToBeDeleted = document.getElementById(id);
            itemToBeDeleted.parentNode.removeChild(itemToBeDeleted);
        },

        clearFields: function () {
            var fields;

            fields = document.querySelectorAll(
                DOMelements.inputAmount + ', '
                + DOMelements.inputCategory + ', '
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

        updateBudgetView: function (obj) {
            var type;

            obj.budgetBalance > 0 ? type = 'inc' : 'exp';

            document.querySelector(DOMelements.totalIncomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMelements.totalExpensesLabel).textContent = formatNumber(obj.totalExpenses, 'exp')
            document.querySelector(DOMelements.totalBudgetBalanceLabel).textContent = formatNumber(obj.budgetBalance, type);
            document.querySelector(DOMelements.percentageTotal).textContent = formatNumber(obj.percentage, 'exp') + '%';
        },

        displayMonth: function () {
            var now, year, month;

            now = new Date();

            months = ['Januray', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'];

            year = now.getFullYear();
            month = months[now.getMonth()];
            document.querySelector(DOMelements.dateHeadlineContent).textContent = month + ' ' + year;

        },

        changeFocusStyle: function (type) {
            let formFields;

            formFields = document.querySelectorAll(
                DOMelements.inputAmount + ', '
                + DOMelements.inputCategory + ', '
                + DOMelements.inputDate + ', '
                + DOMelements.inputTime + ', '
                + DOMelements.inputDescription);

            Array.from(formFields).forEach(e => {
                if(type === 'exp'){
                    e.classList.add('red-focus');
                    e.classList.remove('green-focus');
                    console.log('exp');
                }else if(type === 'inc'){
                    e.classList.add('green-focus');
                    e.classList.remove('red-focus');
                    console.log('inc');
                }
            })
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

        //deleting record from the list
        document.querySelector(DOM.recordContainerList).addEventListener('click', deleteRecordItem);

        document.querySelector(DOM.typeBtnExpense).addEventListener('click', function () {

            document.querySelector(DOM.typeBtnExpense).classList.add(DOMStyle.expenseBtnActive);
            document.querySelector(DOM.typeBtnIncome).classList.remove(DOMStyle.incomeBtnActive);
            var recordTypes = document.querySelector(DOM.recordTypeContainer);
            recordTypes.classList.add(DOMStyle.expenseTypeContainer);
            recordTypes.classList.remove(DOMStyle.incomeTypeContainer);

            //color change of border's input fields whether it's expense or income
            viewController.changeFocusStyle('exp');
        });

        document.querySelector(DOM.typeBtnIncome).addEventListener('click', function () {

            document.querySelector(DOM.typeBtnExpense).classList.remove(DOMStyle.expenseBtnActive);
            document.querySelector(DOM.typeBtnIncome).classList.add(DOMStyle.incomeBtnActive);
            var recordTypes = document.querySelector(DOM.recordTypeContainer);
            recordTypes.classList.remove(DOMStyle.expenseTypeContainer);
            recordTypes.classList.add(DOMStyle.incomeTypeContainer);

            //color change of border's input fields whether it's expense or income
            viewController.changeFocusStyle('inc');
        });

        document.querySelector(DOM.closeIconBtn).addEventListener('click', function () {

            //ion-ios-close-outline
            const btnElem = document.querySelector(DOM.closeIconBtn);

            btnElem.lastChild.classList.toggle('ion-ios-close-outline');
            if (btnElem.lastChild.className === 'ion-ios-arrow-down') {
                btnElem.style.webkitAnimationPlayState = 'running';
            } else {
                btnElem.style.webkitAnimationPlayState = 'paused';
            }

            document.querySelector(DOMStyle.sectionMiddle).classList.toggle('animation-class');
            document.querySelector(DOMStyle.sectionMiddle).classList.toggle('hidden');

        });
    };

    const dataFromJSONServer = async function(type) {
        let typeOfRecord, newJSONRecord;;
        if(type === 'inc'){ 
            typeOfRecord = 'income';
        }else{
            typeOfRecord = 'expense';
        }
        let uri = `http://localhost:3000/${typeOfRecord}?_sort=amount&_order=inc`;
        const res = await fetch(uri);
        const rec = await res.json();

        rec.forEach(el => {
            newJSONRecord = serviceController.addItem(type, el.amount,
                 el.category, el.date, el.time, el.description);
                 viewController.addListRecord(newJSONRecord, type);
                 console.log(newJSONRecord);
        });

        serviceController.calcualteBudget();
        updateBudget();
        updatePercentages();
    };

    const saveRecordToDB = async function(obj, type) {

        let typeOfRecord;
    
        const record = {
            amount: obj.amount,
            category: obj.category,
            date: obj.date,
            time: obj.time,
            description: obj.description,
        };

        if(type === 'inc'){
            typeOfRecord = 'income';
        }else{
            typeOfRecord = 'expense';
        }

        await fetch(`http://localhost:3000/${typeOfRecord}`, {
            method: 'POST',
            body: JSON.stringify(record),
            headers: { 'Content-Type': 'application/json'}
        });
    };

    var updateBudget = function () {

        //calculate te budget balance
        serviceController.calcualteBudget();

        //return the budget
        var budget = serviceController.getBudgetData();
        //displaying the budget on the front
        console.log(budget);
        viewController.updateBudgetView(budget);
    }

    var updatePercentages = function () {

        //calculations
        serviceController.calculatePercentages();

        //reading data from budget controller
        var percentageData = serviceController.getPercentages();

        //update template with data
        console.log(percentageData);
    }



    var addItemController = async function () {

        var input, newRecord;

        //getting input data from front
        input = viewController.getInput();

        if (viewController.isFormValid(input)) {
            // 2. Add the item to the budget controller
            newRecord = serviceController.addItem(input.type, input.amount,
                input.category, input.date, input.time, input.description);
            serviceController.displayData();

            //3. Add record to the JSON database server
            await saveRecordToDB(newRecord, input.type);

            // 3. Add the item to the UI
            viewController.addListRecord(newRecord, input.type);

            // 4. Clear fields after adding record to the list 
            viewController.clearFields();

            serviceController.calcualteBudget();
            //Calculate and update budget
            updateBudget();

            //calculate and update percentages
            updatePercentages();
        }
    };

    var deleteRecordItem = function (e) {
        var recordId, derivedId, type, ID;

        recordId = e.target.parentNode.parentNode.parentNode.id;

        if (recordId) {
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
        init: async function () {
            await dataFromJSONServer('exp');
            await dataFromJSONServer('inc');
            console.log('Application has started.');
            viewController.displayMonth();
            viewController.changeFocusStyle('inc');
            setUpEventListeners();
        }
    }

})(serviceController, viewController);


//initializing of controllers

appController.init();