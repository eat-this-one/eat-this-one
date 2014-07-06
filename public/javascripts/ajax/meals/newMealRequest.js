angular.module('eat-this-one')
    .factory('newMealRequest', ['appStatus', 'notifier', 'eatConfig', function(appStatus, notifier, eatConfig) {

    return function($scope, meal) {
        $.ajax({
            type : 'POST',
            url : eatConfig.backendUrl + '/meals',
            data : meal,
            datatype : 'json',
            success : function(data) {
                var msg = 'Meal booked';
                notifier.show(msg, 'success');
                appStatus.completed();
            },
            error : function(data, errorStatus, errorMsg) {
                var msg = 'Meal can not be added. "' + errorStatus + '": ' + errorMsg;
                notifier.show(msg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
