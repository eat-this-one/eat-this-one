angular.module('eat-this-one')
    .factory('editDishRequest', ['appStatus', 'notifier', function(appStatus, notifier) {

    return function($scope, dish) {
        if (typeof dish.id != 'undefined' && dish.id != null) {
            method = 'PUT';
        } else {
            //  TODO Backend will check if the user is allowed to change that id.
            method = 'POST';
        }

        $.ajax({
            type : method,
            url : $.eatConfig.backendUrl + '/dishes',
            data : dish,
            datatype : 'json',
            success : function(data) {
                var msg = 'Changes saved';
                notifier.show(msg, 'success');
                appStatus.completed();
            },
            error : function(data, errorStatus, errorMsg) {
                var msg = 'Dishes can not be added/edited. "' + errorStatus + '": ' + errorMsg;
                notifier.show(msg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
