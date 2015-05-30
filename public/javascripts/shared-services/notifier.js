angular.module('eat-this-one').factory('notifier', ['$mdDialog', function($mdDialog) {
    return {

        dialog : null,

        // Exactly the same method for both web and app.
        show : function(title, msg, callback) {

            if (typeof callback === "undefined") {
                callback = function() {};
            }

            dialog = $mdDialog.alert()
                .title(title)
                .content(msg)
                .ok($.eatLang.lang.alertcontinue);
            $mdDialog.show(dialog)
                .finally(callback);
        },

        showConfirm : function showConfirm(msg, callback, args) {

            dialog = $mdDialog.confirm()
                .content(msg)
                .ok($.eatLang.lang.sure)
                .cancel($.eatLang.lang.notyet)
                .ariaLabel(msg);
            $mdDialog.show(dialog).then(function() {
                callback(args);
            });
        },

        /**
         * @param {scope} $scope
         * @param {string} storageKey The localStorage key.
         * @param {string} langInfo Language string to show
         */
        showTooltip : function showTooltip($scope, storageKey, langInfo) {

            if (typeof langInfo === "undefined") {
                langInfo = $scope.lang.tipcontinue;
            }

            if (localStorage.getItem(storageKey) === null) {

                // Once this is set it will be displayed.
                $scope.actionInfo = langInfo;

                // Waiting a bit before showing the tooltip.
                setTimeout(function() {
                    $scope.showTip = true;
                    $scope.$apply();
                }, 500);

                // Hidding the tool tip after a while.
                setTimeout(function() {
                    $scope.showTip = false;
                    $scope.$apply();
                    // Also unset this so it does not appear again when clicked
                    // including timeout to finish the tooltip animation.
                    setTimeout(function() {
                        $scope.actionInfo = false;
                    }, 1000);
                }, 3000);
                localStorage.setItem(storageKey, true);
            }
        }
    };
}]);
