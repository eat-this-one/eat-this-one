angular.module('eat-this-one').factory('notifier', ['$mdDialog', function($mdDialog) {
    return {

        dialog : null,

        // Exactly the same method for both web and app.
        show : function(title, msg, callback) {

            dialog = $mdDialog.alert()
                .title(title)
                .content(msg)
                .ok($.eatLang.lang.alertcontinue);
            $mdDialog.show(dialog)
                .finally(callback);
        },

        statusBar : function(title, message, type, dishid) {
            // Not supported by the web interface.
        }

    }
}]);
