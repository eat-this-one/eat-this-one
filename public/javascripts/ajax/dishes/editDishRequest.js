angular.module('eat-this-one')
    .factory('editDishRequest', ['appStatus', 'notifier', 'eatConfig', 'sessionManager', function(appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, dish) {
        if (typeof dish.id != 'undefined' && dish.id != null) {
            method = 'PUT';
        } else {
            method = 'POST';
        }

        // Adding the session token to the request.
        dish['token'] = sessionManager.getToken();

        $.ajax({
            type : method,
            url : eatConfig.backendUrl + '/dishes',
            data : dish,
            datatype : 'json',
            success : function(data) {
                var msg = 'Changes saved';
                notifier.show(msg, 'success');
                appStatus.completed();
            },
            error : function(data, errorStatus, errorMsg) {
                var msg = 'Dish can not be added/edited. "' + errorStatus + '": ' + errorMsg;
                notifier.show(msg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
