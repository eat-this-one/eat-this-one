angular.module('eat-this-one').factory('appStatus', function() {

    var alreadyFinished = false;

    return {

        waiting : function() {

            document.addEventListener('deviceready', function() {
                if (!alreadyFinished) {
                    ActivityIndicator.show($.eatLang.lang.loading);
                }
            }, true);
        },
        completed : function() {

            // Marking that the action already finished because
            // sometimes is even faster than deviceready.
            alreadyFinished = true;

            document.addEventListener('deviceready', function() {
                ActivityIndicator.hide();
            });
        }
    }
});
