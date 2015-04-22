angular.module('eat-this-one')
    .factory('newMealRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', 'statics', function(redirecter, $http, eatConfig, sessionManager, appStatus, notifier, statics) {

    return function($scope, meal, dishname, mealCallback, errorCallback) {

        // Adding the session token to the request.
        meal.token = sessionManager.getToken();

        var locLang = statics.getGroupLanguage();
        meal.message = sessionManager.getUser().name + ' ' +
            $.eatLang[locLang].lnbooked + ' ' +
            dishname + '. ' + $.eatLang[locLang].lnremember;

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/meals',
            data : meal

        })
        .success(mealCallback)
        .error(errorCallback);
    };

}]);
