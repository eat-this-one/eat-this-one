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

        showTooltip : function showTooltip($scope, storageKey, langInfo) {

            if (typeof langInfo === "undefined") {
                langInfo = $scope.lang.tipcontinue;
            }

            if (localStorage.getItem(storageKey) === null) {

                // Once this is set it will be displayed.
                $scope.actionInfo = langInfo;

                setTimeout(function() {$scope.showTip = true;$scope.$apply();}, 500);
                setTimeout(function() {$scope.showTip = false;$scope.$apply();}, 3000);
                localStorage.setItem(storageKey, true);
            }
        }
    };
}]);
