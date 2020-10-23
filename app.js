

var serviceController = (function() {


})();


var viewController= (function() {

})();


var appController = (function() {

    var addItemController = function() {
      // 1. Get the input data
        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
        console.log('Some text');
    }

    document.querySelector('.btn-record').addEventListener('click', addItemController);

    document.addEventListener('keypress', function(e) {
        if(e.keyCode === 13 && e.which === 13){
            addItemController();
        }
    });

    document.querySelector('.expense').addEventListener('click', function() {
        
        document.querySelector('.expense').classList.add('active-record-type-red');
        document.querySelector('.income').classList.remove('active-record-type-green');
        var recordTypes = document.querySelector('.record-type');
        recordTypes.classList.add('record-type-container-expenses');
        recordTypes.classList.remove('record-type-container-income');
    });

    document.querySelector('.income').addEventListener('click', function() {
        
        document.querySelector('.expense').classList.remove('active-record-type-red');
        document.querySelector('.income').classList.add('active-record-type-green');
        var recordTypes = document.querySelector('.record-type');
        recordTypes.classList.remove('record-type-container-expenses');
        recordTypes.classList.add('record-type-container-income');
    })



    document.querySelector('.close-icon').addEventListener('click', function() {

        document.querySelector('.middle').style.display = 'none';
    })

})(serviceController, viewController);