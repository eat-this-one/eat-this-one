angular.module('eat-this-one').factory('notifier', ['$mdDialog', '$timeout', function($mdDialog, $timeout) {
    return {

        dialog : null,

        // Exactly the same method for both web and app.
        show : function(title, msg, callback) {

            if (typeof title === "undefined") {
                title = "";
            }

            if (typeof msg === "undefined") {
                msg = "";
            }

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

        showConfirm : function showConfirm(msg, callback, args, langok, langcancel, cancelCallback, cancelArgs) {

            if (typeof langok === "undefined") {
                langok = $.eatLang.lang.sure;
            }
            if (typeof langcancel === "undefined") {
                langcancel = $.eatLang.lang.notyet;
            }

            if (typeof cancelCallback === "undefined") {
                cancelCallback = function() {};
            }

            dialog = $mdDialog.confirm()
                .content(msg)
                .ok(langok)
                .cancel(langcancel)
                .ariaLabel(msg);
            $mdDialog.show(dialog).then(
                function() {
                    callback(args);
                }, function() {
                    cancelCallback(cancelArgs);
                }
            );
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
                $timeout(function() {
                    $scope.showTip = true;
                }, 500);

                // Hidding the tool tip after a while.
                $timeout(function() {
                    $scope.showTip = false;
                    // Also unset this so it does not appear again when clicked
                    // including timeout to finish the tooltip animation.
                    $timeout(function() {
                        $scope.actionInfo = false;
                    }, 300);
                }, 3000);
                localStorage.setItem(storageKey, true);
            }
        }
    };
}]);
