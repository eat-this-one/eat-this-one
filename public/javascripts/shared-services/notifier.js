angular.module('eat-this-one').factory('notifier', ['$mdDialog', function($mdDialog) {
    return {

        dialog : null,

        // Exactly the same method for both web and app.
        show : function(title, msg, callback) {

            if (typeof callback == 'undefined') {
                callback = function() {};
            }

            dialog = $mdDialog.alert()
                .title(title)
                .content(msg)
                .ok($.eatLang.lang.alertcontinue);
            $mdDialog.show(dialog)
                .finally(callback);
        },
    };
}]);
